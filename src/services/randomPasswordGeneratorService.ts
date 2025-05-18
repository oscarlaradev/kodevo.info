
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
  const queryParams = new URLSearchParams();
  queryParams.append('length', passwordLength.toString());
  if (uppercase) queryParams.append('uppercase', 'on');
  if (lowercase) queryParams.append('lowercase', 'on');
  if (numbers) queryParams.append('numbers', 'on');
  if (symbols) queryParams.append('symbols', 'on');
  
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
        console.error("[Password Generator Service] API response was not OK, and response body was not valid JSON:", responseText, "Status:", response.status);
        // If the response is the error message directly (like "Any of one input is required.")
        if (response.status === 400 && responseText.includes("Any of one input is required")) {
             throw new Error(`Error de la API de RapidAPI: ${responseText}`);
        }
        throw new Error(`Error de la API de RapidAPI: ${response.status} ${response.statusText}. Respuesta no válida del servidor.`);
      }
      console.error("[Password Generator Service] API Error Response:", errorData);
      const apiErrorMessage = errorData?.message || errorData?.error || 'Mensaje de error no disponible de RapidAPI.';
      throw new Error(`Error de la API de RapidAPI: ${response.status} ${response.statusText}. ${apiErrorMessage}`);
    }
    
    let passwordString = '';
    try {
        const jsonData = JSON.parse(responseText);
        if (jsonData.random_password) {
            passwordString = jsonData.random_password;
        } else if (jsonData.password) {
            passwordString = jsonData.password;
        } else if (typeof jsonData === 'string') { 
             passwordString = jsonData;
        } else {
            const firstStringProp = Object.values(jsonData).find(val => typeof val === 'string');
            if (firstStringProp) {
                passwordString = firstStringProp as string;
            } else {
                console.error("[Password Generator Service] Password not found in JSON response, or response not a direct string:", jsonData);
                throw new Error('La contraseña no se encontró en la respuesta de la API o el formato es inesperado.');
            }
        }
    } catch (e) {
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

    // Sanitize the password string if it contains HTML entities (sometimes these APIs return them)
    const sanitizedPassword = passwordString.replace(/&[#A-Za-z0-9]+;/gi, (entity) => {
      const textarea = document.createElement('textarea');
      textarea.innerHTML = entity;
      return textarea.value;
    });


    return {
      // randomPassword: passwordString,
      randomPassword: sanitizedPassword, // Use sanitized password
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
