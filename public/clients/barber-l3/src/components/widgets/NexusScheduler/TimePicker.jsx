// Archivo: src/components/widgets/NexusScheduler/TimePicker.jsx
// v11.91-BLOCKS — 14-day pre-fetch slot selector with service-specific blocking and zero-latency
'use client';
import React, { useState, useEffect } from 'react';
import { getAppointmentsRange, computeSlotsFromAppointments, getHolidays, getServiceBlocks } from '@/lib/firebase/db';
import SlotGrid from './SlotGrid';

const dayNamesEs = {
  monday: 'LUN', tuesday: 'MAR', wednesday: 'MIE',
  thursday: 'JUE', friday: 'VIE', saturday: 'SAB', sunday: 'DOM'
};

export default function TimePicker({ selection, onSelect, onBack, specialists }) {
  const specialist = specialists.find(s => s.id === selection.specialistId);
  const fullName = specialist?.firstName 
    ? `${specialist.firstName}${specialist.lastName ? ' ' + specialist.lastName : ''}`
    : (specialist?.identity?.displayName || 'Especialista');

  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    getHolidays().then(data => {
      setHolidays(data);
      // Si el día pre-seleccionado resulta ser un feriado, lo reseteamos luego de cargar la data
      if (data.includes(selection.date || '')) {
        // el reseteo se manejará en otro useEffect o aquí mismo
      }
    }).catch(console.error);
  }, [selection.date]);

  const getNextWorkingDays = () => {
    if (!specialist) return [];
    const result = [];
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    let curr = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
    curr.setHours(12, 0, 0, 0);

    const nowMs = Date.now();
    const advanceHours = selection.service?.advanceHoursRequired || 0;
    const bufferMs = Math.max(15, advanceHours * 60) * 60 * 1000;

    let safety = 0;
    while (result.length < 5 && safety < 30) {
      const dayName = days[curr.getDay()];
      const config = specialist.workingHours?.[dayName] || specialist.availability?.weekly?.[dayName];
      const dateStr = curr.toISOString().split('T')[0];
      
      // Chequear si está bloqueado por feriados
      const isHoliday = holidays.includes(dateStr);
      
      let isWorking = !!(config?.active);
      if (isWorking && config) {
        // Obtener la hora de fin del especialista para este día
        let endTimeStr = '20:00';
        if (config.shifts && config.shifts.length > 0) {
          endTimeStr = config.shifts[config.shifts.length - 1].end;
        } else if (config.end) {
          endTimeStr = config.end;
        }
        
        // Calcular el fin de jornada del día en milisegundos en Buenos Aires (UTC-3)
        const targetDateEnd = new Date(`${dateStr}T${endTimeStr}:00-03:00`);
        const endMs = targetDateEnd.getTime();
        
        // Si el fin de jornada está a menos del tiempo de anticipación, no hay slots posibles hoy
        if (endMs <= (nowMs + bufferMs)) {
          isWorking = false;
        }
      }

      if (isWorking && !isHoliday) {
        result.push({
          dateStr,
          label: dayNamesEs[dayName],
          dayNumber: curr.getDate(),
          monthLabel: curr.toLocaleString('es-AR', { month: 'short' }).toUpperCase().replace('.', '')
        });
      }
      curr.setDate(curr.getDate() + 1);
      safety++;
    }
    return result;
  };

  const nextDays = getNextWorkingDays();
  const [selectedDate, setSelectedDate] = useState(selection.date || nextDays[0]?.dateStr || '');
  const [slots, setSlots] = useState([]);
  const [appointmentsCache, setAppointmentsCache] = useState([]);
  const [serviceBlocks, setServiceBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Efecto de seguridad: si la fecha seleccionada no está en los días válidos (ej. porque cargó un feriado)
  useEffect(() => {
    if (nextDays.length > 0 && !nextDays.find(d => d.dateStr === selectedDate)) {
      setSelectedDate(nextDays[0].dateStr);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holidays]);

  // Cálculos de Zona Horaria de Buenos Aires para bloqueo de turnos pasados
  const baFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  });
  const baParts = baFormatter.formatToParts(new Date());
  const baYear = baParts.find(p => p.type === 'year')?.value;
  const baMonth = baParts.find(p => p.type === 'month')?.value;
  const baDay = baParts.find(p => p.type === 'day')?.value;
  const localDateStr = `${baYear}-${baMonth}-${baDay}`;
  
  const isToday = selectedDate === localDateStr;
  let nowH = Number(baParts.find(p => p.type === 'hour')?.value || 0);
  const nowM = Number(baParts.find(p => p.type === 'minute')?.value || 0);
  if (nowH === 24) nowH = 0;

  // 1. Precarga masiva inicial de 14 días al montar el turnero (incluyendo bloqueos de servicio)
  useEffect(() => {
    if (!selection.specialistId) return;
    setLoading(true);
    
    Promise.all([
      getAppointmentsRange(selection.specialistId, localDateStr, 14),
      getServiceBlocks()
    ])
      .then(([appointmentsData, blocksData]) => {
        setAppointmentsCache(appointmentsData || []);
        const targetServiceId = selection.service?.id;
        const filteredBlocks = (blocksData || []).filter(b => b.serviceId === targetServiceId);
        setServiceBlocks(filteredBlocks);
        setLoading(false);
      })
      .catch(err => {
        console.error("[SLOTS] Error al precargar datos:", err);
        setAppointmentsCache([]);
        setServiceBlocks([]);
        setLoading(false);
      });
  }, [selection.specialistId, localDateStr, selection.service?.id]);

  // 2. Cómputo sincrónico instantáneo al alternar o cambiar la fecha seleccionada (0ms latencia)
  useEffect(() => {
    if (!selectedDate || !specialist) return;
    const advanceHours = selection.service?.advanceHoursRequired || 0;
    const computed = computeSlotsFromAppointments(
      specialist, 
      selectedDate, 
      appointmentsCache, 
      localDateStr, 
      advanceHours, 
      serviceBlocks
    );
    setSlots(computed || []);
  }, [selectedDate, appointmentsCache, specialist, localDateStr, selection.service, serviceBlocks]);

  // Lógica de navegación táctil
  const selectedIndex = nextDays.findIndex(d => d.dateStr === selectedDate);
  const isFirstDay = selectedIndex <= 0;
  const isLastDay = selectedIndex >= nextDays.length - 1;

  const handlePrevDay = () => {
    if (!isFirstDay) setSelectedDate(nextDays[selectedIndex - 1].dateStr);
  };

  const handleNextDay = () => {
    if (!isLastDay) setSelectedDate(nextDays[selectedIndex + 1].dateStr);
  };

  const formatFullSelectedDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    const dateVal = new Date(year, month - 1, day);
    const dayLong = dateVal.toLocaleString('es-AR', { weekday: 'long' }).toUpperCase();
    const monthLong = dateVal.toLocaleString('es-AR', { month: 'long' }).toUpperCase();
    return `${dayLong} ${day} DE ${monthLong}`;
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300 pb-2 font-mono text-neutral-900">
      <div className="mb-2 flex items-center justify-between border-b border-zinc-200 pb-2">
        <span className="text-xs font-bold uppercase text-[#800000]">Elegí tu fecha y hora</span>
        <span className="text-[9px] font-black uppercase bg-zinc-50 border border-zinc-200 text-neutral-800 px-2 py-0.5">
          PROFESIONAL: {fullName.toUpperCase()}
        </span>
      </div>

      {/* Selector de Fecha Táctil Rápido para Mobile */}
      <div className="flex items-center justify-between border border-zinc-200 p-2.5 bg-zinc-50 shadow-sm select-none">
        <button
          type="button"
          onClick={handlePrevDay}
          disabled={isFirstDay}
          className={`w-9 h-9 border border-zinc-300 flex items-center justify-center font-black transition-all rounded-none ${
            isFirstDay ? 'text-zinc-300 bg-zinc-100/50 cursor-not-allowed' : 'text-neutral-800 bg-white hover:bg-[#800000] hover:text-white hover:border-[#800000] cursor-pointer'
          }`}
        >
          ←
        </button>
        <div className="text-center flex-1 mx-2">
          <span className="text-[8px] font-black text-neutral-400 block uppercase tracking-wider">DÍA SELECCIONADO</span>
          <span className="text-xs font-black uppercase text-[#800000] tracking-wider block sm:inline">
            {formatFullSelectedDate(selectedDate)}
          </span>
        </div>
        <button
          type="button"
          onClick={handleNextDay}
          disabled={isLastDay}
          className={`w-9 h-9 border border-zinc-300 flex items-center justify-center font-black transition-all rounded-none ${
            isLastDay ? 'text-zinc-300 bg-zinc-100/50 cursor-not-allowed' : 'text-neutral-800 bg-white hover:bg-[#800000] hover:text-white hover:border-[#800000] cursor-pointer'
          }`}
        >
          →
        </button>
      </div>

      {/* Días en Grilla Refinada */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {nextDays.map((day) => (
          <button
            key={day.dateStr}
            type="button"
            onClick={() => setSelectedDate(day.dateStr)}
            className={`p-2 border text-center font-mono flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-200 rounded-none ${
              selectedDate === day.dateStr 
                ? 'bg-[#800000] text-white border-[#800000] shadow-sm'
                : 'bg-white text-neutral-800 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-400'
            }`}
          >
            <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider">{day.label}</span>
            <span className="text-base sm:text-lg font-black my-0.5">{day.dayNumber}</span>
            <span className="text-[8px] sm:text-[9px] uppercase font-bold">{day.monthLabel}</span>
          </button>
        ))}
      </div>

      {/* Slots de Horario */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 pb-1 border-b border-zinc-200">
          <span className="text-xs font-black uppercase text-neutral-500">Horarios Disponibles</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <div className="w-6 h-6 border border-zinc-300 border-t-[#800000] rounded-none animate-spin" />
            <span className="text-[9px] font-bold uppercase text-neutral-400">CARGANDO HORAS...</span>
          </div>
        ) : (
          <SlotGrid 
            slots={slots} 
            selectedDate={selectedDate} 
            onSelect={onSelect} 
            isToday={isToday} 
            nowH={nowH} 
            nowM={nowM} 
          />
        )}
      </div>

      <div className="pt-2">
        <button 
          type="button"
          onClick={onBack}
          className="mx-auto flex items-center justify-center pt-2 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-neutral-700 transition-colors font-bold cursor-pointer"
        >
          ← Volver a Servicios
        </button>
      </div>
    </div>
  );
}
