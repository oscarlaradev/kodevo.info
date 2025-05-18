
'use server';

import { z } from 'zod';

const PageSpeedInputClientSchema = z.object({
  url: z.string().url({ message: 'Por favor, introduce una URL válida.' }),
  strategy: z.enum(['desktop', 'mobile'], { message: 'Por favor, selecciona una estrategia válida.' }),
});
export type PageSpeedInputClient = z.infer<typeof PageSpeedInputClientSchema>;

// Define a Zod schema for the expected parts of the PageSpeed API response
const PageSpeedMetricSchema = z.object({
  percentile: z.number().optional(), // Percentile might not always be present
  displayValue: z.string().optional(),
  score: z.number().optional(), // Some metrics have a score directly
});

const PageSpeedCategorySchema = z.object({
  score: z.number(),
});

const PageSpeedLighthouseResultSchema = z.object({
  categories: z.object({
    performance: PageSpeedCategorySchema,
  }),
  audits: z.object({
    'first-contentful-paint': PageSpeedMetricSchema,
    'largest-contentful-paint': PageSpeedMetricSchema,
    'cumulative-layout-shift': PageSpeedMetricSchema,
    'speed-index': PageSpeedMetricSchema,
    'interactive': PageSpeedMetricSchema, // Time to Interactive
  }),
  finalUrl: z.string().url().optional(),
  requestedUrl: z.string().url().optional(),
});

export const PageSpeedOutputSchema = z.object({
  performanceScore: z.number(),
  firstContentfulPaint: z.string(),
  largestContentfulPaint: z.string(),
  cumulativeLayoutShift: z.string(),
  speedIndex: z.string(),
  timeToInteractive: z.string(),
  finalUrl: z.string().optional(),
  requestedUrl: z.string().optional(),
  strategy: z.enum(['desktop', 'mobile']),
});
export type PageSpeedOutput = z.infer<typeof PageSpeedOutputSchema>;

export async function analyzePageSpeed(input: PageSpeedInputClient): Promise<PageSpeedOutput> {
  const validatedInput = PageSpeedInputClientSchema.safeParse(input);
  if (!validatedInput.success) {
    // Construct a user-friendly error message from Zod errors
    const errorMessages = Object.values(validatedInput.error.flatten().fieldErrors)
      .map(errors => errors?.join(', '))
      .filter(Boolean)
      .join('; ');
    throw new Error(`Datos de entrada no válidos: ${errorMessages}`);
  }
  
  const { url, strategy } = validatedInput.data;
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;

  if (!apiKey) {
    console.error('Google PageSpeed API Key is not configured in environment variables.');
    throw new Error('La clave API de Google PageSpeed no está configurada en el servidor.');
  }

  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${apiKey}&category=PERFORMANCE`;
  // We can add more categories: &category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO
  // For now, focusing on PERFORMANCE.

  try {
    console.log(`[PageSpeed Service] Fetching URL: ${apiUrl.replace(apiKey, 'YOUR_API_KEY')}`);
    const response = await fetch(apiUrl);
    
    const responseText = await response.text(); // Get raw response text for debugging if JSON fails

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        // If parsing errorData itself fails
        console.error("[PageSpeed Service] API response was not OK, and response body was not valid JSON:", responseText);
        throw new Error(`Error de la API de PageSpeed: ${response.status} ${response.statusText}. Respuesta no válida del servidor.`);
      }
      console.error("[PageSpeed Service] API Error Response:", errorData);
      throw new Error(`Error de la API de PageSpeed: ${response.status} ${response.statusText}. ${errorData.error?.message || 'Mensaje de error no disponible.'}`);
    }
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch(e) {
      console.error("[PageSpeed Service] Failed to parse JSON response from PageSpeed API:", responseText);
      throw new Error("Respuesta inesperada de la API de PageSpeed (no es JSON válido).");
    }

    const lighthouseResultValidation = PageSpeedLighthouseResultSchema.safeParse(data.lighthouseResult);

    if (!lighthouseResultValidation.success) {
        console.error("[PageSpeed Service] PageSpeed API response parsing error (Zod):", lighthouseResultValidation.error.flatten());
        throw new Error('No se pudo analizar la estructura de la respuesta de la API de PageSpeed. La estructura puede haber cambiado.');
    }
    
    const result = lighthouseResultValidation.data;

    return {
      performanceScore: Math.round(result.categories.performance.score * 100),
      firstContentfulPaint: result.audits['first-contentful-paint'].displayValue || 'N/A',
      largestContentfulPaint: result.audits['largest-contentful-paint'].displayValue || 'N/A',
      cumulativeLayoutShift: result.audits['cumulative-layout-shift'].displayValue || 'N/A',
      speedIndex: result.audits['speed-index'].displayValue || 'N/A',
      timeToInteractive: result.audits['interactive'].displayValue || 'N/A',
      finalUrl: result.finalUrl,
      requestedUrl: result.requestedUrl,
      strategy: strategy,
    };
  } catch (error) {
    console.error("[PageSpeed Service] Error analyzing page speed:", error);
    if (error instanceof Error) {
      // Avoid re-wrapping if it's already a meaningful error
      if(error.message.startsWith('Error de la API de PageSpeed:') || error.message.startsWith('Datos de entrada no válidos:') || error.message.startsWith('La clave API de Google PageSpeed no está configurada')) {
        throw error;
      }
      throw new Error(`No se pudo analizar la velocidad de la página: ${error.message}`);
    }
    throw new Error('Ocurrió un error desconocido al analizar la velocidad de la página.');
  }
}
