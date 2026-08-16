const fs = require('fs');
const path = require('path');

/**
 * VectorStore.js
 * Local JSON-based vector storage with Cosine Similarity search.
 * Zero external database dependencies.
 */
class VectorStore {
    constructor() {
        this.dataDir = path.join(__dirname, '../data');
        this.storePath = path.join(this.dataDir, 'brain_vectors.json');
        this.vectors = [];
        this.init();
    }

    init() {
        // Ensure directory exists
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }

        // Load existing store
        if (fs.existsSync(this.storePath)) {
            try {
                const raw = fs.readFileSync(this.storePath, 'utf8');
                this.vectors = JSON.parse(raw);
                console.log(`🧠 [VectorStore] Loaded ${this.vectors.length} memories.`);
            } catch (error) {
                console.error("⚠️ [VectorStore] Corrupt store, starting fresh.", error);
                this.vectors = [];
            }
        } else {
            this.vectors = [];
        }
    }

    async save() {
        fs.writeFileSync(this.storePath, JSON.stringify(this.vectors, null, 2));
    }

    addDocument(id, content, metadata, embedding) {
        // Remove existing if update
        this.vectors = this.vectors.filter(v => v.id !== id);
        this.vectors.push({
            id,
            content,
            metadata,
            embedding,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Calculate Cosine Similarity between two vectors
     * @param {number[]} vecA 
     * @param {number[]} vecB 
     */
    cosineSimilarity(vecA, vecB) {
        if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }

        if (normA === 0 || normB === 0) return 0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    /**
     * Search specifically for semantic meaning
     * @param {number[]} queryEmbedding 
     * @param {number} topK 
     */
    search(queryEmbedding, topK = 5) {
        if (!queryEmbedding) return [];

        const results = this.vectors.map(doc => {
            return {
                ...doc,
                score: this.cosineSimilarity(queryEmbedding, doc.embedding)
            };
        });

        // Sort by score descending
        return results
            .sort((a, b) => b.score - a.score)
            .slice(0, topK)
            .map(result => ({
                id: result.id,
                score: result.score.toFixed(4),
                content: result.content, // Return snippet
                metadata: result.metadata
            }));
    }
}

module.exports = new VectorStore();
