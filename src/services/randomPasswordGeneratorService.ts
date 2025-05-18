
'use server';

import { z } from 'zod';

const PasswordGeneratorInputSchema = z.object({
  passwordLength: z.number().min(8, "La longitud debe ser al menos 8.").max(128, "La longitud no puede exceder 128."),
  uppercase: z.boolean().default(true),
  lowercase: z.boolean().default(true),
  numbers: z.boolean().default(true),
  symbols: z.boolean().default(true),
});
export type PasswordGeneratorInput = z.infer<typeof PasswordGeneratorInputSchema>;

const RapidApiResponseSchema = z.object({
  random_password: z.string(),
});

const PasswordGeneratorOutputSchema = z.object({
  randomPassword: z.string(),
});
export type PasswordGeneratorOutput = z.infer<typeof PasswordGeneratorOutputSchema>;

export async function generateRandomPassword(input: PasswordGeneratorInput): Promise<PasswordGeneratorOutput> {
  const validatedInput = PasswordGeneratorInputSchema.safeParse(input);
  if (!validatedInput.success) {
    const errorMessages = Object.values(validatedInput.error.flatten().fieldErrors)
      .map(errors => errors?.join(', '))
      .filter(Boolean)
      .join('; ');
    throw new Error(`Datos de entrada no válidos: ${errorMessages}`);
  }

  const { passwordLength, uppercase, lowercase, numbers, symbols } = validatedInput.data;

  if (!uppercase && !lowercase && !numbers && !symbols) {
    throw new Error('Debes seleccionar al menos un tipo de caracter para la contraseña.');
  }

  const apiKey = process.env.RAPIDAPI_KEY;
  const apiHost = process.env.RAPIDAPI_HOST_PASSWORD_GENERATOR;

  if (!apiKey || !apiHost) {
    console.error('RapidAPI Key o Host para el generador de contraseñas no están configurados en las variables de entorno.');
    throw new Error('Configuración del servidor incompleta para el generador de contraseñas.');
  }

  // Construir los query parameters
  const queryParams = new URLSearchParams({
    passwordLength: passwordLength.toString(),
    uppercase: uppercase.toString(),
    lowercase: lowercase.toString(),
    numbers: numbers.toString(),
    symbols: symbols.toString(),
  });

  const endpointUrl = `https://${apiHost}/api/v1/strong?${queryParams.toString()}`;
  
  try {
    console.log(`[Password Generator Service] Fetching URL: ${endpointUrl.replace(apiKey, 'YOUR_RAPIDAPI_KEY')}`);
    const response = await fetch(endpointUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost,
      },
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        console.error("[Password Generator Service] API response was not OK, and response body was not valid JSON:", responseText);
        throw new Error(`Error de la API de RapidAPI: ${response.status} ${response.statusText}. Respuesta no válida del servidor.`);
      }
      console.error("[Password Generator Service] API Error Response:", errorData);
      const apiErrorMessage = errorData?.message || errorData?.error || 'Mensaje de error no disponible de RapidAPI.';
      throw new Error(`Error de la API de RapidAPI: ${response.status} ${response.statusText}. ${apiErrorMessage}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("[Password Generator Service] Failed to parse JSON response from RapidAPI:", responseText);
      throw new Error("Respuesta inesperada de la API de RapidAPI (no es JSON válido).");
    }
    
    const parsedData = RapidApiResponseSchema.safeParse(data);

    if (!parsedData.success || !parsedData.data.random_password) {
      console.error("[Password Generator Service] RapidAPI response parsing error (Zod) or no password field:", parsedData.success ? 'No random_password field' : parsedData.error.flatten());
      throw new Error('No se pudo analizar la estructura de la respuesta de la API o no se encontró la contraseña.');
    }

    return {
      randomPassword: parsedData.data.random_password,
    };

  } catch (error) {
    console.error("[Password Generator Service] Error generating random password:", error);
    if (error instanceof Error) {
        if(error.message.startsWith('Error de la API de RapidAPI:') || error.message.startsWith('Datos de entrada no válidos:') || error.message.startsWith('Configuración del servidor incompleta')) {
            throw error;
          }
      throw new Error(`No se pudo generar la contraseña: ${error.message}`);
    }
    throw new Error('Ocurrió un error desconocido al generar la contraseña.');
  }
}
