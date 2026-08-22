// Archivo: src/app/admin/turnos/components/WhatsAppManualModal.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { 
  formatPhoneForWhatsApp, 
  parseWhatsAppTemplate, 
  generateWhatsAppUrl 
} from '@/lib/utils/whatsapp';
import { 
  X, 
  Send, 
  User, 
  Scissors, 
  Calendar, 
  Clock, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';

const FALLBACK_TEMPLATES = {
  confirmation: "¡Hola {{cliente}}! ✨ Te confirmamos tu turno para el servicio de {{servicio}} con {{especialista}} el día {{fecha}} a las {{hora}}hs. ¡Te esperamos en Nexus Barber L3!",
  modification: "¡Hola {{cliente}}! 🔄 Tu turno ha sido modificado. La nueva cita es para {{servicio}} con {{especialista}} el día {{fecha}} a las {{hora}}hs. Por favor, confírmanos si estás de acuerdo.",
  cancellation: "¡Hola {{cliente}}! ⚠️ Lamentamos informarte que tu turno para {{servicio}} el día {{fecha}} a las {{hora}}hs ha sido cancelado. Si deseas reprogramar, no dudes en ponerte en contacto con nosotros.",
  reminder: "¡Hola {{cliente}}! ⏰ Te recordamos tu turno de mañana en Nexus Barber L3: {{servicio}} con {{especialista}} el día {{fecha}} a las {{hora}}hs. ¡Que tengas un excelente día!"
};

const ACTION_LABELS = {
  confirmation: { text: 'CONFIRMACIÓN', color: 'bg-green-500 text-white border-green-700' },
  modification: { text: 'MODIFICACIÓN', color: 'bg-amber-500 text-white border-amber-700' },
  cancellation: { text: 'CANCELACIÓN', color: 'bg-rose-600 text-white border-rose-800' },
  reminder: { text: 'RECORDATORIO', color: 'bg-[#720E1C] text-white border-[#800000]' }
};

export default function WhatsAppManualModal({
  isOpen,
  onClose,
  appointment,
  actionType = 'confirmation',
  specialists = [],
  services = []
}) {
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientName, setClientName] = useState('');

  useEffect(() => {
    if (!isOpen || !appointment) return;

    const resolveAndParseMessage = async () => {
      setLoading(true);
      try {
        // 1. Resolver Datos del Cliente
        const client = appointment.resolvedClient || appointment.client || {};
        const cName = `${client.firstName || ''} ${client.lastName || ''}`.trim() || client.name || 'Cliente';
        setClientName(cName);

        const rawPhone = client.whatsapp || client.clientPhone || '';
        const cleanPhone = formatPhoneForWhatsApp(rawPhone);
        setClientPhone(cleanPhone);

        // 2. Resolver Servicios
        let resolvedServices = [];
        if (Array.isArray(appointment.resolvedServices) && appointment.resolvedServices.length > 0) {
          resolvedServices = appointment.resolvedServices;
        } else if (Array.isArray(appointment.serviceIds)) {
          resolvedServices = services.filter(s => appointment.serviceIds.includes(s.id));
        } else if (appointment.serviceId) {
          const s = services.find(srv => srv.id === appointment.serviceId);
          if (s) resolvedServices = [s];
        }
        const servicesName = resolvedServices.length > 0
          ? resolvedServices.map(s => s.name || '').join(', ')
          : 'Servicio General';

        // 3. Resolver Especialista
        let specialistName = 'Profesional';
        if (appointment.specialistId) {
          const spec = specialists.find(s => s.id === appointment.specialistId);
          if (spec) {
            specialistName = spec.name || 'Profesional';
          }
        } else if (appointment.specialistName) {
          specialistName = appointment.specialistName;
        }

        // 4. Resolver Fecha y Hora
        let dateFormatted = appointment.dateString || appointment.date || '';
        if (dateFormatted && dateFormatted.includes('-')) {
          const [y, m, d] = dateFormatted.split('-');
          dateFormatted = `${d}/${m}/${y}`;
        }
        const timeFormatted = appointment.timeString || appointment.time || '';

        // 5. Cargar plantilla desde Firestore
        let dbTemplate = '';
        try {
          const docSnap = await getDoc(doc(db, 'settings', 'booking_parameters'));
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (actionType === 'confirmation') {
              dbTemplate = data.whatsappTemplateConfirmation;
            } else if (actionType === 'modification') {
              dbTemplate = data.whatsappTemplateModification;
            } else if (actionType === 'cancellation') {
              dbTemplate = data.whatsappTemplateCancellation;
            } else if (actionType === 'reminder') {
              dbTemplate = data.whatsappTemplateReminder;
            }
          }
        } catch (e) {
          console.warn("[NEXUS] Error leyendo plantilla en Firestore, usando fallback.", e);
        }

        // 6. Aplicar Fallback si está vacía
        const templateToUse = dbTemplate || FALLBACK_TEMPLATES[actionType] || FALLBACK_TEMPLATES.confirmation;

        // 7. Parsear Variables usando la utilidad centralizada de WhatsApp
        const parsedBody = parseWhatsAppTemplate(templateToUse, {
          clientName: cName,
          serviceName: servicesName,
          specialistName,
          date: appointment.dateString || appointment.date || '',
          time: timeFormatted
        });

        setMessageText(parsedBody);
      } catch (err) {
        console.error("[NEXUS] Error general parseando mensaje:", err);
      } finally {
        setLoading(false);
      }
    };

    resolveAndParseMessage();
  }, [isOpen, appointment, actionType, services, specialists]);

  const handleSend = () => {
    if (!clientPhone) {
      alert("Teléfono inválido para enviar mensaje.");
      return;
    }
    const waUrl = generateWhatsAppUrl(clientPhone, messageText);
    window.open(waUrl, '_blank');
    onClose();
  };

  if (!isOpen) return null;

  const currentLabel = ACTION_LABELS[actionType] || ACTION_LABELS.confirmation;

  return (
    <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4 select-none">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg p-6 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Cabecera Brutalista */}
        <div className="flex justify-between items-start border-b-4 border-black pb-4">
          <div>
            <div className="flex items-center gap-2 text-[9px] font-black uppercase text-zinc-500 tracking-wider">
              <MessageSquare size={12} className="text-[#720E1C]" /> GATEWAY MANIPULACIÓN WHATSAPP // SOBERANO
            </div>
            <h3 className="text-2xl font-serif italic text-[#720E1C] uppercase font-black tracking-tight mt-1">
              WHATSAPP MANUAL
            </h3>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="border-2 border-black p-1 hover:bg-[#720E1C] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Carga del Estado */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-black border-t-[#720E1C] rounded-full animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#720E1C]">Parseando Variables...</span>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Ficha Resumen de Cita (Brutalismo Puro) */}
            <div className="border-2 border-black p-4 bg-zinc-50 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black uppercase tracking-wider text-zinc-500">Detalles de Reserva</span>
                <span className={`px-2 py-0.5 border-2 border-black text-[8px] font-black uppercase tracking-widest ${currentLabel.color}`}>
                  {currentLabel.text}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-black uppercase">
                <div className="flex items-center gap-1.5 border-b border-zinc-200 pb-1.5">
                  <User size={12} className="text-[#720E1C]" />
                  <span className="truncate">{clientName}</span>
                </div>
                <div className="flex items-center gap-1.5 border-b border-zinc-200 pb-1.5">
                  <span className="font-mono text-green-700 font-black">WA: +{clientPhone}</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <Scissors size={12} className="text-zinc-600" />
                  <span className="truncate">{appointment.resolvedServices?.map(s => s.name).join(', ') || 'SERVICIOS'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-[#720E1C]" />
                  <span>{appointment.dateString || appointment.date || 'FECHA'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={12} className="text-zinc-600" />
                  <span>{appointment.timeString || appointment.time || 'HORA'} hs</span>
                </div>
              </div>
            </div>

            {/* Caja de Edición en Tiempo Real */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-wider text-black flex items-center gap-1">
                Editable del Mensaje <span className="text-rose-600">*</span>
              </label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full min-h-[140px] p-4 bg-zinc-50 border-2 border-black text-black font-sans text-xs outline-none focus:bg-white focus:border-[#720E1C] placeholder-zinc-400 leading-relaxed resize-none font-bold"
              />
              <div className="flex justify-between items-center text-[9px] font-black uppercase text-zinc-500 tracking-wider">
                <span>Caracteres: {messageText.length}</span>
                <span className="text-green-600 font-bold">Argentina Prefix Enforced</span>
              </div>
            </div>

            {/* Aviso de Acción */}
            <div className="bg-amber-50 border-2 border-amber-300 p-3 flex items-start gap-2.5 text-[9px] font-bold text-amber-900 uppercase">
              <AlertCircle size={14} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                Al presionar "ENVIAR AHORA", se abrirá una nueva pestaña redirigiendo a WhatsApp Web/Mobile con el mensaje precargado. Ningún mensaje se enviará automáticamente.
              </div>
            </div>

            {/* Acciones Brutalistas */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button 
                type="button" 
                onClick={onClose}
                className="w-full py-3.5 border-2 border-black bg-white text-black font-black uppercase text-[10px] tracking-wider transition-all hover:bg-zinc-100 active:scale-95"
              >
                DESCARTAR
              </button>
              <button 
                type="button" 
                onClick={handleSend}
                className="w-full py-3.5 border-2 border-black bg-[#720E1C] text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-[#800000] active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
              >
                <Send size={12} /> ENVIAR AHORA
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
