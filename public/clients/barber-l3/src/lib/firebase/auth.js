// Archivo: src/lib/firebase/auth.js
// v11.91-PLATINUM — signInWithPopup (fix COOP cross-origin & redirect loops)
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from './config';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Inicializar proactivamente la persistencia local (VITALIS)
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('[AUTH] Error setting persistence proactively:', err);
});

/**
 * Iniciar sesión con email y contraseña asegurando persistencia de sesión nativa
 */
export async function login(email, password) {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('[AUTH] Login error code:', error.code, '| message:', error.message);
    if (error.code === 'auth/unauthorized-domain') {
      return { 
        user: null, 
        error: 'Este dominio no está autorizado en Firebase. Contactar al administrador.' 
      };
    }
    return { user: null, error: 'Credenciales inválidas. Acceso denegado.' };
  }
}

/**
 * Cerrar sesión
 */
export async function logout() {
  await signOut(auth);
}

/**
 * Observer de estado de autenticación
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Iniciar sesión con Google — usa signInWithPopup para evitar error COOP en local/Netlify
 */
export async function loginWithGoogle() {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithPopup(auth, googleProvider);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('[AUTH] Google popup error:', error.code, '|', error.message);
    return { user: null, error: error.code };
  }
}

/**
 * Recuperar resultado del redirect de Google (función stub legacy para compatibilidad)
 */
export async function handleGoogleRedirectResult() {
  return { user: null, error: null };
}
