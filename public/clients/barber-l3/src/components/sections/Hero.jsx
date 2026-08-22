// Archivo: src/components/sections/Hero.jsx
"use client";
import Image from "next/image";

/**
 * HERO SECTION - V11 ELEGANT
 * Rediseño minimalista y de alta gama con el logo circular oficial de la marca,
 * tipografía estilizada y acceso directo a la terminal de reservas.
 */
export default function Hero({ onOpenBooking }) {
  return (
    <section className="relative w-full pt-32 pb-12 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
      {/* Estilos locales para el logo responsivo y la estética V11 */}
      <style jsx>{`
        .hero-title {
          font-family: var(--font-hanken), sans-serif;
        }
        @media (max-width: 767px) {
          .mobile-logo-wrapper {
            max-width: 140px !important;
            margin-top: 40px !important;
          }
        }
      `}</style>

      {/* Header Fijo Transparente Superior */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-transparent border-b border-transparent">
        <div className="flex justify-between items-center h-16 px-4 md:px-8 max-w-6xl mx-auto">
          {/* Brand */}
          <a className="font-black text-lg md:text-xl uppercase tracking-[0.4em] text-[#800000]" href="#">
            Nexus Barber L3
          </a>
          {/* Acción Rápida */}
          <div>
            <button
              onClick={onOpenBooking}
              className="bg-[#800000] text-white px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-bold uppercase tracking-widest hover:opacity-90 shadow-lg shadow-[#800000]/20 transition-all cursor-pointer"
            >
              RESERVAR
            </button>
          </div>
        </div>
      </header>

      {/* Contenedor del Logo Circular */}
      <div className="mobile-logo-wrapper w-full max-w-[280px] md:max-w-[320px] mb-8 relative">
        <div className="aspect-square relative w-full rounded-full border-2 border-white overflow-hidden shadow-xl">
          <Image
            src="/assets/images/logo_barber-l3-barberia-unisex.jpeg"
            alt="Nexus Barber L3 Barbería Unisex Logo"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 280px, 320px"
          />
        </div>
      </div>

      {/* Textos Principales */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="hero-title text-3xl md:text-4xl lg:text-5xl font-black text-[#800000] uppercase tracking-[0.4em] mb-4">
          Nexus Barber L3
        </h1>
        <p className="text-xs md:text-sm text-neutral-600 font-bold tracking-[0.2em] uppercase">
          San Miguel de Tucumán
        </p>
      </div>

      {/* Línea Divisoria Sutil */}
      <div className="w-full h-px bg-neutral-300/40 max-w-2xl mx-auto my-8"></div>
    </section>
  );
}
