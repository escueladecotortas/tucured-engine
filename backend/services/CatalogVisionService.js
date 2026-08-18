// Archivo: backend/services/CatalogVisionService.js
// Ingesta de catálogos mediante Gemini 2.5 Flash Visión (Ley de 200 líneas)

const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
require("dotenv").config();

class CatalogVisionService {
    static fileToGenerativePart(filePath, mimeType) {
        return {
            inlineData: {
                data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
                mimeType
            },
        };
    }

    static async ingestCatalog(filePath, mimeType) {
        try {
            console.log(`👁️ VISION: Procesando archivo ${path.basename(filePath)} (${mimeType})...`);
            if (!fs.existsSync(filePath)) throw new Error(`Archivo no encontrado: ${filePath}`);

            const apiKey = (process.env.GEMINI_API_KEY || "").trim();
            if (!apiKey) throw new Error("GEMINI_API_KEY no configurada");

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const filePart = this.fileToGenerativePart(filePath, mimeType);

            const prompt = `
            Actúa como un Analista de Datos experto en extracción de catálogos comerciales.
            Tu misión es leer este documento y extraer estructuradamente los productos.

            SALIDA REQUERIDA (JSON Array puro):
            [
              {
                "category": "Nombre de Categoria (o 'General')",
                "name": "Nombre del Producto",
                "description": "Descripción breve si existe",
                "price": 1000,
                "sku": "Código visual si existe (opcional)"
              }
            ]
            Devuelve SOLO el JSON válido, sin bloques de código markdown.
            `;

            const result = await model.generateContent([prompt, filePart]);
            const response = await result.response;
            const text = response.text();

            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const items = JSON.parse(cleanText);

            console.log(`✅ VISION: Extracción completada (${items.length} items detectados)`);
            return items;
        } catch (error) {
            console.error("❌ VISION: Error en procesamiento:", error.message);
            return [];
        }
    }
}

module.exports = CatalogVisionService;
