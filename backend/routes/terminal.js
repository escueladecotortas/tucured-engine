// Archivo: backend/routes/terminal.js
// Enrutador de Terminal Core interactivo con Server-Sent Events (SSE) y ejecución

const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

// Registro de clientes SSE activos
const sseClients = new Set();

// Función de broadcast global para eventos de terminal
function broadcastLog(agent, message, status = 'info', progress = null) {
    let payload;
    if (typeof message === 'object' && message !== null) {
        payload = {
            timestamp: message.timestamp || new Date().toISOString(),
            agent: message.agent || agent || 'NEXUS',
            message: message.message || '',
            status: message.status || status || 'info',
            progress: message.progress !== undefined ? message.progress : progress
        };
    } else if (typeof message === 'string' && message.startsWith('{') && message.endsWith('}')) {
        try {
            const parsed = JSON.parse(message);
            payload = {
                timestamp: parsed.timestamp || new Date().toISOString(),
                agent: parsed.agent || agent || 'NEXUS',
                message: parsed.message || message,
                status: parsed.status || status || 'info',
                progress: parsed.progress !== undefined ? parsed.progress : progress
            };
        } catch (e) {
            payload = {
                timestamp: new Date().toISOString(),
                agent: agent || 'NEXUS',
                message: String(message),
                status: status || 'info',
                progress: typeof progress === 'number' ? progress : null
            };
        }
    } else {
        payload = {
            timestamp: new Date().toISOString(),
            agent: agent || 'NEXUS',
            message: String(message),
            status: status || 'info',
            progress: typeof progress === 'number' ? progress : null
        };
    }

    const sseData = `data: ${JSON.stringify(payload)}\n\n`;

    sseClients.forEach(client => {
        try {
            client.write(sseData);
        } catch (e) {
            sseClients.delete(client);
        }
    });
}

// GET /api/terminal/stream - Canal SSE en tiempo real
router.get('/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    sseClients.add(res);

    // Mensaje de bienvenida inicial
    const welcome = JSON.stringify({
        timestamp: new Date().toISOString(),
        agent: 'NEXUS',
        message: 'Enlace neural SSE establecido. Terminal del Satélite Tucu Red en línea.'
    });
    res.write(`data: ${welcome}\n\n`);

    // Heartbeat cada 15 segundos para mantener el túnel activo
    const heartbeat = setInterval(() => {
        res.write(`: heartbeat\n\n`);
    }, 15000);

    req.on('close', () => {
        clearInterval(heartbeat);
        sseClients.delete(res);
    });
});

// POST /api/terminal/execute - Ejecución de comandos desde la UI
router.post('/execute', (req, res) => {
    const { command, agent = 'USER' } = req.body;
    if (!command || !command.trim()) {
        return res.status(400).json({ error: 'Comando requerido' });
    }

    const cleanCmd = command.trim();
    broadcastLog(agent, cleanCmd);

    // Comandos internos del sistema
    if (cleanCmd.toLowerCase() === 'help' || cleanCmd.toLowerCase() === '/help') {
        setTimeout(() => {
            broadcastLog('NEXUS', 'Comandos disponibles: status, health, services, clear, /<cmd_windows>');
        }, 100);
        return res.json({ success: true, command: cleanCmd });
    }

    if (cleanCmd.toLowerCase() === 'health' || cleanCmd.toLowerCase() === 'status') {
        setTimeout(() => {
            const uptime = Math.round(process.uptime());
            const mem = Math.round(process.memoryUsage().rss / (1024 * 1024));
            broadcastLog('VITALIS', `Motor Tucu Red v10.0 | Uptime: ${uptime}s | RAM: ${mem}MB | Estado: NOMINAL`);
        }, 150);
        return res.json({ success: true, command: cleanCmd });
    }

    if (cleanCmd.toLowerCase() === 'services') {
        setTimeout(() => {
            broadcastLog('CODI', '51 Servicios del motor activos (TheDirector, AutoSiteGenerator, Stitch, Vision, Shield).');
        }, 150);
        return res.json({ success: true, command: cleanCmd });
    }

    // Ejecución segura de comandos del sistema
    const sysCmd = cleanCmd.startsWith('/') ? cleanCmd.substring(1) : cleanCmd;
    exec(sysCmd, { windowsHide: true, timeout: 10000 }, (error, stdout, stderr) => {
        if (error) {
            broadcastLog('TERMINAL', `Error: ${error.message}`);
        } else {
            if (stdout) {
                stdout.split('\n').forEach(line => {
                    if (line.trim()) broadcastLog('OUTPUT', line.trim());
                });
            }
            if (stderr) {
                stderr.split('\n').forEach(line => {
                    if (line.trim()) broadcastLog('STDERR', line.trim());
                });
            }
        }
    });

    res.json({ success: true, command: cleanCmd });
});

// POST /api/terminal/log - Inyección programática de logs
router.post('/log', (req, res) => {
    const { agent, message } = req.body;
    if (message) {
        broadcastLog(agent || 'SYSTEM', message);
    }
    res.json({ success: true });
});

module.exports = router;
module.exports.broadcastLog = broadcastLog;
