// Archivo: scripts/audit_kanban_sync_cross.cjs
/**
 * AUDITORÍA DE SINCRONIZACIÓN KANBAN: BLUEPRINT-NEXUS & TUCURED-ENGINE
 */

const fs = require('fs');
const path = require('path');

const TUCURED_ENGINE_KANBAN = path.resolve(__dirname, '../.agent/workflows/kanban.md');
const BLUEPRINT_PARSER_PATH = 'C:/Users/leola/Downloads/blueprint-nexus/system_core/dashboard/kanban_parser.js';

console.log('════════════════════════════════════════════════════════════════════');
console.log('🕵️ AUDITORÍA DE PARSEO DE HITOS ENTRE BLUEPRINT-NEXUS Y TUCURED-ENGINE');
console.log('════════════════════════════════════════════════════════════════════\n');

// 1. Verificar existencia física del origen
console.log('1. Verificación Física del Origen (tucured-engine):');
if (!fs.existsSync(TUCURED_ENGINE_KANBAN)) {
  console.error('❌ Error: No existe kanban.md en tucured-engine');
  process.exit(1);
}

const kanbanRaw = fs.readFileSync(TUCURED_ENGINE_KANBAN, 'utf8');
const lines = kanbanRaw.split('\n');
console.log(`• Ruta: ${TUCURED_ENGINE_KANBAN}`);
console.log(`• Total Líneas: ${lines.length} LOC | Peso: ${kanbanRaw.length} bytes`);

// Buscar TASK-047
const hasTask047 = kanbanRaw.includes('TASK-047');
console.log(`• ¿Existe [TASK-047] en kanban.md?: ${hasTask047 ? '✅ SÍ' : '❌ NO (OMISIÓN DETECTADA)'}`);

// Mostrar las últimas tareas en [DONE]
console.log('\n• Tareas registradas en el archivo actual:');
const taskMatches = [...kanbanRaw.matchAll(/- \[x\] \*\*\[(TASK-[A-Z0-9_-]+)\]\*\*/g)].map(m => m[1]);
console.log(`  Encontradas en [DONE]: ${taskMatches.join(', ')}`);

console.log('\n• Snippet de las primeras 25 líneas de kanban.md:');
console.log(lines.slice(0, 25).join('\n'));

// 2. Probar el parser de blueprint-nexus
console.log('\n────────────────────────────────────────────────────────────────────');
console.log('2. Prueba del Parser de blueprint-nexus:');
if (fs.existsSync(BLUEPRINT_PARSER_PATH)) {
  const { parseKanban } = require(BLUEPRINT_PARSER_PATH);
  const parsed = parseKanban(kanbanRaw);
  console.log(`• Backlog: ${(parsed.backlog || []).length} tareas`);
  console.log(`• In Progress: ${(parsed.inProgress || []).length} tareas`);
  console.log(`• Ideas: ${(parsed.ideas || []).length} ideas`);
  console.log(`• Done (Hitos Consolidados): ${(parsed.done || []).length} tareas`);
  
  console.log('\n• Lista de tareas parseadas en [DONE] por blueprint-nexus:');
  (parsed.done || []).forEach(t => {
    console.log(`  - ID: ${t.id.padEnd(10, ' ')} | Título: ${t.title} | Subtareas: ${t.subtasks.length}`);
  });
} else {
  console.log(`⚠️ Parser no encontrado en: ${BLUEPRINT_PARSER_PATH}`);
}

console.log('\n════════════════════════════════════════════════════════════════════');
