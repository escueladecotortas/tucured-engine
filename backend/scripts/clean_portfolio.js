const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const KEEP_KEYWORDS = ['amora', 'vianderia', 'alberdi', 'adore'];
const TARGET_CLIENTS = [
    {
        id: 'la-alberdi',
        data: {
            name: 'La Alberdi Almacén',
            status: 'active', // Finished
            category: 'Gastronomy',
            description: 'Empanadas y Picadas en CABA.',
            tags: ['local-store', 'food'],
            deployUrl: 'https://la-alberdi.netlify.app' // Hypothesized, can update later
        }
    },
    {
        id: 'adore-esencia',
        data: {
            name: 'Adoré Tu Esencia',
            status: 'active',
            category: 'Wellness',
            description: 'Sesiones de Masaje y Relajación.',
            tags: ['service', 'wellness'],
            deployUrl: 'https://adore-esencia.netlify.app'
        }
    },
    {
        id: 'amora-nails',
        data: {
            name: 'Amora Nails',
            status: 'active',
            category: 'Beauty',
            description: 'Nails & Beauty Studio.',
            tags: ['service', 'beauty'],
            deployUrl: 'https://amoranails.com'
        }
    },
    {
        id: 'la-vianderia',
        data: {
            name: 'La Viandería',
            status: 'active',
            category: 'Food',
            description: 'Viandas saludables.',
            tags: ['food', 'delivery'],
            deployUrl: 'https://lavianderia.com.ar' // Hypothesized
        }
    }
];

async function cleanAndSeed() {
    console.log("=== PORTFOLIO PURGE & SEED ===");
    const snapshot = await db.collection('prospects').get();
    const batch = db.batch();
    let deletedCount = 0;

    // 1. CLEANUP
    snapshot.forEach(doc => {
        const data = doc.data();
        const id = doc.id;
        const name = (data.name || '').toLowerCase();

        // Check if this doc matches any of our target keywords
        const isKeeper = KEEP_KEYWORDS.some(k => name.includes(k) || id.includes(k));

        if (!isKeeper) {
            console.log(`[DELETE] Garbage detected: ${id} (${data.name})`);
            batch.delete(doc.ref);
            deletedCount++;
        } else {
            console.log(`[KEEP] Organic detected: ${id} (${data.name})`);
        }
    });

    if (deletedCount > 0) {
        await batch.commit();
        console.log(`✔ Deleted ${deletedCount} garbage records.`);
    }

    // 2. SEED / UPDATE
    // We iterate over our TARGET_CLIENTS and ensure they exist or update them
    console.log("--- SEEDING TARGETS ---");
    for (const client of TARGET_CLIENTS) {
        const docRef = db.collection('prospects').doc(client.id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            console.log(`[CREATE] Missing Client: ${client.data.name}`);
            await docRef.set({
                ...client.data,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                blueprint: {
                    archetype: 'local_business', // Default
                    sections: ['hero_static', 'contact_form']
                },
                brandKit: { vibration: '4' } // Default safe vibra
            });
        } else {
            console.log(`[EXISTS] Client confirmed: ${client.data.name}`);
            // Optional: Update status if needed, but respect existing data
        }
    }

    console.log("=== OPERATION COMPLETE ===");
}

cleanAndSeed();
