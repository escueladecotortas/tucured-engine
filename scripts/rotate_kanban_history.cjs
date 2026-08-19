// Archivo: scripts/rotate_kanban_history.cjs
/**
 * ROTACIÓN DE KANBAN Y ARCHIVO HISTÓRICO - FASE 1
 * Protocolo: Nexus OS v11.1 - ELARA (Bóveda)
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const KANBAN_PATH = path.join(ROOT_DIR, '.agent/workflows/kanban.md');
const ARCHIVE_DIR = path.join(ROOT_DIR, '.agent/workflows/archive');
const ARCHIVE_PATH = path.join(ARCHIVE_DIR, 'kanban_history_v1.md');

if (!fs.existsSync(ARCHIVE_DIR)) {
  fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
}

const content = fs.readFileSync(KANBAN_PATH, 'utf8');

// Find where TASK-040 starts
const task040Marker = '- [x] **[TASK-040]**';
const task040Idx = content.indexOf(task040Marker);

if (task040Idx === -1) {
  console.error('❌ Error: No se encontró [TASK-040] en kanban.md');
  process.exit(1);
}

// Recent part: everything up to TASK-040
const recentPart = content.slice(0, task040Idx).trim();

// Historical part: everything from TASK-040 to the end
const historicalPart = content.slice(task040Idx).trim();

// Create Historical Archive
const archiveContent = `# Archivo Histórico de Misiones — tucured-engine (Nexus OS v11.1)

> 📦 **Registro Histórico:** Tareas archivadas desde **TASK-INIT** hasta **TASK-040**.
> Para consultar las tareas activas y recientes (TASK-041 en adelante), referirse a [.agent/workflows/kanban.md](../kanban.md).

---

## [HISTORICAL_DONE]

${historicalPart}
`;

fs.writeFileSync(ARCHIVE_PATH, archiveContent, 'utf8');
console.log(`✅ Archivo histórico creado en: ${ARCHIVE_PATH} (${archiveContent.length} bytes, ${archiveContent.split('\n').length} LOC)`);

// Create New Trimmed Kanban
const newKanbanContent = `${recentPart}

> 📦 **Historial Anterior:** Tareas anteriores (TASK-INIT a TASK-040) archivadas en [archive/kanban_history_v1.md](archive/kanban_history_v1.md).
`;

fs.writeFileSync(KANBAN_PATH, newKanbanContent, 'utf8');
console.log(`✅ kanban.md podado exitosamente en: ${KANBAN_PATH} (${newKanbanContent.length} bytes, ${newKanbanContent.split('\n').length} LOC)`);
