// Archivo: src/app/admin/turnos/page.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { 
  updateAppointmentStatus, 
  getServices, 
  getSpecialists, 
  getClients,
  subscribeAppointments
} from '@/lib/firebase/db';
import AdminHeader from './components/AdminHeader';
import TableList from './components/TableList';
import FormModals from './components/FormModals';
import WhatsAppManualModal from './components/WhatsAppManualModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Toast from '@/components/ui/Toast';
import { useMounted } from '@/lib/hooks/useMounted';
import { useAppointmentData } from './hooks/useAppointmentData';

export default function AppointmentsManager() {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState({ show: false, id: null });
  const [toast, setToast] = useState(null);
  const [whatsAppModal, setWhatsAppModal] = useState({
    isOpen: false,
    appointment: null,
    actionType: 'confirmation'
  });
  
  const mounted = useMounted();

  const {
    filters,
    setFilters,
    sort,
    setSort,
    appointmentsWithClients,
    filteredData,
    stats
  } = useAppointmentData({ appointments, clients, services });

  useEffect(() => {
    // 1. Carga de datos estáticos (Maestros)
    const fetchMasters = async () => {
      try {
        const [servs, specs, clis] = await Promise.all([
          getServices(true),
          getSpecialists(),
          getClients()
        ]);
        setServices(Array.isArray(servs) ? servs : []);
        setSpecialists(Array.isArray(specs) ? specs : []);
        setClients(Array.isArray(clis) ? clis : []);
      } catch (e) { console.error(e); }
    };
    fetchMasters();

    // 2. Suscripción en Tiempo Real (v11.45-GOLD+)
    const unsubscribe = subscribeAppointments((data) => {
      setAppointments(prev => {
        // Lógica de Alerta Sonora (Solo para turnos nuevos en estado 'pending')
        if (prev.length > 0 && data.length > prev.length) {
          const newItems = data.filter(item => !prev.some(p => p.id === item.id));
          const hasNewPending = newItems.some(item => item.status === 'pending');
          
          if (hasNewPending) {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play().catch(e => console.log('Audio blocked by browser. Interaction required.'));
            setToast({ message: 'NUEVO TURNO RECIBIDO', type: 'success' });
          }
        }
        return data;
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchInitialData = async () => {
    // Mantener para compatibilidad con botones de refresh
    setLoading(true);
    setLoading(false);
  };

  // Actualizar estado de un turno
  const updateStatus = async (id, status) => {
    if (status === 'cancelled') {
      setConfirmCancel({ show: true, id });
      return;
    }
    
    try {
      await updateAppointmentStatus(id, status);
      fetchInitialData();
      setToast({ message: 'Estado actualizado correctamente', type: 'success' });

      if (status === 'confirmed') {
        const appt = appointmentsWithClients.find(a => a.id === id);
        if (appt) {
          setWhatsAppModal({
            isOpen: true,
            appointment: appt,
            actionType: 'confirmation'
          });
        }
      }
    } catch (e) {
      setToast({ message: 'Error al actualizar estado', type: 'error' });
    }
  };

  const handleConfirmCancel = async () => {
    if (confirmCancel.id) {
      try {
        await updateAppointmentStatus(confirmCancel.id, 'cancelled');
        fetchInitialData();
        setToast({ message: 'Turno cancelado correctamente', type: 'success' });

        const appt = appointmentsWithClients.find(a => a.id === confirmCancel.id);
        if (appt) {
          setWhatsAppModal({
            isOpen: true,
            appointment: { ...appt, status: 'cancelled' },
            actionType: 'cancellation'
          });
        }
      } catch (e) {
        setToast({ message: 'Error al cancelar turno', type: 'error' });
      } finally {
        setConfirmCancel({ show: false, id: null });
      }
    }
  };

  const handleCreateSuccess = (apptData) => {
    fetchInitialData();
    if (apptData) {
      const resolvedServices = Array.isArray(apptData.serviceIds)
        ? services.filter(s => apptData.serviceIds.includes(s.id))
        : [];
      
      setWhatsAppModal({
        isOpen: true,
        appointment: {
          ...apptData,
          resolvedServices: resolvedServices.length > 0 ? resolvedServices : apptData.resolvedServices
        },
        actionType: 'confirmation'
      });
    }
  };

  if (!mounted) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#800000] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 font-sans text-[10px]">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <AdminHeader 
        stats={stats}
        filters={filters}
        setFilters={setFilters}
        services={services}
        loading={loading}
        onRefresh={fetchInitialData}
        onNewAppointment={() => setShowModal(true)}
      />

      <TableList 
        loading={loading}
        filteredData={filteredData}
        sort={sort}
        setSort={setSort}
        onUpdateStatus={updateStatus}
      />

      <ConfirmModal 
        isOpen={confirmCancel.show}
        title="¿CANCELAR TURNO?"
        message="Esta acción notificará al sistema y liberará el espacio en la agenda. El cliente podrá ver el estado cancelado si consulta su reserva."
        onConfirm={handleConfirmCancel}
        onCancel={() => setConfirmCancel({ show: false, id: null })}
        confirmText="SÍ, CANCELAR"
        cancelText="VOLVER"
      />

      {showModal && (
        <FormModals 
          onClose={() => setShowModal(false)}
          services={services}
          specialists={specialists}
          onSuccess={handleCreateSuccess}
        />
      )}

      <WhatsAppManualModal 
        isOpen={whatsAppModal.isOpen}
        onClose={() => setWhatsAppModal({ isOpen: false, appointment: null, actionType: 'confirmation' })}
        appointment={whatsAppModal.appointment}
        actionType={whatsAppModal.actionType}
        specialists={specialists}
        services={services}
      />
    </div>
  );
}
