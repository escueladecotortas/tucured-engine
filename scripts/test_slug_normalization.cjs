// Archivo: scripts/test_slug_normalization.cjs
const slugify = require('../backend/utils/slugify');

function runTest(input, expected) {
    const result = slugify(input);
    const success = result === expected;
    console.log(`[TEST] "${input}" -> "${result}" | ${success ? '✅ OK' : '❌ FAIL (Esperado: ' + expected + ')'}`);
    return success;
}

const tests = [
    { input: 'Florería Independencia', expected: 'floreria-independencia' },
    { input: 'Florería El Indio', expected: 'floreria-el-indio' },
    { input: 'Café Martínez', expected: 'cafe-martinez' },
    { input: 'Peña Los Gauchos Ñuñorco', expected: 'pena-los-gauchos-nunorco' },
    { input: 'Supermercado Día%', expected: 'supermercado-dia' },
    { input: '  espacios locos   ', expected: 'espacios-locos' },
    { input: 'Camión_de_carga', expected: 'camion-de-carga' },
    { input: 'Agüero y CIA', expected: 'aguero-y-cia' }
];

let allPassed = true;
tests.forEach(t => {
    if (!runTest(t.input, t.expected)) {
        allPassed = false;
    }
});

if (allPassed) {
    console.log('\n✅ TODOS LOS TESTS PASARON EXITOSAMENTE.');
    process.exit(0);
} else {
    console.error('\n❌ ALGUNOS TESTS FALLARON.');
    process.exit(1);
}
