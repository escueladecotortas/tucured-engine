// Archivo: src/lib/firebase/specialists.js
import { collection, getDocs, addDoc, Timestamp, doc, updateDoc, setDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from './config';

export async function getSpecialists() {
  try {
    const specialistsCol = collection(db, 'specialists');
    const snapshot = await getDocs(specialistsCol);
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(s => s.status !== 'deleted');
  } catch (error) {
    console.error('[DB] Error fetching specialists:', error);
    return [];
  }
}

// Suscripción en tiempo real con filtrado en JS para estabilidad v11.42
export function subscribeSpecialists(callback) {
  const specialistsCol = collection(db, 'specialists');
  
  return onSnapshot(specialistsCol, (snapshot) => {
    const data = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(s => s.status !== 'deleted');
    callback(data);
  }, (error) => {
    console.error('[DB] Error en onSnapshot de specialists:', error);
    callback([]);
  });
}

export async function addSpecialist(data, operatorId = null) {
  try {
    const docRef = await addDoc(collection(db, 'specialists'), {
      ...data,
      status: 'active', // Forzamos estado activo por defecto
      createdAt: Timestamp.now(),
      createdBy: operatorId
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('[DB] Error adding specialist:', error);
    throw error;
  }
}

export async function updateSpecialist(id, data, operatorId = null) {
  try {
    const docRef = doc(db, 'specialists', id);
    await setDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
      updatedBy: operatorId
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('[DB] Error updating specialist:', error);
    throw error;
  }
}

export async function deleteSpecialist(id, operatorId = null) {
  try {
    // Borrado Lógico: v11.24 Protocol
    const docRef = doc(db, 'specialists', id);
    await updateDoc(docRef, { 
      status: 'deleted',
      deletedAt: Timestamp.now(),
      updatedBy: operatorId
    });
    return { success: true };
  } catch (error) {
    console.error('[DB] Error logical-deleting specialist:', error);
    throw error;
  }
}
