// Archivo: scripts/test_engine_full_health.js
// Batería Integral de Salud Clínica para tucured-engine (Nexus OS v10.0)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('════════════════════════════════════════════════════════════════════');
console.log('🩺 INICIANDO BATERÍA INTEGRAL DE SALUD CLÍNICA (TUCURED-ENGINE)');
console.log('════════════════════════════════════════════════════════════════════\n');

let passedChecks = 0;
let totalChecks = 0;

function assert(condition, message) {
    totalChecks++;
    if (condition) {
        console.log(`✅ [PASS] ${message}`);
        passedChecks++;
    } else {
        console.error(`❌ [FAIL] ${message}`);
    }
}

// 1. Verificar peso de public/
const publicDir = path.join(__dirname, '../public');
function getDirSize(dir) {
    let size = 0;
    if (!fs.existsSync(dir)) return 0;
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const full = path.join(dir, f);
        if (fs.statSync(full).isDirectory()) size += getDirSize(full);
        else size += fs.statSync(full).size;
    }
    return size;
}
const publicSizeMb = parseFloat((getDirSize(publicDir) / (1024 * 1024)).toFixed(2));
assert(publicSizeMb < 190, `Peso de public/ optimizado: ${publicSizeMb} MB (< 190 MB tras purga de residuos)`);

// 2. Verificar que los assets clave de la experiencia cinemática están intactos
const activeAssets = [
    'assets/cinematic/transitions/intro.mp4',
    'assets/cinematic/transitions/elevator_ride_f1.mp4',
    'assets/cinematic/transitions/elevator_open_f1.mp4',
    'assets/cinematic/transitions/enter_office_f1.mp4',
    'assets/cinematic/transitions/lobby_to_elevator.mp4',
    'assets/cinematic/floors/floor_1_tucured.png',
    'assets/cinematic/exterior/building_day.png',
    'assets/cinematic/exterior/building_night.png',
    'assets/cinematic/lobby/intercom_panel.png'
];
for (const asset of activeAssets) {
    const p = path.join(publicDir, asset);
    assert(fs.existsSync(p), `Asset cinemático esencial preservado: ${asset}`);
}

// 3. Verificar que los componentes huérfanos fueron erradicados
const deadComponents = [
    'src/components/archive',
    'src/components/ClientIdentity.jsx',
    'src/components/core/MetricCard.jsx',
    'src/components/GlobalConsole.jsx',
    'src/components/ProjectHub.jsx',
    'src/components/visual/TheHive.jsx'
];
for (const dc of deadComponents) {
    const p = path.join(__dirname, '..', dc);
    assert(!fs.existsSync(p), `Componente huérfano erradicado con éxito: ${dc}`);
}

// 4. Verificar variables de entorno
const envPath = path.join(__dirname, '../.env');
assert(fs.existsSync(envPath), 'Archivo .env presente en la raíz de tucured-engine');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    assert(envContent.includes('VITE_FIREBASE_API_KEY'), 'Variable VITE_FIREBASE_API_KEY presente');
    assert(envContent.includes('PORT=5005'), 'Variable PORT=5005 presente');
}

console.log('\n════════════════════════════════════════════════════════════════════');
console.log(`🎯 RESULTADO: ${passedChecks}/${totalChecks} CHECKS EXITOSOS (${Math.round((passedChecks/totalChecks)*100)}%)`);
console.log('════════════════════════════════════════════════════════════════════');

if (passedChecks === totalChecks) {
    process.exit(0);
} else {
    process.exit(1);
}
