const fs = require('fs');
const path = require('path');

/**
 * ARGUS GATE v2.0 (IRON DOCTRINE)
 * Valida Células Atómicas (.tsx, .ts, .js) contra la Doctrina de Hierro.
 * 
 * REGLAS:
 * 1. LEY DE 200 LÍNEAS: Archivo > 200 líneas = VETO.
 * 2. LIMPIEZA: No `console.log` (salvo error), no `var`, no `any`.
 * 3. NEXT.JS 15: Alerta si ve `useEffect` sin "use client".
 */

const MAX_LINES = 200;
const FORBIDDEN_PATTERNS = [
    { regex: /console\.log\(/, message: "Leftover 'console.log' detected." },
    { regex: /\bvar\b/, message: "Forbidden 'var' keyword. Use 'const' or 'let'." },
    { regex: /: any\b/, message: "TypeScript 'any' detected. Be specific." },
    { regex: /Lorem Ipsum/i, message: "Placeholder text 'Lorem Ipsum' detected." }
];

function validateCell(filePath) {
    const fileName = path.basename(filePath);
    console.log(`\n👁️ ARGUS SCANNING: ${fileName}`);

    if (!fs.existsSync(filePath)) {
        console.error(`❌ ERROR: File not found: ${filePath}`);
        return false;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const lineCount = lines.length;
    let errors = [];
    let warnings = [];

    // 1. LEY DE 200 LÍNEAS
    if (lineCount > MAX_LINES) {
        errors.push(`CRITICAL: Line count ${lineCount} exceeds limit of ${MAX_LINES}. REFACTOR IMMEDIATELY.`);
    }

    // 2. PATRONES PROHIBIDOS
    lines.forEach((line, index) => {
        FORBIDDEN_PATTERNS.forEach(pattern => {
            if (pattern.regex.test(line)) {
                // Ignore comments
                if (!line.trim().startsWith('//') && !line.trim().startsWith('/*')) {
                    errors.push(`Line ${index + 1}: ${pattern.message}`);
                }
            }
        });
    });

    // 3. NEXT.JS 15 HEURISTICS
    if (content.includes('useEffect') || content.includes('useState')) {
        if (!content.includes("'use client'") && !content.includes('"use client"')) {
            errors.push("CRITICAL: React Hooks used without 'use client' directive.");
        }
    }

    // REPORTE
    if (errors.length > 0) {
        console.error("❌ RECHAZADO (VETOED)");
        errors.forEach(e => console.error(`   - 🔴 ${e}`));
        return false;
    } else {
        console.log(`✅ APROBADO (PASSED) - ${lineCount} LOC`);
        return true;
    }
}

// CLI Execution
if (require.main === module) {
    const targetFile = process.argv[2];
    if (!targetFile) {
        console.log("Usage: node argus_gate.js <path_to_file>");
        process.exit(1);
    }
    const passed = validateCell(targetFile);
    process.exit(passed ? 0 : 1);
}

module.exports = validateCell;
