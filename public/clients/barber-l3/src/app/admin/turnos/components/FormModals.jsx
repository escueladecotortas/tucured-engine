// Archivo: src/app/admin/turnos/components/FormModals.jsx
// v11.98-GOLD — Modal de turno manual con selección responsiva de fechas e identificación de mes
import React, { useState, useEffect } from 'react';
import { useAppointmentForm, cleanInputPhone } from '../hooks/useAppointmentForm';
import ServicesSelector from './ServicesSelector';
import { Phone, Calendar, Clock, CheckCircle2, ChevronLeft, ChevronRight, X, LogOut } from 'lucide-react';
import Toast from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function FormModals({ onClose, services, specialists, onSuccess }) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  const {
    newAppt, setNewAppt, loading, slots, loadingSlots, clientFound,
    availableDates, weekOffset, setWeekOffset, toast, setToast,
    restoreModal, setRestoreModal, handleRestore, handleCreate
  } = useAppointmentForm({ services, specialists, onSuccess });

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <ConfirmModal
        isOpen={restoreModal.isOpen}
        title="¡CLIENTE ARCHIVADO ENCONTRADO!"
        message={`El número ${restoreModal.client?.whatsapp} pertenece a ${restoreModal.client?.firstName} ${restoreModal.client?.lastName}, quien está archivado. ¿Deseas restaurarlo proactivamente para este turno?`}
        confirmText="RESTAURAR AHORA"
        cancelText="CANCELAR"
        variant="warning"
        onConfirm={handleRestore}
        onCancel={() => setRestoreModal({ isOpen: false, client: null })}
      />
      
      <form onSubmit={handleCreate} className="bg-white border border-zinc-200 shadow-2xl rounded-xl w-full max-w-md p-8 space-y-6 animate-in fade-in zoom-in duration-200 max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-serif italic text-[#720E1C] uppercase tracking-tighter font-black">Nuevo Turno Manual</h3>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-[#720E1C] transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg">
            <X size={20} />
          </button>
        </div>
        
        <div className="grid gap-4">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"><Phone size={14} /></div>
            <input 
              id="clientPhone" name="clientPhone" required type="tel" inputMode="numeric" pattern="[0-9]*" placeholder="WHATSAPP (10 DÍGITOS)" value={newAppt.clientPhone}
              className={`w-full bg-zinc-50 border ${clientFound ? 'border-green-500 ring-1 ring-green-100' : 'border-zinc-300'} p-3 pl-10 rounded-lg outline-none focus:border-[#720E1C] text-[#333333] font-bold placeholder:text-zinc-400 text-[11px] transition-all`} 
              onChange={e => setNewAppt({...newAppt, clientPhone: cleanInputPhone(e.target.value)})} 
            />
            {clientFound && <CheckCircle2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="NOMBRE" value={newAppt.firstName} className="bg-zinc-50 border border-zinc-300 p-3 rounded-lg outline-none focus:border-[#720E1C] uppercase text-[#333333] font-bold text-[11px]" onChange={e => setNewAppt({...newAppt, firstName: e.target.value})} />
            <input required placeholder="APELLIDO" value={newAppt.lastName} className="bg-zinc-50 border border-zinc-300 p-3 rounded-lg outline-none focus:border-[#720E1C] uppercase text-[#333333] font-bold text-[11px]" onChange={e => setNewAppt({...newAppt, lastName: e.target.value})} />
          </div>
          
          <ServicesSelector services={services} selectedIds={newAppt.serviceIds} onChange={serviceIds => setNewAppt({...newAppt, serviceIds, date: '', time: ''})} />

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-black text-[#720E1C] uppercase tracking-widest flex items-center gap-1.5"><Calendar size={12} /> DISPONIBILIDAD SEMANAL</p>
                <div className="flex gap-1">
                  <button type="button" onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))} className="p-2 hover:bg-zinc-100 rounded-md disabled:opacity-20 transition-all"><ChevronLeft size={16} className="text-[#720E1C]" /></button>
                  <button type="button" onClick={() => setWeekOffset(prev => prev + 1)} className="p-2 hover:bg-zinc-100 rounded-md transition-all"><ChevronRight size={16} className="text-[#720E1C]" /></button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {availableDates.map(d => (
                  <button
                    key={d.dateStr} type="button" onClick={() => setNewAppt({...newAppt, date: d.dateStr, time: ''})}
                    className={`flex flex-col items-center justify-center py-2 px-1 min-h-[46px] rounded-lg border transition-all duration-200 ${
                      newAppt.date === d.dateStr ? 'bg-[#720E1C] border-[#720E1C] text-white shadow-md' : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-[#720E1C]'
                    }`}
                  >
                    <span className="text-[7px] uppercase font-black leading-none">{d.dayName}</span>
                    <span className="text-[10px] font-black my-0.5 leading-none">{d.dayNum}</span>
                    <span className={`text-[7px] uppercase font-bold leading-none ${newAppt.date === d.dateStr ? 'text-white/80' : 'text-zinc-400'}`}>{d.monthName}</span>
                  </button>
                ))}
              </div>
            </div>

            {newAppt.date && newAppt.serviceIds.length > 0 && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                <p className="text-[9px] font-black text-[#720E1C] uppercase tracking-widest flex items-center gap-1.5"><Clock size={12} /> SLOTS LIBRES</p>
                {loadingSlots ? (
                  <div className="grid grid-cols-4 gap-2">
                    {[1,2,3,4].map(i => <div key={i} className="h-10 bg-zinc-100 animate-pulse rounded-lg" />)}
                  </div>
                ) : slots.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1 bg-zinc-50 rounded-lg border border-zinc-200 scrollbar-hide">
                    {slots.map(s => (
                      <button
                        key={s.time} type="button" disabled={s.isOccupied} onClick={() => setNewAppt({...newAppt, time: s.time})}
                        className={`p-2 min-h-[44px] rounded-md text-[10px] font-black transition-all border ${
                          newAppt.time === s.time ? 'bg-[#720E1C] text-white border-[#720E1C] shadow-md' : s.isOccupied ? 'bg-zinc-100 text-zinc-300 border-zinc-100 cursor-not-allowed' : 'bg-white text-zinc-700 border-zinc-200 hover:border-[#720E1C]'
                        }`}
                      >
                        {s.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg text-center font-bold text-[9px] text-zinc-400 uppercase italic">Día sin turnos libres</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <button 
            type="submit" disabled={loading || !newAppt.time} 
            className="w-full p-4 bg-[#720E1C] text-white rounded-xl hover:bg-[#720E1C]/90 transition-all uppercase font-black tracking-widest shadow-lg shadow-[#720E1C]/20 disabled:opacity-30 text-[11px]"
          >
            {loading ? 'Grabando...' : 'Grabar Turno'}
          </button>
          <button 
            type="button" onClick={onClose} 
            className="w-full p-3 bg-white border border-zinc-200 text-zinc-600 rounded-xl hover:border-[#720E1C]/40 hover:text-[#720E1C] hover:bg-zinc-50 transition-all uppercase font-black tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-sm"
          >
            <LogOut size={14} /> Finalizar Operación
          </button>
        </div>
      </form>
    </div>
  );
}
