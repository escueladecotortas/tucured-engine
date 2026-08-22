// Archivo: src/app/admin/manual/page.jsx
// Panel Administrativo - Manual Operativo Soberano con Búsqueda Reactiva.
// Ley de 200 líneas: Cumplimiento estricto (~80 líneas).
'use client';
import React, { useState, useMemo } from 'react';
import { MANUAL_DATA } from './data/manualData';
import ManualContent from './components/ManualContent';
import { Search, BookOpen, ChevronRight } from 'lucide-react';

export default function ManualPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Auxiliar para normalizar tildes y diacríticos
  const normalizeText = (str) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  // Filtrado reactivo completo sobre el árbol de datos
  const filteredModules = useMemo(() => {
    if (!searchTerm.trim()) return MANUAL_DATA;
    const term = normalizeText(searchTerm);

    return MANUAL_DATA.filter((mod) => {
      const inTitle = normalizeText(mod.title).includes(term);
      const inIntro = normalizeText(mod.introduction).includes(term);
      
      const inSubsections = mod.subsections.some((sub) => {
        const inSubtitle = normalizeText(sub.subtitle).includes(term);
        const inItems = sub.items.some((item) => normalizeText(item).includes(term));
        return inSubtitle || inItems;
      });

      return inTitle || inIntro || inSubsections;
    });
  }, [searchTerm]);

  const scrollToModule = (id) => {
    const el = document.getElementById(`module-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Encabezado Boutique */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4 mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <BookOpen size={12} className="text-[#800000]" /> ECOSISTEMA Nexus Barber L3 // GUÍA OPERATIVA
          </div>
          <h1 className="text-2xl md:text-3xl font-serif tracking-tight mt-1 text-[#1A1A1A]">
            Manual Maestro <span className="text-[#800000]">de Operaciones</span>
          </h1>
          <p className="text-xs text-gray-400 mt-2 font-sans">
            Consola y guía de procedimientos protegida por Google Auth. Versión activa: <code className="bg-gray-100 text-[#800000] px-1.5 py-0.5 rounded font-mono text-[10px] font-bold">v11.95-GOLD</code>
          </p>
        </div>
      </div>

      {/* Buscador y Anclas Boutique */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Input de Búsqueda Boutique */}
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-3.5 shadow-sm flex items-center gap-3 focus-within:border-[#800000] focus-within:ring-1 focus-within:ring-[#800000]/20 transition-all">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Buscar procedimiento (ej. feriados, WhatsApp, CRM)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs font-sans focus:outline-none bg-transparent placeholder-gray-400 text-neutral-800"
          />
        </div>

        {/* Info / Status Badge Boutique */}
        <div className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-sm flex items-center justify-between">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Módulos:</span>
          <span className="text-xs font-bold text-[#800000] bg-[#800000]/5 border border-[#800000]/20 px-2.5 py-1 rounded-md">
            {filteredModules.length} / {MANUAL_DATA.length} Activos
          </span>
        </div>
      </div>

      {/* Navegación rápida por Anclas Boutique */}
      {!searchTerm && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-wrap gap-2 items-center">
          <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mr-2">ACCESO RÁPIDO:</span>
          {MANUAL_DATA.map((mod) => (
            <button
              key={mod.id}
              onClick={() => scrollToModule(mod.id)}
              className="text-[10px] font-semibold border border-gray-200 text-gray-600 hover:border-[#800000] hover:bg-[#800000] hover:text-white px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer bg-white"
            >
              {mod.title.split('.')[1]?.trim() || mod.title}
              <ChevronRight size={10} className="opacity-60" />
            </button>
          ))}
        </div>
      )}

      {/* Contenido Dinámico */}
      <ManualContent modules={filteredModules} searchTerm={searchTerm} />
    </div>
  );
}
