// Archivo: src/lib/firebase/serviceBlocks.js
// v1.00-SOVEREIGN — Módulo de base de datos para bloqueos de servicios por fecha y horario
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './config';

const COLLECTION_NAME = 'service_blocks';

/**
 * Recupera todos los bloqueos de servicios de la base de datos, ordenados por fecha y hora de inicio.
 */
export async function getServiceBlocks() {
  try {
    const ref = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(ref);
    const blocks = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    
    // Ordenar en memoria por fecha (asc) y hora de inicio (asc)
    return blocks.sort((a, b) => {
      const dateCompare = (a.date || '').localeCompare(b.date || '');
      if (dateCompare !== 0) return dateCompare;
      return (a.startTime || '').localeCompare(b.startTime || '');
    });
  } catch (e) {
    console.error('[DB] Error al recuperar bloqueos de servicios:', e);
    throw e;
  }
}

/**
 * Agrega un nuevo bloqueo de servicio a la colección.
 * @param {Object} blockData - Datos del bloqueo { serviceId, serviceName, date, startTime, endTime }
 */
export async function addServiceBlock(blockData) {
  try {
    const ref = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(ref, {
      ...blockData,
      createdAt: Timestamp.now()
    });
    return { id: docRef.id, ...blockData };
  } catch (e) {
    console.error('[DB] Error al agregar bloqueo de servicio:', e);
    throw e;
  }
}

/**
 * Elimina un bloqueo de servicio por su ID.
 * @param {string} blockId - ID del documento del bloqueo
 */
export async function deleteServiceBlock(blockId) {
  try {
    const docRef = doc(db, COLLECTION_NAME, blockId);
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    console.error('[DB] Error al eliminar bloqueo de servicio:', e);
    throw e;
  }
}
