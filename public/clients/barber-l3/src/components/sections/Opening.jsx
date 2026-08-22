// Archivo: src/components/sections/Opening.jsx
// v11.70-PLATINUM — Bloque bordó con texto blanco, zero gray
import React from "react";

/**
 * OPENING SECTION - BRUTALISMO URBANO v11.70
 * Bloque de alta tensión: fondo bordó (#800000) con texto blanco.
 * Comunicación directa del estreno. Zero gray enforced.
 */
export default function Opening() {
  return (
    <section className="w-full border-b-4 border-black bg-[#800000] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Grid sutil negro */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `linear-gradient(to right, #000000 1px, transparent 1px), linear-gradient(to bottom, #000000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-4 border-black shadow-[8px_8px_0px_0px_#000000]">

          {/* Bloque Izquierdo: Identificación */}
          <div className="lg:col-span-4 bg-black p-8 flex flex-col justify-between border-b-4 lg:border-b-0 lg:border-r-4 border-[#800000] relative">
            <span className="absolute top-2 left-2 font-mono text-xs text-[#800000] font-black">└┐</span>
            <span className="absolute bottom-2 right-2 font-mono text-xs text-[#800000] font-black">┌┘</span>

            <div>
              <span className="inline-block bg-[#800000] text-white font-mono text-[10px] font-black px-3 py-1 uppercase tracking-widest mb-4 border-2 border-white">
                AVISO MANDATORIO
              </span>
              <h2 className="text-3xl sm:text-4xl font-mono font-black text-white uppercase tracking-tighter leading-tight">
                ESTRENO OFICIAL
              </h2>
              <p className="font-mono text-[11px] text-white/60 uppercase tracking-widest mt-3 font-black">
                CIUDAD UNIVERSITARIA
              </p>
            </div>

            <div className="pt-8">
              <div className="bg-[#800000] border-2 border-white px-4 py-3 shadow-[4px_4px_0px_#800000]">
                <span className="block text-[9px] text-white/60 font-mono uppercase tracking-widest font-black">
                  Ubicación Asignada
                </span>
                <span className="block text-white font-mono font-black text-[11px] uppercase tracking-wider mt-1">
                  FADU // PABELLÓN 3
                </span>
              </div>
            </div>
          </div>

          {/* Bloque Derecho: Mensaje + Horarios */}
          <div className="lg:col-span-8 bg-[#800000] p-8 sm:p-12 flex flex-col justify-between relative">
            {/* Marcas de corte */}
            <div className="absolute top-0 right-12 w-[2px] h-4 bg-white" />
            <div className="absolute bottom-0 right-12 w-[2px] h-4 bg-white" />

            <div className="space-y-6 max-w-2xl">
              <p className="text-xl sm:text-3xl font-mono font-black text-white uppercase tracking-tight leading-snug border-l-4 border-black pl-4">
                &quot;PASÁ EL VIERNES. FORMÁ PARTE DEL CIMIENTO. ESTRENO DE FACHADA EN San Miguel de Tucumán.&quot;
              </p>

              <p className="font-mono text-xs sm:text-sm text-white/80 uppercase tracking-wide leading-relaxed">
                La estructura deja de ser un render para convertirse en materia viva. Un hito arquitectónico y estético pensado para la comunidad universitaria.
              </p>
            </div>

            {/* Bloque de Horarios — Bordó fondo, texto blanco explícito */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { dia: 'LUN — VIE', horario: '10:00 — 20:00' },
                { dia: 'SÁBADOS', horario: '10:00 — 18:00' },
                { dia: 'DOMINGOS', horario: 'CERRADO' },
              ].map((item) => (
                <div
                  key={item.dia}
                  className="bg-black border-2 border-white px-4 py-4 shadow-[4px_4px_0px_#000000]"
                >
                  <p className="text-[9px] text-white/50 font-mono font-black uppercase tracking-[0.4em]">
                    {item.dia}
                  </p>
                  <p className="text-[14px] text-white font-mono font-black uppercase tracking-tight mt-1">
                    {item.horario}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest font-black">
            // SECCIÓN 02: COMUNICACIÓN ESTRUCTURAL v11.70
          </span>
        </div>
      </div>
    </section>
  );
}
