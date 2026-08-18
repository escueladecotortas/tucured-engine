// Archivo: src/components/database/ProspectDocViewers.jsx
// Visores de DESIGN.md y stitch-manifest.json con Estado Vacío Inteligente (Ley de 200 líneas)

import React, { useState } from "react";
import { FileText, Layers, X, Info, Loader2, Sparkles } from "lucide-react";

const DocModal = ({ title, icon: Icon, color, content, isLoading, onClose }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
      <div className={`flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-${color}-500/5`}>
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 text-${color}-400`} />
          <span className={`text-${color}-300 font-bold text-sm font-mono`}>{title}</span>
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 transition-colors"><X className="w-4 h-4" /></button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
        {isLoading ? (
          <div className="flex items-center justify-center h-44 gap-2 text-zinc-500">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            <span className="text-sm font-mono">Consultando repositorio de cliente...</span>
          </div>
        ) : content ? (
          <pre className="text-[11px] text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap break-words">{content}</pre>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 px-6 text-center gap-3">
            <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
              <Info className="w-6 h-6" />
            </div>
            <div className="max-w-md">
              <h4 className="text-sm font-bold text-white mb-1.5 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Sin Forja Registrada
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Este comercio aún no ha sido forjado con Google Stitch. Ejecutá la forja en Gate 2 para generar su Sistema de Diseño y Manifiesto Oficial.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export const DesignMdViewer = ({ slug }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOpen = async () => {
    setOpen(true);
    if (content) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/nexus/assets/design-md?slug=${slug}`);
      if (res.ok) {
        const text = await res.text();
        setContent(text?.trim() ? text : null);
      } else {
        setContent(null);
      }
    } catch {
      setContent(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={handleOpen} className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 text-violet-400 text-[10px] font-bold transition-all" title="Ver DESIGN.md">
        <FileText className="w-3 h-3" /> DESIGN
      </button>
      {open && <DocModal title={`DESIGN.md — ${slug}`} icon={FileText} color="violet" content={content} isLoading={loading} onClose={() => setOpen(false)} />}
    </>
  );
};

export const StitchManifestViewer = ({ slug }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOpen = async () => {
    setOpen(true);
    if (content) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/nexus/assets/stitch-manifest?slug=${slug}`);
      if (res.ok) {
        const data = await res.json();
        setContent(data && Object.keys(data).length > 0 ? JSON.stringify(data, null, 2) : null);
      } else {
        setContent(null);
      }
    } catch {
      setContent(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={handleOpen} className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold transition-all" title="Ver Manifest Stitch">
        <Layers className="w-3 h-3" /> MANIFEST
      </button>
      {open && <DocModal title={`stitch-manifest.json — ${slug}`} icon={Layers} color="cyan" content={content} isLoading={loading} onClose={() => setOpen(false)} />}
    </>
  );
};
