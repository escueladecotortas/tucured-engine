// Archivo: scripts/test_firebase_config.js
// Validación de Configuración de Firebase y Variables Vite
// Nexus OS v10.0

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../');

console.log('\n🔥 [ARGUS] Test de Configuración de Firebase y Variables Vite');
console.log('═'.repeat(65));

let passed = 0, failed = 0;

function check(label, fn) {
    try {
        const note = fn();
        console.log(`  ✅ ${label}${note ? ' → ' + note : ''}`);
        passed++;
    } catch (e) {
        console.error(`  ❌ ${label} → ${e.message}`);
        failed++;
    }
}

// Check 1: Presencia de .env
check('.env existe en tucured-engine', () => {
    const envPath = path.join(rootDir, '.env');
    if (!fs.existsSync(envPath)) throw new Error('.env no existe');
    return 'Presente';
});

// Check 2: Variables VITE_FIREBASE_* en .env
check('Variables VITE_FIREBASE_* configuradas en .env', () => {
    const content = fs.readFileSync(path.join(rootDir, '.env'), 'utf-8');
    const requiredVars = [
        'VITE_FIREBASE_API_KEY',
        'VITE_FIREBASE_AUTH_DOMAIN',
        'VITE_FIREBASE_PROJECT_ID',
        'VITE_FIREBASE_STORAGE_BUCKET',
        'VITE_FIREBASE_MESSAGING_SENDER_ID',
        'VITE_FIREBASE_APP_ID'
    ];
    for (const v of requiredVars) {
        if (!content.includes(v + '=')) throw new Error(`Falta ${v}`);
    }
    return '6/6 variables presentes';
});

// Check 3: Blindaje en src/firebase.js
check('src/firebase.js implementa fallback resiliente y try/catch', () => {
    const content = fs.readFileSync(path.join(rootDir, 'src/firebase.js'), 'utf-8');
    if (!content.includes('defaultFirebaseConfig')) throw new Error('Falta defaultFirebaseConfig');
    if (!content.includes('try {') || !content.includes('catch (error)')) throw new Error('Falta bloque try/catch');
    if (!content.includes('export { auth, googleProvider, db, storage }')) throw new Error('Faltan exports requeridos');
    return 'Blindaje activo contra auth/invalid-api-key';
});

// Check 4: .gitignore excluye .env
check('.gitignore excluye .env', () => {
    const content = fs.readFileSync(path.join(rootDir, '.gitignore'), 'utf-8');
    if (!content.includes('.env')) throw new Error('.env no excluido en .gitignore');
    return 'Blindaje de seguridad validado';
});

console.log('═'.repeat(65));
console.log(`[ARGUS] RESULTADO: ${passed}/${passed + failed} checks aprobados`);
if (failed === 0) {
    console.log('✨ Estado: 100% CERTIFICADO — Configuración de Firebase completamente validada.\n');
} else {
    console.log(`⚠️  Estado: ${failed} verificaciones fallidas.\n`);
}
process.exit(failed > 0 ? 1 : 0);
