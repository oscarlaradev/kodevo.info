
'use server';

import { z } from 'zod';

const MozUrlMetricsInputSchema = z.object({
  url: z.string().url({ message: 'Por favor, introduce una URL válida.' }),
});
export type MozUrlMetricsInput = z.infer<typeof MozUrlMetricsInputSchema>;

const MozUrlMetricsResultSchema = z.object({
  page_authority: z.number().optional(),
  domain_authority: z.number().optional(),
  linking_root_domains: z.number().optional(),
  // Add other fields from Moz response if needed, e.g., root_domain
});

const MozApiResponseSchema = z.object({
  results: z.array(MozUrlMetricsResultSchema),
});

const MozUrlMetricsOutputSchema = z.object({
  url: z.string(),
  pageAuthority: z.number().optional(),
  domainAuthority: z.number().optional(),
  linkingRootDomains: z.number().optional(),
});
export type MozUrlMetricsOutput = z.infer<typeof MozUrlMetricsOutputSchema>;

export async function getMozUrlMetrics(input: MozUrlMetricsInput): Promise<MozUrlMetricsOutput> {
  const validatedInput = MozUrlMetricsInputSchema.safeParse(input);
  if (!validatedInput.success) {
    const errorMessages = Object.values(validatedInput.error.flatten().fieldErrors)
      .map(errors => errors?.join(', '))
      .filter(Boolean)
      .join('; ');
    throw new Error(`Datos de entrada no válidos: ${errorMessages}`);
  }

  const { url } = validatedInput.data;
  const mozApiAuth = process.env.MOZ_API_BASE64_AUTH;

  if (!mozApiAuth) {
    console.error('La cadena de autenticación Base64 de la API de Moz no está configurada en las variables de entorno (MOZ_API_BASE64_AUTH).');
    throw new Error('La autenticación de la API de Moz no está configurada en el servidor.');
  }

  const apiUrl = 'https://lsapi.seomoz.com/v2/url_metrics';
  
  try {
    console.log(`[Servicio Moz] Obteniendo Métricas de URL para: ${url}`);
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${mozApiAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        targets: [url],
        // Requesting specific metrics. Adjust 'cols' as needed based on Moz API v2 documentation.
        cols: ["page_authority", "domain_authority", "linking_root_domains"] 
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        console.error("[Servicio Moz] La respuesta de la API no fue OK, y el cuerpo de la respuesta no era JSON válido:", responseText);
        throw new Error(`Error de la API de Moz: ${response.status} ${response.statusText}. Respuesta no válida del servidor.`);
      }
      console.error("[Servicio Moz] Respuesta de Error de la API:", errorData);
      const mozErrorMessage = errorData?.message || errorData?.error_message || 'Mensaje de error no disponible de Moz.';
      throw new Error(`Error de la API de Moz: ${response.status} ${response.statusText}. ${mozErrorMessage}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("[Servicio Moz] Fallo al parsear la respuesta JSON de la API de Moz:", responseText);
      throw new Error("Respuesta inesperada de la API de Moz (no es JSON válido).");
    }
    
    const parsedData = MozApiResponseSchema.safeParse(data);

    if (!parsedData.success || !parsedData.data.results || parsedData.data.results.length === 0) {
      console.error("[Servicio Moz] Error al parsear la respuesta de la API de Moz (Zod) o no hay resultados:", parsedData.success ? 'No hay array de resultados o está vacío' : parsedData.error.flatten());
      throw new Error('No se pudo analizar la estructura de la respuesta de la API de Moz o no se encontraron resultados.');
    }

    const metrics = parsedData.data.results[0];

    return {
      url: url,
      pageAuthority: metrics.page_authority,
      domainAuthority: metrics.domain_authority,
      linkingRootDomains: metrics.linking_root_domains,
    };

  } catch (error) {
    console.error("[Servicio Moz] Error al obtener métricas de URL de Moz:", error);
    if (error instanceof Error) {
        if(error.message.startsWith('Error de la API de Moz:') || error.message.startsWith('Datos de entrada no válidos:') || error.message.startsWith('La autenticación de la API de Moz no está configurada')) {
            throw error;
          }
      throw new Error(`No se pudieron obtener las métricas de Moz: ${error.message}`);
    }
    throw new Error('Ocurrió un error desconocido al obtener las métricas de Moz.');
  }
}
