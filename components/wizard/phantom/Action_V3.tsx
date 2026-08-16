"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface ActionProps {
    data: {
        whatsapp_number: string;
    };
}

export const Action_V3 = ({ data }: ActionProps) => {
    const [status, setStatus] = useState<'IDLE' | 'CLAIMING'>('IDLE');

    const handleClaim = () => {
        setStatus('CLAIMING');
        // Mensaje: "Hola Tucu Red, vi mi sitio demo y quiero activarlo ya."
        const text = encodeURIComponent(`Hola *Tucu Red*, estoy viendo mi demo y ME INTERESA activar el Plan Semilla. Mis datos ya están cargados. ¿Cómo sigo?`);
        window.open(`https://wa.me/${data.whatsapp_number}?text=${text}`, '_blank');
        setTimeout(() => setStatus('IDLE'), 2000);
    };

    return (
        <section className="w-full bg-[#1A1A1A] py-32 px-6 flex flex-col items-center text-center relative overflow-hidden">
            {/* Atmosfera */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[#FF2A2A]" />
            
            <h2 className="text-white text-5xl md:text-7xl font-black uppercase mb-8 tracking-tighter leading-none">
                ¿TE GUSTA LO <span className="text-[#FF2A2A]">QUE VES?</span>
            </h2>
            <p className="max-w-xl text-white/60 text-lg mb-16 uppercase font-bold tracking-widest">
                Tu marca merece este nivel de soberanía digital. <br/>
                Sin esperas. Llave en mano.
            </p>

            <motion.div
                className="bg-white p-12 shadow-[30px_30px_0px_0px_rgba(255,42,42,0.1)] max-w-lg w-full border-2 border-[#1A1A1A] relative"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
            >
                {/* Badge de Urgencia */}
                <div className="absolute -top-4 -right-4 bg-[#FF2A2A] text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest rotate-3 shadow-xl">
                    Oferta de Lanzamiento
                </div>

                <div className="flex flex-col gap-2 mb-10 border-b-2 border-gray-100 pb-8 text-left">
                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">Plan Semilla 2026</span>
                    <div className="flex items-baseline gap-4">
                        <span className="text-4xl font-black text-[#1A1A1A]">AR$ 75.000</span>
                        <span className="text-sm text-gray-300 line-through font-bold">AR$ 120.000</span>
                    </div>
                </div>

                <button 
                    onClick={handleClaim}
                    disabled={status === 'CLAIMING'}
                    className="w-full bg-[#FF2A2A] text-white py-6 text-xs font-black uppercase tracking-[0.4em] hover:bg-[#1A1A1A] transition-all disabled:opacity-50 shadow-lg"
                >
                    {status === 'CLAIMING' ? 'INICIANDO PROCESO...' : 'ACTIVAR SOBERANÍA'}
                </button>

                <p className="text-[10px] text-gray-400 mt-6 uppercase font-black tracking-widest">
                    *PRECIO PROTEGIDO POR 24HS
                </p>
            </motion.div>

        </section>
    );
};
