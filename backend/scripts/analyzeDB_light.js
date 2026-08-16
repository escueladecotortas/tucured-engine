const admin = require("firebase-admin");
const dotenv = require("dotenv");
const path = require("path");
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, "../.env") });
const serviceAccount = require(path.join(__dirname, "../serviceAccountKey.json"));

if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

async function analyzeLight() {
    console.log("🔍 SCAN LIGHT...");
    const report = { collections: [], target: null, example_mission: null };

    // 1. Root Collections
    const cols = await db.listCollections();
    report.collections = cols.map(c => c.id);
    console.log("📂 Collections Found:", report.collections);

    // 2. Target Search (RsWzBbZJBUtZp7sANqtF) in 'missions' (guessing root)
    if (report.collections.includes('missions')) {
        console.log("🎯 Checking 'missions' root collection for target...");
        try {
            const doc = await db.collection('missions').doc('RsWzBbZJBUtZp7sANqtF').get();
            if (doc.exists) {
                report.target = doc.data();
                console.log("✅ TARGET FOUND!");
            } else {
                console.log("❌ Target NOT found in root 'missions'. Checking all collections...");
                // Fallback: Check all root collections for this ID
                for (const col of cols) {
                    const d = await col.doc('RsWzBbZJBUtZp7sANqtF').get();
                    if (d.exists) {
                        report.target = d.data();
                        report.target_collection = col.id;
                        console.log(`✅ TARGET FOUND IN [${col.id}]!`);
                        break;
                    }
                }
            }
        } catch (e) {
            console.error("Error reading target:", e);
        }
    }

    // 3. Dump to file
    fs.writeFileSync(path.join(__dirname, '../db_light_dump.json'), JSON.stringify(report, null, 2));
    console.log("✅ DUMP SAVED: backend/db_light_dump.json");
    process.exit(0);
}

analyzeLight();
