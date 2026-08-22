// Archivo: src/app/admin/configuracion/personal/components/FormModals.jsx
import React, { useState, useEffect } from 'react';
import { addSpecialist, updateSpecialist, getServices } from '@/lib/firebase/db';
import { useAuth } from '@/context/AuthContext';
import AvailabilityColumn, { DAYS } from './AvailabilityColumn';

export default function FormModals({ showModal, editing, services: propServices, onClose, onSuccess }) {
  const { user } = useAuth();
  const [localServices, setLocalServices] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', role: '', bio: '', email: '', celular: '',
    recibirAlertas: true, status: 'active', serviceIds: [],
    workingHours: DAYS.reduce((acc, d) => ({ ...acc, [d.key]: { active: d.key !== 'sunday', start: '09:00', end: '20:00' } }), {})
  });

  useEffect(() => {
    if (!showModal) return;
    const fetchServs = async () => {
      setLocalServices((!propServices || propServices.length === 0) ? await getServices(true) : propServices);
    };
    fetchServs();

    if (editing) {
      const initialHours = DAYS.reduce((acc, day) => {
        const legacyActive = editing.workingDays?.includes(day.key) || editing.availability?.weekly?.[day.key]?.active;
        return { ...acc, [day.key]: editing.workingHours?.[day.key] || { active: legacyActive !== undefined ? legacyActive : (day.key !== 'sunday'), start: '09:00', end: '20:00' } };
      }, {});

      const serviceIds = Array.isArray(editing.serviceIds) ? editing.serviceIds :
        (typeof editing.serviceIds === 'string' ? editing.serviceIds.split(',').map(id => id.trim()).filter(Boolean) :
        (editing.serviceId ? [editing.serviceId] : []));

      setFormData({
        firstName: editing.firstName || '', lastName: editing.lastName || '', role: editing.role || '',
        bio: editing.bio || '', email: editing.email || '', celular: editing.celular || '',
        recibirAlertas: editing.recibirAlertas !== undefined ? editing.recibirAlertas : true,
        status: editing.status || 'active', serviceIds, workingHours: initialHours
      });
    } else {
      setFormData({
        firstName: '', lastName: '', role: '', bio: '', email: '', celular: '', recibirAlertas: true, status: 'active', serviceIds: [],
        workingHours: DAYS.reduce((acc, d) => ({ ...acc, [d.key]: { active: d.key !== 'sunday', start: '09:00', end: '20:00' } }), {})
      });
    }
  }, [showModal, editing, propServices]);

  if (!showModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        firstName: formData.firstName, lastName: formData.lastName, role: formData.role, bio: formData.bio,
        email: formData.email.trim(), celular: formData.celular.trim(), recibirAlertas: formData.recibirAlertas,
        status: formData.status, serviceIds: formData.serviceIds || [], workingHours: formData.workingHours
      };
      if (editing) {
        await updateSpecialist(editing.id, data, user?.uid);
      } else {
        await addSpecialist(data, user?.uid);
      }
      onSuccess();
    } catch (err) { 
      onSuccess({ type: 'error', message: 'Error: ' + err.message });
    }
  };

  const toggleDay = (dayKey) => setFormData(prev => ({ ...prev, workingHours: { ...prev.workingHours, [dayKey]: { ...prev.workingHours[dayKey], active: !prev.workingHours[dayKey].active } } }));
  const updateTime = (dayKey, field, value) => setFormData(prev => ({ ...prev, workingHours: { ...prev.workingHours, [dayKey]: { ...prev.workingHours[dayKey], [field]: value } } }));

  return (
    <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl p-8 space-y-6 animate-in fade-in zoom-in duration-300 border-zinc-200 max-h-[95vh] overflow-y-auto bg-white border rounded-3xl shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-zinc-800 uppercase tracking-tighter">{editing ? 'EDITAR ESPECIALISTA' : 'NUEVO ESPECIALISTA'}</h3>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">Soberanía de Datos v11.95</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400">
            <svg size={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px]">
          {/* Columna Izquierda: Datos Básicos */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 uppercase tracking-widest ml-1 font-bold">Nombre</label>
                <input required type="text" value={formData.firstName} placeholder="Nombre" className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-zinc-800 uppercase font-bold transition-all" onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 uppercase tracking-widest ml-1 font-bold">Apellido</label>
                <input required type="text" value={formData.lastName} placeholder="Apellido" className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-zinc-800 uppercase font-bold transition-all" onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 uppercase tracking-widest ml-1 font-bold">Email (Opcional)</label>
                <input type="email" value={formData.email} placeholder="correo@ejemplo.com" className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-zinc-800 font-bold transition-all" onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 uppercase tracking-widest ml-1 font-bold">Celular (Opcional)</label>
                <input type="tel" value={formData.celular} placeholder="Ej: 1123456789" className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-zinc-800 font-bold transition-all" onChange={e => setFormData({...formData, celular: e.target.value})} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-400 uppercase tracking-widest ml-1 font-bold">Rol / Especialidad</label>
              <input required type="text" value={formData.role} placeholder="Ej: BARBERO SENIOR" className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-zinc-800 font-bold uppercase transition-all" onChange={e => setFormData({...formData, role: e.target.value})} />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-400 uppercase tracking-widest ml-1 font-bold">Biografía Corta</label>
              <input type="text" value={formData.bio} placeholder="Breve descripción..." className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-zinc-800 font-bold transition-all" onChange={e => setFormData({...formData, bio: e.target.value})} />
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-100/50 transition-all" onClick={() => setFormData({ ...formData, recibirAlertas: !formData.recibirAlertas })}>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Recibir Avisos de Turnos (Email)</span>
              <div className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${formData.recibirAlertas ? 'bg-primary' : 'bg-zinc-300'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.recibirAlertas ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-400 uppercase tracking-widest ml-1 font-bold">Estado Operativo</label>
              <select value={formData.status} className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-zinc-800 uppercase font-bold cursor-pointer transition-all" onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="active">EN LÍNEA / ACTIVO</option>
                <option value="inactive">INACTIVO / PAUSA</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-zinc-400 uppercase tracking-widest ml-1 font-bold">Servicios Habilitados</label>
              <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl grid grid-cols-1 gap-2 max-h-36 overflow-y-auto custom-scrollbar">
                {localServices.map(s => {
                  const safeIds = formData.serviceIds || [];
                  const isChecked = safeIds.includes(s.id);
                  return (
                    <label key={s.id} className={`flex items-center gap-3 p-2 rounded-lg border transition-all cursor-pointer ${isChecked ? 'bg-white border-primary/20 text-primary shadow-sm' : 'border-transparent text-zinc-500 hover:bg-white hover:border-zinc-100'}`}>
                      <input type="checkbox" className="accent-primary w-4 h-4" checked={isChecked} onChange={(e) => {
                        setFormData({ ...formData, serviceIds: e.target.checked ? [...safeIds, s.id] : safeIds.filter(id => id !== s.id) });
                      }} />
                      <span className="text-[10px] uppercase font-bold tracking-tight">{s.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Horarios Disponibles */}
          <AvailabilityColumn workingHours={formData.workingHours} toggleDay={toggleDay} updateTime={updateTime} />
        </div>

        <div className="flex gap-4 pt-6 border-t border-zinc-100">
          <button type="button" onClick={onClose} className="flex-1 p-4 border border-zinc-200 rounded-xl hover:bg-zinc-50 text-zinc-400 transition-all uppercase font-bold tracking-widest text-[10px]">Cerrar</button>
          <button type="submit" className="flex-1 p-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all uppercase font-bold tracking-widest shadow-xl shadow-primary/20 text-[10px]">Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
}
