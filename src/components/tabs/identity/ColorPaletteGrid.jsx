// Archivo: src/components/tabs/identity/ColorPaletteGrid.jsx
// Subcomponente Atómico: Visualización y Copia de Paleta Cromática (Ley de 200 líneas)

import React from 'react';

export function ColorPaletteGrid({ colors = [] }) {
  if (!colors || colors.length === 0) return null;

  return (
    <div>
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">🎨 Paleta Cromática</p>
      <div className="flex flex-wrap gap-2">
        {colors.map(color => (
          <button
            key={color}
            onClick={() => navigator.clipboard?.writeText(color)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-700 hover:border-zinc-500 bg-zinc-900 transition-all group"
            title={`Copiar ${color}`}
          >
            <span
              className="w-5 h-5 rounded-md shadow border border-white/10 flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-[10px] font-mono text-zinc-300 group-hover:text-white">{color}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
