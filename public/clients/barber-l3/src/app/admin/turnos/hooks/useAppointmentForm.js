// Archivo: src/app/admin/turnos/hooks/useAppointmentForm.js
import { useState, useEffect, useMemo } from 'react';
import { getClientByWhatsapp, restoreClient, createClient, createAppointment, getServiceBlocks } from '@/lib/firebase/db';
import { getAvailableSlots, isDayEnabled, getHolidays } from '@/lib/firebase/availability';

export function cleanInputPhone(value) {
  let clean = value.replace(/\D/g, '');
  if (clean.startsWith('549') && clean.length > 10) {
    clean = clean.substring(3);
  } else if (clean.startsWith('54') && clean.length > 10) {
    clean = clean.substring(2);
  } else if (clean.startsWith('0') && clean.length === 11) {
    clean = clean.substring(1);
  }
  return clean.slice(0, 10);
}

export function useAppointmentForm({ services, specialists, onSuccess }) {
  const [newAppt, setNewAppt] = useState({ 
    firstName: '', lastName: '', clientPhone: '', 
    serviceIds: [], date: '', time: '', 
    specialistId: '', clientId: '' 
  });
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [clientFound, setClientFound] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [toast, setToast] = useState(null);
  const [restoreModal, setRestoreModal] = useState({ isOpen: false, client: null });
  const [holidays, setHolidays] = useState([]);

  // Carga de feriados nacionales
  useEffect(() => {
    getHolidays().then(setHolidays).catch(console.error);
  }, []);

  const currentSpecialist = useMemo(() => {
    if (newAppt.serviceIds.length === 0) return null;
    const firstService = services.find(s => s.id === newAppt.serviceIds[0]);
    return specialists.find(s => s.serviceIds?.includes(firstService?.id)) || null;
  }, [newAppt.serviceIds, services, specialists]);

  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    let enabledDaysFound = 0;
    let iterations = 0;
    let targetStartDay = new Date(today);

    if (weekOffset > 0) {
      const neededToSkip = weekOffset * 7;
      while (enabledDaysFound < neededToSkip && iterations < 100) {
        const d = new Date(today);
        d.setDate(today.getDate() + iterations);
        const dateStr = d.toISOString().split('T')[0];
        const isHoliday = holidays.includes(dateStr);
        const isEnabled = currentSpecialist 
          ? (isDayEnabled(currentSpecialist, dateStr) && !isHoliday) 
          : !isHoliday;
        if (isEnabled) enabledDaysFound++;
        targetStartDay = d;
        iterations++;
      }
      targetStartDay.setDate(targetStartDay.getDate() + 1);
    }

    let count = 0, i = 0;
    while (count < 7 && i < 60) {
      const d = new Date(targetStartDay);
      d.setDate(targetStartDay.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const isHoliday = holidays.includes(dateStr);
      const isEnabled = currentSpecialist 
        ? (isDayEnabled(currentSpecialist, dateStr) && !isHoliday) 
        : !isHoliday;
      if (isEnabled) {
        const dayName = new Intl.DateTimeFormat('es-AR', { weekday: 'short' }).format(d);
        const monthName = new Intl.DateTimeFormat('es-AR', { month: 'short' }).format(d).replace('.', '');
        dates.push({ dateStr, dayName, dayNum: d.getDate(), monthName });
        count++;
      }
      i++;
    }
    return dates;
  }, [currentSpecialist, weekOffset, holidays]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const phone = newAppt.clientPhone.replace(/\D/g, '');
      if (phone.length === 10) {
        try {
          const client = await getClientByWhatsapp(phone);
          if (client) {
            if (client.status === 'archived') {
              setRestoreModal({ isOpen: true, client });
              return;
            }
            setNewAppt(prev => ({ ...prev, firstName: client.firstName || '', lastName: client.lastName || '', clientId: client.id }));
            setClientFound(true);
          } else setClientFound(false);
        } catch (e) { console.error("[NEXUS] Error cliente:", e); }
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [newAppt.clientPhone]);

  useEffect(() => {
    if (newAppt.date && newAppt.serviceIds.length > 0) fetchSlots();
    else setSlots([]);
  }, [newAppt.date, newAppt.serviceIds]);

  const fetchSlots = async () => {
    setLoadingSlots(true);
    try {
      if (currentSpecialist) {
        if (newAppt.specialistId !== currentSpecialist.id) setNewAppt(prev => ({ ...prev, specialistId: currentSpecialist.id }));
        const firstService = services.find(s => s.id === newAppt.serviceIds[0]);
        const advanceHours = firstService?.advanceHoursRequired || 0;
        
        // Obtener los bloqueos configurados para el servicio seleccionado y la fecha en curso
        const blocksData = await getServiceBlocks();
        const filteredBlocks = (blocksData || []).filter(b => b.serviceId === firstService?.id && b.date === newAppt.date);

        const available = await getAvailableSlots(currentSpecialist.id, newAppt.date, advanceHours, filteredBlocks);
        setSlots(available);
      }
    } catch (e) { console.error("[NEXUS] Error slots:", e); } finally { setLoadingSlots(false); }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      await restoreClient(restoreModal.client.id);
      setNewAppt(prev => ({ ...prev, firstName: restoreModal.client.firstName, lastName: restoreModal.client.lastName, clientId: restoreModal.client.id }));
      setClientFound(true);
      setRestoreModal({ isOpen: false, client: null });
      setToast({ message: 'Cliente restaurado.', type: 'success' });
    } catch (e) { setToast({ message: 'Error restauración.', type: 'error' }); } finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (newAppt.serviceIds.length === 0) return setToast({ message: 'Seleccione un servicio', type: 'error' });
    if (!newAppt.date || !newAppt.time) return setToast({ message: 'Seleccione fecha y hora', type: 'error' });
    
    setLoading(true);
    try {
      let cid = newAppt.clientId;
      if (!cid) {
        const res = await createClient({ firstName: newAppt.firstName, lastName: newAppt.lastName, whatsapp: newAppt.clientPhone });
        cid = res.id;
      }

      const resolvedServices = services.filter(s => newAppt.serviceIds.includes(s.id));
      const totalPrice = resolvedServices.reduce((acc, s) => acc + Number(s.price || 0), 0);
      const totalDuration = resolvedServices.reduce((acc, s) => acc + Number(s.duration || 45), 0);

      const res = await createAppointment({ 
        clientId: cid, 
        serviceIds: newAppt.serviceIds, 
        specialistId: newAppt.specialistId || specialists[0]?.id, 
        date: newAppt.date, 
        time: newAppt.time,
        price: totalPrice,
        totalDuration: totalDuration
      });
      
      const apptData = {
        id: res.id,
        clientId: cid,
        serviceIds: newAppt.serviceIds,
        specialistId: newAppt.specialistId || specialists[0]?.id,
        dateString: newAppt.date,
        timeString: newAppt.time,
        resolvedClient: {
          id: cid,
          firstName: newAppt.firstName,
          lastName: newAppt.lastName,
          whatsapp: newAppt.clientPhone
        },
        resolvedServices: services.filter(s => newAppt.serviceIds.includes(s.id))
      };

      setToast({ message: 'Turno grabado.', type: 'success' });
      onSuccess(apptData);
      setNewAppt(prev => ({ ...prev, serviceIds: [], date: '', time: '', clientId: cid }));
      setSlots([]);
    } catch (e) { setToast({ message: 'Error: ' + e.message, type: 'error' }); } finally { setLoading(false); }
  };

  return { newAppt, setNewAppt, loading, slots, loadingSlots, clientFound, availableDates, weekOffset, setWeekOffset, toast, setToast, restoreModal, setRestoreModal, handleRestore, handleCreate };
}
