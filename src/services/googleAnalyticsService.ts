
'use server';

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { z } from 'zod';
import { subDays, format } from 'date-fns';

const GaDataPointSchema = z.object({
  date: z.string(), // YYYY-MM-DD
  pageViews: z.number(),
});
export type GaDataPoint = z.infer<typeof GaDataPointSchema>;

const GaReportOutputSchema = z.object({
  data: z.array(GaDataPointSchema),
  startDate: z.string(),
  endDate: z.string(),
  error: z.string().optional(),
});
export type GaReportOutput = z.infer<typeof GaReportOutputSchema>;

export async function getPageViewReport(): Promise<GaReportOutput> {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const serviceAccountKeyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON;

  if (!propertyId) {
    console.error('[Servicio GA] GA4_PROPERTY_ID no está configurado en las variables de entorno.');
    return { data: [], startDate: '', endDate: '', error: 'ID de Propiedad GA4 no configurado en el servidor.' };
  }
  if (!serviceAccountKeyJson) {
    console.error('[Servicio GA] GOOGLE_SERVICE_ACCOUNT_KEY_JSON no está configurado en las variables de entorno.');
    return { data: [], startDate: '', endDate: '', error: 'Clave de cuenta de servicio de Google no configurada en el servidor.' };
  }

  let credentials;
  try {
    credentials = JSON.parse(serviceAccountKeyJson);
  } catch (e) {
    console.error('[Servicio GA] Fallo al parsear GOOGLE_SERVICE_ACCOUNT_KEY_JSON:', e);
    return { data: [], startDate: '', endDate: '', error: 'Error al parsear la clave de cuenta de servicio de Google.' };
  }

  const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials,
  });

  const today = new Date();
  const sevenDaysAgo = subDays(today, 7); 
  const formattedStartDate = format(sevenDaysAgo, 'yyyy-MM-dd');
  const formattedEndDate = format(subDays(today,1), 'yyyy-MM-dd'); // Data for 'yesterday'

  try {
    console.log(`[Servicio GA] Obteniendo informe para ID de propiedad: ${propertyId} desde ${formattedStartDate} hasta ${formattedEndDate}`);
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        },
      ],
      dimensions: [
        {
          name: 'date',
        },
      ],
      metrics: [
        {
          name: 'screenPageViews',
        },
      ],
      orderBys: [ 
        {
          dimension: {
            dimensionName: 'date',
          },
          // desc: false, // default is ascending
        }
      ]
    });
    
    console.log('[Servicio GA] Respuesta del informe recibida de la API de GA.');

    const reportData: GaDataPoint[] = [];
    response.rows?.forEach(row => {
      if (row.dimensionValues && row.metricValues) {
        const dateString = row.dimensionValues[0].value || 'fecha-desconocida';
        // GA date format is YYYYMMDD, convert to YYYY-MM-DD
        const formattedApiDate = `${dateString.substring(0,4)}-${dateString.substring(4,6)}-${dateString.substring(6,8)}`;
        
        reportData.push({
          date: formattedApiDate,
          pageViews: parseInt(row.metricValues[0].value || '0', 10),
        });
      }
    });

    if (response.rows?.length === 0) {
      console.log('[Servicio GA] Informe obtenido exitosamente de la API de GA, pero contenía 0 filas de datos para el período especificado.');
    }
    console.log(`[Servicio GA] Procesados ${reportData.length} puntos de datos.`);
    return { 
      data: reportData, 
      startDate: formattedStartDate, 
      endDate: formattedEndDate 
    };

  } catch (error) {
    console.error('[Servicio GA] Error al obtener el informe de Google Analytics:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener el informe de GA.';
    return { 
      data: [], 
      startDate: formattedStartDate, 
      endDate: formattedEndDate, 
      error: `No se pudo obtener el informe de Google Analytics: ${errorMessage}` 
    };
  }
}
