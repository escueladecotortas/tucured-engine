// Archivo: scripts/test_slug_2_words.cjs
const slugify = require('../backend/utils/slugify');

const testCases = [
    { input: "Florería Independencia", expected: "floreria-independencia" },
    { input: "Florería El Indio de Barrio Norte", expected: "floreria-el" },
    { input: "Café Martínez Express 24hs", expected: "cafe-martinez" },
    { input: "Peña Los Gauchos Ñuñorco", expected: "pena-los" }
];

let allPassed = true;

console.log("[TEST] Verificando Blindaje de Directorios (Max 2 Palabras & Sin Tildes)");
testCases.forEach(tc => {
    const res = slugify(tc.input);
    if (res === tc.expected) {
        console.log(`✅ OK: "${tc.input}" -> "${res}"`);
    } else {
        console.error(`❌ FAIL: "${tc.input}" -> "${res}" (Esperado: "${tc.expected}")`);
        allPassed = false;
    }
});

if (!allPassed) process.exit(1);
console.log("\n✅ Todos los tests del slugificador blindado pasaron correctamente.");
process.exit(0);
