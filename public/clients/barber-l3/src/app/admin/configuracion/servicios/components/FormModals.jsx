// Archivo: src/app/admin/configuracion/servicios/components/FormModals.jsx
import React, { useState, useEffect } from 'react';
import { updateService, addService } from '@/lib/firebase/db';
import { useAuth } from '@/context/AuthContext';
import { X, Save, Plus, ChevronDown } from 'lucide-react';

export default function FormModals({ editing, isCreating, categories, onClose, onSuccess }) {
  const { user } = useAuth();
  const [mostrarPrecioWeb, setMostrarPrecioWeb] = useState(true);
  const [mostrarDuracionWeb, setMostrarDuracionWeb] = useState(true);

  useEffect(() => {
    if (editing) {
      setMostrarPrecioWeb(editing.mostrarPrecioWeb !== false);
      setMostrarDuracionWeb(editing.mostrarDuracionWeb !== false);
    } else {
      setMostrarPrecioWeb(true);
      setMostrarDuracionWeb(true);
    }
  }, [editing, isCreating]);

  if (!editing && !isCreating) return null;
  const isEdit = !!editing;
  const currentData = editing || {};
  const safeCategories = Array.isArray(categories) ? categories : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      category: formData.get('category'),
      name: formData.get('name'),
      price: Number(formData.get('price')),
      duration: Number(formData.get('duration')),
      advanceHoursRequired: Number(formData.get('advanceHoursRequired')),
      mostrarPrecioWeb,
      mostrarDuracionWeb,
      ...(isEdit ? {} : { active: true })
    };
    try {
      if (isEdit) await updateService(currentData.id, data, user?.uid);
      else await addService(data, user?.uid);
      onSuccess();
    } catch (err) {
      onSuccess({ type: 'error', message: `Error al ${isEdit ? 'actualizar' : 'crear'}: ` + err.message });
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-[2px] flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-md overflow-hidden rounded-2xl shadow-2xl border border-zinc-200 animate-in zoom-in-95 duration-200">
        <div className="bg-[#800000] px-8 py-6 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tighter">{isEdit ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>
            <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mt-1">{isEdit ? 'Actualizar información del activo' : 'Configurar nuevo servicio en búnker'}</p>
          </div>
          <button type="button" onClick={onClose} className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>
        <div className="p-8 space-y-5">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block mb-2 ml-1">Categoría del Servicio</label>
              <div className="relative">
                <select name="category" defaultValue={currentData.category || ''} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-zinc-800 outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/5 appearance-none text-sm font-bold transition-all font-sans" required disabled={!isEdit && safeCategories.length === 0}>
                  <option value="">{!isEdit && safeCategories.length === 0 ? 'SIN CATEGORÍAS' : 'SELECCIONE CATEGORÍA...'}</option>
                  {safeCategories.map(cat => <option key={cat.id} value={cat.name}>{cat.name.toUpperCase()}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400"><ChevronDown size={14} /></div>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block mb-2 ml-1">Nombre Comercial</label>
              <input name="name" type="text" defaultValue={currentData.name || ''} placeholder="Ej: CORTE DEGRADADO" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-zinc-800 outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/5 text-sm font-bold transition-all uppercase font-sans" required disabled={!isEdit && safeCategories.length === 0} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block mb-2 ml-1">Precio ($)</label>
                <input name="price" type="number" defaultValue={currentData.price !== undefined ? currentData.price : ''} placeholder="2500" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-zinc-800 outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/5 text-sm font-bold transition-all font-sans" required disabled={!isEdit && safeCategories.length === 0} />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block mb-2 ml-1">Duración (Min)</label>
                <input name="duration" type="number" defaultValue={currentData.duration || 45} placeholder="45" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-zinc-800 outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/5 text-sm font-bold transition-all font-sans" required disabled={!isEdit && safeCategories.length === 0} />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block mb-2 ml-1">Horas Prev.</label>
                <input name="advanceHoursRequired" type="number" step="0.5" defaultValue={currentData.advanceHoursRequired !== undefined ? currentData.advanceHoursRequired : 2} placeholder="2" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-zinc-800 outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/5 text-sm font-bold transition-all font-sans" required disabled={!isEdit && safeCategories.length === 0} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                <div className="flex flex-col"><span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider font-sans">Ver Precio Web</span></div>
                <button type="button" onClick={() => setMostrarPrecioWeb(!mostrarPrecioWeb)} className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-all ${mostrarPrecioWeb ? 'bg-[#800000]' : 'bg-zinc-200'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all ${mostrarPrecioWeb ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                <div className="flex flex-col"><span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider font-sans">Ver Duración Web</span></div>
                <button type="button" onClick={() => setMostrarDuracionWeb(!mostrarDuracionWeb)} className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-all ${mostrarDuracionWeb ? 'bg-[#800000]' : 'bg-zinc-200'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all ${mostrarDuracionWeb ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 border border-zinc-200 text-zinc-500 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-50 transition-all rounded-xl font-sans">Cancelar</button>
            <button type="submit" disabled={!isEdit && categories.length === 0} className="flex-[2] py-3.5 bg-[#800000] text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#800000]/90 transition-all rounded-xl shadow-lg disabled:opacity-20 font-sans">
              {isEdit ? <Save size={16} /> : <Plus size={16} />}
              {isEdit ? 'Guardar Cambios' : 'Crear Servicio'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
