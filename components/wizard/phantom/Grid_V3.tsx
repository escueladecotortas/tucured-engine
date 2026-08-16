"use client";

import { motion } from "framer-motion";
import { Check, ShieldCheck, Zap } from "lucide-react";

export const Grid_V3 = () => {
  const BENEFITS = [
    { 
      title: "PROPIEDAD ABSOLUTA", 
      desc: "No sos un perfil en una red social. Sos dueño de tu dominio y tus datos.",
      icon: ShieldCheck
    },
    { 
      title: "CONTACTO DIRECTO", 
      desc: "Sin intermediarios. Tus clientes te escriben directo a tu WhatsApp.",
      icon: Zap
    },
    { 
      title: "DISEÑO EDITORIAL", 
      desc: "Estética High-End que transmite confianza y seriedad profesional.",
      icon: Check
    }
  ];

  return (
    <section className="w-full bg-[#1A1A1A] py-24 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {BENEFITS.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="border-l-2 border-[#FF2A2A] pl-6 py-2"
          >
            <item.icon className="text-[#F5F5F0] w-8 h-8 mb-4" />
            <h3 className="text-[#F5F5F0] font-bold text-xl uppercase mb-2">{item.title}</h3>
            <p className="text-[#F5F5F0]/60 text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
