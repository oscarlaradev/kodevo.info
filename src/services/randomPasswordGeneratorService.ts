
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
    console.error('[Password Generator Service] RapidAPI Key o Host para el generador de contraseñas no están configurados en las variables de entorno.');
    throw new Error('Configuración del servidor incompleta para el generador de contraseñas.');
  }

  const queryParams = new URLSearchParams();
  // Ensure 'length' is used as the parameter name as per RapidAPI typical usage
  queryParams.append('length', passwordLength.toString());
  if (uppercase) queryParams.append('uppercase', 'on'); // Common practice is 'on' or 'true'
  if (lowercase) queryParams.append('lowercase', 'on');
  if (numbers) queryParams.append('numbers', 'on');
  if (symbols) queryParams.append('symbols', 'on');
  
  // Corrected endpoint path based on user provided info
  const endpointPath = "/random-password/index.php"; 
  const endpointUrl = `https://${apiHost}${endpointPath}?${queryParams.toString()}`;
  
  try {
    console.log(`[Password Generator Service] Fetching URL: ${endpointUrl.replace(apiKey, 'YOUR_RAPIDAPI_KEY')}`); // Log URL (key redacted for safety)
    const response = await fetch(endpointUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost,
      },
    });

    const responseText = await response.text();
    // Log the raw response text from the API
    console.log("[Password Generator Service] Raw responseText from API:", responseText);


    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        console.error("[Password Generator Service] API response was not OK, and response body was not valid JSON:", responseText, "Status:", response.status);
        if (response.status === 400 && responseText.includes("Any of one input is required")) {
             throw new Error(`Error de la API de RapidAPI: ${responseText}`);
        }
        throw new Error(`Error de la API de RapidAPI: ${response.status} ${response.statusText}. Respuesta no válida del servidor.`);
      }
      console.error("[Password Generator Service] API Error Response (parsed):", errorData);
      const apiErrorMessage = errorData?.message || errorData?.error || responseText || 'Mensaje de error no disponible de RapidAPI.';
      throw new Error(`Error de la API de RapidAPI: ${response.status} ${response.statusText}. ${apiErrorMessage}`);
    }
    
    let passwordString = '';
    try {
        // This API often returns the password directly as text.
        // If JSON.parse fails, assume responseText is the password.
        const jsonData = JSON.parse(responseText);
        console.log("[Password Generator Service] Parsed jsonData from API:", jsonData);

        if (jsonData && jsonData.random_password) {
            passwordString = jsonData.random_password;
        } else if (jsonData && jsonData.password) {
            passwordString = jsonData.password;
        } else if (typeof jsonData === 'string') { 
             passwordString = jsonData;
        } else {
            // Try to find any string property if it's an unexpected JSON object
            const firstStringProp = Object.values(jsonData).find(val => typeof val === 'string');
            if (firstStringProp) {
                passwordString = firstStringProp as string;
            } else {
                // If we successfully parsed JSON but couldn't find a known password field or any string,
                // it's possible the plain responseText was the intended password.
                // This case might be redundant if the API truly returns plain text, caught by outer catch.
                console.warn("[Password Generator Service] Password not found in known JSON fields, trying responseText as fallback.");
                passwordString = responseText.trim(); // Fallback to trimmed responseText
            }
        }
    } catch (e) {
        // If JSON.parse fails, it's likely responseText is the password directly (plain text)
        console.log("[Password Generator Service] JSON.parse failed, assuming responseText is the password. Error:", (e as Error).message);
        if (typeof responseText === 'string' && responseText.trim().length > 0) {
            passwordString = responseText.trim();
        } else {
            console.error("[Password Generator Service] Response is not valid JSON and not a non-empty string:", responseText);
            throw new Error("Respuesta inesperada de la API de RapidAPI (ni JSON válido, ni cadena directa).");
        }
    }
    
    // Log the derived password string before returning
    console.log("[Password Generator Service] Derived passwordString:", `"${passwordString}"`);

    if (!passwordString || passwordString.trim() === '') {
      console.error("[Password Generator Service] Extracted password string is empty or whitespace.");
      throw new Error('La API devolvió una contraseña vacía o inválida.');
    }

    return {
      randomPassword: passwordString.trim(), // Ensure to trim whitespace
    };

  } catch (error) {
    console.error("[Password Generator Service] Error generating random password:", error);
    if (error instanceof Error) {
        if(error.message.startsWith('Error de la API de RapidAPI:') || error.message.startsWith('Datos de entrada no válidos:') || error.message.startsWith('Configuración del servidor incompleta') || error.message.startsWith('La API devolvió una contraseña vacía')) {
            throw error;
          }
      throw new Error(`No se pudo generar la contraseña: ${error.message}`);
    }
    throw new Error('Ocurrió un error desconocido al generar la contraseña.');
  }
}
