// Archivo: scripts/purge_zombie_leads.js
// Script Soberano de Purga Atómica: Erradica prospectos zombi en Firestore y disco

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const dotenv = require('dotenv');
dotenv.config();

const { db } = require('../backend/config/db');
const LOCAL_DUMP_PATH = path.resolve(__dirname, '../data/db_dump.json');

async function purgeZombies() {
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('🧹 PURGA ATÓMICA DE LEADS ZOMBIS ("Café San Martín Test")');
    console.log('════════════════════════════════════════════════════════════════════\n');

    let firestorePurged = 0;
    let localDumpPurged = 0;
    let foldersPurged = 0;

    // 1. Purga en Cloud Firestore
    if (db) {
        try {
            const snap = await db.collection('prospects').get();
            for (const doc of snap.docs) {
                const data = doc.data();
                const name = (data.name || '').toLowerCase();
                const slug = (data.slug || '').toLowerCase();
                if (name.includes('san martín test') || name.includes('san martin test') || slug.includes('san-mart-n-test') || slug.includes('san-martin-test')) {
                    await db.collection('prospects').doc(doc.id).delete();
                    console.log(`🔥 [Firestore] Doc purgado: ${doc.id} ("${data.name}")`);
                    firestorePurged++;
                }
            }
        } catch (e) {
            console.warn('⚠️ Error en Firestore purge:', e.message);
        }
    }

    // 2. Purga en data/db_dump.json
    if (fs.existsSync(LOCAL_DUMP_PATH)) {
        try {
            const raw = fs.readFileSync(LOCAL_DUMP_PATH, 'utf-8');
            const dump = JSON.parse(raw);

            if (dump.prospects && typeof dump.prospects === 'object') {
                if (Array.isArray(dump.prospects)) {
                    const before = dump.prospects.length;
                    dump.prospects = dump.prospects.filter(p => {
                        const name = (p.name || '').toLowerCase();
                        const slug = (p.slug || '').toLowerCase();
                        return !(name.includes('san martín test') || name.includes('san martin test') || slug.includes('san-mart-n-test') || slug.includes('san-martin-test'));
                    });
                    localDumpPurged += (before - dump.prospects.length);
                } else {
                    for (const [key, val] of Object.entries(dump.prospects)) {
                        const name = (val.name || '').toLowerCase();
                        const slug = (val.slug || '').toLowerCase();
                        if (name.includes('san martín test') || name.includes('san martin test') || slug.includes('san-mart-n-test') || slug.includes('san-martin-test')) {
                            delete dump.prospects[key];
                            console.log(`📄 [db_dump.json] Key purgada: ${key} ("${val.name}")`);
                            localDumpPurged++;
                        }
                    }
                }
            }

            fs.writeFileSync(LOCAL_DUMP_PATH, JSON.stringify(dump, null, 2), 'utf-8');
            console.log(`✅ [db_dump.json] Guardado limpio (${localDumpPurged} registros purgados)`);
        } catch (e) {
            console.warn('⚠️ Error purgando db_dump.json:', e.message);
        }
    }

    // 3. Purga en filesystem (carpetas de clientes)
    const candidateDirs = [
        path.resolve(__dirname, '../public/clients/cafe-san-martin-test'),
        path.resolve(__dirname, '../public/clients/caf-san-mart-n-test'),
        path.resolve(__dirname, '../nexus_archives/tucu-red/clients/cafe-san-martin-test'),
        path.resolve(__dirname, '../nexus_archives/tucu-red/clients/caf-san-mart-n-test')
    ];

    for (const d of candidateDirs) {
        if (fs.existsSync(d)) {
            fs.rmSync(d, { recursive: true, force: true });
            console.log(`📁 [Filesystem] Carpeta eliminada: ${d}`);
            foldersPurged++;
        }
    }

    console.log('\n════════════════════════════════════════════════════════════════════');
    console.log(`🎯 TOTAL PURGADO: ${firestorePurged} en Firestore | ${localDumpPurged} en db_dump.json | ${foldersPurged} carpetas`);
    console.log('════════════════════════════════════════════════════════════════════\n');
}

purgeZombies();
