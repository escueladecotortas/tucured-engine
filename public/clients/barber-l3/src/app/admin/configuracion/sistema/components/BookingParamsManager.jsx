// Archivo: src/app/admin/configuracion/sistema/components/BookingParamsManager.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/context/AuthContext';
import { Save, RefreshCw, Terminal, Sliders, ShieldAlert, Check } from 'lucide-react';
import TemplateField from './TemplateField';

export default function BookingParamsManager() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [params, setParams] = useState({
    allowedAdvanceDays: 30,
    maxActiveAppointmentsPerUser: 1,
    allowSameDayBookings: true,
    whatsappEnabled: false,
    whatsappApiKey: '',
    whatsappPhoneId: '',
    whatsappTemplateConfirmation: '',
    whatsappTemplateModification: '',
    whatsappTemplateCancellation: '',
    whatsappTemplateReminder: ''
  });

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const docSnap = await getDoc(doc(db, 'settings', 'booking_parameters'));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setParams({
          allowedAdvanceDays: data.allowedAdvanceDays !== undefined ? Number(data.allowedAdvanceDays) : 30,
          maxActiveAppointmentsPerUser: data.maxActiveAppointmentsPerUser !== undefined ? Number(data.maxActiveAppointmentsPerUser) : 1,
          allowSameDayBookings: data.allowSameDayBookings !== undefined ? Boolean(data.allowSameDayBookings) : true,
          whatsappEnabled: data.whatsappEnabled !== undefined ? Boolean(data.whatsappEnabled) : false,
          whatsappApiKey: data.whatsappApiKey || '',
          whatsappPhoneId: data.whatsappPhoneId || '',
          whatsappTemplateConfirmation: data.whatsappTemplateConfirmation || '',
          whatsappTemplateModification: data.whatsappTemplateModification || '',
          whatsappTemplateCancellation: data.whatsappTemplateCancellation || '',
          whatsappTemplateReminder: data.whatsappTemplateReminder || ''
        });
      }
    } catch (e) {
      setFeedback({ message: 'ERROR SOBERANO: FALLO AL LEER LA NUBE', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleFieldChange = (field, val) => {
    setParams(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      await setDoc(doc(db, 'settings', 'booking_parameters'), {
        ...params,
        allowedAdvanceDays: Number(params.allowedAdvanceDays),
        maxActiveAppointmentsPerUser: Number(params.maxActiveAppointmentsPerUser),
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email || 'unknown'
      });
      setFeedback({ message: 'CONFIGURACIÓN GUARDADA CON ÉXITO', type: 'success' });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setFeedback({ message: 'ERROR DE NUBE: FALLO AL GUARDAR', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4 mb-4 gap-3">
        <div>
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <Terminal size={12} className="text-[#800000]" /> CONSOLA DE CONTROL // PARÁMETROS
          </div>
          <h1 className="text-2xl font-serif tracking-tight mt-1 text-[#1A1A1A]">Configuración <span className="text-[#800000]">del Sistema</span></h1>
        </div>
        <button onClick={fetchSettings} disabled={loading || saving} className="flex items-center justify-center gap-2 h-9 px-4 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-md hover:bg-gray-50 disabled:opacity-40">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> REESTABLECER SINCRO
        </button>
      </div>

      {feedback && (
        <div className={`p-4 border flex items-center gap-3 rounded-md text-xs font-bold uppercase tracking-wider ${feedback.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {feedback.type === 'success' ? <Check size={18} /> : <ShieldAlert size={18} />} {feedback.message}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-5 py-3.5 flex items-center justify-between border-b border-gray-200 text-xs font-semibold uppercase tracking-wider">
          <div className="flex items-center gap-3 text-gray-700"><Sliders size={16} /> Parámetros de Reserva</div>
          <span className="text-gray-500">{loading ? 'SINCRONIZANDO...' : 'EN LÍNEA'}</span>
        </div>

        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-4"><RefreshCw size={24} className="animate-spin text-[#800000]" /><span className="text-xs font-semibold text-gray-400 uppercase">LEYENDO DATOS...</span></div>
        ) : (
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-600 font-semibold tracking-wide">DÍAS PERMITIDOS PARA TURNOS</label>
                <input type="number" value={params.allowedAdvanceDays} onChange={e => handleFieldChange('allowedAdvanceDays', parseInt(e.target.value) || 0)} className="w-full h-11 border border-gray-300 focus:border-[#800000] outline-none text-[#1A1A1A] px-3 py-1 text-sm rounded-md focus:ring-1 focus:ring-[#800000]/20 font-bold" min="1" />
                <span className="text-gray-400 text-[10px]">Ventana temporal máxima de días para reservar.</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-600 font-semibold tracking-wide">LÍMITE DE TURNOS ACTIVOS</label>
                <input type="number" value={params.maxActiveAppointmentsPerUser} onChange={e => handleFieldChange('maxActiveAppointmentsPerUser', parseInt(e.target.value) || 0)} className="w-full h-11 border border-gray-300 focus:border-[#800000] outline-none text-[#1A1A1A] px-3 py-1 text-sm rounded-md focus:ring-1 focus:ring-[#800000]/20 font-bold" min="1" />
                <span className="text-gray-400 text-[10px]">Límite de reservas activas simultáneas por usuario.</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-600 font-semibold tracking-wide">RESERVAR MISMO DÍA</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => handleFieldChange('allowSameDayBookings', true)} className={`flex-1 h-10 border transition-all font-semibold text-xs rounded-md ${params.allowSameDayBookings ? 'bg-[#800000] border-[#800000] text-white shadow-sm' : 'bg-white border-gray-200 text-gray-500'}`}>HABILITADO</button>
                  <button type="button" onClick={() => handleFieldChange('allowSameDayBookings', false)} className={`flex-1 h-10 border transition-all font-semibold text-xs rounded-md ${!params.allowSameDayBookings ? 'bg-[#800000] border-[#800000] text-white shadow-sm' : 'bg-white border-gray-200 text-gray-500'}`}>BLOQUEADO</button>
                </div>
              </div>

            </div>
            <div className="border-l-0 md:border-l border-gray-200 pl-0 md:pl-8 flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div className="text-xs font-bold text-[#800000] uppercase tracking-widest">Plantillas de Mensajes</div>
                <TemplateField
                  label="Confirmación (Creación)"
                  value={params.whatsappTemplateConfirmation}
                  onChange={(val) => handleFieldChange('whatsappTemplateConfirmation', val)}
                  placeholder="¡Hola {{cliente}}! Tu turno para {{servicio}} con {{especialista}} el {{fecha}} a las {{hora}} ha sido confirmado."
                />
                <TemplateField
                  label="Modificación (Reprogramación)"
                  value={params.whatsappTemplateModification}
                  onChange={(val) => handleFieldChange('whatsappTemplateModification', val)}
                  placeholder="¡Hola {{cliente}}! Tu turno ha sido modificado. Nueva cita: {{servicio}} con {{especialista}} el {{fecha}} a las {{hora}}."
                />
                <TemplateField
                  label="Cancelación"
                  value={params.whatsappTemplateCancellation}
                  onChange={(val) => handleFieldChange('whatsappTemplateCancellation', val)}
                  placeholder="¡Hola {{cliente}}! Queremos informarte que tu turno para {{servicio}} el {{fecha}} a las {{hora}} ha sido cancelado."
                />
                <TemplateField
                  label="Recordatorio"
                  value={params.whatsappTemplateReminder}
                  onChange={(val) => handleFieldChange('whatsappTemplateReminder', val)}
                  placeholder="¡Hola {{cliente}}! Te recordamos tu turno de mañana: {{servicio}} con {{especialista}} el {{fecha}} a las {{hora}}."
                />
              </div>
              <button type="submit" disabled={saving} className="w-full h-11 bg-[#800000] hover:bg-[#600000] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 rounded-md shadow-sm active:scale-95">
                {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />} GUARDAR CONFIGURACIÓN
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
