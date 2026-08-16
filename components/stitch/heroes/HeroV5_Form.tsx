'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VIBE_STYLES } from '@/app/stitch-library/constants';

interface HeroV5Props {
    title?: string; benefits?: string[]; formTitle?: string; formSubtitle?: string; formCta?: string;
    backgroundImage?: string; ratingText?: string; vibe?: string; whatsappNumber?: string;
}

export const HeroV5_Form = ({ 
  title = "Título Pendiente", benefits = ["Beneficio 1", "Beneficio 2", "Beneficio 3"],
  formTitle = "Consultanos", formSubtitle = "Dejanos tus datos y te contactamos.",
  formCta = "Enviar Consulta", backgroundImage, ratingText = "Más de 500 clientes felices",
  vibe = '1', whatsappNumber = '549381000000'
}: HeroV5Props) => {
  const styles = VIBE_STYLES[vibe] || VIBE_STYLES['1'];
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) return alert("Debes aceptar los términos y condiciones.");
    setLoading(true);
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        await fetch(`${apiUrl}/api/leads`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: formData.name, phone: formData.phone, email: formData.email, context: title, source: 'tucu_red_landing_v5' })
        });
    } catch (err) { console.error("⚠️ Lead persistence failed:", err); } finally { setLoading(false); }
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hola! Soy ${formData.name}. Mi email es ${formData.email}. Quería consultar por: ${title}`)}`, '_blank');
  };

  return (
    <section className="relative min-h-[90vh] flex items-center bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url('${backgroundImage || 'https://source.unsplash.com/random/1920x1080/?beauty'}' )` }}>
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-[2px]"></div>
      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
        <div className="text-white flex flex-col justify-center order-1 lg:order-1">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mb-6"><span className="text-yellow-400 text-2xl">★★★★★</span><span className="text-sm font-medium opacity-80 uppercase tracking-widest">{ratingText}</span></motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-black mb-8 leading-[0.9] tracking-tighter">{title}</motion.h1>
            <ul className="space-y-4 mb-4 text-lg opacity-90">
                {benefits.map((benefit, i) => (
                    <motion.li key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (i * 0.1) }} className="flex items-center gap-3 font-medium">
                        <svg className={`w-6 h-6 ${styles.accent}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>{benefit}
                    </motion.li>
                ))}
            </ul>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto w-full border-t-8 order-2 lg:order-2" style={{ borderColor: styles.primary }}>
            <h3 className="text-3xl font-bold text-gray-900 mb-2 text-center tracking-tight">{formTitle}</h3>
            <p className="text-gray-500 text-center mb-8 text-sm">{formSubtitle}</p>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div><label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wider">Tu Nombre</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 outline-none font-medium text-gray-900" style={{ '--tw-ring-color': styles.primary } as any} placeholder="Ej: Juan Pérez" /></div>
                <div><label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wider">WhatsApp / Tel</label><input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 outline-none font-medium text-gray-900" style={{ '--tw-ring-color': styles.primary } as any} placeholder="+54 381 ..." /></div>
                <div><label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wider">Email Profesional</label><input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 outline-none font-medium text-gray-900" style={{ '--tw-ring-color': styles.primary } as any} placeholder="tu@empresa.com" /></div>
                <div className="flex items-start gap-3 pt-2"><input type="checkbox" id="terms" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-1 w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /><label htmlFor="terms" className="text-xs text-gray-500 leading-snug">Acepto los <a href="/terminos" target="_blank" className="font-bold underline hover:text-gray-900">Términos y Condiciones</a>.</label></div>
                <button type="submit" className="w-full text-white font-bold py-5 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-lg text-lg uppercase mt-2" style={{ backgroundColor: styles.primary }}>{loading ? 'Procesando...' : formCta}</button>
                <p className="text-xs text-center text-gray-400 mt-6">🔒 Tus datos viajan seguros a nuestro WhatsApp.</p>
            </form>
        </motion.div>
      </div>
    </section>
  );
};
