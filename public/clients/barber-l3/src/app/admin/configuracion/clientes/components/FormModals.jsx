// Archivo: src/app/admin/configuracion/clientes/components/FormModals.jsx
import React, { useState, useEffect } from 'react';
import { createClient, updateClient, getClientByWhatsapp } from '@/lib/firebase/db';
import { useAuth } from '@/context/AuthContext';
import { X, Plus, Edit2, CheckCircle2, Loader2 } from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';

function cleanInputPhone(value) {
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

export default function FormModals({ editing, isCreating, onClose, onSuccess }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ whatsapp: '', firstName: '', lastName: '', birthday: '' });
  const [isSearching, setIsSearching] = useState(false);
  const [foundExisting, setFoundExisting] = useState(false);
  const [existingClientId, setExistingClientId] = useState(null);
  const [showConfirmExisting, setShowConfirmExisting] = useState({ show: false, client: null });

  useEffect(() => {
    if (editing) {
      setFormData({
        whatsapp: editing.whatsapp || '',
        firstName: editing.firstName || '',
        lastName: editing.lastName || '',
        birthday: editing.birthday || ''
      });
      setFoundExisting(false);
      setExistingClientId(null);
    } else if (isCreating) {
      setFormData({ whatsapp: '', firstName: '', lastName: '', birthday: '' });
      setFoundExisting(false);
      setExistingClientId(null);
    }
  }, [editing, isCreating]);

  if (!editing && !isCreating) return null;
  const isEdit = !!editing;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === 'whatsapp' ? cleanInputPhone(value) : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleBlurWhatsapp = async () => {
    const cleanVal = formData.whatsapp?.trim().replace(/\D/g, '');
    if (!cleanVal || isEdit) return;
    setIsSearching(true);
    try {
      const existing = await getClientByWhatsapp(cleanVal);
      if (existing) {
        setFormData(prev => ({
          ...prev,
          firstName: existing.firstName || prev.firstName,
          lastName: existing.lastName || prev.lastName,
          birthday: existing.birthday || prev.birthday || ''
        }));
        setExistingClientId(existing.id);
        setFoundExisting(true);
      } else {
        setExistingClientId(null);
        setFoundExisting(false);
      }
    } catch (err) {
      console.error("[DB] Error en autopoblado de cliente:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneVal = formData.whatsapp?.trim();
    if (!phoneVal) return;
    try {
      if (!isEdit && !existingClientId) {
        const existing = await getClientByWhatsapp(phoneVal);
        if (existing) {
          setShowConfirmExisting({ show: true, client: existing });
          return;
        }
      }
      const data = {
        firstName: formData.firstName?.trim(),
        lastName: formData.lastName?.trim(),
        whatsapp: phoneVal,
        birthday: formData.birthday || ''
      };
      if (isEdit) {
        await updateClient(editing.id, data, user?.uid);
      } else if (existingClientId) {
        await updateClient(existingClientId, data, user?.uid);
      } else {
        await createClient(data, user?.uid);
      }
      onSuccess();
    } catch (err) {
      onSuccess({ type: 'error', message: `Error al ${isEdit ? 'actualizar' : 'registrar'} cliente: ` + err.message });
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-[2px] flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-md overflow-hidden rounded-2xl shadow-2xl border border-zinc-200 animate-in zoom-in-95 duration-200">
        <div className="bg-[#800000] px-8 py-5 border-b border-[#800000] flex justify-between items-center text-white">
          <div>
            <h3 className="text-xl font-bold uppercase tracking-tighter">{isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
            <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mt-1">
              {isEdit ? 'Actualizar información del titular' : 'Registrar nuevo cliente en búnker'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>
        <div className="p-8 space-y-5">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">WhatsApp (Cód. Área + Número)</label>
                {isSearching && <span className="text-[#800000] text-[9px] flex items-center gap-1 animate-pulse font-bold"><Loader2 size={10} className="animate-spin" /> Buscando...</span>}
                {foundExisting && !isSearching && <span className="text-emerald-600 text-[9px] flex items-center gap-1 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100"><CheckCircle2 size={10} /> Autocompletado</span>}
              </div>
              <div className="flex rounded-xl border border-zinc-200 overflow-hidden focus-within:border-[#800000] focus-within:ring-4 focus-within:ring-[#800000]/5 transition-all">
                <span className="bg-zinc-50 px-4 py-3.5 text-zinc-400 font-mono font-bold text-sm flex items-center select-none border-r border-zinc-200">+54 9</span>
                <input id="modal-whatsapp" name="whatsapp" type="text" value={formData.whatsapp} onChange={handleInputChange} onBlur={handleBlurWhatsapp} placeholder="1123456789" required className={`w-full bg-zinc-50 px-4 py-3.5 text-zinc-800 outline-none font-mono font-bold text-sm ${foundExisting ? 'bg-emerald-50/30' : ''}`} />
              </div>
              {!isEdit && <p className="text-[9px] text-zinc-400 mt-2 italic font-bold uppercase tracking-widest ml-1">Ingresa sin prefijos. Fuerza +54 9 nativo.</p>}
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block mb-2 ml-1">Nombre</label>
              <input id="modal-firstName" name="firstName" type="text" value={formData.firstName} onChange={handleInputChange} required className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-800 font-bold outline-none uppercase focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/5 transition-all" />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block mb-2 ml-1">Apellido</label>
              <input id="modal-lastName" name="lastName" type="text" value={formData.lastName} onChange={handleInputChange} required className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-800 font-bold outline-none uppercase focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/5 transition-all" />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block mb-2 ml-1">Fecha de Nacimiento (Cumpleaños)</label>
              <input id="modal-birthday" name="birthday" type="date" value={formData.birthday} onChange={handleInputChange} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-800 font-bold outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/5 transition-all" />
            </div>
          </div>
          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-4 border border-zinc-200 text-zinc-500 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-50 transition-all rounded-xl">Cancelar</button>
            <button type="submit" className={`flex-[2] py-4 text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all rounded-xl shadow-lg shadow-[#800000]/20 ${foundExisting && !isEdit ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#800000] hover:bg-[#800000]/90'}`}>
              {isEdit ? <Edit2 size={14} /> : <Plus size={14} />}
              {isEdit ? 'Guardar Cambios' : foundExisting ? 'Actualizar y Registrar' : 'Registrar Cliente'}
            </button>
          </div>
        </div>
      </form>
      <ConfirmModal 
        isOpen={showConfirmExisting.show}
        title="CLIENTE EXISTENTE DETECTADO"
        message={`El número ${showConfirmExisting.client?.whatsapp} ya pertenece a ${showConfirmExisting.client?.firstName} ${showConfirmExisting.client?.lastName}. ¿Deseas cargar sus datos para editarlos o prefieres cancelar?`}
        onConfirm={() => {
          const existing = showConfirmExisting.client;
          setFormData({ whatsapp: existing.whatsapp, firstName: existing.firstName, lastName: existing.lastName, birthday: existing.birthday || '' });
          setExistingClientId(existing.id);
          setFoundExisting(true);
          setShowConfirmExisting({ show: false, client: null });
        }}
        onCancel={() => setShowConfirmExisting({ show: false, client: null })}
        confirmText="USAR DATOS EXISTENTES"
        cancelText="CANCELAR"
      />
    </div>
  );
}
