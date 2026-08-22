// Archivo: src/lib/firebase/users.js
import { collection, getDocs, doc, setDoc, deleteDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import { db, auth } from './config';

export async function checkIsAdmin(email) {
  if (!email) return false;
  const cleanEmail = email.toLowerCase().trim();
  const rescueEmails = ['contacto@lafachadaunisex.ar', 'leolariarg@gmail.com', 'darcyrigonat@gmail.com'];
  const isRescue = rescueEmails.includes(cleanEmail);

  try {
    const usersCol = collection(db, 'usuarios');
    const snapshot = await getDocs(usersCol);
    const users = snapshot.docs.map(d => d.data());
    const dbAdmin = users.some(u => u.email.toLowerCase() === cleanEmail && u.rol === 'admin');
    
    if (isRescue && !dbAdmin) {
      console.log('[AUTH] Rescue email detected. Seeding user in Firestore...', cleanEmail);
      await addAdmin(cleanEmail);
      return true;
    }
    
    return dbAdmin || isRescue;
  } catch(e) {
    console.error('[DB] Error checking admin role:', e);
    return isRescue;
  }
}

export function subscribeAdmins(callback) {
  const usersCol = collection(db, 'usuarios');
  return onSnapshot(usersCol, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data.filter(u => u.rol === 'admin'));
  });
}

export async function addAdmin(email) {
  const cleanEmail = email.toLowerCase().trim();
  const docRef = doc(db, 'usuarios', cleanEmail);
  await setDoc(docRef, {
    email: cleanEmail,
    rol: 'admin',
    createdAt: Timestamp.now(),
    createdBy: auth.currentUser?.email || 'system'
  });
}

export async function removeAdmin(id) {
  await deleteDoc(doc(db, 'usuarios', id));
}

export async function updateAdminAlerts(id, recibirAlertas) {
  const docRef = doc(db, 'usuarios', id);
  await setDoc(docRef, { recibirAlertas }, { merge: true });
}
