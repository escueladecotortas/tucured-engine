// Archivo: backend/services/telemetry/TerminalService.js
// Servicio Central de Telemetría en Tiempo Real y Emisión SSE — Ley de 200 líneas

const { broadcastLog } = require('../../routes/terminal');

class TerminalService {
  /**
   * Emite un evento estructurado a través del canal SSE (/api/terminal/stream)
   * @param {string} message Mensaje de log
   * @param {string} status 'info' | 'success' | 'warning' | 'error'
   * @param {number|null} progress Porcentaje real (0 a 100)
   * @param {string} agent Nombre del agente emisor
   */
  static broadcast(message, status = 'info', progress = null, agent = 'NEXUS') {
    const payload = {
      timestamp: new Date().toISOString(),
      agent,
      message: String(message),
      status,
      progress: typeof progress === 'number' ? Math.min(100, Math.max(0, Math.round(progress))) : null
    };

    console.log(`[SSE-${status.toUpperCase()}] [${agent}] ${message}${payload.progress !== null ? ` (${payload.progress}%)` : ''}`);

    if (typeof broadcastLog === 'function') {
      try {
        broadcastLog(agent, payload);
      } catch (e) {}
    }
  }

  static emitCompletion(message, agent = 'NEXUS') {
    this.broadcast(message, 'success', 100, agent);
  }

  static emitError(message, agent = 'NEXUS') {
    this.broadcast(message, 'error', null, agent);
  }
}

module.exports = TerminalService;
