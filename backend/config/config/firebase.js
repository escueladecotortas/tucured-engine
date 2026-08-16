const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

if (!admin.apps.length) {
    if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = require(serviceAccountPath);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("✅ Firebase Admin Initialized (Cloud Mode)");
    } else {
        console.warn("⚠️ Firebase serviceAccountKey.json not found. Offline Mode.");
    }
}

const db = admin.apps.length ? admin.firestore() : null;

module.exports = { admin, db };
