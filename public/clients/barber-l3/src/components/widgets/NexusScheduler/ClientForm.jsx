// Archivo: src/components/widgets/NexusScheduler/ClientForm.jsx
// v11.75-ELEGANT — Elegant client registration and reservation form with 200-line compliance
'use client';
import React, { useState } from 'react';
import { getClientByWhatsapp } from '@/lib/firebase/db';
import BookingSummary from './BookingSummary';

export default function ClientForm({ selection, onConfirm, onBack, loading, specialists = [] }) {
  const [firstName, setFirstName] = useState(selection.client.firstName || '');
  const [lastName, setLastName] = useState(selection.client.lastName || '');
  const [whatsapp, setWhatsapp] = useState(selection.client.whatsapp || '');
  const [notes, setNotes] = useState(selection.client.notes || '');
  const [isSearching, setIsSearching] = useState(false);

  const specialist = specialists.find(s => s.id === selection.specialistId);
  const specialistName = specialist 
    ? (specialist.firstName 
      ? `${specialist.firstName}${specialist.lastName ? ' ' + specialist.lastName : ''}`
      : (specialist.identity?.displayName || 'Especialista'))
    : (selection.specialistName || 'Cualquier profesional');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanWhatsapp = whatsapp.replace(/\D/g, '');
    if (!firstName || !lastName || cleanWhatsapp.length < 10) {
      return alert("Por favor, ingresa tu nombre, apellido y un número de WhatsApp válido de 10 dígitos.");
    }

    setIsSearching(true);
    let finalClient = { 
      firstName: firstName.trim().toUpperCase(), 
      lastName: lastName.trim().toUpperCase(), 
      whatsapp: cleanWhatsapp,
      notes: notes.trim().toUpperCase()
    };

    try {
      const existingClient = await getClientByWhatsapp(cleanWhatsapp);
      setIsSearching(false);

      if (existingClient) {
        const enteredFullName = `${firstName.trim()} ${lastName.trim()}`.toUpperCase();
        const existingFullName = `${existingClient.firstName || ''} ${existingClient.lastName || ''}`.trim().toUpperCase();

        if (enteredFullName !== existingFullName && existingFullName) {
          const useExisting = window.confirm(
            `Este celular pertenece a ${existingClient.firstName || ''} ${existingClient.lastName || ''}. ¿Deseas usar estos datos cargados automáticamente?`
          );
          if (useExisting) {
            setFirstName(existingClient.firstName || '');
            setLastName(existingClient.lastName || '');
            finalClient = {
              firstName: (existingClient.firstName || '').toUpperCase(),
              lastName: (existingClient.lastName || '').toUpperCase(),
              whatsapp: cleanWhatsapp,
              notes: notes.trim().toUpperCase()
            };
          }
        }
      }
    } catch (err) {
      setIsSearching(false);
      console.error("[DB] Error verificando cliente:", err);
    }

    onConfirm(finalClient);
  };

  const handleWhatsappChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setWhatsapp(value);
    if ((firstName || lastName) && value !== selection.client.whatsapp) {
      setFirstName('');
      setLastName('');
      setNotes('');
    }
  };

  const handleWhatsappBlur = async () => {
    if (whatsapp.length >= 10 && !firstName && !lastName) {
      setIsSearching(true);
      const existingClient = await getClientByWhatsapp(whatsapp);
      if (existingClient) {
        setFirstName(existingClient.firstName || '');
        setLastName(existingClient.lastName || '');
      }
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-300 pb-2 font-mono text-neutral-900">
      <div className="mb-4 flex items-center justify-between border-b border-zinc-200 pb-2">
        <span className="text-xs font-bold uppercase text-[#800000]">Tus datos de reserva</span>
      </div>

      <BookingSummary selection={selection} specialistName={specialistName} />
      
      <div className="space-y-4 bg-white border border-zinc-200 p-4">
        <div className="space-y-1">
          <label className="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
            WhatsApp / Celular (con código de área sin 15)
          </label>
          <div className="flex border border-zinc-300 bg-white focus-within:border-zinc-500 transition-colors duration-200">
            <span className="bg-zinc-100 px-3 py-2 text-neutral-700 text-xs sm:text-sm font-bold flex items-center select-none border-r border-zinc-200">
              +54 9
            </span>
            <input 
              type="tel" 
              required
              minLength={10}
              maxLength={15}
              placeholder="1122334455"
              value={whatsapp}
              onBlur={handleWhatsappBlur}
              onChange={handleWhatsappChange}
              disabled={loading}
              className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm tracking-wider text-neutral-900 outline-none border-none ring-0 placeholder:text-neutral-400 font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold flex justify-between items-center">
              <span>Nombre</span>
              {isSearching && <span className="text-[8px] text-[#800000] animate-pulse">// BUSCANDO CLIENTE...</span>}
            </label>
            <input 
              type="text" 
              required
              maxLength={30}
              placeholder="EJ: LEO"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value.toUpperCase())}
              disabled={loading}
              className="w-full bg-white border border-zinc-300 p-2.5 text-xs sm:text-sm tracking-wider text-neutral-900 outline-none focus:border-zinc-500 transition-all font-bold"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
              Apellido
            </label>
            <input 
              type="text" 
              required
              maxLength={30}
              placeholder="EJ: LANDA"
              value={lastName}
              onChange={(e) => setLastName(e.target.value.toUpperCase())}
              disabled={loading}
              className="w-full bg-white border border-zinc-300 p-2.5 text-xs sm:text-sm tracking-wider text-neutral-900 outline-none focus:border-zinc-500 transition-all font-bold"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
            Nota Opcional / Mensaje
          </label>
          <textarea 
            maxLength={200}
            rows={3}
            placeholder="EJ: CUALQUIER DETALLE ADICIONAL O PREFERENCIA..."
            value={notes}
            onChange={(e) => setNotes(e.target.value.toUpperCase())}
            disabled={loading}
            className="w-full bg-white border border-zinc-300 p-2.5 text-xs sm:text-sm tracking-wider text-neutral-900 outline-none focus:border-zinc-500 transition-all font-bold resize-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <button 
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-white border border-[#800000] text-[#800000] font-black text-sm tracking-wider hover:bg-[#800000]/5 active:translate-y-0.5 transition-all rounded-none shadow-sm hover:shadow cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-[#800000] border-t-transparent rounded-full animate-spin"></span>
              PROCESANDO RESERVA...
            </>
          ) : (
            "¡RESERVÁ MI TURNO!"
          )}
        </button>
        <button 
          type="button"
          onClick={onBack}
          disabled={loading}
          className="mx-auto pt-2 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-neutral-700 transition-colors font-bold cursor-pointer"
        >
          ← Volver a Horarios
        </button>
      </div>
    </form>
  );
}
