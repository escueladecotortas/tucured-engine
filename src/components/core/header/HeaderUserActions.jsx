// Archivo: src/components/core/header/HeaderUserActions.jsx
import React, { useState } from 'react';
import { ExternalLink, Zap, LogOut, Activity } from 'lucide-react';
import { navigate } from '../../../hooks/useAppLogic';
import ApiHealthModal from '../../modals/ApiHealthModal';

export default function HeaderUserActions({ project, user, userRole, onLogout }) {
  const [isApiHealthOpen, setIsApiHealthOpen] = useState(false);
  const projId = project?.id || 'tucu-red';

  const handleOpenLanding = () => {
    const landingUrl = 'https://tucured.ar';
    const win = window.open(landingUrl, '_blank');
    if (!win) {
      window.open('/tucu-red-public', '_blank');
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        {/* Botón de Diagnóstico de APIs */}
        <button
          onClick={() => setIsApiHealthOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer"
          title="Ver Salud y Probes de APIs Multicloud en Tiempo Real"
        >
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>APIs</span>
        </button>

        {projId === 'tucu-red' && (
          <button
            onClick={handleOpenLanding}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 border border-orange-500/30 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer"
            title="Abrir Sitio Web Público (https://tucured.ar)"
          >
            <span>Landing</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={() => navigate(`/project/${projId}?tab=agents`)}
          className="flex items-center gap-2 px-3 py-1.5 text-purple-400 hover:text-white hover:bg-purple-500/20 rounded-xl transition-all border border-purple-500/20 hover:border-purple-400/50 cursor-pointer text-xs font-bold font-mono"
          title="Ver los 14 Agentes Especialistas (Neural Team)"
        >
          <Zap className="w-4 h-4 text-purple-400" />
          <span className="hidden sm:inline">Neural Team</span>
        </button>

        <div className="flex items-center gap-3 px-2 border-l border-white/10 pl-3">
          {onLogout && (
            <button 
              onClick={onLogout} 
              className="group p-2 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer" 
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4 text-gray-400 group-hover:text-rose-400" />
            </button>
          )}

          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&background=6366f1&color=fff`}
            alt="User" className="w-8 h-8 rounded-full ring-2 ring-white/10 object-cover bg-indigo-900"
            referrerPolicy="no-referrer"
            onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&background=6366f1&color=fff`; }}
          />

          <div className="hidden md:block text-right">
            <div className="text-xs font-bold text-white leading-tight">{user?.displayName || 'Usuario'}</div>
            <div className="text-[9px] text-indigo-400 font-mono uppercase tracking-wider">{userRole || 'LEAD ARCHITECT'}</div>
          </div>
        </div>
      </div>

      <ApiHealthModal isOpen={isApiHealthOpen} onClose={() => setIsApiHealthOpen(false)} />
    </>
  );
}
