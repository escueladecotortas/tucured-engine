// Archivo: frontend/src/components/core/header/HeaderProjectInfo.jsx
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { StatusBadge } from '../index.jsx';

export default function HeaderProjectInfo({ project, backUrl, backLabel }) {
  return (
    <div>
      {backLabel && (
        <button
          onClick={() => window.location.hash = backUrl}
          className="flex items-center gap-2 text-xs text-indigo-400 hover:text-white mb-1 transition-colors group ml-1"
        >
          <ArrowRight className="w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
          {backLabel}
        </button>
      )}

      <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3 font-['Outfit'] mt-1">
        {project?.name || "CONSOLA NEXUS"}
        {project && <StatusBadge status={project.status} />}
      </h1>

      <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono tracking-widest mt-1">
        <span className="w-2 h-2 rounded-full bg-nexus-orange animate-pulse shadow-[0_0_8px_#F97316]"></span>
        NEXUS OS / {project?.id?.toUpperCase() || 'SYSTEM'} / MODO CONSOLA
      </div>
    </div>
  );
}
