// Archivo: src/lib/firebase/clients.js
import { collection, getDocs, query, where, limit, doc, getDoc, setDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import { db } from './config';

const slugify = (text) => text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

export function cleanPhone(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.startsWith('549')) return digits;
  if (digits.startsWith('54')) return '549' + digits.slice(2);
  return '549' + digits;
}

export function normalizePhone(phone) {
  if (!phone) return '';
  const cleaned = cleanPhone(phone);
  const base = cleaned.slice(3);
  return `+54 9 ${base}`;
}

export async function getClientByWhatsapp(whatsapp) {
  try {
    const cleanWhatsapp = cleanPhone(whatsapp);
    const clientsCol = collection(db, 'clients');
    const q = query(clientsCol, where('whatsapp', '==', cleanWhatsapp), limit(1));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }

    // Fallback robusto para registros heredados sin el prefijo 549
    const rawDigits = String(whatsapp).replace(/\D/g, '');
    let bareDigits = rawDigits;
    if (bareDigits.startsWith('549')) bareDigits = bareDigits.slice(3);
    else if (bareDigits.startsWith('54')) bareDigits = bareDigits.slice(2);

    if (bareDigits && bareDigits !== cleanWhatsapp) {
      const qFallback = query(clientsCol, where('whatsapp', '==', bareDigits), limit(1));
      const snapFallback = await getDocs(qFallback);
      if (!snapFallback.empty) {
        return { id: snapFallback.docs[0].id, ...snapFallback.docs[0].data() };
      }
    }

    return null;
  } catch (error) {
    console.error('[DB] Error fetching client by whatsapp:', error);
    return null;
  }
}

export async function getClients() {
  try {
    const clientsCol = collection(db, 'clients');
    const snapshot = await getDocs(clientsCol);
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(c => c.status !== 'deleted'); // Mantenemos compatibilidad con legacy
  } catch (error) {
    console.error('[DB] Error fetching clients:', error);
    return [];
  }
}

// Suscripción en tiempo real con filtrado en JS para estabilidad v11.42
export function subscribeClients(callback) {
  const clientsCol = collection(db, 'clients');
  
  return onSnapshot(clientsCol, (snapshot) => {
    const data = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(c => c.status !== 'deleted');
    callback(data);
  }, (error) => {
    console.error('[DB] Error en onSnapshot de clientes:', error);
    callback([]);
  });
}

export async function createClient(data, operatorId = null) {
  try {
    const cleanWhatsapp = cleanPhone(data.whatsapp);
    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
    const slug = slugify(fullName) || cleanWhatsapp;

    const docRef = doc(db, 'clients', slug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Si el cliente existe pero estaba archivado, lo reactivamos silenciosamente
      if (docSnap.data().status === 'archived') {
        await setDoc(docRef, { status: 'active', updatedAt: Timestamp.now() }, { merge: true });
        return { id: slug, ...docSnap.data(), status: 'active' };
      }
      return { id: slug, ...docSnap.data() };
    }

    const newClient = {
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      whatsapp: cleanWhatsapp,
      birthday: data.birthday || '',
      appointmentIds: [],
      status: 'active',
      createdAt: Timestamp.now(),
      createdBy: operatorId
    };

    await setDoc(docRef, newClient);
    return { id: slug, ...newClient };
  } catch (error) {
    console.error('[DB] Error creating client:', error);
    throw error;
  }
}

export async function updateClient(id, data, operatorId = null) {
  try {
    const docRef = doc(db, 'clients', id);
    const updateData = { 
      ...data,
      updatedAt: Timestamp.now(),
      updatedBy: operatorId
    };
    
    if (updateData.whatsapp) {
      updateData.whatsapp = cleanPhone(updateData.whatsapp);
    }
    
    // Use setDoc with merge to avoid overwriting existing non-updated fields
    await setDoc(docRef, updateData, { merge: true });
    return { id, ...updateData };
  } catch (error) {
    console.error('[DB] Error updating client:', error);
    throw error;
  }
}

export async function deleteClient(id, operatorId = null) {
  try {
    const docRef = doc(db, 'clients', id);
    await setDoc(docRef, { 
      status: 'archived',
      deletedAt: Timestamp.now(),
      updatedBy: operatorId 
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('[DB] Error logical-deleting client:', error);
    throw error;
  }
}

export async function restoreClient(id, operatorId = null) {
  try {
    const docRef = doc(db, 'clients', id);
    await setDoc(docRef, { 
      status: 'active',
      restoredAt: Timestamp.now(),
      updatedBy: operatorId 
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('[DB] Error restoring client:', error);
    throw error;
  }
}

