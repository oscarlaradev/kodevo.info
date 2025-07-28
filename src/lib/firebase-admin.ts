// src/lib/firebase-admin.ts
import admin from 'firebase-admin';

// Esta función ahora será la única fuente para obtener las credenciales de administrador.
function getAdminCredentials() {
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;

  if (!clientEmail || !privateKey || !projectId) {
    console.warn(
      '[Firebase Admin] Faltan una o más variables de entorno para el SDK de Admin (CLIENT_EMAIL, PRIVATE_KEY, PROJECT_ID). Las operaciones de administrador no estarán disponibles.'
    );
    return null;
  }

  // Reemplaza los caracteres de escape `\\n` por saltos de línea reales `\n`.
  // Esto es crucial porque las variables de entorno a menudo escapan los saltos de línea.
  const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

  return {
    clientEmail,
    privateKey: formattedPrivateKey,
    projectId,
  };
}

let adminFirestore: admin.firestore.Firestore | null = null;

try {
  const credentials = getAdminCredentials();

  // Solo intentar inicializar si las credenciales fueron cargadas con éxito
  if (credentials) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(credentials),
      });
      console.log('[Firebase Admin] SDK de Admin inicializado correctamente.');
    } else {
      console.log('[Firebase Admin] Usando instancia existente del SDK de Admin.');
    }

    adminFirestore = admin.firestore();
  } else {
    // Este caso ocurre si getAdminCredentials devolvió null
    console.warn(
      '[Firebase Admin] No se pudieron cargar las credenciales. La inicialización del SDK de Admin se omitió. Las funciones de Admin no estarán operativas.'
    );
  }
} catch (error) {
  console.error('[Firebase Admin] Error crítico al inicializar la app de Admin.', error);
  // Dejar adminFirestore como null si la inicialización falla.
  adminFirestore = null;
}

// Exportar la instancia de Firestore, que será null si la inicialización falló.
// Las funciones que la usen deberán verificar si es null antes de operar.
export { adminFirestore };
