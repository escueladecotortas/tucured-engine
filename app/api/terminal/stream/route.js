import { terminalEmitter } from '../events';

export const dynamic = 'force-dynamic';

export async function GET() {
  let handler;

  const stream = new ReadableStream({
    start(controller) {
      // Definimos qué hacer cuando llega un log
      handler = (data) => {
        try {
          // Solo intentamos enviar si el controlador está abierto
          controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
        } catch (err) {
          // Si falla, el 'handler' se autolimpia para no molestar más
          terminalEmitter.off('log', handler);
        }
      };

      // Escuchamos los eventos
      terminalEmitter.on('log', handler);
    },
    cancel() {
      // ESTO ES CLAVE: Si el usuario cierra la pestaña, dejamos de escuchar
      if (handler) {
        terminalEmitter.off('log', handler);
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}