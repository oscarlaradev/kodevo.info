
'use server';
/**
 * @fileOverview Un flujo de Genkit para generar palabras clave SEO relacionadas.
 *
 * - generateRelatedKeywords - Una función que genera palabras clave relacionadas basada en un tema/palabra clave principal.
 * - RelatedKeywordsInput - El tipo de entrada para la función generateRelatedKeywords.
 * - RelatedKeywordsOutput - El tipo de retorno para la función generateRelatedKeywords.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RelatedKeywordsInputSchema = z.object({
  topic: z.string().min(3, {message: 'El tema o palabra clave debe tener al menos 3 caracteres.'}).describe('La palabra clave principal o tema para la cual generar palabras clave relacionadas.'),
});
export type RelatedKeywordsInput = z.infer<typeof RelatedKeywordsInputSchema>;

const RelatedKeywordsOutputSchema = z.object({
  keywords: z.array(z.string().describe('Una palabra clave relacionada o variación de cola larga.')).describe('Una lista de 5 a 10 palabras clave relacionadas, términos LSI o variaciones de cola larga.'),
});
export type RelatedKeywordsOutput = z.infer<typeof RelatedKeywordsOutputSchema>;

export async function generateRelatedKeywords(input: RelatedKeywordsInput): Promise<RelatedKeywordsOutput> {
  return relatedKeywordsGenerationFlow(input);
}

const relatedKeywordsPrompt = ai.definePrompt({
  name: 'relatedKeywordsPrompt',
  input: {schema: RelatedKeywordsInputSchema},
  output: {schema: RelatedKeywordsOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `Eres un especialista en SEO con experiencia en investigación de palabras clave.
Para el siguiente tema o palabra clave principal, genera una lista de 5 a 10 palabras clave relacionadas.
Estas pueden incluir términos LSI (Latent Semantic Indexing), sinónimos, variaciones de cola larga o preguntas comunes que los usuarios podrían buscar.

Palabra Clave Principal/Tema: {{{topic}}}

Proporciona únicamente la lista de palabras clave en el formato de salida especificado.`,
  config: {
    temperature: 0.7,
  }
});

const relatedKeywordsGenerationFlow = ai.defineFlow(
  {
    name: 'relatedKeywordsGenerationFlow',
    inputSchema: RelatedKeywordsInputSchema,
    outputSchema: RelatedKeywordsOutputSchema,
  },
  async (input) => {
    const {output} = await relatedKeywordsPrompt(input);
    if (!output || !output.keywords || output.keywords.length === 0) {
      throw new Error('No se pudieron generar palabras clave relacionadas. La respuesta del modelo estaba vacía o incompleta.');
    }
    return output;
  }
);
