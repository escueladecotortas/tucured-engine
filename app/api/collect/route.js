import { NextResponse } from 'next/server';
import { terminalEmitter } from '../terminal/events'; // El puntero correcto a tu events.js

export async function POST(req) {
  try {
    const body = await req.json();

    // 1. Si la respuesta de Antigravity fue un ÉXITO
    if (body.type === 'NATIVE_RESPONSE') {
      terminalEmitter.emit('log', {
        agent: 'SYSTEM',
        // Imprimimos el resultado exacto de la consola de Windows
        message: `\n${body.payload.result}`, 
        timestamp: new Date()
      });
    } 
    // 2. Si hubo un ERROR en Windows o en Chrome
    else if (body.type === 'ERROR_NATIVO') {
      terminalEmitter.emit('log', {
        agent: 'SYSTEM',
        message: `❌ [ERROR DEL PUENTE]: ${body.payload}`,
        timestamp: new Date()
      });
    }

    // Le devolvemos un OK a la extensión para que sepa que recibimos el paquete
    return NextResponse.json({ status: 'received' }, { status: 200 });
    
  } catch (error) {
    console.error("Error en collect:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}