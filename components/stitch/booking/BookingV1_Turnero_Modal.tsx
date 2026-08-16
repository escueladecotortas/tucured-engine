'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ModalProps {
    step: number;
    setStep: (s: number) => void;
    currentDate: Date;
    setCurrentDate: (d: Date) => void;
    selectedDate: Date | null;
    selectedTime: string | null;
    clientName: string;
    setClientName: (n: string) => void;
    handleDateSelect: (day: number) => void;
    handleTimeSelect: (time: string) => void;
    handleWhatsAppRedirect: () => void;
    renderCalendarGrid: () => React.ReactNode;
    renderTimeSlots: () => React.ReactNode;
    setIsOpen: (o: boolean) => void;
    themeColor: string;
    MONTHS: string[];
}

export const BookingV1_Modal = ({
    step, setStep, currentDate, setCurrentDate, selectedDate, selectedTime,
    clientName, setClientName, handleDateSelect, handleTimeSelect, handleWhatsAppRedirect,
    renderCalendarGrid, renderTimeSlots, setIsOpen, themeColor, MONTHS
}: ModalProps) => {
    return (
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white text-gray-800 rounded-4xl w-full max-w-md p-8 shadow-2xl overflow-hidden"
        >
            <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900"><X size={24} /></button>
            <div className="flex items-center gap-3 mb-8" style={{ color: themeColor }}><Calendar size={28} /><h3 className="font-bold text-2xl text-gray-900">Reservar Turno</h3></div>

            {step === 1 && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft /></button>
                        <span className="font-bold text-lg capitalize text-gray-900">{MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight /></button>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center">{['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => <span key={d} className="text-xs font-bold text-gray-400 uppercase tracking-wider">{d}</span>)}</div>
                    <div className="grid grid-cols-7 gap-2">{renderCalendarGrid()}</div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6">
                    <div className="text-center"><p className="text-gray-400 text-sm uppercase tracking-widest font-bold mb-1">Fecha Seleccionada</p><h4 className="text-2xl font-black text-gray-900 capitalize mb-6">{selectedDate?.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</h4></div>
                    <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto custom-scrollbar">{renderTimeSlots()}</div>
                    <button onClick={() => setStep(1)} className="w-full py-3 text-gray-400 font-bold hover:text-gray-900">← Volver al Calendario</button>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                        <div className="flex items-start gap-4 mb-4"><div className="p-3 bg-white rounded-xl shadow-sm"><Calendar size={20} className="text-gray-400"/></div><div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Fecha</p><p className="font-bold text-gray-900 capitalize">{selectedDate?.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</p></div></div>
                        <div className="flex items-start gap-4"><div className="p-3 bg-white rounded-xl shadow-sm"><Clock size={20} className="text-gray-400"/></div><div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Hora</p><p className="font-bold text-gray-900">{selectedTime} hs</p></div></div>
                    </div>
                    <div className="space-y-2"><label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Tu Nombre (Opcional)</label><input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Juan Pérez" className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 outline-none font-medium text-gray-900" style={{ '--tw-ring-color': themeColor } as any} /></div>
                    <button onClick={handleWhatsAppRedirect} className="w-full bg-[#25D366] text-white font-bold py-5 rounded-xl hover:bg-[#20bd5a] flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all">COFIRMAR RESERVA <Check size={20} /></button>
                    <button onClick={() => setStep(2)} className="w-full py-3 text-gray-400 font-bold hover:text-gray-900">← Cambiar Hora</button>
                </div>
            )}
        </motion.div>
    );
};
