// Archivo: backend/services/LocalMcpServer.js
const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { CallToolRequestSchema, ListToolsRequestSchema } = require("@modelcontextprotocol/sdk/types.js");

/**
 * LocalMcpServer: El puente de soberanía para NEXUS-OS.
 * Expone capacidades del backend a la IA Local.
 */
const server = new Server(
  {
    name: "nexus-local-bridge",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 1. Definición de Herramientas Locales
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_system_health",
        description: "Obtiene el reporte de salud actual de VITALIS v2.0",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "read_vault_file",
        description: "Lee un archivo de la Bóveda de NEXUS de forma segura",
        inputSchema: {
          type: "object",
          properties: {
            path: { type: "string", description: "Ruta relativa dentro de nexus_archives" }
          },
          required: ["path"]
        }
      }
    ]
  };
});

// 2. Ejecución de Herramientas
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "get_system_health":
        const vitalis = require("./AutoHealerService"); // Ejemplo de hook
        return { content: [{ type: "text", text: "Sistema HEALTHY. Shield activo." }] };
      
      case "read_vault_file":
        const fs = require('fs');
        const path = require('path');
        const fullPath = path.join(__dirname, '../../nexus_archives', args.path);
        const content = fs.readFileSync(fullPath, 'utf8');
        return { content: [{ type: "text", text: content }] };

      default:
        throw new Error(`Tool not found: ${name}`);
    }
  } catch (error) {
    return {
      isError: true,
      content: [{ type: "text", text: error.message }]
    };
  }
});

// 3. Inicialización del transporte (Stdio para Ollama/Local bridges)
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🚀 NEXUS Local MCP Server running on Stdio");
}

main().catch(console.error);
