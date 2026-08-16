// Archivo: backend/config/db.js
// SSOT: Única Fuente de Verdad para Inicialización de Firestore

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');
if (!admin.apps.length) {
    if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = require(serviceAccountPath);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("✅ [DB] Firebase Admin Initialized (Cloud Mode SSOT)");
    } else {
        console.warn("⚠️ [DB] Firebase serviceAccountKey.json not found. Offline Mode.");
    }
}

const db = admin.apps.length ? admin.firestore() : null;

module.exports = { admin, db };
