// Archivo: scripts/sanitize_terminal_requires.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKEND_DIR = path.resolve(__dirname, '../backend');

function sanitize(dir) {
    fs.readdirSync(dir).forEach(f => {
        const full = path.join(dir, f);
        if (fs.statSync(full).isDirectory()) {
            sanitize(full);
        } else if (f.endsWith('.js')) {
            let content = fs.readFileSync(full, 'utf-8');
            if (content.includes('TerminalService')) {
                content = content.replace(
                    /const TerminalService = require\(["'].*?TerminalService["']\);?/g,
                    'const TerminalService = { broadcast: (msg) => console.log("[LOG]", msg), emitCompletion: (msg) => console.log("[DONE]", msg), emitError: (msg) => console.error("[ERR]", msg) };'
                );
                fs.writeFileSync(full, content, 'utf-8');
                console.log('✅ Sanitizado require en:', path.relative(BACKEND_DIR, full));
            }
        }
    });
}

sanitize(BACKEND_DIR);
