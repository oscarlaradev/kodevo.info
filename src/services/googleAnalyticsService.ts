
'use server';

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { z } from 'zod';
import { subDays, format } from 'date-fns';

// Schemas for data points
const GaDataPointSchema = z.object({
  date: z.string(), // YYYY-MM-DD
  pageViews: z.number().optional(),
  activeUsers: z.number().optional(),
});
export type GaDataPoint = z.infer<typeof GaDataPointSchema>;

const GaTopPageSchema = z.object({
  path: z.string(),
  pageViews: z.number(),
});
export type GaTopPage = z.infer<typeof GaTopPageSchema>;

const GaTopSourceSchema = z.object({
  source: z.string(),
  sessions: z.number(),
});
export type GaTopSource = z.infer<typeof GaTopSourceSchema>;

// Main output schema
const GaReportOutputSchema = z.object({
  data: z.array(GaDataPointSchema),
  totals: z.object({
    pageViews: z.number(),
    activeUsers: z.number(),
    sessions: z.number(),
  }),
  topPages: z.array(GaTopPageSchema),
  topSources: z.array(GaTopSourceSchema),
  startDate: z.string(),
  endDate: z.string(),
  error: z.string().optional(),
  // Diagnostic info
  propertyId: z.string().optional(),
  clientEmail: z.string().optional(),
});
export type GaReportOutput = z.infer<typeof GaReportOutputSchema>;

// Helper function for credentials
function getServiceAccountCredentials() {
  const serviceAccountKeyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON;

  if (!serviceAccountKeyJson) {
    console.error(`[Servicio GA] CRÍTICO: La variable de entorno 'GOOGLE_SERVICE_ACCOUNT_KEY_JSON' no está configurada.`);
    throw new Error("Configuración del servidor incompleta: Falta la clave de la cuenta de servicio de Google.");
  }
  try {
    const credentials = JSON.parse(serviceAccountKeyJson);
    if (!credentials.client_email) {
       throw new Error("El JSON de credenciales no contiene la propiedad 'client_email'.");
    }
    return credentials;
  } catch (error) {
    console.error('[Servicio GA] Error crítico al parsear el JSON de la variable de entorno.', error);
    throw new Error(`[Servicio GA] Error al procesar las credenciales: ${error instanceof Error ? error.message : "Error desconocido"}`);
  }
}

export async function getAnalyticsReport(): Promise<GaReportOutput> {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const days = 7;

  const emptyReport: Omit<GaReportOutput, 'propertyId' | 'clientEmail'> = {
      data: [],
      totals: { pageViews: 0, activeUsers: 0, sessions: 0 },
      topPages: [],
      topSources: [],
      startDate: '',
      endDate: '',
  };

  if (!propertyId) {
    const errorMsg = 'ID de Propiedad GA4 no configurado en el servidor.';
    console.error('[Servicio GA]', errorMsg);
    return { ...emptyReport, error: errorMsg };
  }
  
  let credentials;
  try {
    credentials = getServiceAccountCredentials();
  } catch (error) {
    return { 
        ...emptyReport, 
        propertyId, 
        error: error instanceof Error ? error.message : "Error desconocido con credenciales." 
    };
  }

  const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });

  const today = new Date();
  const startDate = subDays(today, days);
  const formattedStartDate = format(startDate, 'yyyy-MM-dd');
  const formattedEndDate = format(today, 'yyyy-MM-dd');
  
  const baseReturnObject = {
      ...emptyReport,
      propertyId: propertyId,
      clientEmail: credentials.client_email,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
  };


  try {
    console.log(`[Servicio GA - Diagnóstico] Intentando conectar a la Propiedad GA4 ID: ${propertyId} con el email: ${credentials.client_email}`);
    
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: formattedStartDate, endDate: formattedEndDate }],
      dimensions: [
        { name: 'date' },
        { name: 'pagePath' },
        { name: 'sessionSource' },
      ],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'activeUsers' },
        { name: 'sessions' },
      ],
    });
    
    console.log('[Servicio GA] Respuesta recibida de la API.');

    if (!response.rows || response.rows.length === 0) {
      console.log('[Servicio GA] Informe obtenido, pero contenía 0 filas de datos.');
      return { 
        ...baseReturnObject, 
        error: "No se encontraron datos para el período seleccionado."
      };
    }

    const dailyData: { [date: string]: { pageViews: number, activeUsers: number } } = {};
    const pageViewCounts: { [path: string]: number } = {};
    const sourceCounts: { [source: string]: number } = {};
    let totalPageViews = 0;
    let totalSessions = 0;

    response.rows.forEach(row => {
      if (row.dimensionValues && row.metricValues) {
        const date = row.dimensionValues[0].value || 'unknown-date';
        const path = row.dimensionValues[1].value || '(not set)';
        const source = row.dimensionValues[2].value || '(direct)';
        
        const pageViews = parseInt(row.metricValues[0]?.value || '0', 10);
        const sessions = parseInt(row.metricValues[2]?.value || '0', 10);
        
        const formattedApiDate = `${date.substring(0,4)}-${date.substring(4,6)}-${date.substring(6,8)}`;

        if (!dailyData[formattedApiDate]) {
          dailyData[formattedApiDate] = { pageViews: 0, activeUsers: 0 };
        }
        dailyData[formattedApiDate].pageViews += pageViews;

        if (path !== '(not set)') {
          pageViewCounts[path] = (pageViewCounts[path] || 0) + pageViews;
        }

        sourceCounts[source] = (sourceCounts[source] || 0) + sessions;
        
        totalPageViews += pageViews;
        totalSessions += sessions;
      }
    });

    const [usersResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: formattedStartDate, endDate: formattedEndDate }],
      metrics: [{ name: 'activeUsers' }],
    });
    const totalActiveUsers = usersResponse.rows?.[0]?.metricValues?.[0]?.value ? parseInt(usersResponse.rows[0].metricValues[0].value, 10) : 0;

    const processedDailyData = Object.entries(dailyData).map(([date, values]) => ({
      date,
      pageViews: values.pageViews
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const topPages = Object.entries(pageViewCounts)
      .map(([path, pageViews]) => ({ path, pageViews }))
      .sort((a, b) => b.pageViews - a.pageViews)
      .slice(0, 10);

    const topSources = Object.entries(sourceCounts)
      .map(([source, sessions]) => ({ source, sessions }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 10);

    if (processedDailyData.length === 0 && totalPageViews === 0) {
        return { 
            ...baseReturnObject,
            error: "No se encontraron datos para el período seleccionado."
        };
    }

    return {
      ...baseReturnObject,
      data: processedDailyData,
      totals: {
        pageViews: totalPageViews,
        activeUsers: totalActiveUsers,
        sessions: totalSessions,
      },
      topPages,
      topSources,
    };

  } catch (error) {
    console.error('[Servicio GA] Error al obtener el informe de Google Analytics:', error);
    let userFriendlyMessage = `No se pudieron cargar los datos de Google Analytics.`;
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido.';

    if (errorMessage.includes('permission-denied') || errorMessage.includes('does not have sufficient permissions')) {
      userFriendlyMessage = 'Permiso denegado. La cuenta de servicio necesita el rol de "Lector" en tu propiedad de Google Analytics.';
    } else if (errorMessage.includes('invalid_grant')) {
      userFriendlyMessage = 'Error de autenticación. Verifica que la clave de la cuenta de servicio sea correcta.';
    } else {
      userFriendlyMessage += ` Detalle: ${errorMessage}`;
    }
    
    return { ...baseReturnObject, error: userFriendlyMessage };
  }
}
