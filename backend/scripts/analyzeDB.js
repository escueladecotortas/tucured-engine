const admin = require("firebase-admin");
const dotenv = require("dotenv");
const path = require("path");
const fs = require('fs');

// Load .env from backend root
dotenv.config({ path: path.join(__dirname, "../.env") });

// Initialize Firebase
const serviceAccount = require(path.join(__dirname, "../serviceAccountKey.json"));

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}
const db = admin.firestore();

/**
 * AUTO-HEALING LOGIC (SAFE-DB PRO MAX)
 * Verifica y repara documentos críticos de Firestore.
 */
async function healDB() {
    console.log("🛡️ [Auto-Healer] Verificando integridad de la BBDD...");
    let fixCount = 0;

    // 1. Validar Clientes
    const clientsSnapshot = await db.collection('clients').get();
    for (const doc of clientsSnapshot.docs) {
        const data = doc.data();
        const updates = {};
        
        // Regla: Todo cliente debe tener Vibración y Status
        if (!data.vibration) updates.vibration = "V1";
        if (!data.status) updates.status = "active";
        if (!data.dna) updates.dna = { sector: "desconocido", tags: [] };

        if (Object.keys(updates).length > 0) {
            await doc.ref.update(updates);
            console.log(`   ✨ Reparado Cliente: ${doc.id}`);
            fixCount++;
        }
    }

    // 2. Validar Agentes (Configuraciones Críticas)
    const agentsSnapshot = await db.collection('agents').get();
    for (const doc of agentsSnapshot.docs) {
        const data = doc.data();
        if (!data.systemPrompt) {
            console.warn(`   ⚠️ Agente corrupto (sin prompt): ${doc.id}`);
            // Aquí podríamos rehidratar desde system_core/agents/
        }
    }

    if (fixCount > 0) {
        console.log(`✅ [Auto-Healer] Saneado completado. ${fixCount} correcciones aplicadas.`);
    } else {
        console.log("✅ [Auto-Healer] BBDD en armonía total.");
    }
}

async function analyzeDB() {
    console.log("🔍 INICIANDO ESCANEO PROFUNDO DE FIRESTORE...");
    
    // Ejecutar Sanación proactiva si se invoca con el flag --fix
    const shouldHeal = process.argv.includes('--fix');
    if (shouldHeal) {
        await healDB();
    }

    const dump = {};
    const collections = await db.listCollections();

    for (const col of collections) {
        dump[col.id] = {};
        const snapshot = await col.get();

        if (snapshot.empty) continue;

        for (const doc of snapshot.docs) {
            dump[col.id][doc.id] = doc.data();

            // Subcollections
            const subCollections = await doc.ref.listCollections();
            if (subCollections.length > 0) {
                dump[col.id][doc.id]["__subcollections__"] = {};
                for (const subCol of subCollections) {
                    dump[col.id][doc.id]["__subcollections__"][subCol.id] = {};
                    const subSnapshot = await subCol.get();
                    subSnapshot.forEach(subDoc => {
                        dump[col.id][doc.id]["__subcollections__"][subCol.id][subDoc.id] = subDoc.data();
                    });
                }
            }
        }
    }

    // BACKUP ROTATION LOGIC
    const backupsDir = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupsDir)) {
        fs.mkdirSync(backupsDir);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const backupFilename = `db_dump_${timestamp}.json`;
    const backupPath = path.join(backupsDir, backupFilename);
    const latestPath = path.join(__dirname, '../db_dump.json');

    // Save with Timestamp
    fs.writeFileSync(backupPath, JSON.stringify(dump, null, 2));
    console.log(`✅ BACKUP DIARIO GUARDADO: ${backupPath}`);

    // Update 'latest' for easy access
    fs.writeFileSync(latestPath, JSON.stringify(dump, null, 2));
    console.log("✅ DUMP (Latest) ACTUALIZADO en backend/db_dump.json");
}

analyzeDB().catch(console.error);
