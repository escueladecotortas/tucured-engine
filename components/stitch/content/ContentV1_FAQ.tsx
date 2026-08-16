'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

/**
 * WIDGET: FAQ Accordion
 * Enfoque: Resolver dudas y SEO.
 */

interface FAQItem {
    q: string;
    a: string;
}

export const ContentV1_FAQ = ({
    questions = [
        { q: "¿Cuáles son los medios de pago?", a: "Aceptamos todas las tarjetas de crédito, débito y transferencias bancarias." },
        { q: "¿Hacen envíos a todo el país?", a: "Sí, despachamos a domicilio a través de Andreani o Correo Argentino." },
        { q: "¿Tienen garantía?", a: "Absolutamente. Todos nuestros trabajos cuentan con 6 meses de garantía escrita." }
    ]
}: { questions?: FAQItem[] }) => {
    
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-3xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
                <div className="space-y-4">
                    {questions.map((item, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                            <button 
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex justify-between items-center p-6 text-left font-bold text-gray-800 hover:bg-gray-50 transition-colors"
                            >
                                {item.q}
                                {openIndex === idx ? <Minus className="text-[var(--primary)] shrink-0"/> : <Plus className="text-gray-400 shrink-0"/>}
                            </button>
                            <div 
                                className={`bg-gray-50 text-gray-600 transition-all duration-300 ease-in-out px-6 ${openIndex === idx ? 'max-h-48 py-6 opacity-100' : 'max-h-0 py-0 opacity-0'}`}
                            >
                                {item.a}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
