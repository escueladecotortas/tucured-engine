// Archivo: src/components/sections/Concept.jsx
"use client";
import Image from "next/image";
import useIntersection from "@/hooks/useIntersection";

/**
 * CONCEPT SECTION - BRUTALISMO URBANO (V4)
 * Manifiesto matérico que concibe la peluquería como una intervención estructural.
 * Muestra imagen tratada técnicamente y especificaciones de diseño.
 * Tono directo, sin verso, estilo rapero/callejero argentino.
 */
export default function Concept() {
  const [ref, isVisible] = useIntersection({ 
    threshold: 0.3, 
    mobileThreshold: 0.6,
    once: true 
  });

  return (
    <section id="concepto" className="border-b-2 border-ink bg-cement py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden blueprint-grid">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Columna Izquierda: Manifiesto y Cota */}
        <div className="md:col-span-7 space-y-6">
          <div className="inline-block bg-ink text-white font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest border border-ink">
            IDENTIDAD // AL HUESO
          </div>

          <div className="space-y-2 border-l-4 border-alert pl-4">
            <h2 className="text-4xl sm:text-6xl font-mono font-black text-ink uppercase tracking-tighter leading-none">
              TU FACHADA, TU IDENTIDAD.
            </h2>
            <p className="font-mono text-xs text-alert font-bold uppercase tracking-widest block">
              CONSTRUCCIÓN DE ESTILO SIN FILTROS.
            </p>
          </div>

          <p className="font-mono text-sm sm:text-base text-ink uppercase leading-relaxed bg-white/80 p-4 border-2 border-ink font-black shadow-[4px_4px_0px_0px_#000000]">
            &quot;TU FACHADA, TU IDENTIDAD. CONSTRUCCIÓN DE ESTILO SIN FILTROS. ACÁ TE TIRAMOS UN CORTE PRECISO, TÉCNICO Y SIN VUELTAS. EL BLOQUE ESTÁ ACTIVO EN EL PABELLÓN 3 DE LA FADU. CAÉ COMO SOS, SALÍS CON TU IDENTIDAD EXPLOTADA AL FRENTE. VISITANOS.&quot;
          </p>

          {/* Tags Técnicos de Calle */}
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="brutal-badge">#ESTRUCTURA</span>
            <span className="brutal-badge bg-white text-ink">#ESTILO</span>
            <span className="brutal-badge bg-alert text-white">#SINVUELTAS</span>
            <span className="brutal-badge bg-white text-ink">#FADU</span>
          </div>
        </div>

        {/* Columna Derecha: Imagen de Intervención Tratada */}
        <div className="md:col-span-5 flex justify-center">
          <div 
            ref={ref}
            className="relative w-full max-w-sm aspect-[4/5] border-2 border-ink bg-white p-3 shadow-[8px_8px_0px_0px_#000000] group rounded-none"
          >
            {/* Esquinas de registro */}
            <span className="absolute top-1 left-1 font-mono text-[9px] text-ink font-bold">┌</span>
            <span className="absolute bottom-1 right-1 font-mono text-[9px] text-ink font-bold">┘</span>

            <div className="w-full h-full relative border border-ink bg-cement/20 overflow-hidden rounded-none">
              <Image
                src="/assets/images/Imagen 1.jpg"
                alt="Intervención Matérica Experiencia"
                fill
                className={`object-cover mix-blend-luminosity contrast-125 transition-all duration-1000 ease-in-out group-hover:mix-blend-normal ${
                  isVisible ? "scale-100 opacity-100" : "scale-110 opacity-40"
                }`}
                sizes="(max-width: 768px) 100vw, 400px"
              />
              {/* Cota superpuesta indicando altura */}
              <div className="absolute top-4 right-4 bg-ink text-white font-mono text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wider opacity-80">
                ELEV: +3.20M
              </div>
            </div>

            <div className="mt-2 text-center font-mono text-[9px] font-bold text-ink uppercase tracking-widest border-t border-ink/20 pt-1">
              FIG. 1: EL BLOQUE // FADU PAB. 3
            </div>
          </div>
        </div>

        {/* Cierre condicional o nota de diseño */}
      </div>
    </section>
  );
}
