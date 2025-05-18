
'use server';
/**
 * @fileOverview Un flujo de Genkit para generar meta tags SEO.
 *
 * - generateMetaTags - Una función que genera un meta título y descripción basados en un tema o contenido.
 * - MetaTagsInput - El tipo de entrada para la función generateMetaTags.
 * - MetaTagsOutput - El tipo de retorno para la función generateMetaTags.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MetaTagsInputSchema = z.object({
  topicOrContent: z.string().min(10, {message: 'El tema o contenido debe tener al menos 10 caracteres.'}).describe('El tema, palabra clave principal o un resumen del contenido de la página para generar los meta tags.'),
});
export type MetaTagsInput = z.infer<typeof MetaTagsInputSchema>;

const MetaTagsOutputSchema = z.object({
  title: z.string().describe('Un meta título optimizado para SEO, conciso y atractivo (idealmente entre 50-60 caracteres).'),
  description: z.string().describe('Una meta descripción optimizada para SEO, persuasiva e informativa (idealmente entre 150-160 caracteres).'),
});
export type MetaTagsOutput = z.infer<typeof MetaTagsOutputSchema>;

export async function generateMetaTags(input: MetaTagsInput): Promise<MetaTagsOutput> {
  return metaTagsGenerationFlow(input);
}

const metaTagsPrompt = ai.definePrompt({
  name: 'metaTagsPrompt',
  input: {schema: MetaTagsInputSchema},
  output: {schema: MetaTagsOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `Eres un experto en SEO y redactor publicitario especializado en optimizar la presencia online.
Basado en el siguiente tema o contenido proporcionado, genera:
1. Un meta título atractivo y optimizado para SEO. Debe ser conciso (alrededor de 50-60 caracteres) y capturar la esencia del contenido.
2. Una meta descripción persuasiva y optimizada para SEO. Debe ser informativa (alrededor de 150-160 caracteres) y animar a los usuarios a hacer clic.

Asegúrate de que el título y la descripción sean únicos y relevantes para el tema proporcionado.

Tema/Contenido: {{{topicOrContent}}}

Estructura tu respuesta para que coincida con el esquema de salida proporcionado.`,
  config: {
    temperature: 0.6, // Un balance entre creatividad y precisión
  }
});

const metaTagsGenerationFlow = ai.defineFlow(
  {
    name: 'metaTagsGenerationFlow',
    inputSchema: MetaTagsInputSchema,
    outputSchema: MetaTagsOutputSchema,
  },
  async (input) => {
    const {output} = await metaTagsPrompt(input);
    if (!output || !output.title || !output.description) {
      throw new Error('No se pudieron generar los meta tags. La respuesta del modelo estaba incompleta.');
    }
    return output;
  }
);
