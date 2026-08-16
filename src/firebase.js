// Archivo: src/firebase.js
// Inicialización Resiliente de Firebase Client para Vite
// Nexus OS v10.0

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Credenciales SSOT con fallback soberano
const defaultFirebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCKo-JNV-X1fo7kAWFPt6s49ciWRHVTFxE",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nexus-v2-native.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nexus-v2-native",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nexus-v2-native.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "412608881982",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:412608881982:web:f7757c49673c23aa6bf86f"
};

let app, auth, googleProvider, db, storage;

try {
    app = getApps().length > 0 ? getApp() : initializeApp(defaultFirebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    db = getFirestore(app);
    storage = getStorage(app);
} catch (error) {
    console.warn("[Firebase] Advertencia de inicialización:", error.message);
    try {
        app = getApps().length > 0 ? getApp() : initializeApp(defaultFirebaseConfig, "fallback-app");
        auth = getAuth(app);
    } catch (e) {
        auth = { currentUser: null, onAuthStateChanged: (cb) => { cb(null); return () => {}; } };
    }
    googleProvider = new GoogleAuthProvider();
    try { db = getFirestore(app); } catch (e) { db = {}; }
    try { storage = getStorage(app); } catch (e) { storage = {}; }
}

export { auth, googleProvider, db, storage };
export default app;
