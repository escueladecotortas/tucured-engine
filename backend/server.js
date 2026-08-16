const express = require('express');
const http = require('http');
const path = require('path');
const { exec } = require('child_process');

console.log("🚀 NEXUS-OS KERNEL — [OPERACIÓN DE RESCATE]");
require('dotenv').config({ path: path.join(__dirname, '.env') });

const agentService = require('./services/AgentService');
const terminalService = require('./services/TerminalService');

const app = express();
require('./config/express')(app); // Restaura configuración de CORS, límites JSON y archivos estáticos (nexus_archives)
const server = http.createServer(app);


// --- [NIVEL 1] HEALTH CHECK (Prioridad Absoluta) ---
app.get('/api/health', (req, res) => {
    res.json({ 
        status: "Online", 
        kernel: "Nexus-OS", 
        tools_active: !!agentService.fsTools,
        timestamp: new Date().toISOString() 
    });
});

// --- [NIVEL 2] RUTAS DE AGENTES ---
app.use('/api/nexus', require('./routes/nexus'));
app.use('/api/bifrost', require('./routes/bifrost'));

// --- [RESTORED] RUTAS DE SISTEMA (Atomic Compliance) ---
app.use('/api', require('./routes/leads'));
app.use('/api/forge', require('./routes/forge'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/widgets', require('./routes/widgets'));
app.use('/api/vitalis', require('./routes/vitalis'));
app.use('/api/automations', require('./routes/automations'));
app.use('/api/vision', require('./routes/vision'));
app.use('/api/tucu', require('./routes/tucu'));
app.use('/api/files', require('./routes/files'));

// --- VINCULACIÓN DE SERVICIOS ---
terminalService.attach(server);
agentService.setSocket(terminalService.io);

// Inyectar herramientas al arrancar
if (agentService.initializeTools) {
    agentService.initializeTools();
}

const PORT = process.env.PORT || 5005;

// --- LIMPIEZA DE PUERTO FORZADA (Synchronous for startup stability) ---
const cleanPort = (port) => {
    if (process.platform === 'win32') {
        try {
            const { execSync } = require('child_process');
            const stdout = execSync(`netstat -ano | findstr :${port}`).toString();
            if (stdout && stdout.includes('LISTENING')) {
                const lines = stdout.trim().split('\n');
                lines.forEach(line => {
                    const parts = line.trim().split(/\s+/);
                    const pid = parts[parts.length - 1];
                    if (pid && pid !== '0' && pid !== String(process.pid)) {
                        console.log(`🛡️ Liberando puerto ${port} (PID: ${pid})...`);
                        try { execSync(`taskkill /F /PID ${pid}`); } catch(e) {}
                    }
                });
            }
        } catch (e) {
            // netstat devuelve error si no encuentra nada, ignoramos
        }
    }
};

cleanPort(PORT);

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.error(`❌ ERROR: El puerto ${PORT} ya está siendo usado por otro proceso.`);
        process.exit(1);
    } else {
        console.error(`❌ FATAL SERVER ERROR:`, e);
    }
});

setTimeout(() => {
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`\n==========================================`);
        console.log(`📡 NEXUS CORE: ONLINE EN PUERTO ${PORT}`);
        console.log(`🔗 TEST: http://localhost:${PORT}/api/health`);
        console.log(`==========================================\n`);
    });
}, 1500);