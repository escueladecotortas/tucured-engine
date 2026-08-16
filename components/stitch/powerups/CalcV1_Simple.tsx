'use client';

import React, { useState } from 'react';
import { Calculator, Send } from 'lucide-react';

/**
 * POWER-UP: Calculator Budget Simple
 * Enfoque: Generación de Leads Calificados (Presupuesto)
 */

interface CalcV1Props {
    title?: string;
    description?: string;
    unitPrice?: number;
    unitName?: string;
    serviceName?: string;
    whatsappNumber?: string;
    primaryColor?: string;
}

export const CalcV1_Simple = ({
    title = "Cotizador Online",
    description = "Obtené un estimado inmediato según tus medidas.",
    unitPrice = 1500,
    unitName = "m2",
    serviceName = "Servicio General",
    whatsappNumber = "549381000000",
    primaryColor = "#2563EB"
}: CalcV1Props) => {

    const [inputValue, setInputValue] = useState<number | ''>('');
    const [result, setResult] = useState(0);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setInputValue(isNaN(val) ? '' : val);
        setResult(isNaN(val) ? 0 : val * unitPrice);
    };

    const handleSend = () => {
        if (!inputValue || inputValue <= 0) return;
        
        const message = `Hola! Hice una cotización en la web.\n\n🛠️ *Servicio:* ${serviceName}\n📏 *Cantidad:* ${inputValue} ${unitName}\n💰 *Estimado:* $${result.toLocaleString()}\n\nQuisiera coordinar una visita.`;
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <section className="py-16 bg-gray-50 flex justify-center">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="text-center mb-8">
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-opacity-10" style={{ backgroundColor: primaryColor, color: primaryColor }}>
                            Cotizador Online
                        </span>
                        <h2 className="text-2xl font-bold mt-3 text-gray-800">{title}</h2>
                        <p className="text-gray-500 text-sm mt-2">{description}</p>
                    </div>

                    <div className="space-y-6">
                        {/* Input */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Cantidad ({unitName})</label>
                            <div className="flex items-center">
                                <div className="pl-4 py-4 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-gray-400">
                                    <Calculator size={20}/>
                                </div>
                                <input 
                                    type="number" 
                                    value={inputValue}
                                    onChange={handleInput}
                                    className="w-full p-4 border border-gray-200 rounded-r-xl focus:ring-2 outline-none text-lg font-bold text-gray-800"
                                    placeholder="10"
                                    style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                                />
                            </div>
                        </div>

                        {/* Result */}
                        <div className="p-6 rounded-xl text-center border border-opacity-20 bg-opacity-5" style={{ backgroundColor: primaryColor, borderColor: primaryColor }}>
                            <p className="text-gray-500 text-xs uppercase font-bold mb-1">Presupuesto Estimado</p>
                            <p className="text-4xl font-black" style={{ color: primaryColor }}>
                                ${result.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">*Precio referencial, sujeto a visita técnica.</p>
                        </div>

                        {/* CTA */}
                        <button 
                            onClick={handleSend}
                            disabled={!inputValue || inputValue <= 0}
                            className="w-full text-white font-bold py-4 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Contratar Ahora
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
