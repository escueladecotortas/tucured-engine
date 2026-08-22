// Archivo: src/components/widgets/NexusScheduler/ElegantDatePicker.jsx
// v11.70-ELEGANT — Elegant client-side date picker for boutique scheduler
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ElegantDatePicker({ value, onChange, label, shouldDisableDate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(
    value && value !== 'all' ? new Date(value + 'T12:00:00') : new Date()
  );
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const formatDateLocal = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSelectDate = (day) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const dateString = formatDateLocal(newDate);
    onChange(dateString);
    setIsOpen(false);
  };

  const renderDays = () => {
    const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDay = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
      const dateString = formatDateLocal(dateObj);
      const isSelected = value === dateString;
      const isToday = new Date().toDateString() === dateObj.toDateString();
      const isDisabled = shouldDisableDate ? !shouldDisableDate(dateString) : false;

      days.push(
        <button
          key={d}
          type="button"
          disabled={isDisabled}
          onClick={() => handleSelectDate(d)}
          className={`h-8 w-8 flex items-center justify-center text-xs font-sans transition-all rounded-full ${
            isSelected
              ? 'bg-[#800000] text-white font-semibold shadow-sm'
              : isToday && !isSelected
              ? 'border border-[#800000] text-[#800000] font-medium'
              : 'hover:bg-neutral-100 text-neutral-800'
          } ${isDisabled ? 'opacity-20 cursor-not-allowed pointer-events-none' : ''}`}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div className="relative w-full font-sans" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 flex items-center justify-between bg-white border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50/50 transition-all rounded-none px-4 py-2 text-neutral-700 text-xs uppercase tracking-widest font-medium"
      >
        <span className="flex items-center gap-2">
          <CalendarIcon size={14} className="text-[#800000]" />
          {(!value || value === 'all') ? (label || 'Seleccionar Fecha') : value.split('-').reverse().join('/')}
        </span>
        <span className="text-[10px] text-neutral-400">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 sm:left-0 mt-2 z-[110] w-72 bg-white border border-neutral-200 shadow-lg p-4 rounded-none animate-in fade-in duration-200">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-neutral-100">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-serif italic text-sm text-neutral-800 font-normal">
              {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2 text-center">
            {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'].map((d) => (
              <div key={d} className="h-6 flex items-center justify-center text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center justify-items-center">
            {renderDays()}
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                onChange(formatDateLocal(new Date()));
                setIsOpen(false);
              }}
              className="px-3 py-1.5 text-[9px] uppercase tracking-wider font-medium text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 transition-all rounded-none"
            >
              Hoy
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 text-[9px] uppercase tracking-wider font-medium bg-neutral-800 text-white hover:bg-neutral-700 transition-all rounded-none"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
