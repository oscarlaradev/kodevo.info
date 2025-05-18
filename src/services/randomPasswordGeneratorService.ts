
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

// The API seems to return the password in a field like "random_password" or directly.
// Let's assume it's "random_password" based on common patterns, adjust if needed.
const RapidApiResponseSchema = z.object({
  random_password: z.string(), // Or it might be directly a string response, or a different key
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

  // Construct query parameters
  const queryParams = new URLSearchParams({
    len: passwordLength.toString(), // Assuming API uses 'len' for length
    upper: uppercase ? 'true' : 'false',    // Assuming 'true'/'false' strings
    lower: lowercase ? 'true' : 'false',
    number: numbers ? 'true' : 'false',   // Assuming 'number' not 'numbers'
    special: symbols ? 'true' : 'false', // Assuming 'special' for symbols
  });

  // Corrected endpoint URL based on user provided snippet
  const endpointPath = "/random-password/index.php"; 
  const endpointUrl = `https://${apiHost}${endpointPath}?${queryParams.toString()}`;
  
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

    // RapidAPI "Random Password Generator" from 'random-password-generator5.p.rapidapi.com'
    // often returns the password directly as a string, not in a JSON object.
    // Let's handle this. The API documentation should clarify the exact response format.
    // If it's JSON like {"random_password": "..."}
    let passwordString = '';
    try {
        const jsonData = JSON.parse(responseText);
        // Check common keys, adjust if needed
        if (jsonData.random_password) {
            passwordString = jsonData.random_password;
        } else if (jsonData.password) {
            passwordString = jsonData.password;
        } else if (typeof jsonData === 'string') { // If the root response is the password string
             passwordString = jsonData;
        } else {
             // Attempt to find a string property if the structure is unknown
            const firstStringProp = Object.values(jsonData).find(val => typeof val === 'string');
            if (firstStringProp) {
                passwordString = firstStringProp as string;
                 console.warn("[Password Generator Service] Password key not standard, guessed as:", firstStringProp);
            } else {
                console.error("[Password Generator Service] Password not found in JSON response, or response not a direct string:", jsonData);
                throw new Error('La contraseña no se encontró en la respuesta de la API o el formato es inesperado.');
            }
        }
    } catch (e) {
        // If responseText is not JSON, assume it's the password directly
        if (typeof responseText === 'string' && responseText.trim().length > 0) {
            passwordString = responseText.trim();
        } else {
            console.error("[Password Generator Service] Response is not valid JSON and not a non-empty string:", responseText);
            throw new Error("Respuesta inesperada de la API de RapidAPI (ni JSON válido, ni cadena directa).");
        }
    }
    
    if (!passwordString) {
      console.error("[Password Generator Service] Extracted password string is empty.");
      throw new Error('La API devolvió una contraseña vacía.');
    }

    return {
      randomPassword: passwordString,
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
