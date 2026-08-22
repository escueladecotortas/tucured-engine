// Archivo: src/components/sections/Booking.jsx
"use client";
import React from "react";
import useIntersection from "@/hooks/useIntersection";
import NexusScheduler from "@/components/widgets/NexusScheduler";

/**
 * BOOKING SECTION - ALTA COSTURA BOUTIQUE (V11-ELEGANT)
 * Contenedor minimalista y sofisticado para el sistema de agendamiento.
 * Integra el scheduler sobre un lienzo lino blanco con sombra suave.
 */
export default function Booking({ selectedCategory }) {
  const [ref, isVisible] = useIntersection({ threshold: 0.1 });

  return (
    <section id="reservar" className="border-y border-neutral-200/60 bg-[#FAF9F6] py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl mx-auto relative z-10 space-y-12">
        
        {/* Cabecera Elegante */}
        <div className="text-center space-y-3">
          <div ref={ref} className="overflow-hidden py-1">
            <h2 className={`font-serif text-neutral-800 text-4xl sm:text-5xl md:text-6xl font-normal lowercase italic tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              agendar turno
            </h2>
          </div>

          <p className="font-sans text-xs tracking-widest text-neutral-400 uppercase">
            Selecciona tu servicio y reserva en tiempo real
          </p>
        </div>

        {/* Lienzo Blanco Elegante para el Scheduler */}
        <div className="border border-neutral-200/80 bg-white p-6 sm:p-10 shadow-sm rounded-none relative">
          <NexusScheduler initialCategoryId={selectedCategory} />
        </div>

      </div>
    </section>
  );
}

