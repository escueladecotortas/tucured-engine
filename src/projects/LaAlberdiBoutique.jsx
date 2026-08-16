import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBasket, Truck, Star, ShieldCheck, Instagram, MessageCircle } from 'lucide-react';

const LaAlberdiBoutique = () => {
  return (
    <div className="min-h-screen bg-[var(--color-nexus-bg)] font-[var(--font-inter)] text-[var(--color-text-primary)]">
      
      {/* 🌌 HERO SECTION: VIBRACIÓN 9 (MISTERIO/LUJO) */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden border-b border-[var(--color-glass-border)]">
        {/* Fondo Cinemático con Gradiente de Profundidad */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#030014] via-[#0A0A1A] to-[#111122]">
            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
            {/* Círculo de Luz Cyan Sutil (Glow) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-nexus-cyan)]/10 rounded-full blur-[120px]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <span className="badge badge-info mb-6 animate-fadeIn">Vibración 9 • Boutique Selección</span>
          <h1 className="text-6xl md:text-8xl font-[var(--font-outfit)] font-extrabold tracking-tighter mb-6">
            <span className="text-gradient">La Alberdi</span><br/>
            <span className="text-[var(--color-text-secondary)]">Almacén</span>
          </h1>
          <p className="text-xl md:text-2xl text-[var(--color-text-muted)] mb-10 max-w-2xl mx-auto leading-relaxed">
            Curaduría de sabores frescos y productos premium en el corazón de San Miguel de Tucumán.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="glass-panel hover-lift text-glow px-10 py-4 rounded-xl flex items-center justify-center gap-3 font-bold bg-[var(--color-nexus-cyan)]/10">
              <MessageCircle size={20} />
              Hacer Pedido Online
            </button>
            <button className="px-10 py-4 rounded-xl flex items-center justify-center gap-3 font-semibold border border-[var(--color-glass-border)] hover:bg-white/5 transition-colors">
              Ver Selección de Temporada
            </button>
          </div>
        </motion.div>
      </section>

      {/* 💎 SECCIÓN DE VALORES: GLASSMORPHISM & MICRO-INTERACTIONS */}
      <section className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <Star className="text-[var(--color-nexus-cyan)]" />, title: "Calidad 9/9", desc: "Seleccionamos cada pieza personalmente para asegurar la excelencia." },
          { icon: <Truck className="text-[var(--color-nexus-purple)]" />, title: "Envío Boutique", desc: "Logística propia para que tus productos lleguen impecables." },
          { icon: <ShieldCheck className="text-[var(--color-success)]" />, title: "Origen Garantizado", desc: "Trazabilidad directa desde los mejores productores regionales." }
        ].map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className="glass-panel p-10 rounded-3xl hover-glow group"
          >
            <div className="mb-6 bg-white/5 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
              {item.icon}
            </div>
            <h3 className="text-2xl font-[var(--font-outfit)] font-bold mb-4">{item.title}</h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* 🏪 CTA FINAL: SOBERANÍA DIGITAL */}
      <footer className="py-20 border-t border-[var(--color-glass-border)] text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">¿Buscás algo especial?</h2>
          <p className="text-[var(--color-text-muted)] mb-8">Estamos en Juan Bautista Alberdi 99. Calidad real para gente real.</p>
          <div className="flex justify-center gap-6">
            <a href="#" className="p-3 glass-panel rounded-full hover-lift"><Instagram size={24} /></a>
            <a href="#" className="p-3 glass-panel rounded-full hover-lift"><MessageCircle size={24} /></a>
          </div>
          <p className="mt-12 text-xs text-[var(--color-text-disabled)] font-mono">NEXUS PRO // EESTÉTICA VIVA v1.0</p>
        </div>
      </footer>
    </div>
  );
};

export default LaAlberdiBoutique;
