// Archivo: src/app/admin/configuracion/servicios/page.jsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase/config';
import { getServices, deleteService, getCategories } from '@/lib/firebase/db';
import { useAuth } from '@/context/AuthContext';
import AdminHeader from './components/AdminHeader';
import TableList from './components/TableList';
import FormModals from './components/FormModals';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Toast from '@/components/ui/Toast';

export default function ServicesManager() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
  const [toast, setToast] = useState(null);

  const fetchInitial = useCallback(async () => {
    setLoading(true);
    try {
      const [servicesData, categoriesData] = await Promise.all([
        getServices(true),
        getCategories()
      ]);
      setServices(Array.isArray(servicesData) ? servicesData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error("[DB] Error fetching initial data:", error);
      setToast({ message: 'Error al cargar datos', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchInitial(); 
  }, [fetchInitial]);

  const handleDeleteRequest = (id) => {
    setConfirmDelete({ show: true, id });
  };

  const handleConfirmDelete = async () => {
    if (confirmDelete.id) {
      try {
        await deleteService(confirmDelete.id, user?.uid);
        setToast({ message: 'Servicio eliminado correctamente', type: 'success' });
        fetchInitial();
      } catch (e) {
        setToast({ message: 'Error al eliminar: ' + e.message, type: 'error' });
      } finally {
        setConfirmDelete({ show: false, id: null });
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="max-w-7xl mx-auto space-y-8">
        <AdminHeader 
          loading={loading} 
          onRefresh={fetchInitial} 
          onCreate={() => setIsCreating(true)} 
        />

        <TableList 
          services={services} 
          loading={loading} 
          onEdit={(service) => setEditing(service)} 
          onDelete={handleDeleteRequest} 
        />

        <FormModals 
          editing={editing} 
          isCreating={isCreating} 
          categories={categories} 
          onClose={() => { setEditing(null); setIsCreating(false); }} 
          onSuccess={(feedback) => {
            if (feedback?.type === 'error') {
              setToast({ message: feedback.message, type: 'error' });
            } else {
              setToast({ message: 'Registro actualizado con éxito', type: 'success' });
              fetchInitial();
              setEditing(null);
              setIsCreating(false);
            }
          }} 
        />

        <ConfirmModal 
          isOpen={confirmDelete.show}
          title="¿ELIMINAR SERVICIO?"
          message="Esta acción no afectará a los turnos ya agendados, pero el servicio dejará de estar disponible para nuevas reservas."
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete({ show: false, id: null })}
          confirmText="SÍ, ELIMINAR"
          cancelText="CANCELAR"
        />
      </div>
    </div>
  );
}
