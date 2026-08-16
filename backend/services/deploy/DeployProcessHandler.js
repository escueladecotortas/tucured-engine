// Archivo: backend/services/deploy/DeployProcessHandler.js
const { exec } = require('child_process');
const TerminalService = require('../TerminalService');

/**
 * Especialista en la ejecución del proceso CLI de Netlify.
 * Compatible con Windows I/O bounds.
 */
class DeployProcessHandler {
    constructor() {
        this.timeout = 300000; // 5 minutos
    }

    /**
     * Ejecuta el despliegue a Netlify usando SPAWN (Silencioso)
     * @param {String} sitePath - Directorio a desplegar
     * @param {String} siteId - ID del sitio en Netlify (opcional)
     * @param {String} authToken - Token de Netlify
     */
    static run(sitePath, siteId, authToken) {
        const { spawn } = require('child_process');
        return new Promise((resolve, reject) => {
            const args = ['netlify', 'deploy', '--prod', '--json', '--dir', '.'];
            if (siteId) {
                args.push('--site', siteId);
            }

            console.log(`[DeployHandler] Ejecutando: npx ${args.join(' ')}`);
            TerminalService.broadcast(`🚀 Netlify Target ID: ${siteId || 'NUEVO'}`, 'info');
            TerminalService.broadcast(`📦 Comprimiendo y subiendo recursos del directorio efímero...`, 'info');

            const options = {
                cwd: sitePath,
                env: { ...process.env, NETLIFY_AUTH_TOKEN: authToken, CI: '1' },
                shell: true,
                windowsHide: true
            };

            const proc = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', args, options);
            
            let stdout = '';
            let stderr = '';

            proc.stdout.on('data', (data) => {
                const chunk = data.toString();
                stdout += chunk;
                if (chunk.includes('Deploy ID:')) {
                    TerminalService.broadcast(`🔁 Autenticando despliegue con Netlify...`, 'info');
                }
            });

            proc.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            proc.on('close', (code) => {
                if (code !== 0) {
                    console.error(`[DeployHandler] Error spawn (code ${code}):`, stderr);
                    return reject(new Error(`Falló Netlify (Exit Code ${code}): ${stderr}`));
                }
                resolve(DeployProcessHandler.parseOutput(stdout));
            });

            // Timeout de 5 minutos
            setTimeout(() => {
                proc.kill();
                reject(new Error(`Netlify deployment timeout (5 minutos excedidos)`));
            }, 300000);
        });
    }

    static parseOutput(stdout) {
        const urlMatch = stdout.match(/Website URL:\s+(https?:\/\/[^\s]+)/);
        const deployIdMatch = stdout.match(/Deploy ID:\s+([^\s]+)/);
        let json = {};
        try {
            const jsonMatch = stdout.match(/\{[\s\S]*"deploy_url"[\s\S]*\}/);
            if (jsonMatch) json = JSON.parse(jsonMatch[0]);
        } catch (e) {}

        return {
            url: json.url || json.deploy_url || (urlMatch && urlMatch[1]),
            deployId: json.id || (deployIdMatch && deployIdMatch[1]) || 'unknown'
        };
    }
}

module.exports = DeployProcessHandler;
