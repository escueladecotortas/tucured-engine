// content.js v17.0 (Alineado con Arquitectura de Subcolecciones)

// --- BANDERA DE CONTROL PARA EVITAR RE-INYECCIÓN ---
if (window.nexusScriptInjected) {
    // Silencioso para no llenar la consola en navegación SPA
} else {
    window.nexusScriptInjected = true;
    console.log("Nexus Chat Tracker v17.0 (Arquitectura de Subcolecciones) - Activo");

    let lastSentParts = {};
    let lastChatId = null;
    const CAPTURE_INTERVAL = 2500; // Intervalo reducido para mayor reactividad
    let isSaving = false;

    // NOTA: Esta función requiere que inspecciones el HTML de Gemini y reemplaces
    // los selectores de clase por los actuales. Estos son placeholders.
    function extractChatData() {
        const title = document.title || "Nuevo Chat";
        
        // Placeholder - es probable que el selector del nombre del bot también haya cambiado
        const agentNameElem = document.querySelector('.bot-name-text'); 
        const agentName = agentNameElem ? agentNameElem.innerText.trim() : "Gemini";
        
        const parts = {};
        const conversationContainer = document.querySelector('main');
        
        if (conversationContainer) {
            // =======================================================================
            // LEO: ACCIÓN REQUERIDA AQUÍ
            // Reemplaza estos selectores con los correctos de la UI actual de Gemini
            const allTurnElements = conversationContainer.querySelectorAll('.response-gemini, .user-query'); 
            // =======================================================================

            allTurnElements.forEach((node, index) => {
                const partId = `part_${index}`;
                // Simplificamos la extracción de texto para mayor robustez
                parts[partId] = node.innerText.trim();
            });
        }
        return { title, parts, agentName };
    }

    // Función de hash no necesita cambios
    async function generateSha256(message) {
      const textEncoder = new TextEncoder();
      const data = textEncoder.encode(message);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    }
    
    // Función de obtención de ID no necesita cambios, pero se optimiza
    async function getChatId() {
        let currentChatId = localStorage.getItem('nexus_chatId');
        if (currentChatId) return currentChatId;

        // =======================================================================
        // LEO: ACCIÓN REQUERIDA AQUÍ (SI EL SELECTOR CAMBIÓ)
        const firstMessageElem = document.querySelector('.user-query'); // Usar el mismo selector que arriba
        // =======================================================================

        if (firstMessageElem && firstMessageElem.innerText.trim().length > 0) {
            const hash = await generateSha256(firstMessageElem.innerText.trim());
            localStorage.setItem('nexus_chatId', hash);
            return hash;
        }
        return null;
    }

    setInterval(async () => {
        if (isSaving) return;

        const isNewChatUI = document.querySelector('main')?.children.length < 2; // Heurística simple
        if (isNewChatUI) {
            if (lastChatId !== null) {
                console.log("Nexus: Detectado 'Nuevo Chat'. Limpiando estado anterior.");
            }
            localStorage.removeItem('nexus_chatId');
            lastChatId = null;
        }
        
        const currentChatId = await getChatId();
        const { title, parts, agentName } = extractChatData();

        if (!currentChatId || Object.keys(parts).length === 0) {
            return;
        }

        const currentPartsJson = JSON.stringify(parts);
        const lastPartsJson = JSON.stringify(lastSentParts);

        if (currentChatId !== lastChatId || currentPartsJson !== lastPartsJson) {
            isSaving = true;
            console.log(`Nexus: Cambios detectados (ID: ${currentChatId}). Enviando ${Object.keys(parts).length} partes...`);
            chrome.runtime.sendMessage({ type: 'SAVE_CHAT_DATA', data: { chatId: currentChatId, title, agentName, parts } }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Nexus Error de comunicación:", chrome.runtime.lastError.message);
                } else if (response && response.status === 'success') {
                    console.log("%cNexus: ¡Confirmación de guardado recibida!", "color: #4caf50;");
                    lastSentParts = parts;
                    lastChatId = currentChatId;
                } else {
                    console.error("Nexus: Respuesta de error de background.js:", response);
                }
                isSaving = false;
            });
        }
    }, CAPTURE_INTERVAL);
}