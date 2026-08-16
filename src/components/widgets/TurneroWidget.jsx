// Archivo: frontend/src/components/widgets/TurneroWidget.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, CheckCircle } from 'lucide-react';
import { useTurnero } from './useTurnero';
import TurneroCalendar from './TurneroCalendar';
import TurneroTimeSlots from './TurneroTimeSlots';
import TurneroConfirmation from './TurneroConfirmation';

/**
 * TurneroWidget Orchestrator
 * Complies with 200-line limit by delegating steps and logic
 */
export default function TurneroWidget({ config = {}, onBooking, compact = false, showHeader = true }) {
    const {
        settings, currentMonth, setCurrentMonth, selectedDate, setSelectedDate,
        selectedTime, setSelectedTime, clientName, setClientName, step, setStep,
        isConfirmed, setIsConfirmed, calendarDays, timeSlots
    } = useTurnero(config);

    const primaryColor = settings.primaryColor || '#6366f1';

    const handleConfirm = () => {
        if (!selectedDate || !selectedTime) return;
        const formattedDate = selectedDate.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
        const message = `Hola! 👋 Quiero reservar un turno en *${settings.businessName}*:\n\n📅 *Fecha:* ${formattedDate}\n🕐 *Hora:* ${selectedTime} hs\n${clientName ? `👤 *Nombre:* ${clientName}\n` : ''}\n¿Está disponible? Gracias! 🙏`;
        const waNumber = settings.whatsappNumber.replace(/\D/g, '');
        const waUrl = waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}` : `https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
        if (onBooking) onBooking({ date: selectedDate, time: selectedTime, clientName });
        setIsConfirmed(true);
        setTimeout(() => {
            setIsConfirmed(false);
            setStep('date');
            setSelectedDate(null);
            setSelectedTime(null);
            setClientName('');
        }, 3000);
    };

    if (isConfirmed) {
        return (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center p-8 text-center">
                <CheckCircle size={64} className="text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">¡Listo!</h3>
                <p className="text-gray-400 text-sm">Se abrió WhatsApp con tu solicitud de turno.</p>
            </motion.div>
        );
    }

    return (
        <div className={`bg-white/5 border border-white/10 rounded-xl overflow-hidden ${compact ? 'p-3' : 'p-4'}`}>
            {showHeader && (
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-indigo-400" />
                        <h3 className="text-sm font-bold text-white">Reservar Turno</h3>
                    </div>
                    {step !== 'date' && (
                        <button onClick={() => setStep(step === 'confirm' ? 'time' : 'date')} className="text-[10px] text-gray-500 hover:text-white flex items-center gap-1 uppercase tracking-widest font-bold">
                            <ChevronLeft size={14} /> Volver
                        </button>
                    )}
                </div>
            )}

            <AnimatePresence mode="wait">
                {step === 'date' && (
                    <TurneroCalendar
                        currentMonth={currentMonth} calendarDays={calendarDays} selectedDate={selectedDate}
                        onDateSelect={(d) => { setSelectedDate(d.date); setStep('time'); }}
                        onPrevMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                        onNextMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                        primaryColor={primaryColor}
                    />
                )}
                {step === 'time' && (
                    <TurneroTimeSlots
                        selectedDate={selectedDate} timeSlots={timeSlots} selectedTime={selectedTime}
                        onTimeSelect={(t) => { setSelectedTime(t); setStep('confirm'); }}
                        primaryColor={primaryColor}
                    />
                )}
                {step === 'confirm' && (
                    <TurneroConfirmation
                        selectedDate={selectedDate} selectedTime={selectedTime} clientName={clientName}
                        setClientName={setClientName} onConfirm={handleConfirm} primaryColor={primaryColor}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
