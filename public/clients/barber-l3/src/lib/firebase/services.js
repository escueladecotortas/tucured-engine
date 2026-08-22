// Archivo: src/lib/firebase/services.js
import { collection, getDocs, addDoc, query, where, Timestamp, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from './config';

/**
 * getServices(includeAll)
 * - Sin parámetro o false: solo servicios 'active' (para landing)
 * - Con true: todos los servicios que no estén 'deleted' (para el admin)
 */
export async function getServices(includeAll = false) {
  try {
    const servicesCol = collection(db, 'services');
    // Traemos todos para evitar fallos de índices compuestos faltantes
    const snapshot = await getDocs(servicesCol);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Filtro de soberanía en JS
    const filtered = data.filter(s => s.status !== 'deleted');
    
    if (includeAll) {
      return filtered;
    } else {
      // Para la landing, solo los que están explícitamente activos o no tienen status pero son active:true
      return filtered.filter(s => s.status === 'active' || s.active === true || !s.status);
    }
  } catch (error) {
    console.error('[DB] Error fetching services:', error);
    return [];
  }
}

// Suscripción reactiva obligatoria con filtrado en JS para estabilidad v11.42
export function subscribeServices(callback) {
  const servicesCol = collection(db, 'services');
  
  return onSnapshot(servicesCol, (snapshot) => {
    const data = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(s => s.status !== 'deleted');
    callback(data);
  }, (error) => {
    console.error('[DB] Error en onSnapshot de services:', error);
    callback([]);
  });
}

export async function addService(data, operatorId = null) {
  try {
    const docRef = await addDoc(collection(db, 'services'), { 
      ...data, 
      status: 'active',
      createdAt: Timestamp.now(),
      createdBy: operatorId
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('[DB] Error adding service:', error);
    throw error;
  }
}

export async function updateService(id, data, operatorId = null) {
  try {
    const docRef = doc(db, 'services', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
      updatedBy: operatorId
    });
    return { success: true };
  } catch (error) {
    console.error('[DB] Error updating service:', error);
    throw error;
  }
}

export async function updateServicePrice(id, newPrice, operatorId = null) {
  try {
    const docRef = doc(db, 'services', id);
    await updateDoc(docRef, {
      price: Number(newPrice),
      lastPriceUpdate: Timestamp.now(),
      updatedAt: Timestamp.now(),
      updatedBy: operatorId
    });
    return { success: true };
  } catch (error) {
    console.error('[DB] Error updating service price:', error);
    throw error;
  }
}

export async function deleteService(id, operatorId = null) {
  try {
    const docRef = doc(db, 'services', id);
    await updateDoc(docRef, { 
      status: 'deleted',
      deletedAt: Timestamp.now(),
      updatedBy: operatorId
    });
    return { success: true };
  } catch (error) {
    console.error('[DB] Error logical-deleting service:', error);
    throw error;
  }
}
