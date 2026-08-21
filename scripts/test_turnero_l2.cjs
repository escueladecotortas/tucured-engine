// Archivo: scripts/test_turnero_l2.cjs
const fs = require('fs');
const path = require('path');

const widgetPath = path.resolve(__dirname, '../backend/stitch/widgets/booking/booking_v2_smart_turnero.html');
const content = fs.readFileSync(widgetPath, 'utf8');

console.log("Iniciando validación empírica del Turnero L2...\n");

// 1. Extraer y probar sanitización de teléfono
const sanitizePhoneMatch = content.match(/const sanitizePhone = \((.*?)\) => \{([\s\S]*?)\};/);
if (sanitizePhoneMatch) {
    const sanitizePhone = new Function(sanitizePhoneMatch[1], sanitizePhoneMatch[2]);
    console.log("✅ TEST 1: SANITIZACIÓN DE TELÉFONO");
    const testCases = [
        { input: "155123456", desc: "Empieza con 15" },
        { input: "03811234567", desc: "Empieza con 0" },
        { input: "+54 9 381 123-4567", desc: "Formato internacional con espacios y guiones" },
        { input: "381 abc 123", desc: "Caracteres no numéricos" }
    ];
    
    testCases.forEach(t => {
        console.log(`   Input: "${t.input}" (${t.desc}) -> Output: "${sanitizePhone(t.input)}"`);
    });
} else {
    console.log("❌ Error: No se encontró la función sanitizePhone");
}

// 2. Extraer y probar generación de slots
const generateTimeSlotsMatch = content.match(/const generateTimeSlots = \((.*?)\) => \{([\s\S]*?)\};/);
if (generateTimeSlotsMatch) {
    const generateTimeSlots = new Function(generateTimeSlotsMatch[1], generateTimeSlotsMatch[2]);
    console.log("\n✅ TEST 2: GENERACIÓN DE SLOTS HORARIOS");
    const config = { start: "09:00", end: "11:00", intervalMinutes: 30 };
    const slots = generateTimeSlots(config);
    console.log(`   Configuración: 09:00 a 11:00 (intervalos de 30m)`);
    console.log(`   Slots generados:`, slots);
} else {
    console.log("❌ Error: No se encontró la función generateTimeSlots");
}

// 3. Simulación de lógica de bloqueo (Ocupados + Pasado)
console.log("\n✅ TEST 3: BLOQUEO DE SLOTS (PASADO Y OCUPADOS)");
const mockOccupied = ["09:30", "11:30", "17:00"];
const now = new Date();
const currentHourStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
console.log(`   [Contexto] Hora actual del sistema: ${currentHourStr}`);
console.log(`   [Contexto] Slots recibidos del endpoint (ocupados):`, mockOccupied);

// Vamos a simular que el turno de hoy incluye horas antes, iguales y después de la hora actual
const slotsToTest = ["08:00", "09:30", currentHourStr, "11:30", "18:00", "22:00"];
const isToday = true;

slotsToTest.forEach(t => {
    const isOccupied = mockOccupied.includes(t);
    const isPast = isToday && t < currentHourStr;
    const disabled = isOccupied || isPast;
    
    let reasons = [];
    if (isOccupied) reasons.push("OCUPADO_POR_API");
    if (isPast) reasons.push("HORARIO_PASADO");
    
    const status = disabled ? `BLOQUEADO [${reasons.join(', ')}]` : "DISPONIBLE";
    console.log(`   -> Slot [${t}]: ${status}`);
});

console.log("\nEjecución de validación terminada.");
