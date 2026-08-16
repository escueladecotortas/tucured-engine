import { NextRequest, NextResponse } from "next/server";
import { getDb } from '@/lib/firebase/serverDb';

export async function GET(req: NextRequest) {
    const leadId = req.nextUrl.searchParams.get("leadId");

    if (!leadId) {
        return NextResponse.json({ error: "Missing leadId" }, { status: 400 });
    }

    const encoder = new TextEncoder();

    // Utilizamos ReadableStream Web API nativa para evitar el Buffering Trap de Next.js
    const readableStream = new ReadableStream({
        start(controller) {
            console.log(`📡 [Alive Interface] Conexión SSE abierta para leadId: ${leadId}`);
            
            try {
                const db = getDb();
                
                // Suscripción silenciosa y en tiempo real al documento del lead en Firestore
                // Cada vez que cambia el status (por Enricher, The Director, Stitch), Firestore dispara esto:
                const unsubscribe = db.collection('prospects').doc(leadId).onSnapshot(
                    (docSnapshot) => {
                        if (docSnapshot.exists) {
                            const data = docSnapshot.data();
                            
                            // Preparamos la estructura (Event + Data \n\n) obligatoria para el browser
                            const payload = JSON.stringify({
                                status: data?.status || 'unknown',
                                deployUrl: data?.deployUrl || null,
                                stepsCompleted: data?.stepsCompleted || [],
                                timestamp: Date.now()
                            });

                            const sseChunk = `event: agentStatus\ndata: ${payload}\n\n`;
                            
                            // Emitimos el bloque directamente al cliente sin resolver el handler.
                            controller.enqueue(encoder.encode(sseChunk));
                        } else {
                            // El documento no existe o fue borrado
                            const errorSse = `event: agentStatus\ndata: ${JSON.stringify({ status: 'not_found' })}\n\n`;
                            controller.enqueue(encoder.encode(errorSse));
                        }
                    },
                    (error) => {
                        console.error(`❌ [Alive SSE] Fallo en Snapshot de Firestore:`, error);
                        controller.enqueue(encoder.encode(`event: error\ndata: ${error.message}\n\n`));
                        controller.close();
                    }
                );

                // Prevención agresiva de Memory Leaks:
                // Si el navegador del usuario se cierra, cambia de red o de pestaña abortando la petición HTTP,
                // debemos destruir el listener onSnapshot y cerrar el controller asíncrono.
                req.signal.addEventListener("abort", () => {
                    console.log(`🔌 [Alive Interface] Cliente SSE abortó conexión ${leadId}. Destruyendo streams...`);
                    unsubscribe();
                    try {
                        controller.close();
                    } catch (e) {
                         // Ignorar si ya estaba cerrado
                    }
                });

            } catch (err: any) {
                console.error(`❌ [Alive SSE] Error crítico inicializando DB:`, err);
                controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ message: "DB Error" })}\n\n`));
                controller.close();
            }
        },
    });

    // Devolver el Stream de forma inmediata, con cabeceras explícitas de persistencia.
    // Esto informa a los Proxies/Vercel Edge que la conexión NO debe cerrarse.
    return new NextResponse(readableStream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
        },
    });
}
