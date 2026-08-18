// Archivo: backend/routes/kanban.js
// Enrutador Local-First de Kanban: Parseo y Mutación Atómica de kanban.md

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const KANBAN_PATH = path.resolve(__dirname, '../../.agent/workflows/kanban.md');

// Helper: Parsear kanban.md a JSON estructurado
function parseKanban() {
    if (!fs.existsSync(KANBAN_PATH)) return [];

    const content = fs.readFileSync(KANBAN_PATH, 'utf-8');
    const lines = content.split('\n');
    const tasks = [];

    let currentSection = 'pending'; // 'pending' | 'in_progress' | 'completed'
    let currentTask = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        if (trimmed.startsWith('## [TODO]') || trimmed.startsWith('## [PENDING]')) {
            currentSection = 'pending';
            currentTask = null;
            continue;
        } else if (trimmed.startsWith('## [IN_PROGRESS]')) {
            currentSection = 'in_progress';
            currentTask = null;
            continue;
        } else if (trimmed.startsWith('## [DONE]')) {
            currentSection = 'completed';
            currentTask = null;
            continue;
        }

        // Detección de cabecera de tarea principal (ej: - [x] **[TASK-010]** Titulo...)
        const taskMatch = line.match(/^-\s*\[([ x/])\]\s*\*\*\[(.*?)\]\*\*\s*(.*)/i);
        if (taskMatch) {
            const [, checkMark, taskId, titleWithTime] = taskMatch;
            
            // Extraer título limpio y fecha si existe
            let title = titleWithTime;
            let dateStr = null;
            const dateMatch = titleWithTime.match(/\*\((.*?)\)\*/);
            if (dateMatch) {
                dateStr = dateMatch[1];
                title = titleWithTime.replace(/\s*\*\(.*?\)\*/, '').trim();
            }

            // Inferencia heurística de agente y prioridad
            const lower = (title + ' ' + taskId).toLowerCase();
            let assignedTo = 'nexus';
            if (lower.includes('terminal') || lower.includes('devops') || lower.includes('runner') || lower.includes('puerto')) assignedTo = 'kael';
            else if (lower.includes('ui') || lower.includes('diseño') || lower.includes('header') || lower.includes('visual') || lower.includes('avatar')) assignedTo = 'atenea';
            else if (lower.includes('api') || lower.includes('router') || lower.includes('backend') || lower.includes('endpoint')) assignedTo = 'codi';
            else if (lower.includes('qa') || lower.includes('test') || lower.includes('auditor') || lower.includes('bionic')) assignedTo = 'argus';
            else if (lower.includes('lead') || lower.includes('scraping') || lower.includes('embudo') || lower.includes('prospect')) assignedTo = 'icaro';
            else if (lower.includes('copy') || lower.includes('whatsapp') || lower.includes('brief')) assignedTo = 'lorem';

            let priority = 'high';
            if (lower.includes('crítico') || lower.includes('fatal') || lower.includes('core')) priority = 'critical';
            else if (lower.includes('saneamiento') || lower.includes('calibración')) priority = 'medium';

            currentTask = {
                id: taskId,
                title: title.trim(),
                status: currentSection,
                priority,
                assignedTo,
                date: dateStr,
                checkpoints: [],
                projectId: 'tucu-red'
            };
            tasks.push(currentTask);
            continue;
        }

        // Detección de subtareas o checkpoints
        const subtaskMatch = line.match(/^\s*-\s*\[([ x/])\]\s*(.*)/i);
        if (subtaskMatch && currentTask) {
            currentTask.checkpoints.push({
                done: subtaskMatch[1].toLowerCase() === 'x',
                text: subtaskMatch[2].trim()
            });
        }
    }

    return tasks;
}

// GET /api/kanban/tasks - Obtener todas las tareas de kanban.md
router.get('/tasks', (req, res) => {
    try {
        const tasks = parseKanban();
        res.json({ success: true, count: tasks.length, tasks });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// POST /api/kanban/tasks/add - Agregar nueva tarea a kanban.md
router.post('/tasks/add', (req, res) => {
    const { title, description, assignedTo = 'nexus', priority = 'high' } = req.body;
    if (!title) return res.status(400).json({ error: 'Título requerido' });

    try {
        const tasks = parseKanban();
        const nextNum = tasks.length + 1;
        const taskId = `TASK-${String(nextNum).padStart(3, '0')}`;
        const dateStr = new Date().toLocaleString('es-AR');

        const newTaskEntry = `\n- [ ] **[${taskId}]** ${title} *(${dateStr})*\n  - [ ] ${description || 'Ejecución de tarea delegada a @' + assignedTo}`;

        let content = fs.readFileSync(KANBAN_PATH, 'utf-8');
        if (content.includes('## [IN_PROGRESS]')) {
            content = content.replace('## [IN_PROGRESS]', `## [IN_PROGRESS]${newTaskEntry}`);
        } else {
            content += `\n## [IN_PROGRESS]${newTaskEntry}\n`;
        }

        fs.writeFileSync(KANBAN_PATH, content, 'utf-8');
        res.json({ success: true, taskId, message: 'Tarea agregada exitosamente a kanban.md' });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

module.exports = router;
module.exports.parseKanban = parseKanban;
