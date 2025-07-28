'use server';
/**
 * @fileOverview Un flujo de Genkit para generar ideas de contenido SEO.
 *
 * - generateSeoContentIdeas - Una función que genera ideas de contenido basadas en un tema.
 * - SeoContentIdeasInput - El tipo de entrada para la función generateSeoContentIdeas.
 * - SeoContentIdeasOutput - El tipo de retorno para la función generateSeoContentIdeas.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SeoContentIdeasInputSchema = z.object({
  topic: z.string().min(3, {message: 'El tema debe tener al menos 3 caracteres.'}).describe('El tema o palabra clave principal para generar ideas de contenido.'),
});
export type SeoContentIdeasInput = z.infer<typeof SeoContentIdeasInputSchema>;

const SeoContentIdeasOutputSchema = z.object({
  ideas: z.array(z.string().describe('Una idea de contenido generada.')).describe('Una lista de 5 a 7 ideas de contenido SEO.'),
});
export type SeoContentIdeasOutput = z.infer<typeof SeoContentIdeasOutputSchema>;

export async function generateSeoContentIdeas(input: SeoContentIdeasInput): Promise<SeoContentIdeasOutput> {
  return seoIdeaGenerationFlow(input);
}

const seoIdeaPrompt = ai.definePrompt({
  name: 'seoIdeaPrompt',
  input: {schema: SeoContentIdeasInputSchema},
  output: {schema: SeoContentIdeasOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest', // Using a specific, suitable model
  prompt: `Eres un experto en SEO y estratega de contenido. 
Basado en el siguiente tema, genera una lista de 5 a 7 ideas creativas para contenido. 
Cada idea debe ser una frase corta y accionable, adecuada para el título de un artículo de blog, un concepto de proyecto, o una publicación en redes sociales.

Tema: {{{topic}}}

Por favor, estructura tu respuesta para que coincida con el esquema de salida proporcionado. Asegúrate de que el campo 'ideas' sea un array de strings.`,
  config: {
    temperature: 0.7, // Adjust for creativity vs. predictability
  }
});

const seoIdeaGenerationFlow = ai.defineFlow(
  {
    name: 'seoIdeaGenerationFlow',
    inputSchema: SeoContentIdeasInputSchema,
    outputSchema: SeoContentIdeasOutputSchema,
  },
  async (input) => {
    const {output} = await seoIdeaPrompt(input);
    if (!output) {
      throw new Error('No se pudieron generar ideas de contenido. La respuesta del modelo estaba vacía.');
    }
    return output;
  }
);
