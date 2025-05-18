
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
    console.error('[GA Service] GA4_PROPERTY_ID is not set in environment variables.');
    return { data: [], startDate: '', endDate: '', error: 'GA4 Property ID no configurado en el servidor.' };
  }
  if (!serviceAccountKeyJson) {
    console.error('[GA Service] GOOGLE_SERVICE_ACCOUNT_KEY_JSON is not set in environment variables.');
    return { data: [], startDate: '', endDate: '', error: 'Clave de cuenta de servicio de Google no configurada en el servidor.' };
  }

  let credentials;
  try {
    credentials = JSON.parse(serviceAccountKeyJson);
  } catch (e) {
    console.error('[GA Service] Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY_JSON:', e);
    return { data: [], startDate: '', endDate: '', error: 'Error al parsear la clave de cuenta de servicio de Google.' };
  }

  const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials,
  });

  const today = new Date();
  const sevenDaysAgo = subDays(today, 7); // Data for the last 7 full days.
  const formattedStartDate = format(sevenDaysAgo, 'yyyy-MM-dd');
  const formattedEndDate = format(subDays(today,1), 'yyyy-MM-dd'); // GA data is usually available up to 'yesterday'. 'today' might be incomplete.

  try {
    console.log(`[GA Service] Fetching report for property ID: ${propertyId} from ${formattedStartDate} to ${formattedEndDate}`);
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
    
    console.log('[GA Service] Report response received from GA API.');

    const reportData: GaDataPoint[] = [];
    response.rows?.forEach(row => {
      if (row.dimensionValues && row.metricValues) {
        const dateString = row.dimensionValues[0].value || 'unknown-date';
        // GA date format is YYYYMMDD, convert to YYYY-MM-DD
        const formattedApiDate = `${dateString.substring(0,4)}-${dateString.substring(4,6)}-${dateString.substring(6,8)}`;
        
        reportData.push({
          date: formattedApiDate,
          pageViews: parseInt(row.metricValues[0].value || '0', 10),
        });
      }
    });

    // Data from API is already ordered by date due to orderBys
    // reportData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (response.rows?.length === 0) {
      console.log('[GA Service] Successfully fetched report from GA API, but it contained 0 rows of data for the specified period.');
    }
    console.log(`[GA Service] Processed ${reportData.length} data points.`);
    return { 
      data: reportData, 
      startDate: formattedStartDate, 
      endDate: formattedEndDate 
    };

  } catch (error) {
    console.error('[GA Service] Error fetching Google Analytics report:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener el informe de GA.';
    return { 
      data: [], 
      startDate: formattedStartDate, 
      endDate: formattedEndDate, 
      error: `No se pudo obtener el informe de Google Analytics: ${errorMessage}` 
    };
  }
}
