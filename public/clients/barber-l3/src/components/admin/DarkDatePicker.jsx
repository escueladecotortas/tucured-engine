// Archivo: src/components/admin/DarkDatePicker.jsx
// v11.85-PLATINUM — Rediseño visual estricto Nexus (Elegant Enforcement)
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function DarkDatePicker({ value, onChange, label, shouldDisableDate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value && value !== 'all' ? new Date(value + 'T12:00:00') : new Date());
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

  const handleSelectDate = (day) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const dateString = newDate.toISOString().split('T')[0];
    onChange(dateString);
    setIsOpen(false);
  };

  const renderDays = () => {
    const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDay = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
    const days = [];

    // Empty slots
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
      const dateString = dateObj.toISOString().split('T')[0];
      const isSelected = value === dateString;
      const isToday = new Date().toDateString() === dateObj.toDateString();
      const isDisabled = shouldDisableDate ? !shouldDisableDate(dateString) : false;

      days.push(
        <button
          key={d}
          type="button"
          disabled={isDisabled}
          onClick={() => handleSelectDate(d)}
          className={cn(
            "h-8 w-8 flex items-center justify-center rounded-lg text-[11px] font-sans font-medium transition-all",
            isSelected 
              ? "bg-[#800000] text-white shadow-sm" 
              : "hover:bg-zinc-100 text-gray-700",
            isToday && !isSelected && "border border-[#800000] text-[#800000]",
            isDisabled && "hidden"
          )}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  const monthNames = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
  ];

  return (
    <div className="relative w-full font-sans" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 flex items-center justify-between bg-white border border-zinc-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-zinc-50 focus:border-[#800000] outline-none transition-all text-[10px] uppercase font-bold shadow-sm"
      >
        <span className="flex items-center gap-2 text-gray-700">
          <CalendarIcon size={14} className="text-zinc-400" />
          {(() => {
            if (!value || value === 'all') return label || 'TODOS LOS TURNOS';
            const parts = value.split('-');
            if (parts.length === 3) {
              const day = parseInt(parts[2], 10);
              const month = parseInt(parts[1], 10) - 1;
              const monthNamesShort = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
              return `${day} ${monthNamesShort[month]}`;
            }
            return value;
          })()}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full left-0 mt-2 z-[110] w-72 bg-white border border-zinc-200 rounded-2xl shadow-xl p-5 overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-100">
                <button type="button" onClick={handlePrevMonth} className="p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-gray-700 rounded-md transition-all"><ChevronLeft size={18} /></button>
                <div className="font-sans text-[11px] font-bold text-gray-800 tracking-wider uppercase">
                  {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                </div>
                <button type="button" onClick={handleNextMonth} className="p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-gray-700 rounded-md transition-all"><ChevronRight size={18} /></button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA'].map(d => (
                  <div key={d} className="h-6 flex items-center justify-center text-[9px] text-zinc-400 font-bold">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {renderDays()}
              </div>

               <div className="mt-4 pt-4 border-t border-zinc-100 grid grid-cols-2 gap-2">
                 <button 
                  type="button"
                  onClick={() => { onChange(new Date().toISOString().split('T')[0]); setIsOpen(false); }}
                  className="h-9 flex items-center justify-center bg-white text-gray-700 text-[10px] font-bold hover:bg-zinc-50 border border-zinc-200 rounded-lg transition-all uppercase tracking-wider"
                 >
                   HOY
                 </button>
                 <button 
                  type="button"
                  onClick={() => { onChange('all'); setIsOpen(false); }}
                  className="h-9 flex items-center justify-center bg-white text-gray-700 text-[10px] font-bold hover:bg-zinc-50 border border-zinc-200 rounded-lg transition-all uppercase tracking-wider"
                 >
                   TODOS
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

