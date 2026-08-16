const { Server } = require("socket.io");

/**
 * TerminalService.js
 * Manages real-time WebSocket communication for the Console.
 * Allows backend tools to stream output to the frontend.
 */
class TerminalService {
    constructor() {
        this.io = null;
    }

    /**
     * Attach to the HTTP Server.
     * @param {Object} httpServer - Node.js HTTP server.
     */
    attach(httpServer) {
        this.io = new Server(httpServer, {
            cors: {
                origin: "*", // Allow all for dev, secure in production
                methods: ["GET", "POST"]
            }
        });

        this.io.on("connection", (socket) => {
            console.log(`🔌 [TerminalService] Client connected: ${socket.id}`);

            socket.on("disconnect", () => {
                console.log(`🔌 [TerminalService] Client disconnected: ${socket.id}`);
            });
        });

        console.log("🚀 [TerminalService] Socket.io Server Attached.");
    }

    /**
     * Broadcast a line of text to all connected clients.
     * @param {string} text - The log line.
     * @param {string} type - 'stdout' | 'stderr' | 'info'
     */
    broadcast(text, type = 'stdout') {
        if (!this.io) return;
        this.io.emit("terminal:output", {
            line: text,
            type: type,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Helper to broadcast execution start.
     */
    emitStart(command) {
        this.broadcast(`> ${command}`, 'command');
    }

    /**
     * Helper to broadcast execution end.
     */
    emitEnd(exitCode) {
        this.broadcast(`\n[Process exited with code ${exitCode}]`, 'info');
    }

    /**
     * Final signal for the UI to close modals and show success.
     * Matches SUCCESS_RE in GenerationModal.jsx
     */
    emitCompletion(message = "Pipeline completado con éxito") {
        this.broadcast(`✅ ${message}`, 'success');
    }

    /**
     * Final signal for ERROR in UI modals.
     * Matches ERROR_RE in GenerationModal.jsx
     */
    emitError(message = "Error en el pipeline") {
        this.broadcast(`❌ ${message}`, 'stderr');
    }
}

module.exports = new TerminalService();
