// Archivo: frontend/src/components/widgets/TurneroCalendar.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const TurneroCalendar = ({ currentMonth, calendarDays, selectedDate, onDateSelect, onPrevMonth, onNextMonth, primaryColor }) => (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
        <div className="flex items-center justify-between mb-3">
            <button onClick={onPrevMonth} className="p-1 hover:bg-white/10 rounded-lg"><ChevronLeft size={16} /></button>
            <span className="text-sm font-medium text-white">{MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
            <button onClick={onNextMonth} className="p-1 hover:bg-white/10 rounded-lg"><ChevronRight size={16} /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map(day => <div key={day} className="text-center text-[10px] text-gray-500 font-medium py-1">{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((dayInfo, idx) => (
                <button
                    key={idx}
                    onClick={() => onDateSelect(dayInfo)}
                    disabled={!dayInfo.isAvailable}
                    className={`aspect-square rounded-lg text-xs font-medium transition-all ${!dayInfo.isCurrentMonth ? 'text-gray-700' : ''} ${dayInfo.isAvailable ? 'text-white hover:opacity-80' : 'text-gray-600 cursor-not-allowed'}`}
                    style={{
                        backgroundColor: selectedDate?.toDateString() === dayInfo.date.toDateString() ? primaryColor : 'transparent',
                        boxShadow: dayInfo.isToday ? `0 0 0 1px ${primaryColor}` : 'none'
                    }}
                >
                    {dayInfo.date.getDate()}
                </button>
            ))}
        </div>
    </motion.div>
);

export default TurneroCalendar;
