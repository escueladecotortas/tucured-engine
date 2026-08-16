import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        console.log("👁️ [Serverless Vision] Iniciando ingesta...");
        const formData = await req.formData();
        const file = formData.get('catalog') as File | null;

        if (!file) {
            return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
        }

        // Convert File to Base64 for Gemini
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Data = buffer.toString('base64');
        const mimeType = file.type;

        // Model Selection (Using 2.5 Flash as validated)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Fallback safe model

        const prompt = `
            Actúa como un Analista de Datos experto en extracción de catálogos comerciales.
            Tu misión es leer este documento (foto de menú, lista de precios, catálogo PDF) y extraer estructuradamente los productos.

            REGLAS DE EXTRACCIÓN:
            1. Ignora texto decorativo, encabezados irrelevantes.
            2. Identifica items de venta claros.
            3. Si hay categorías (ej. "Velas", "Textiles"), agrúpalas.
            4. Si el precio no es visible, pon null.
            5. Normaliza los nombres (Capitalize).

            SALIDA REQUERIDA (JSON Array puro):
            [
              {
                "category": "Nombre de Categoria",
                "name": "Nombre del Producto",
                "description": "Breve descripción",
                "price": 0,
                "sku": "SKU si existe"
              }
            ]
            
            IMPORTANTE: Devuelve SOLO el JSON válido.
        `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                }
            }
        ]);

        const text = result.response.text();
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const items = JSON.parse(cleanedText);

        console.log(`✅ [Serverless Vision] ${items.length} items extraídos.`);
        return NextResponse.json({ success: true, items });

    } catch (error: any) {
        console.error("❌ [Serverless Vision] Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
