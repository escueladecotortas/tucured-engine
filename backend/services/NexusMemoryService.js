const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
const vectorStore = require('./VectorStore');
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../../.env") });

/**
 * NexusMemoryService.js
 * Sincronizador de Memoria Neuronal de NEXUS-OS.
 * Indexa bitácoras y permite recuperación semántica de pendientes.
 */
class NexusMemoryService {
    constructor() {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        this.bitacoraDir = path.join(__dirname, '../bitacora');
    }

    /**
     * Genera un embedding para un texto dado.
     */
    async getEmbedding(text) {
        try {
            const result = await this.model.embedContent(text);
            return result.embedding.values;
        } catch (error) {
            console.error("❌ [MemoryService] Error generating embedding:", error);
            return null;
        }
    }

    /**
     * Indexa todos los archivos .md en la carpeta bitacora.
     */
    async syncAll() {
        console.log("🧠 [MemoryService] Sincronizando Memoria Neuronal...");
        const files = fs.readdirSync(this.bitacoraDir).filter(f => f.endsWith('.md'));

        for (const file of files) {
            const filePath = path.join(this.bitacoraDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Dividir en fragmentos (chunks) lógicos si es muy grande
            const chunks = content.split('\n### ').filter(c => c.trim().length > 0);

            for (let i = 0; i < chunks.length; i++) {
                const chunk = chunks[i];
                const id = `${file}_chunk_${i}`;
                const embedding = await this.getEmbedding(chunk);
                
                if (embedding) {
                    vectorStore.addDocument(id, chunk, { source: file, date: new Date().toISOString() }, embedding);
                }
            }
        }

        await vectorStore.save();
        console.log("✅ [MemoryService] Sincronización completada.");
    }

    /**
     * Busca información semántica en la memoria.
     */
    async query(text) {
        const embedding = await this.getEmbedding(text);
        if (!embedding) return [];
        return vectorStore.search(embedding, 5);
    }
}

module.exports = new NexusMemoryService();
