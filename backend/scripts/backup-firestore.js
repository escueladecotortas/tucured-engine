const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

/**
 * Backup completo de Firestore a JSON
 */
async function backupFirestore() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '..', 'backups', `backup_${timestamp}`);

    // Crear directorio de backup
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    console.log('╔════════════════════════════════════════╗');
    console.log('║      BACKUP DE FIRESTORE NEXUS OS      ║');
    console.log('╚════════════════════════════════════════╝\n');
    console.log(`📁 Directorio: ${backupDir}\n`);

    // Listar todas las collections
    const collections = await db.listCollections();

    console.log(`📊 Collections a respaldar: ${collections.length}\n`);

    const backup = {
        metadata: {
            timestamp: new Date().toISOString(),
            database: 'nexus-vertex-prod',
            totalCollections: collections.length
        },
        collections: {}
    };

    for (const collection of collections) {
        const collectionName = collection.id;
        console.log(`⏳ Respaldando: ${collectionName}...`);

        const snapshot = await collection.get();
        const documents = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            // Convertir Timestamps a strings
            const serialized = JSON.parse(JSON.stringify(data, (key, value) => {
                if (value && typeof value === 'object' && value._seconds) {
                    return new Date(value._seconds * 1000).toISOString();
                }
                return value;
            }));

            documents.push({
                id: doc.id,
                data: serialized
            });
        });

        backup.collections[collectionName] = {
            count: documents.length,
            documents
        };

        console.log(`   ✅ ${collectionName}: ${documents.length} documentos\n`);
    }

    // Guardar backup
    const backupFile = path.join(backupDir, 'firestore_backup.json');
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));

    console.log('═══════════════════════════════════════════');
    console.log('✅ BACKUP COMPLETADO');
    console.log('═══════════════════════════════════════════');
    console.log(`📄 Archivo: ${backupFile}`);
    console.log(`📊 Total collections: ${collections.length}`);
    console.log(`💾 Tamaño: ${(fs.statSync(backupFile).size / 1024).toFixed(2)} KB\n`);

    // Crear resumen legible
    const summaryFile = path.join(backupDir, 'RESUMEN.txt');
    let summary = '=== BACKUP FIRESTORE NEXUS OS ===\n\n';
    summary += `Fecha: ${new Date().toLocaleString('es-AR')}\n`;
    summary += `Base de datos: nexus-vertex-prod\n\n`;
    summary += `COLLECTIONS:\n`;

    for (const [name, data] of Object.entries(backup.collections)) {
        summary += `  - ${name}: ${data.count} documentos\n`;
    }

    fs.writeFileSync(summaryFile, summary);

    return backupFile;
}

// Ejecutar
if (require.main === module) {
    backupFirestore()
        .then(file => {
            console.log(`✅ Backup guardado exitosamente en:\n${file}\n`);
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ Error en backup:', error);
            process.exit(1);
        });
}

module.exports = { backupFirestore };
