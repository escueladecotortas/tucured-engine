const admin = require("firebase-admin");
const dotenv = require("dotenv");
const path = require("path");
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, "../.env") });
const serviceAccount = require(path.join(__dirname, "../serviceAccountKey.json"));

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}
const db = admin.firestore();

async function auditDB() {
    console.log("🔍 INICIANDO AUDITORÍA OPTIMIZADA (SAMPLING)...");
    const report = {
        scanDate: new Date().toISOString(),
        collections: {}
    };

    const collections = await db.listCollections();

    for (const col of collections) {
        console.log(`📂 Analizando colección: ${col.id}`);
        report.collections[col.id] = {
            docCountEstimate: 0, // Firestore no da count exacto gratis fácil, usaremos sample size
            fields: {},
            subcollections: []
        };

        // Get sample of 50 docs
        const snapshot = await col.limit(50).get();
        report.collections[col.id].sampleSize = snapshot.size;

        if (snapshot.empty) continue;

        let analyzedDocs = 0;
        for (const doc of snapshot.docs) {
            analyzedDocs++;
            const data = doc.data();

            // Analyze fields
            Object.keys(data).forEach(key => {
                const type = Array.isArray(data[key]) ? 'array' : typeof data[key];
                if (!report.collections[col.id].fields[key]) {
                    report.collections[col.id].fields[key] = { types: new Set(), count: 0 };
                }
                report.collections[col.id].fields[key].types.add(type);
                report.collections[col.id].fields[key].count++;
            });

            // Check subcollections (expensive, do only for first 5 docs)
            if (analyzedDocs <= 5) {
                const subCols = await doc.ref.listCollections();
                subCols.forEach(sc => {
                    if (!report.collections[col.id].subcollections.includes(sc.id)) {
                        report.collections[col.id].subcollections.push(sc.id);
                    }
                });
            }
        }
    }

    // Convert Sets to Arrays for JSON serialization
    Object.keys(report.collections).forEach(cId => {
        Object.keys(report.collections[cId].fields).forEach(f => {
            report.collections[cId].fields[f].types = Array.from(report.collections[cId].fields[f].types);
        });
    });

    const outputPath = path.join(__dirname, '../audit_results.json');
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    console.log(`✅ AUDITORÍA COMPLETADA. Resultado en: ${outputPath}`);
}

auditDB().catch(console.error);
