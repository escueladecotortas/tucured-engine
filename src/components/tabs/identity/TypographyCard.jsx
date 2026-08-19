// Archivo: src/components/tabs/identity/TypographyCard.jsx
// Subcomponente Atómico: Visualización de Tipografías de Marca (Ley de 200 líneas)

import React from 'react';

export function TypographyCard({ fonts = [] }) {
  if (!fonts || fonts.length === 0) return null;

  return (
    <div>
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">🔤 Tipografías</p>
      <div className="flex flex-wrap gap-2">
        {fonts.map(font => (
          <span
            key={font}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 font-medium"
            style={{ fontFamily: font }}
          >
            {font}
          </span>
        ))}
      </div>
    </div>
  );
}
