const fs = require('fs').promises;
const path = require('path');
const vertexProvider = require('./ai/providers/VertexProvider');
const safeWriteService = require('./SafeWriteService');
const serviceAccount = require("../serviceAccountKey.json");

/**
 * GeminiBridgeService.js (Tier 3: Inteligencia / Codi)
 * El Cerebro del Puente Bifröst.
 * Conecta Vertex AI con el File System mediante el protocolo Safe-Write.
 */
class GeminiBridgeService {
    constructor() {
        // Inicializamos el proveedor con la cuenta de servicio existente
        this.ai = new vertexProvider(serviceAccount);
    }

    /**
     * Solicita una evolución de código a Gemini 1.5 Pro.
     * Lee archivos de contexto y genera una propuesta de cambio.
     */
    async requestEvolution(userPrompt, contextFilePaths = []) {
        console.log(`🌉 [Codi] Iniciando evolución Bifröst para prompt: "${userPrompt.substring(0, 50)}..."`);
        
        try {
            // 1. Recolectar Contexto Físico
            let contextText = "";
            for (const filePath of contextFilePaths) {
                const absolutePath = path.resolve(filePath);
                const content = await fs.readFile(absolutePath, 'utf8');
                contextText += `\n--- FILE: ${filePath} ---\n${content}\n`;
            }

            // 2. Construir Prompt Sistémico para Respuesta Estructurada
            const systemInstruction = `
                Eres el Arquitecto Senior de NEXUS-OS. Tu misión es proponer mejoras de código seguras.
                Debes responder EXCLUSIVAMENTE con un bloque JSON válido.
                
                ESTRUCTURA_OBLIGATORIA:
                {
                    "file_path": "ruta/al/archivo/a/modificar.ext",
                    "new_content": "contenido completo del archivo con la mejora aplicada",
                    "explanation": "breve resumen de por qué este cambio es necesario",
                    "diff_summary": "resumen de líneas modificadas"
                }

                REGLA_ORO: Devuelve solo el JSON. Sin explicaciones fuera del bloque.
            `.trim();

            const fullPrompt = `
                CONTEXTO_ACTUAL:
                ${contextText}

                REQUERIMIENTO_L0:
                ${userPrompt}
            `;

            // 3. Llamada a Vertex AI (Gemini 1.5 Pro)
            const aiResponse = await this.ai.generate(fullPrompt, "primary", [], systemInstruction);
            
            // 4. Parsear propuesta JSON
            const proposal = this._extractJSON(aiResponse.text);

            if (!proposal.file_path || !proposal.new_content) {
                throw new Error("PROPUESTA_IA_INCOMPLETA_O_INVALIDA");
            }

            // 5. Entregar a Kael (Safe-Write Staging)
            const stagingResult = await safeWriteService.stageChange(
                proposal.file_path, 
                proposal.new_content, 
                {
                    agent: 'GEMINI_1.5_PRO',
                    reason: proposal.explanation,
                    diff: proposal.diff_summary
                }
            );

            console.log(`✅ [Codi] Propuesta procesada y puesta en HOLD (ID: ${stagingResult.change_id})`);
            return {
                success: true,
                change_id: stagingResult.change_id,
                proposal_summary: proposal.explanation
            };

        } catch (error) {
            console.error("❌ [Codi] Error en el Puente Bifröst:", error);
            throw new Error(`FALLO_PUENTE_BIFRÖST: ${error.message}`);
        }
    }

    /**
     * Limpieza de respuesta para extraer JSON puro.
     */
    _extractJSON(text) {
        try {
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanText);
        } catch (e) {
            const match = text.match(/\{[\s\S]*\}/);
            if (match) return JSON.parse(match[0]);
            throw new Error("Respuesta de IA no contiene un bloque JSON válido.");
        }
    }
}

module.exports = new GeminiBridgeService();
