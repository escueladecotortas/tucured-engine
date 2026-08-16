const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Configuración de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Servicio para ingesta de catálogos mediante Visión Artificial
 */
class CatalogVisionService {

    /**
     * Procesa una imagen o PDF y devuelve un JSON estructurado
     * @param {string} filePath - Ruta absoluta del archivo
     * @param {string} mimeType - Tipo MIME (image/jpeg, image/png, application/pdf)
     */
    static async ingestCatalog(filePath, mimeType) {
        try {
            console.log(`👁️ VISION: Procesando archivo ${path.basename(filePath)} (${mimeType})...`);

            // Validar existencia
            if (!fs.existsSync(filePath)) {
                throw new Error(`Archivo no encontrado: ${filePath}`);
            }

            // Preparar el modelo
            // Nota: Actualizado a Gemini 1.5 Flash (Modelo Estable)
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            // Leer archivo y convertir a GenerativePart
            const filePart = this.fileToGenerativePart(filePath, mimeType);

            // Prompt Maestro de Ingesta
            const prompt = `
            Actúa como un Analista de Datos experto en extracción de catálogos comerciales.
            Tu misión es leer este documento (foto de menú, lista de precios, catálogo PDF) y extraer estructuradamente los productos.

            REGLAS DE EXTRACCIÓN:
            1. Ignora texto decorativo, encabezados irrelevantes o pies de página.
            2. Identifica items de venta claros.
            3. Si hay categorías (ej. "Velas", "Textiles"), agrúpalas.
            4. Si el precio no es visible, pon null.
            5. Normaliza los nombres (Capitalize).

            SALIDA REQUERIDA (JSON Array puro):
            [
              {
                "category": "Nombre de Categoria (o 'General')",
                "name": "Nombre del Producto",
                "description": "Descripción breve si existe",
                "price": 1000 (número puro, sin signos $),
                "sku": "Código visual si existe (opcional)"
              }
            ]
            
            IMPORTANTE: Devuelve SOLO el JSON válido, sin bloques de código markdown ni texto adicional.
            `;

            // Ejecutar inferencia
            const result = await model.generateContent([prompt, filePart]);
            const response = await result.response;
            const text = response.text();

            // Limpiar y parsear JSON
            const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
            const catalogData = JSON.parse(cleanedText);

            console.log(`✅ VISION: Éxito. ${catalogData.length} items extraídos.`);
            return {
                success: true,
                items: catalogData,
                raw: cleanedText
            };

        } catch (error) {
            console.error("❌ VISION ERROR:", error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Helper para convertir archivo a formato de Google AI
    static fileToGenerativePart(path, mimeType) {
        return {
            inlineData: {
                data: Buffer.from(fs.readFileSync(path)).toString("base64"),
                mimeType
            },
        };
    }
}

module.exports = CatalogVisionService;

// Bloque de prueba autónomo
if (require.main === module) {
    (async () => {
        // Buscar un archivo de prueba en la carpeta de uploads o downloads
        // Esto es solo para test manual
        console.log("Modo Test: Especificar archivo en código para probar.");
    })();
}
