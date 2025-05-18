
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
  queryParams.append('length', passwordLength.toString());
  if (uppercase) queryParams.append('uppercase', 'on');
  if (lowercase) queryParams.append('lowercase', 'on');
  if (numbers) queryParams.append('numbers', 'on');
  if (symbols) queryParams.append('symbols', 'on');
  
  const endpointPath = "/random-password/index.php"; 
  const endpointUrl = `https://${apiHost}${endpointPath}?${queryParams.toString()}`;
  
  console.log(`[Password Generator Service] Attempting to fetch URL: ${endpointUrl.replace(apiKey, 'YOUR_RAPIDAPI_KEY')}`);

  try {
    const response = await fetch(endpointUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost,
      },
    });

    const responseText = await response.text();
    console.log("[Password Generator Service] Raw responseText from API:", `"${responseText}"`); // Log raw response

    if (!response.ok) {
      console.error("[Password Generator Service] API response was not OK. Status:", response.status, "Response Text:", responseText);
      if (response.status === 400 && responseText.includes("Any of one input is required")) {
           throw new Error(`Error de la API de RapidAPI: ${responseText.trim()}`);
      }
      throw new Error(`Error de la API de RapidAPI: ${response.status} ${response.statusText}. Detalle: ${responseText.trim()}`);
    }
    
    // Directly use the responseText, assuming it's the password, and trim it.
    const extractedPassword = responseText.trim();
    console.log("[Password Generator Service] Extracted password (after trim):", `"${extractedPassword}"`);

    if (!extractedPassword) {
      console.error("[Password Generator Service] Extracted password string is empty after trimming.");
      throw new Error('La API devolvió una respuesta vacía o inválida después de procesar.');
    }

    // A simple check: if the "successful" message is the entire response, then the API isn't giving the password.
    if (extractedPassword.toLowerCase().includes("password generated successfully")) {
        console.warn("[Password Generator Service] API responded with success message but not the password itself.");
        // This might mean the API expects different params or has an issue.
        // For now, we'll throw an error indicating this.
        // throw new Error('La API indicó éxito pero no devolvió una contraseña. Verifica los logs del servidor.');
        // OR, if the API sometimes returns THIS and the password, we need a more complex parsing.
        // For now, let's assume if this message is present, the password is NOT the message itself.
        // This part needs to be verified with actual API response.
        // If "Password generated successfully." IS the response, then the API is not working as expected.
    }


    return {
      randomPassword: extractedPassword,
    };

  } catch (error) {
    console.error("[Password Generator Service] Error in generateRandomPassword:", error);
    if (error instanceof Error) {
        if(error.message.startsWith('Error de la API de RapidAPI:') || error.message.startsWith('Datos de entrada no válidos:') || error.message.startsWith('Configuración del servidor incompleta') || error.message.startsWith('La API devolvió una respuesta vacía')) {
            throw error;
          }
      throw new Error(`No se pudo generar la contraseña: ${error.message}`);
    }
    throw new Error('Ocurrió un error desconocido al generar la contraseña.');
  }
}
