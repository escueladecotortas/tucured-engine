import { terminalEmitter } from '../events';

export async function POST(request) {
  try {
    // 1. Leemos el comando que mandó el frontend UNA SOLA VEZ
    const body = await request.json();
    const command = body.command || '';
    const agent = body.agent || 'USER';

    // 2. Emitimos el "Eco" (Lo que vos escribiste en la UI)
    terminalEmitter.emit('log', { 
      agent: agent, 
      message: `Ejecutando: ${command}`, 
      timestamp: new Date() 
    });

    // 3. --- EL PEQUEÑO CEREBRO TEMPORAL ---
    if (command.toLowerCase() === 'ping') {
      terminalEmitter.emit('log', { 
        agent: 'SYSTEM', 
        message: 'PONG! 🏓 (Conexión Local Establecida)', 
        timestamp: new Date() 
      });
    } else {
      terminalEmitter.emit('log', { 
        agent: 'SYSTEM', 
        message: `Comando '${command}' recibido, esperando conexión con Antigravity Bridge...`, 
        timestamp: new Date() 
      });
    }
    // ----------------------------------

    // 4. Le avisamos a la UI que todo salió bien
    return new Response(JSON.stringify({ status: 'sent' }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("Error en execute:", error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 });
  }
}