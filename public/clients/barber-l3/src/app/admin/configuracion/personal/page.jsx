// Archivo: src/app/admin/configuracion/personal/page.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { subscribeSpecialists, deleteSpecialist, subscribeServices } from '@/lib/firebase/db';
import { useAuth } from '@/context/AuthContext';
import AdminHeader from './components/AdminHeader';
import GridDisplay from './components/GridDisplay';
import FormModals from './components/FormModals';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Toast from '@/components/ui/Toast';

export default function PersonalManager() {
  const { user } = useAuth();
  const [specialists, setSpecialists] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingSpecs, setLoadingSpecs] = useState(true);
  const [loadingServs, setLoadingServs] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Hidratación continua mediante onSnapshot para eliminar estados vacíos y sincronizar con la Bóveda
    const unsubSpecs = subscribeSpecialists((data) => {
      setSpecialists(Array.isArray(data) ? data : []);
      setLoadingSpecs(false);
    });

    const unsubServs = subscribeServices((data) => {
      setServices(Array.isArray(data) ? data : []);
      setLoadingServs(false);
    });

    return () => {
      unsubSpecs();
      unsubServs();
    };
  }, []);

  const loading = loadingSpecs || loadingServs;

  const handleDeleteRequest = (id) => {
    setConfirmDelete({ show: true, id });
  };

  const handleConfirmDelete = async () => {
    if (confirmDelete.id) {
      try {
        await deleteSpecialist(confirmDelete.id, user?.uid);
        setToast({ message: 'Especialista desactivado correctamente', type: 'success' });
      } catch (e) {
        setToast({ message: 'Error al desactivar: ' + e.message, type: 'error' });
      } finally {
        setConfirmDelete({ show: false, id: null });
      }
    }
  };

  const handleEdit = (spec) => {
    setEditing(spec);
    setShowModal(true);
  };

  const handleAddStaff = () => {
    setEditing(null);
    setShowModal(true);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 bg-[#f8f8f8] min-h-screen">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <AdminHeader onAddStaff={handleAddStaff} />

      <GridDisplay 
        specialists={specialists} 
        services={services} 
        loading={loading} 
        onEdit={handleEdit} 
        onEdit={handleEdit} 
        onDelete={handleDeleteRequest} 
      />

      <ConfirmModal 
        isOpen={confirmDelete.show}
        title="¿DESACTIVAR ESPECIALISTA?"
        message="El especialista ya no aparecerá en el sistema de reservas ni en el panel de control. Sus datos históricos permanecerán intactos."
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete({ show: false, id: null })}
        confirmText="SÍ, DESACTIVAR"
        cancelText="VOLVER"
      />

      <FormModals 
        showModal={showModal} 
        editing={editing} 
        services={services} 
        onClose={() => { setShowModal(false); setEditing(null); }} 
        onSuccess={(feedback) => {
          if (feedback?.type === 'error') {
            setToast({ message: feedback.message, type: 'error' });
          } else {
            setToast({ message: editing ? 'Perfil actualizado con éxito' : 'Especialista creado con éxito', type: 'success' });
            setShowModal(false);
            setEditing(null);
          }
        }} 
      />
    </div>
  );
}
