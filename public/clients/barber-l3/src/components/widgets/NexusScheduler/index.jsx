// Archivo: src/components/widgets/NexusScheduler/index.jsx
// v11.75-ELEGANT — Brutalist booking orchestrator with resolved hooks and 200-line compliance
'use client';
import React, { useState, useEffect } from 'react';
import ServiceSelector from '@/components/booking/ServiceSelector';
import TimePicker from './TimePicker';
import ClientForm from './ClientForm';
import TicketView from './TicketView';
import ReminderModal from './ReminderModal';
import { createAppointment, getSpecialists, getClientByWhatsapp, createClient, updateClient, countActiveAppointments } from '@/lib/firebase/db';
import useSWR from 'swr';

export default function NexusScheduler({ isOpen, onClose, initialCategoryId = null, initialService = null }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lastBooking, setLastBooking] = useState(null);
  const [showReminder, setShowReminder] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selection, setSelection] = useState({
    service: null, specialistId: null, date: '', time: null, specialistName: '',
    client: { firstName: '', lastName: '', whatsapp: '', notes: '' }
  });

  const normalizedCategory = React.useMemo(() => {
    const map = { barberia: 'Barbería', unas: 'Uñas', pestanas: 'Cejas y Pestañas' };
    return map[initialCategoryId] || null;
  }, [initialCategoryId]);

  const { data: specialistsData, isLoading: loadingSpecialists } = useSWR('specialists', getSpecialists, {
    fallbackData: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('swr_cache_specialists') || 'null') : null,
    onSuccess: (data) => localStorage.setItem('swr_cache_specialists', JSON.stringify(data)),
    revalidateOnFocus: false,
    revalidateIfStale: true
  });

  const specialists = specialistsData || [];

  useEffect(() => {
    setMounted(true);
    if (initialService && typeof initialService === 'object') {
      setSelection({ service: initialService.service, specialistId: initialService.specialistId, specialistName: initialService.specialistName, date: '', time: null, client: { firstName: '', lastName: '', whatsapp: '', notes: '' } });
      setStep(2);
      setShowReminder(false);
    } else {
      setSelection({ service: null, specialistId: null, specialistName: '', date: '', time: null, client: { firstName: '', lastName: '', whatsapp: '', notes: '' } });
      setStep(1);
      const saved = localStorage.getItem('lastBooking');
      if (saved) {
        setLastBooking(JSON.parse(saved));
        setShowReminder(true);
      } else {
        setShowReminder(false);
      }
    }
  }, [initialService, isOpen]);

  const handleNext = (data) => {
    setSelection(prev => ({ ...prev, ...data }));
    setStep(prev => prev + 1);
  };

  const handleConfirm = async (clientData) => {
    setLoading(true);
    try {
      let clientId = null;
      const existingClient = await getClientByWhatsapp(clientData.whatsapp);
      if (existingClient) {
        clientId = existingClient.id;
        const activeCount = await countActiveAppointments(clientId);
        if (activeCount >= 2) {
          throw new Error("LÍMITE DE TURNOS ALCANZADO. PODÉS TENER HASTA 2 TURNOS ACTIVOS. COMPLETÁ O CANCELÁ UNO PARA RESERVAR.");
        }
        await updateClient(clientId, clientData);
      } else {
        const newClient = await createClient(clientData);
        clientId = newClient.id;
      }
      await createAppointment({
        clientId,
        serviceIds: [selection.service.id],
        specialistId: selection.specialistId,
        date: selection.date,
        time: selection.time,
        status: 'pending',
        price: Number(selection.service.price || 0),
        totalDuration: Number(selection.service.duration || 45),
        notes: clientData.notes
      });
      const spec = specialists.find(s => s.id === selection.specialistId);
      fetch('/.netlify/functions/notify-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'alertas@lafachadaunisex.ar',
          clientName: `${clientData.firstName || ''} ${clientData.lastName || ''}`.trim().toUpperCase(),
          clientPhone: clientData.whatsapp,
          serviceName: selection.service.name,
          price: Number(selection.service.price || 0),
          duration: Number(selection.service.duration || 45),
          date: selection.date,
          time: selection.time,
          specialistName: selection.specialistName || 'Cualquier profesional',
          specialistEmail: spec?.email || '',
          specialistPhone: spec?.phone || '',
          notes: clientData.notes
        })
      }).catch(err => console.error('[NOTIFY] Fallo:', err));
      const finalSelection = { ...selection, client: clientData };
      localStorage.setItem('lastBooking', JSON.stringify(finalSelection));
      setLastBooking(finalSelection);
      setSelection(finalSelection);
      setStep(4);
    } catch (e) {
      const readableError = e.message === 'SLOT_OCCUPIED' ? "TURNO OCUPADO. POR FAVOR ELEGÍ OTRO HORARIO." : e.message;
      setErrorMsg(readableError);
      if (e.message === 'SLOT_OCCUPIED') setStep(2);
    } finally { setLoading(false); }
  };

  if (!isOpen || !mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-300">
      <div onClick={onClose} className="absolute inset-0 cursor-default" />
      
      <div className="bg-[#F9F9F9] border border-zinc-300 w-full max-w-lg rounded-none shadow-[8px_8px_0px_0px_#800000] flex flex-col text-neutral-900 font-mono relative overflow-hidden animate-in zoom-in-95 duration-200 z-10">
        
        {errorMsg && (
          <div className="absolute inset-0 bg-[#0c0c0c]/95 z-[60] flex flex-col items-center justify-center p-6 text-center select-none animate-in fade-in duration-300">
            <div className="border border-[#800000] bg-[#0c0c0c] p-6 max-w-sm w-full flex flex-col items-center shadow-[4px_4px_0px_0px_#800000]">
              <div className="w-10 h-10 border border-[#800000] flex items-center justify-center text-xl font-black text-[#800000] mb-4 font-mono">!</div>
              <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold mb-2">ERROR</span>
              <h3 className="text-white text-xs font-bold uppercase tracking-wide leading-relaxed mb-6 font-mono">{errorMsg}</h3>
              <button 
                onClick={() => setErrorMsg(null)}
                className="w-full py-2.5 bg-[#800000] text-white font-black text-xs uppercase tracking-wider hover:bg-[#800000]/90 transition-all rounded-none cursor-pointer"
              >
                ENTENDIDO
              </button>
            </div>
          </div>
        )}

        {showReminder && lastBooking && step === 1 && (
          <ReminderModal
            lastBooking={lastBooking}
            onConfirm={() => { setSelection(lastBooking); setStep(4); setShowReminder(false); }}
            onIgnore={() => setShowReminder(false)}
          />
        )}

        <div className="bg-[#800000] text-white px-4 py-3 flex items-center justify-between border-b border-zinc-300 select-none">
          <span className="text-xs font-bold uppercase tracking-wider font-mono">
            RESERVA: {selection.service ? selection.service.category.toUpperCase() : (normalizedCategory ? normalizedCategory.toUpperCase() : "TURNO")}
          </span>
          <button 
            onClick={onClose} 
            className="text-white hover:bg-black/20 p-1.5 transition-colors border border-transparent hover:border-white/30 rounded-none w-8 h-8 flex items-center justify-center font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-4 sm:p-5 min-h-[360px] overflow-y-auto max-h-[75vh]">
          {step === 1 && (
            <ServiceSelector 
              onSelect={handleNext} 
              specialists={specialists} 
              loadingSpecialists={loadingSpecialists}
              initialCategoryId={normalizedCategory}
            />
          )}
          {step === 2 && (
            <TimePicker 
              selection={selection} 
              onSelect={handleNext} 
              onBack={() => initialService ? onClose() : setStep(1)} 
              specialists={specialists} 
            />
          )}
          {step === 3 && (
            <ClientForm 
              selection={selection} 
              onConfirm={handleConfirm} 
              onBack={() => setStep(2)} 
              loading={loading} 
              specialists={specialists} 
            />
          )}
          {step === 4 && <TicketView selection={selection} onClose={onClose} />}
        </div>

        <div className="bg-[#EAEAEA] border-t border-zinc-300 px-4 py-2 flex justify-between items-center text-[10px] font-bold text-neutral-500 font-mono select-none">
          <span>Nexus Barber L3 UNISEX</span>
          <span className="text-[#800000]">v11.75-ELEGANT</span>
        </div>
      </div>
    </div>
  );
}
