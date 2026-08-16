import { useState, useEffect } from 'react';

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    className?: string; // Add className support
}

export const PhoneInput = ({ value, onChange, className = '' }: PhoneInputProps) => {
    // Parser inicial (si viene un valor pegado)
    const [areaCode, setAreaCode] = useState('');
    const [number, setNumber] = useState('');

    useEffect(() => {
        // Intento básico de desglosar si ya viene cargado
        if (value && value.startsWith('+549')) {
            const raw = value.replace('+549', '');
            if (raw.length > 3 && !areaCode && !number) {
                 // Simple parser logic for display purposes if needed
                 // For now, let's just respect if user types
            }
        }
    }, []);

    const handleChange = (newArea: string, newNumber: string) => {
        setAreaCode(newArea);
        setNumber(newNumber);
        const cleanArea = newArea.replace(/^0/, '');
        const cleanNumber = newNumber.replace(/^15/, '');
        onChange(`+549${cleanArea}${cleanNumber}`);
    };

    return (
        <div className={`flex gap-2 w-full ${className}`}>
            <div className="flex items-center justify-center bg-white/5 border border-white/10 rounded-xl px-3 text-white/50 font-mono text-sm select-none">
                +54 9
            </div>
            <input
                type="tel"
                value={areaCode}
                onChange={(e) => handleChange(e.target.value.replace(/\D/g, '').slice(0, 4), number)}
                placeholder="Cód."
                className="w-20 bg-white/5 border border-white/10 rounded-xl py-3 px-3 text-white placeholder-white/20 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all text-center font-medium"
            />
            <input
                type="tel"
                value={number}
                onChange={(e) => handleChange(areaCode, e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Número (Sin 15)"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/20 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all font-medium"
            />
        </div>
    );
};
