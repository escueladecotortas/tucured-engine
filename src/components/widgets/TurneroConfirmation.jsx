// Archivo: frontend/src/components/widgets/TurneroConfirmation.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MessageCircle } from 'lucide-react';

const TurneroConfirmation = ({ selectedDate, selectedTime, clientName, setClientName, onConfirm, primaryColor }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
                <Calendar size={18} className="text-indigo-400" />
                <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Fecha</p>
                    <p className="text-sm text-white font-medium">{selectedDate?.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Clock size={18} className="text-indigo-400" />
                <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Hora</p>
                    <p className="text-sm text-white font-medium">{selectedTime} hs</p>
                </div>
            </div>
        </div>
        <div>
            <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Tu nombre (opcional)</label>
            <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Ej: María" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
        </div>
        <button onClick={onConfirm} style={{ backgroundColor: primaryColor }} className="w-full py-3 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-opacity">
            <MessageCircle size={18} /> Enviar a WhatsApp
        </button>
    </motion.div>
);

export default TurneroConfirmation;
