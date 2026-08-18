// Archivo: src/components/core/header/HeaderProjectInfo.jsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { StatusBadge } from '../index.jsx';

export default function HeaderProjectInfo({ project }) {
  const isClientView = project?.id && project.id !== 'tucu-red' && project.id !== 'system';
  const title = project?.id === 'tucu-red' 
    ? 'Tucu Red' 
    : (project?.name?.replace(/HQ/i, '').trim() || 'Tucu Red');

  return (
    <div className="flex items-center gap-4">
      {isClientView && (
        <button
          onClick={() => { window.location.hash = '#/project/tucu-red?tab=portfolio'; }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all text-xs font-semibold shadow-sm group"
          title="Volver al Portafolio General"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Portafolio</span>
        </button>
      )}

      <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3 font-['Outfit']">
        {title}
        {project && <StatusBadge status={project.status} />}
      </h1>
    </div>
  );
}
