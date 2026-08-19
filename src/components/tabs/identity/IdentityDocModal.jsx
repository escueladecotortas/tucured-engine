// Archivo: src/components/tabs/identity/IdentityDocModal.jsx
// Subcomponente Atómico: Modal y Renderizador de Documentos DESIGN / MANIFEST (Ley de 200 líneas)

import React from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { ColorPaletteGrid } from './ColorPaletteGrid';
import { TypographyCard } from './TypographyCard';

function DesignRenderer({ content, isDesign }) {
  if (!isDesign) {
    try {
      const parsed = JSON.parse(content);
      return (
        <pre className="p-5 text-[11px] text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap break-words">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      );
    } catch {
      return <pre className="p-5 text-[11px] text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap">{content}</pre>;
    }
  }

  const hexMatches = [...content.matchAll(/#([0-9A-Fa-f]{6})\b/g)].map(m => '#' + m[1]);
  const uniqueColors = [...new Set(hexMatches)].slice(0, 8);
  const fontMatches = [...content.matchAll(/font(?:[-_\s]?family)?[:\s]+["']?([A-Za-z\s]+)["']?/gi)].map(m => m[1].trim());
  const uniqueFonts = [...new Set(fontMatches)].slice(0, 4);

  return (
    <div className="p-5 space-y-5">
      <ColorPaletteGrid colors={uniqueColors} />
      <TypographyCard fonts={uniqueFonts} />

      <details className="cursor-pointer">
        <summary className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors">Ver documento completo</summary>
        <pre className="mt-2 text-[10px] text-zinc-400 font-mono leading-relaxed whitespace-pre-wrap break-words max-h-80 overflow-y-auto">{content}</pre>
      </details>
    </div>
  );
}

export function IdentityDocModal({ title, icon: Icon, color, content, loading, onClose }) {
  const colors = {
    violet: 'text-violet-400 border-violet-500/30 bg-violet-500/5',
    cyan:   'text-cyan-400   border-cyan-500/30   bg-cyan-500/5'
  };
  const cls = colors[color] || colors.violet;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className={`flex items-center justify-between px-5 py-3 border-b border-zinc-800 ${cls}`}>
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            <span className="font-bold text-sm font-mono">{title}</span>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-40 gap-2 text-zinc-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs">Cargando documento...</span>
            </div>
          ) : content ? (
            <DesignRenderer content={content} isDesign={color === 'violet'} />
          ) : (
            <div className="flex flex-col items-center justify-center h-40 gap-2 text-zinc-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-xs">Documento no disponible para este cliente</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
