// Archivo: frontend/src/components/widgets/useTurnero.js
import { useState, useMemo } from 'react';

export const DEFAULT_CONFIG = {
    businessName: 'Mi Negocio',
    whatsappNumber: '',
    workDays: [1, 2, 3, 4, 5, 6],
    startHour: 9,
    endHour: 20,
    slotDuration: 60,
    blockedDays: [],
};

const generateTimeSlots = (startHour, endHour, duration) => {
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
        for (let min = 0; min < 60; min += duration) {
            if (hour + min / 60 >= endHour) break;
            slots.push(`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
        }
    }
    return slots;
};

export const useTurnero = (config = {}) => {
    const settings = { ...DEFAULT_CONFIG, ...config };
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [clientName, setClientName] = useState('');
    const [step, setStep] = useState('date');
    const [isConfirmed, setIsConfirmed] = useState(false);

    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const days = [];
        const startPadding = firstDay.getDay();
        for (let i = startPadding - 1; i >= 0; i--) {
            days.push({ date: new Date(year, month, -i), isCurrentMonth: false, isPast: true });
        }
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const d = new Date(year, month, day);
            const isPast = d < today;
            const isWorkDay = settings.workDays.includes(d.getDay());
            const isBlocked = settings.blockedDays.some(bd => new Date(bd).toDateString() === d.toDateString());
            days.push({ date: d, isCurrentMonth: true, isPast, isAvailable: !isPast && isWorkDay && !isBlocked, isToday: d.toDateString() === today.toDateString() });
        }
        const endPadding = 42 - days.length;
        for (let i = 1; i <= endPadding; i++) {
            days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false, isPast: false });
        }
        return days;
    }, [currentMonth, settings.workDays, settings.blockedDays]);

    const timeSlots = useMemo(() => generateTimeSlots(settings.startHour, settings.endHour, settings.slotDuration), [settings]);

    return {
        settings, currentMonth, setCurrentMonth, selectedDate, setSelectedDate,
        selectedTime, setSelectedTime, clientName, setClientName, step, setStep,
        isConfirmed, setIsConfirmed, calendarDays, timeSlots
    };
};
