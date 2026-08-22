// Archivo: src/lib/firebase/categories.js
import { collection, getDocs, doc, setDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from './config';

const createId = (text) => text.toUpperCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

export async function getCategories() {
  try {
    const categoriesCol = collection(db, 'categories');
    const snapshot = await getDocs(categoriesCol);
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(cat => cat.status !== 'inactive');
  } catch (error) {
    console.error('[DB] Error fetching categories:', error);
    return [];
  }
}

export async function addCategory(data) {
  try {
    const docId = createId(data.name);
    const docRef = doc(db, 'categories', docId);
    const newCategory = {
      name: data.name,
      slug: data.slug || data.name, // El slug ahora es el título del frontend
      icon: data.icon || 'Scissors',
      status: 'active',
      createdAt: Timestamp.now()
    };
    await setDoc(docRef, newCategory);
    return { id: docId, ...newCategory };
  } catch (error) {
    console.error('[DB] Error adding category:', error);
    throw error;
  }
}

export async function updateCategory(id, data) {
  try {
    const docRef = doc(db, 'categories', id);
    const updateData = {
      name: data.name,
      slug: data.slug || data.name,
      icon: data.icon || 'Scissors',
      updatedAt: Timestamp.now()
    };
    await setDoc(docRef, updateData, { merge: true });
    return { id, ...updateData };
  } catch (error) {
    console.error('[DB] Error updating category:', error);
    throw error;
  }
}

export async function deleteCategory(id) {
  try {
    const docRef = doc(db, 'categories', id);
    await setDoc(docRef, { status: 'inactive' }, { merge: true });
    return true;
  } catch (error) {
    console.error('[DB] Error logical-deleting category:', error);
    throw error;
  }
}
