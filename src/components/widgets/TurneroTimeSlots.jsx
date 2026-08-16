// Archivo: frontend/src/components/widgets/TurneroTimeSlots.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const TurneroTimeSlots = ({ selectedDate, timeSlots, selectedTime, onTimeSelect, primaryColor }) => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
        <div className="mb-3 text-center">
            <p className="text-xs text-gray-400">
                {selectedDate?.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
        </div>
        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
            {timeSlots.map(time => (
                <button
                    key={time}
                    onClick={() => onTimeSelect(time)}
                    className={`py-2 rounded-lg text-xs font-medium transition-all ${selectedTime === time ? 'text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                    style={{ backgroundColor: selectedTime === time ? primaryColor : undefined }}
                >
                    <Clock size={12} className="inline mr-1" /> {time}
                </button>
            ))}
        </div>
    </motion.div>
);

export default TurneroTimeSlots;
