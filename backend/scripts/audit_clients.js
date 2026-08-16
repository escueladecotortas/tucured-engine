const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function auditClients() {
    console.log("--- AUDIT START: PROSPECTS COLLECTION ---");
    const snapshot = await db.collection('prospects').get();

    if (snapshot.empty) {
        console.log("No matching documents.");
        return;
    }

    const clients = [];
    snapshot.forEach(doc => {
        clients.push({
            id: doc.id,
            name: doc.data().name || 'Unknown',
            status: doc.data().status || 'N/A',
            desc: doc.data().description || ''
        });
    });

    console.table(clients);
    console.log(`Total: ${clients.length} records.`);
    console.log("--- AUDIT END ---");
}

auditClients();
