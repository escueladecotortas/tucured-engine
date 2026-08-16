// Archivo: frontend/src/components/VisualEditor/AccordionSection.jsx
// Componente accordion reutilizable para las secciones del PropertiesPanel.
import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Sección accordion con toggle de apertura/cierre.
 * @param {string} title - Título de la sección.
 * @param {React.ComponentType} icon - Ícono Lucide a mostrar.
 * @param {boolean} isOpen - Estado de apertura.
 * @param {Function} onToggle - Callback al hacer click.
 * @param {React.ReactNode} children - Contenido interno.
 */
const AccordionSection = ({ title, icon: Icon, isOpen, onToggle, children }) => (
    <div className="border-b border-white/5 last:border-0">
        <button
            onClick={onToggle}
            className={`w-full flex items-center justify-between p-4 text-xs font-bold uppercase tracking-widest transition-colors ${isOpen ? 'bg-white/5 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
        >
            <div className="flex items-center gap-2">
                {Icon && <Icon size={12} />}
                <span>{title}</span>
            </div>
            <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
            <div className="p-3 bg-black/20 animate-in slide-in-from-top-2 duration-200">
                {children}
            </div>
        )}
    </div>
);

export default AccordionSection;
