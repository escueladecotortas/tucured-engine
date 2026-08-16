// Archivo: backend/scripts/checkFileLength.js
const fs = require('fs');
const path = require('path');

/**
 * VALIDADOR DE LEY DE 200 LÍNEAS (NEXUS-OS)
 * Este script escanea los directorios de código fuente y falla si algún archivo supera las 200 líneas.
 */

const CONFIG = {
    maxLines: 200,
    directories: [
        path.resolve(__dirname, '../../backend/services'),
        path.resolve(__dirname, '../../backend/routes'),
        path.resolve(__dirname, '../../frontend/src/components'),
    ],
    extensions: ['.js', '.jsx', '.tsx'],
    exclude: ['node_modules', 'dist', 'build', '.next', 'archive', 'TermsAndConditions.jsx']
};

let totalFiles = 0;
let violations = [];

function checkDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (CONFIG.exclude.some(ex => fullPath.includes(ex))) return;

        if (stat.isDirectory()) {
            checkDirectory(fullPath);
        } else if (CONFIG.extensions.includes(path.extname(file))) {
            totalFiles++;
            const content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n').length;
            
            if (lines > CONFIG.maxLines) {
                violations.push({ path: fullPath, lines });
            }
        }
    });
}

console.log('🛡️  Iniciando Auditoría de Pureza Estructural (Ley de 200 líneas)...');

CONFIG.directories.forEach(dir => checkDirectory(dir));

if (violations.length > 0) {
    console.error(`\n❌ VIOLACIÓN DE LA LEY DE 200 LÍNEAS: Se encontraron ${violations.length} archivos fuera de norma.\n`);
    violations.forEach(v => {
        console.error(`  [!] ${path.relative(process.cwd(), v.path)}: ${v.lines} líneas`);
    });
    console.log('\nAcción requerida: Refactorizar estos archivos en componentes atómicos inmediatamente.');
    process.exit(1);
} else {
    console.log(`\n✅ PUREZA GARANTIZADA: ${totalFiles} archivos analizados. Todos cumplen con la norma (< 200 líneas).`);
    process.exit(0);
}
