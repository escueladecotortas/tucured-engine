'use client';

import React from 'react';

/**
 * WIDGET: Contact Form Builder
 * Enfoque: Formularios de contacto avanzados.
 */

export const FormV2_Builder = ({ data = {} }: { data?: any }) => {
    const title = data.title || 'Inicia tu Ascenso Digital';
    const fields = data.fields || [
        { label: 'Nombre', type: 'text', placeholder: 'Leo' },
        { label: 'Email', type: 'email', placeholder: 'leo@nexus.ar' },
        { label: 'Mensaje', type: 'textarea', placeholder: 'Háblanos de tu visión...' }
    ];

    return (
        <section className="py-20 bg-slate-950 relative overflow-hidden">
            {/* Atmosferas Atenea */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 max-w-2xl relative z-10">
                <div className="bg-slate-900/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                    <span className="text-[10px] font-black tracking-[0.4em] text-indigo-400 uppercase mb-4 block">Lead Acquisition System</span>
                    <h3 className="text-3xl font-bold text-white mb-8 tracking-tighter italic">{title}</h3>
                    
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {fields.slice(0, 2).map((field: any, i: number) => (
                                <div key={i}>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">{field.label}</label>
                                    <input 
                                        type={field.type} 
                                        placeholder={field.placeholder} 
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-white placeholder:text-slate-700" 
                                    />
                                </div>
                            ))}
                        </div>
                        
                        {fields.length > 2 && (
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">{fields[2].label}</label>
                                <textarea 
                                    placeholder={fields[2].placeholder} 
                                    rows={4} 
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-white placeholder:text-slate-700"
                                ></textarea>
                            </div>
                        )}
                        
                        <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all uppercase tracking-widest text-[12px] group">
                            Enviar Señal
                            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};
