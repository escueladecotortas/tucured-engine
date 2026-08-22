// Archivo: src/lib/firebase/config.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

/**
 * CONFIGURACIÓN SOBERANA NEXUS v11.39-REAL-DEPLOY
 * Soporta múltiples instancias de base de datos para arquitectura estanca.
 */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDXF3exatIDAWkgXs8FR7qZt1hULrtwvJE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "barber-l3.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "barber-l3",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "barber-l3.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "902881970544",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:902881970544:web:f7743579358b5691f0e7b5"
};

// Inicialización de la App (Singleton)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

/**
 * Inicialización de Firestore
 * Si existe DATABASE_ID en el entorno, se conecta a esa instancia específica.
 * De lo contrario, cae a la instancia '(default)'.
 */
const databaseId = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || '(default)';
const db = getFirestore(app, databaseId === '(default)' ? undefined : databaseId);

const auth = getAuth(app);

// Forzar persistencia local para asegurar estabilidad en móviles (v11.39-REAL-DEPLOY)
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("[AUTH] Persistencia configurada: LOCAL"))
  .catch((err) => console.error("[AUTH] Error configurando persistencia:", err));

export { db, auth, app };
