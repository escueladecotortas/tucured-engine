// Archivo: src/app/admin/manual/components/ManualContent.jsx
// Componente de contenido del Manual de Operaciones Soberano. Estética Brutalista V4.
// Ley de 200 líneas: Cumplimiento estricto (~100 líneas).
'use client';
import React from 'react';

export default function ManualContent({ modules, searchTerm }) {
  // Función para resaltar el término buscado en los textos
  const highlightText = (text, highlight) => {
    if (!highlight || !highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() 
            ? <mark key={i} className="bg-yellow-100 text-neutral-950 font-bold px-0.5 rounded-sm">{part}</mark>
            : part
        )}
      </>
    );
  };

  if (modules.length === 0) {
    return (
      <div className="bg-white border border-gray-200 p-8 rounded-xl text-center shadow-sm my-6">
        <p className="text-sm text-[#800000] font-bold uppercase tracking-wider">
          Ninguna sección coincide con la búsqueda
        </p>
        <p className="text-gray-400 text-xs mt-2 font-sans">
          Intentá con otros términos como "feriados", "whatsapp" o "clientes".
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 my-6">
      {modules.map((mod) => (
        <article 
          key={mod.id} 
          id={`module-${mod.id}`}
          className="bg-white border border-gray-200 p-6 md:p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
        >
          {/* Cabecera del Módulo */}
          <div className="border-b border-gray-150 pb-4 mb-5">
            <h2 className="text-lg md:text-xl font-serif tracking-tight text-neutral-900">
              {highlightText(mod.title, searchTerm)}
            </h2>
            <p className="text-xs text-gray-500 font-sans mt-2 leading-relaxed">
              {highlightText(mod.introduction, searchTerm)}
            </p>
          </div>

          {/* Subsecciones */}
          <div className="space-y-6">
            {mod.subsections.map((sub, sIdx) => (
              <div key={sIdx} className="space-y-3">
                <h3 className="text-xs font-semibold text-[#800000] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#800000] rounded-full inline-block"></span>
                  {highlightText(sub.subtitle, searchTerm)}
                </h3>
                
                <ul className="space-y-2.5 pl-4 border-l border-gray-100">
                  {sub.items.map((item, iIdx) => (
                    <li key={iIdx} className="text-xs font-sans text-neutral-600 leading-relaxed list-disc marker:text-[#800000]/40 pl-1">
                      {highlightText(item, searchTerm)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
