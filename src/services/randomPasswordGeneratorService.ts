
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
  randomPassword: z.string().min(1, "La contraseña generada no puede estar vacía."),
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
    console.error('[Servicio Generador Contraseñas] Clave o Host de RapidAPI para el generador de contraseñas no están configurados en las variables de entorno.');
    throw new Error('Configuración del servidor incompleta para el generador de contraseñas.');
  }

  const queryParams = new URLSearchParams();
  queryParams.append('length', passwordLength.toString());
  if (uppercase) queryParams.append('uppercase', 'true'); 
  if (lowercase) queryParams.append('lowercase', 'true'); 
  if (numbers) queryParams.append('numbers', 'true');     
  if (symbols) queryParams.append('symbols', 'true');   
  
  const endpointPath = "/random-password/index.php"; 
  const endpointUrl = `https://${apiHost}${endpointPath}?${queryParams.toString()}`;
  
  console.log(`[Servicio Generador Contraseñas] Intentando obtener URL: ${endpointUrl.replace(apiKey, 'TU_CLAVE_RAPIDAPI')}`);

  try {
    const response = await fetch(endpointUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost,
      },
    });

    const responseText = await response.text();
    console.log("[Servicio Generador Contraseñas] Texto de respuesta crudo de la API:", `"${responseText}"`);

    if (!response.ok) {
      console.error("[Servicio Generador Contraseñas] La respuesta de la API no fue OK. Estado:", response.status, "Texto de Respuesta:", responseText);
      throw new Error(`Error de la API de RapidAPI: ${response.status} ${response.statusText}. Detalle: ${responseText.trim()}`);
    }
    
    let jsonData;
    try {
      jsonData = JSON.parse(responseText);
    } catch (e) {
      console.error("[Servicio Generador Contraseñas] Fallo al parsear la respuesta JSON de RapidAPI:", responseText, e);
      throw new Error('Respuesta inesperada de la API de RapidAPI (no es JSON válido).');
    }

    console.log("[Servicio Generador Contraseñas] Datos JSON parseados de la API:", jsonData);

    const parsedRapidApiResponse = RapidApiResponseSchema.safeParse(jsonData);

    if (!parsedRapidApiResponse.success) {
      console.error("[Servicio Generador Contraseñas] Error de parseo Zod para la estructura de respuesta de RapidAPI:", parsedRapidApiResponse.error.flatten());
      throw new Error('No se pudo analizar la estructura de la respuesta de la API de RapidAPI.');
    }

    const { status, message, password: apiPassword } = parsedRapidApiResponse.data;
    
    if (status === true && (apiPassword === "" || !apiPassword)) {
      console.warn("[Servicio Generador Contraseñas] API reportó éxito (status:true) pero devolvió una cadena de contraseña vacía. Mensaje de la API:", message);
      throw new Error(`La API generó la contraseña exitosamente pero no devolvió caracteres. Mensaje de la API: "${message}". Verifica los parámetros de tipo de caracter.`);
    }
    
    if (status === false) {
         console.error("[Servicio Generador Contraseñas] API reportó fallo. Estado:", status, "Mensaje:", message, "Contraseña:", `"${apiPassword}"`);
         throw new Error(`La API de RapidAPI no pudo generar una contraseña. Mensaje: "${message || 'Razón desconocida'}"`);
    }
    
    console.log("[Servicio Generador Contraseñas] Contraseña extraída exitosamente:", `"${apiPassword}"`);

    return {
      randomPassword: apiPassword,
    };

  } catch (error) {
    console.error("[Servicio Generador Contraseñas] Error en generateRandomPassword:", error);
    if (error instanceof Error) {
        if(error.message.startsWith('Error de la API de RapidAPI:') || 
           error.message.startsWith('Datos de entrada no válidos:') || 
           error.message.startsWith('Configuración del servidor incompleta') ||
           error.message.startsWith('La API generó la contraseña exitosamente pero no devolvió caracteres') ||
           error.message.startsWith('No se pudo analizar la estructura de la respuesta') ||
           error.message.startsWith('La API de RapidAPI no pudo generar una contraseña') ||
           error.message.startsWith('Respuesta inesperada de la API de RapidAPI')
          ) {
            throw error;
          }
      throw new Error(`No se pudo generar la contraseña: ${error.message}`);
    }
    throw new Error('Ocurrió un error desconocido al generar la contraseña.');
  }
}
