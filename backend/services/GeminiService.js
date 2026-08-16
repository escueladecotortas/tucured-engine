const path = require('path');
const { VertexAI } = require('@google-cloud/vertexai');
const serviceAccount = require('../serviceAccountKey.json');
require("dotenv").config();

const GeminiVertexService = {
    async generateCopy(prompt) {
        console.log("🔹 [GeminiVertexService] Generating Copy via Vertex AI...");
        
        if (!serviceAccount || !serviceAccount.project_id) {
             console.error("❌ Service Account missing project_id in GeminiVertexService");
             return null;
        }

        try {
            process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(__dirname, "../serviceAccountKey.json");
            
            const vertex_ai = new VertexAI({
                project: serviceAccount.project_id,
                location: 'us-central1'
            });

            // Use lightweight flash model for copy generation backup
            const model = vertex_ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const result = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: { maxOutputTokens: 2000 }
            });

            const text = result.response.candidates[0].content.parts[0].text;
            
            if (text) {
                console.log(`✅ [GeminiVertexService] Success! (${text.length} chars)`);
                return text;
            } else {
                console.warn("⚠️ [GeminiVertexService] Empty Response");
                return null;
            }

        } catch (e) {
            console.error("❌ [GeminiVertexService] Vertex AI Error", e);
            return null;
        }
    }
};

module.exports = GeminiVertexService;
