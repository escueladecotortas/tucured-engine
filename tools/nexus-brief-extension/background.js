// background.js v14.1 (Serialización de Embeddings JSON)

// Importaciones de Firebase
importScripts("./firebase-app-compat.js");
importScripts("./firebase-firestore-compat.js");
importScripts("./firebase-auth-compat.js");

// Importación de la librería de Hugging Face
importScripts("./huggingface-inference.min.js");

console.log("--- Nexus Background Service Worker v14.1 ---");

// --- LÓGICA DE INYECCIÓN (sin cambios) ---
const geminiUrlFilter = {
  url: [{ hostEquals: 'gemini.google.com', pathPrefix: '/app' }]
};

function injectContentScript(details) {
  if (details.frameId !== 0) return;
  console.log(`Nexus: Navegación detectada en ${details.url}. Inyectando content_script.js...`);
  chrome.scripting.executeScript({
    target: { tabId: details.tabId },
    files: ['content_script.js']
  }).catch(err => console.error("Nexus: Falla al inyectar script:", err));
}

chrome.webNavigation.onHistoryStateUpdated.addListener(injectContentScript, geminiUrlFilter);
chrome.webNavigation.onCompleted.addListener(injectContentScript, geminiUrlFilter);

// --- LÓGICA DE BASE DE DATOS Y AUTENTICACIÓN ---
const firebaseConfig = {
  apiKey: "PLACEHOLDER_FIREBASE_API_KEY",
  authDomain: "nexus-vertex-prod.firebaseapp.com",
  projectId: "nexus-vertex-prod",
  storageBucket: "nexus-vertex-prod.firebasestorage.app",
  messagingSenderId: "747818185155",
  appId: "1:747818185155:web:0fb3114b5377100c3c0d76"
};

try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
} catch (e) {
  console.error("Nexus: Error inicializando Firebase en background:", e);
}
const db = firebase.firestore();
const auth = firebase.auth();

// Configuración de la API de Hugging Face para embeddings
const HUGGING_FACE_API_KEY = 'PLACEHOLDER_HUGGING_FACE_KEY';
const EMBEDDING_MODEL = 'sentence-transformers/all-MiniLM-L6-v2';
const hf = new HuggingFaceInference(HUGGING_FACE_API_KEY);

// Función para generar embeddings (sin cambios)
async function generateEmbedding(text) {
  try {
    const response = await hf.featureExtraction({
      model: EMBEDDING_MODEL,
      inputs: text,
    });
    return response;
  } catch (error) {
    console.error("Nexus Error generando embedding:", error.message);
    return null;
  }
}

console.log("Nexus: Intentando autenticación anónima...");
auth.signInAnonymously()
  .then(() => {
    console.log("%cNexus: Autenticación anónima exitosa.", "color: #4caf50;");
    
    // --- NUEVO LISTENER DE MENSAJES PARA FRAGMENTOS ---
    chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
        if (request.type === 'SAVE_CHAT_CHUNK') {
            const { chatId, title, agentName, content, part, totalParts } = request.data;
            
            if (!chatId) {
                return sendResponse({ status: 'error', message: "chatId no proporcionado" });
            }

            // Referencia al documento principal del chat
            const chatRef = db.collection('chats').doc(chatId);
            // Referencia al documento de la parte específica en una subcolección
            const partRef = chatRef.collection('parts').doc(`part_${part}`);
            
            // Usamos un "batch" para asegurar que ambas escrituras sean atómicas
            const batch = db.batch();

            // 1. Generamos el embedding solo si es el primer fragmento del chat
            let embeddingJson = null;
            if (part === 1) {
              console.log("Nexus: Primer fragmento detectado. Generando embedding...");
              const embeddingVector = await generateEmbedding(content);
              
              if (embeddingVector) {
                // CAMBIO CLAVE: Serializamos el array numérico a JSON string
                embeddingJson = JSON.stringify(embeddingVector);
              }
            }

            // 2. Preparamos la actualización de los metadatos en el documento principal
            const metadataToUpdate = {
                title: title,
                agentName: agentName,
                chatId: chatId,
                totalParts: totalParts,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
            };
            if (embeddingJson) {
              metadataToUpdate.embeddingJson = embeddingJson; // Guardamos como JSON string
            }
            batch.set(chatRef, metadataToUpdate, { merge: true });

            // 3. Preparamos la escritura del contenido en el documento de la parte
            // Aseguramos que el campo para ordenar sea 'partId' y no 'part'
            batch.set(partRef, { content: content, partId: part });

            // 4. Ejecutamos ambas operaciones
            batch.commit()
            .then(() => {
                console.log(`Nexus: Parte ${part}/${totalParts} guardada con éxito.`);
                sendResponse({ status: 'success' });
            })
            .catch(error => {
                console.error(`Nexus Error al guardar parte ${part} de ${chatId}:`, error.message);
                sendResponse({ status: 'error', message: error.message });
            });
            
            return true; // Indicamos respuesta asíncrona
        }
    });

  })
  .catch((error) => {
    console.error("Nexus FATAL: Error en la autenticación anónima.", error.message);
  });

