// src/services/randomPasswordGeneratorService.ts
'use server';

import { z } from 'zod';
import { randomBytes } from 'crypto';

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

  const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>/?',
  };

  let characterPool = '';
  if (uppercase) characterPool += charSets.uppercase;
  if (lowercase) characterPool += charSets.lowercase;
  if (numbers) characterPool += charSets.numbers;
  if (symbols) characterPool += charSets.symbols;

  if (characterPool.length === 0) {
    throw new Error('Debes seleccionar al menos un tipo de caracter para la contraseña.');
  }

  try {
    const randomPassword = await createSecureRandomString(passwordLength, characterPool);
    return {
      randomPassword: randomPassword,
    };
  } catch (error) {
     console.error("[Servicio Generador Contraseñas] Error al generar la contraseña localmente:", error);
     const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido durante la generación.";
     throw new Error(`No se pudo generar la contraseña: ${errorMessage}`);
  }
}

/**
 * Generates a cryptographically secure random string.
 * @param length The length of the string to generate.
 * @param characterPool The set of characters to choose from.
 * @returns A promise that resolves with the random string.
 */
function createSecureRandomString(length: number, characterPool: string): Promise<string> {
    return new Promise((resolve, reject) => {
        if (length <= 0) {
            return resolve('');
        }

        const poolSize = characterPool.length;
        if (poolSize === 0) {
            return reject(new Error('El grupo de caracteres no puede estar vacío.'));
        }

        let password = '';
        const bytes = randomBytes(length);

        for (let i = 0; i < length; i++) {
            // Map the random byte to an index in the character pool
            const randomIndex = Math.floor((bytes[i] / 256) * poolSize);
            password += characterPool[randomIndex];
        }

        resolve(password);
    });
}
