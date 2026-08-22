"use client";

// Archivo: src/app/invitacion/page.jsx
import React, { useState, useEffect } from "react";
import VariantStreet from "./components/VariantStreet";
import VariantMinimal from "./components/VariantMinimal";
import VariantGabi from "./components/VariantGabi";

export default function InvitationPage() {
  const [activeVariant, setActiveVariant] = useState("gabi"); // Persistencia enfocada en la Variante C (Físico Gabi) por defecto
  const [isCleanView, setIsCleanView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("clean") === "true") {
        setIsCleanView(true);
      }
      const variantParam = searchParams.get("variant");
      if (variantParam === "street" || variantParam === "minimal" || variantParam === "gabi") {
        setActiveVariant(variantParam);
      }
      setIsLoaded(true);
    }
  }, []);

  // Lógica de WhatsApp pre-codificado para RSVP directo
  const whatsappNumber = "5491134294848";
  const rawMessage = "¡Hola! Confirmo mi asistencia para el brindis de inauguración de Nexus Barber L3 este viernes 🥂";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(rawMessage)}`;

  // Disparador interactivo de exportación binaria en alta definición
  const handleExportHD = async () => {
    setIsGenerating(true);
    try {
      // Inyección dinámica soberana de html2canvas si no está presente
      if (typeof window.html2canvas === "undefined") {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const element = document.getElementById("invitation-plate");
      if (!element) {
        setIsGenerating(false);
        return;
      }

      // Renderizar a lienzo garantizando escala HD y color de fondo nativo
      const canvas = await window.html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: activeVariant === "street" ? "#6A1B29" : "#FFFFFF"
      });

      const isGabi = activeVariant === "gabi";
      const mimeType = isGabi ? "image/jpeg" : "image/png";
      const dataUrl = canvas.toDataURL(mimeType, isGabi ? 0.95 : undefined);

      // Forzar Descarga Directa del archivo Binario con el nombre exacto solicitado por persistencia
      const link = document.createElement("a");
      link.download = isGabi ? "invitacion_final_gabi.jpg" : `La_Fachada_Invitacion_${activeVariant.toUpperCase()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Respaldo en nueva pestaña como visor de imagen pura
      const newTab = window.open("", "_blank");
      if (newTab) {
        newTab.document.write(`<!DOCTYPE html><html><head><title>Placa Exportada - Nexus Barber L3</title><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;background:#0A0A0A;display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:100vh;padding:20px;box-sizing:border-box;font-family:monospace;color:#fff;"><p style="margin-bottom:15px;font-size:12px;color:#888;">💡 Clic derecho en la imagen &gt; "Guardar imagen como..." para descargar el archivo físico</p><img src="${dataUrl}" style="max-width:100%;max-height:85vh;object-fit:contain;box-shadow:0 0 40px rgba(106,27,41,0.4);border:1px solid #6A1B29;" alt="Placa Invitacion" /></body></html>`);
        newTab.document.close();
      }
    } catch (err) {
      console.error("Error en exportación binaria:", err);
      alert("⚠️ Hubo un inconveniente al generar la imagen. Abriendo vista estanca de respaldo...");
      window.open(`?clean=true&variant=${activeVariant}`, "_blank");
    } finally {
      setIsGenerating(false);
    }
  };

  // Evitar destellos de UI durante la hidratación de rutas en el cliente
  if (!isLoaded) {
    return <div className="min-h-screen w-full bg-[#0A0A0A]" />;
  }

  // RENDER DE VISTA LIMPIA ESTANCA (?clean=true)
  if (isCleanView) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black overflow-hidden select-none">
        <div id="invitation-plate" className="w-[390px] h-[844px] shrink-0 box-border relative shadow-[0_0_50px_rgba(0,0,0,0.9)]">
          {activeVariant === "street" && <VariantStreet />}
          {activeVariant === "minimal" && <VariantMinimal />}
          {activeVariant === "gabi" && <VariantGabi />}
        </div>
      </div>
    );
  }

  // RENDER COMPLETO CON PANEL DE CONTROL PRINCIPAL
  return (
    <main className="min-h-screen w-full bg-[#0A0A0A] text-white flex flex-col items-center justify-start p-4 font-mono selection:bg-bordo selection:text-white pb-16">
      <header className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-bordo text-white font-bold text-[10px] px-2 py-0.5 tracking-widest uppercase">
              ACTIVOS [H-021]
            </span>
            <span className="text-zinc-400 text-xs font-mono">Render: 390px × 844px</span>
          </div>
          <h1 className="text-sm font-bold text-zinc-200 uppercase tracking-tight">
            Selector de Placa WhatsApp Oficial
          </h1>
        </div>

        {/* Pestañas de Conmutación */}
        <div className="flex flex-wrap items-center gap-1 bg-black p-1 border border-zinc-800">
          <button
            onClick={() => setActiveVariant("street")}
            className={`px-2.5 py-1.5 text-xs font-bold uppercase transition-all ${activeVariant === "street" ? "bg-bordo text-white shadow-sm" : "text-zinc-500 hover:text-white"}`}
          >
            A: Street
          </button>
          <button
            onClick={() => setActiveVariant("minimal")}
            className={`px-2.5 py-1.5 text-xs font-bold uppercase transition-all ${activeVariant === "minimal" ? "bg-white text-black shadow-sm" : "text-zinc-500 hover:text-white"}`}
          >
            B: Minimal
          </button>
          <button
            onClick={() => setActiveVariant("gabi")}
            className={`px-2.5 py-1.5 text-xs font-bold uppercase transition-all ${activeVariant === "gabi" ? "bg-amber-500 text-black shadow-sm font-black" : "text-zinc-500 hover:text-amber-500"}`}
          >
            C: Físico (Gabi)
          </button>
        </div>

        {/* Acciones de Asistencia y Descarga HD */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportHD}
            disabled={isGenerating}
            className={`border text-xs font-bold px-3 py-2 flex items-center gap-1.5 transition-all ${
              isGenerating
                ? "bg-bordo text-white border-bordo animate-pulse cursor-wait"
                : "bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-600"
            }`}
            title="Exportar placa binaria de alta fidelidad"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 shrink-0">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            <span>{isGenerating ? "Generando..." : "Descargar HD"}</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-bordo hover:bg-bordo/80 text-white text-xs font-bold px-3 py-2 border border-bordo/40 transition-colors flex items-center gap-1"
            title="Confirmar asistencia vía WhatsApp"
          >
            <span>RSVP</span>
            <span>↗</span>
          </a>
        </div>
      </header>

      {/* ÁREA DE EXPORTACIÓN ESTANCA */}
      <div className="w-full flex items-center justify-center overflow-auto p-2">
        <div id="invitation-plate" className="w-[390px] h-[844px] shrink-0 box-border relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.9)] transition-all duration-300">
          {activeVariant === "street" && <VariantStreet />}
          {activeVariant === "minimal" && <VariantMinimal />}
          {activeVariant === "gabi" && <VariantGabi />}
        </div>
      </div>

      {/* Pie Informativo Inferior */}
      <footer className="w-full max-w-4xl mt-4 text-center text-zinc-500 text-xs space-y-1">
        <p>Proporción estricta garantizada: <span className="text-zinc-300 font-bold">390px × 844px</span>. Dominancia cromática: <span className="text-bordo font-bold">#6A1B29</span>.</p>
        <p className="text-[11px] text-amber-500/90 font-bold">Persistencia Activa: Ensamblaje determinista de activo físico (Flyer Base + Máscara + Logo Oficial) configurado a invitacion_final_gabi.jpg.</p>
      </footer>
    </main>
  );
}
