// Archivo: backend/services/ArgusGateService.js
/**
 * ARGUS GATE SERVICE v2.0 - SHIELD PRO MAX
 * "El Cerbero de la Bóveda"
 * 
 * Misión:
 * 1. Validar integridad de archivos generados.
 * 2. BLOQUEO FÍSICO: Ningún archivo fuente (.js, .jsx, .tsx, .css) > 200 líneas.
 * 3. Veto de Mediocridad y Blindaje Atmosférico.
 */

const fs = require('fs');

class ArgusGateService {
    
    /**
     * Valida el contenido de un archivo antes de permitir su escritura.
     * @param {string} filePath - Ruta absoluta.
     * @param {string} content - Contenido a escribir.
     * @returns {boolean} - True si es válido. Lanza Error Crítico si falla.
     */
    static validateContent(filePath, content) {
        if (!content) return true;

        const lines = content.split('\n').length;
        const isSource = /\.(js|jsx|tsx|css)$/.test(filePath);
        const isCompiled = /\.html$/.test(filePath);
        const isConfig = /package\.json|\.env|ecosystem\.config\.js/.test(filePath);
        const inNexusArchives = filePath.includes('nexus_archives');

        // EXCEPCIÓN TOTAL: HTML compilado o archivos en nexus_archives
        if (isCompiled || inNexusArchives) {
            // Se aprueba sin límite de líneas y sin warnings visuales
        } else {
            // 1. HARD-GATE: REGLA DE 200 LÍNEAS (Source Code)
            if (isSource && !isConfig && lines > 200) {
                console.error(`💥 [Argus-HARD-GATE]: Bloqueo de escritura activado para ${filePath}`);
                throw new Error(`[CRITICAL_LINE_LIMIT_EXCEEDED] El archivo fuente ${filePath} tiene ${lines} líneas. EL LÍMITE ES 200. Debes refactorizar este componente en piezas atómicas antes de guardar.`);
            }
        }

        // 3. VETO DE MEDIOCRIDAD (Lorem Ipsum)
        if (/lorem ipsum/i.test(content)) {
            throw new Error('[Argus-VETO]: Detectado "Lorem Ipsum". La mediocridad no tiene lugar en NEXUS.');
        }

        // 4. VETO ATMOSFÉRICO (Solo para Front-end)
        if (isSource && filePath.includes('components') && !/bg-(noise|mesh|glass|grid)|backdrop-blur|bg-gradient/.test(content)) {
            console.warn(`🎨 [Argus-VIBE]: Advertencia de Diseño Plano en ${filePath}. Falta textura atmosfética.`);
        }

        return true;
    }

    /**
     * Auditoría estática post-escritura.
     */
    static async auditFile(filePath) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`[Argus-404] Archivo no encontrado: ${filePath}`);
        }

        const content = fs.readFileSync(filePath, 'utf8');
        return this.validateContent(filePath, content);
    }
}

module.exports = ArgusGateService;
