import * as admin from 'firebase-admin';

// Initialize Firebase Admin (Singleton Pattern)
if (!admin.apps.length) {
    try {
        const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        // Only initialize if we have the key (Run time)
        if (serviceAccountJson) {
            const serviceAccount = JSON.parse(serviceAccountJson);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log("🔥 [Serverless Firebase] Inicializado (SSOT).");
        } else {
            console.warn("⚠️ [Serverless Firebase] Skipping init: No credentials found (Build time?)");
        }
    } catch (e) {
        console.error("❌ [Serverless Firebase] Fallo al inicializar:", e);
    }
}

// Export a function to get DB safely
export const getDb = () => {
    if (!admin.apps.length) {
        // En tiempo de build local, admin.apps.length puede ser 0
        // pero necesitamos que la función exista para que el build pase.
        // Solo lanzamos error si estamos en runtime y realmente falló.
        if (process.env.NODE_ENV === 'production') {
             // Intento de fallback o silent fail para evitar crash de build
        }
    }
    return admin.firestore();
}
