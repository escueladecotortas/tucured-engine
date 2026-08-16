const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * VisualBionicsService.js (v1.0)
 * Logic bridge: Node.js Backend <-> Stdio MCP (Playwright).
 */
class VisualBionicsService {
    constructor() {
        this.serverPath = path.resolve(__dirname, '../../system_core/mcp/nexus-browser/server.js');
    }

    /**
     * Executes the 'browse_and_capture' tool through the Stdio MCP interface.
     * Implements a minimal MCP handshake (initialize -> tools/call).
     */
    async capture(url, projectId = 'general') {
        console.log(`📸 [Bionics] Initiating capture for: ${url}`);

        return new Promise((resolve, reject) => {
            const mcp = spawn('node', [this.serverPath], {
                stdio: ['pipe', 'pipe', 'inherit'],
                env: process.env,
                shell: false, // Disabling shell for direct execution
                windowsHide: true // Prevents CMD window from appearing on Windows
            });

            let buffer = '';
            let step = 'initialize'; // initialize -> call

            const send = (obj) => mcp.stdin.write(JSON.stringify(obj) + '\n');

            mcp.stdout.on('data', (data) => {
                buffer += data.toString();
                const lines = buffer.split('\n');
                buffer = lines.pop(); // Keep partial line

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const message = JSON.parse(line.trim());
                        
                        if (step === 'initialize' && message.id === 0) {
                            console.log("🔗 [Bionics] Handshake: Initialized. Calling tool...");
                            step = 'call';
                            send({ jsonrpc: "2.0", method: "notifications/initialized", params: {} });
                            send({ 
                                jsonrpc: "2.0", id: 1, method: "tools/call", 
                                params: { name: "browse_and_capture", arguments: { url, waitMs: 4000 } } 
                            });
                        } else if (step === 'call' && message.id === 1) {
                            console.log("✅ [Bionics] Audit data received.");
                            
                            // Extract data from MCP tool call response
                            const { content } = message.result;
                            const metadataContent = content.find(c => c.type === 'text' && c.text.includes('"metrics"'));
                            const metadata = metadataContent ? JSON.parse(metadataContent.text) : {};
                            
                            // CALCULATE BIONIC SCORE (1-100)
                            let score = 100;
                            const { metrics, logs } = metadata;
                            
                            // Penalty for Speed (> 2.5s)
                            if (metrics?.loadTime > 2500) score -= Math.min(30, Math.floor((metrics.loadTime - 2500) / 200));
                            
                            // Penalty for Health (Console Errors)
                            const errorCount = logs?.filter(l => l.type === 'error').length || 0;
                            const warnCount = logs?.filter(l => l.type === 'warning').length || 0;
                            score -= (errorCount * 12) + (warnCount * 5);
                            
                            score = Math.max(0, Math.min(100, score));

                            mcp.kill();
                            resolve({
                                ...message,
                                audit: {
                                    score,
                                    metrics,
                                    logs,
                                    health: errorCount > 0 ? 'CRITICAL' : (warnCount > 0 ? 'WARNING' : 'OPTIMAL')
                                }
                            });
                        }
                    } catch (e) {
                        console.error("⚠️ [Bionics] Parsing error:", e.message);
                    }
                }
            });

            // Start Handshake
            send({
                jsonrpc: "2.0", id: 0, method: "initialize",
                params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "nexus-backend", version: "1.0" } }
            });

            mcp.on('error', (err) => { mcp.kill(); reject(err); });
            setTimeout(() => { mcp.kill(); reject(new Error('TIMEOUT: MCP Handshake/Call took > 40s')); }, 40000);
        });
    }

    /**
     * Persists the screenshot in the project vault.
     */
    saveToVault(base64Data, url, projectId) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `capture_${timestamp}.png`;
        const targetDir = path.resolve(__dirname, `../../nexus_archives/tucu-red/clients/${projectId}/assets/bionics`);
        
        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
        
        const filePath = path.join(targetDir, filename);
        fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
        
        console.log(`📂 [Bionics] Capture saved to Vault: ${filename}`);
        return { filename, filePath };
    }
}

module.exports = new VisualBionicsService();
