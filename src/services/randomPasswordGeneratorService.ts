
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
  randomPassword: z.string().min(1, "La contraseña generada no puede estar vacía."), // Ensure our service returns a non-empty password
});
export type PasswordGeneratorOutput = z.infer<typeof PasswordGeneratorOutputSchema>;

// Schema for the actual response from RapidAPI
const RapidApiResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  password: z.string(), // This can be empty in the API response
});

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
    console.log("[Password Generator Service] Raw responseText from API:", `"${responseText}"`);

    if (!response.ok) {
      console.error("[Password Generator Service] API response was not OK. Status:", response.status, "Response Text:", responseText);
      throw new Error(`Error de la API de RapidAPI: ${response.status} ${response.statusText}. Detalle: ${responseText.trim()}`);
    }
    
    let jsonData;
    try {
      jsonData = JSON.parse(responseText);
    } catch (e) {
      console.error("[Password Generator Service] Failed to parse JSON response from RapidAPI:", responseText, e);
      // If parsing fails, but API said OK, it might be plain text after all.
      // This case is unlikely given the new JSON response you saw, but as a fallback:
      if (responseText.trim()) {
         console.log("[Password Generator Service] Assuming plain text password due to JSON parse failure:", responseText.trim());
         return { randomPassword: responseText.trim() };
      }
      throw new Error('Respuesta inesperada de la API de RapidAPI (no es JSON válido y está vacía).');
    }

    console.log("[Password Generator Service] Parsed JSON data from API:", jsonData);

    const parsedRapidApiResponse = RapidApiResponseSchema.safeParse(jsonData);

    if (!parsedRapidApiResponse.success) {
      console.error("[Password Generator Service] Zod parsing error for RapidAPI response structure:", parsedRapidApiResponse.error.flatten());
      throw new Error('No se pudo analizar la estructura de la respuesta de la API de RapidAPI.');
    }

    const { status, message, password: apiPassword } = parsedRapidApiResponse.data;

    if (status === true && apiPassword === "") {
      console.warn("[Password Generator Service] API reported success (status:true) but returned an empty password string. Message from API:", message);
      throw new Error(`La API generó la contraseña exitosamente pero no devolvió caracteres. Mensaje de la API: "${message}". Verifica los parámetros de tipo de caracter.`);
    }
    
    if (status === false || !apiPassword) {
         console.error("[Password Generator Service] API reported failure or empty password. Status:", status, "Message:", message, "Password:", apiPassword);
         throw new Error(`La API de RapidAPI no pudo generar una contraseña. Mensaje: "${message || 'Razón desconocida'}"`);
    }
    
    console.log("[Password Generator Service] Successfully extracted password:", `"${apiPassword}"`);

    return {
      randomPassword: apiPassword,
    };

  } catch (error) {
    console.error("[Password Generator Service] Error in generateRandomPassword:", error);
    if (error instanceof Error) {
        if(error.message.startsWith('Error de la API de RapidAPI:') || 
           error.message.startsWith('Datos de entrada no válidos:') || 
           error.message.startsWith('Configuración del servidor incompleta') ||
           error.message.startsWith('La API generó la contraseña exitosamente pero no devolvió caracteres') ||
           error.message.startsWith('No se pudo analizar la estructura de la respuesta') ||
           error.message.startsWith('La API de RapidAPI no pudo generar una contraseña')
          ) {
            throw error;
          }
      throw new Error(`No se pudo generar la contraseña: ${error.message}`);
    }
    throw new Error('Ocurrió un error desconocido al generar la contraseña.');
  }
}
