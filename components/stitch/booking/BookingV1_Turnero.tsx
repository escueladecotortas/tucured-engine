'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { BookingV1_Modal } from './BookingV1_Turnero_Modal';

interface BookingV1Props {
    title?: string;
    description?: string;
    ctaText?: string;
    whatsappNumber?: string;
    themeColor?: string;
}

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const WORK_DAYS = [1, 2, 3, 4, 5, 6]; 
const START_HOUR = 10;
const END_HOUR = 20;

export const BookingV1_Turnero = ({
    title = "Reservá tu Turno",
    description = "Seleccioná el día y horario que mejor te convenga.",
    ctaText = "Ver Disponibilidad",
    whatsappNumber = "549381000000",
    themeColor = "#D4AF37"
}: BookingV1Props) => {

    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [clientName, setClientName] = useState('');

    const handleDateSelect = (day: number) => { setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day)); setStep(2); };
    const handleTimeSelect = (time: string) => { setSelectedTime(time); setStep(3); };

    const handleWhatsAppRedirect = () => {
        if (!selectedDate || !selectedTime) return;
        const dateStr = selectedDate.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
        const text = encodeURIComponent(`Hola! Quiero reservar turno para el ${dateStr} a las ${selectedTime} hs. Soy ${clientName || 'Cliente'}.`);
        window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
        setIsOpen(false); setStep(1);
    };

    const renderCalendarGrid = () => {
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        const days = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const today = new Date(); today.setHours(0,0,0,0);
        const grid = [];
        for (let i = 0; i < firstDay; i++) grid.push(<div key={`empty-${i}`} className="aspect-square" />);
        for (let day = 1; day <= days; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isPast = date < today; const isWorkDay = WORK_DAYS.includes(date.getDay());
            const isToday = date.toDateString() === today.toDateString();
            grid.push(
                <button key={day} disabled={isPast || !isWorkDay} onClick={() => handleDateSelect(day)}
                    className={`aspect-square rounded-lg text-sm font-medium transition-all flex items-center justify-center ${isToday ? `ring-2 font-bold` : ''} ${!isPast && isWorkDay ? `hover:text-white bg-gray-100 text-gray-800 hover:cursor-pointer` : 'text-gray-300 cursor-not-allowed opacity-50'}`}
                    style={{ borderColor: (!isPast && isWorkDay && !isToday) ? themeColor : undefined, ...(isToday ? { '--tw-ring-color': themeColor } as any : {}) }}
                >{day}</button>
            );
        }
        return grid;
    };

    return (
        <section className="py-24 px-4 bg-white text-center border-t border-gray-100">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <h2 className="text-3xl md:text-5xl font-black mb-6 text-gray-900 tracking-tighter">{title}</h2>
                    <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">{description}</p>
                    <button onClick={() => setIsOpen(true)} className="text-white font-bold py-5 px-10 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all text-lg flex items-center justify-center gap-3 mx-auto" style={{ backgroundColor: themeColor }}><Calendar size={24} />{ctaText}</button>
                </motion.div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <BookingV1_Modal step={step} setStep={setStep} currentDate={currentDate} setCurrentDate={setCurrentDate} selectedDate={selectedDate} selectedTime={selectedTime} clientName={clientName} setClientName={setClientName} handleDateSelect={handleDateSelect} handleTimeSelect={handleTimeSelect} handleWhatsAppRedirect={handleWhatsAppRedirect} renderCalendarGrid={renderCalendarGrid} renderTimeSlots={() => Array.from({length: END_HOUR-START_HOUR}, (_, i) => { const t = `${(START_HOUR+i).toString().padStart(2,'0')}:00`; return <button key={t} onClick={() => handleTimeSelect(t)} className="p-3 bg-gray-50 rounded-xl hover:bg-black hover:text-white transition-all text-gray-700 font-medium">{t}</button>; })} setIsOpen={setIsOpen} themeColor={themeColor} MONTHS={MONTHS} />
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};
