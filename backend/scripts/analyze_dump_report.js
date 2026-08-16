const fs = require('fs');
const path = require('path');

const dumpPath = path.join(__dirname, '../db_dump.json');

try {
    if (!fs.existsSync(dumpPath)) {
        console.error("❌ No se encontró el archivo db_dump.json. Ejecuta analyzeDB.js primero.");
        process.exit(1);
    }

    const rawData = fs.readFileSync(dumpPath);
    const db = JSON.parse(rawData);

    console.log("# REPORTE DE ESTRUCTURA FIRESTORE (GENERADO AUTOMÁTICAMENTE)\n");
    console.log(`Fecha: ${new Date().toISOString()}\n`);

    console.log("## 📊 Resumen General");
    const collections = Object.keys(db);
    console.log(`- **Total Colecciones Raíz:** ${collections.length}`);

    let totalDocs = 0;
    collections.forEach(c => totalDocs += Object.keys(db[c]).length);
    console.log(`- **Total Documentos (aprox):** ${totalDocs}\n`);

    console.log("## 📂 Detalle por Colección\n");

    collections.forEach(colName => {
        const docs = db[colName];
        const docIds = Object.keys(docs);
        const count = docIds.length;

        console.log(`### 📦 Colección: \`${colName}\``);
        console.log(`- **Cantidad de Documentos:** ${count}`);

        if (count > 0) {
            // Analyze schema from first 5 docs
            const sampleSize = Math.min(count, 5);
            const keysFrequency = {};
            const typesFrequency = {};

            // Subcollections detection
            const subcollections = new Set();

            docIds.forEach(id => {
                const doc = docs[id];
                if (doc.__subcollections__) {
                    Object.keys(doc.__subcollections__).forEach(sc => subcollections.add(sc));
                }

                Object.keys(doc).forEach(key => {
                    if (key === '__subcollections__') return;
                    keysFrequency[key] = (keysFrequency[key] || 0) + 1;
                    const type = Array.isArray(doc[key]) ? 'array' : typeof doc[key];
                    if (!typesFrequency[key]) typesFrequency[key] = new Set();
                    typesFrequency[key].add(type);
                });
            });

            console.log(`- **Campos Comunes (Muestra de todos):**`);
            Object.keys(keysFrequency).forEach(key => {
                const coverage = Math.round((keysFrequency[key] / count) * 100);
                // Solo mostrar si es relevante o schema principal
                if (coverage > 10 || count < 10) {
                    console.log(`  - \`${key}\`: ${Array.from(typesFrequency[key]).join(', ')} (${coverage}%)`);
                }
            });

            if (subcollections.size > 0) {
                console.log(`- **Subcolecciones detectadas:** ${Array.from(subcollections).join(', ')}`);
            }
        }
        console.log("");
    });

} catch (error) {
    console.error("Error analizando dump:", error);
}
