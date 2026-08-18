// Archivo: backend/config/db.js
// SSOT: Inicialización Resiliente de Firestore y Firebase Admin SDK

const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

let db = null;

try {
    const possiblePaths = [
        path.join(process.cwd(), 'serviceAccountKey.json'),
        path.resolve(__dirname, '../../serviceAccountKey.json'),
        path.resolve(__dirname, '../serviceAccountKey.json'),
        process.env.GOOGLE_APPLICATION_CREDENTIALS
    ].filter(Boolean);

    const serviceAccountPath = possiblePaths.find(p => fs.existsSync(p));

    if (serviceAccountPath) {
        const serviceAccount = require(serviceAccountPath);
        const apps = admin.getApps ? admin.getApps() : [];
        const app = apps.length > 0 
            ? apps[0] 
            : admin.initializeApp({ credential: admin.cert(serviceAccount) });
        
        db = getFirestore(app);
        console.log(`🔥 [DB] Firebase Admin SDK conectado con éxito a Cloud Firestore (${serviceAccount.project_id || 'Cloud Mode'})`);
    } else {
        console.log("ℹ️ [DB] serviceAccountKey.json ausente. Modo Local-First Activo.");
        db = null;
    }
} catch (err) {
    console.warn("⚠️ [DB] Error inicializando Firebase Admin:", err.message);
    db = null;
}

// Helper seguro de FieldValue para compatibilidad
const safeAdmin = {
    ...admin,
    firestore: Object.assign(
        (app) => (db || (admin.getApps && admin.getApps().length ? getFirestore(admin.getApps()[0]) : null)),
        {
            FieldValue: FieldValue || {
                serverTimestamp: () => new Date(),
                delete: () => null
            }
        }
    )
};

module.exports = { admin: safeAdmin, db };
