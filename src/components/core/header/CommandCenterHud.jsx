// Archivo: frontend/src/components/core/header/CommandCenterHud.jsx
import React from 'react';
import { Activity } from 'lucide-react';

export const HudPill = ({ color, label, value, tooltip, children }) => (
  <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-help group relative">
    <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px]`} style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
    <div className="text-left">
      <div className="text-[8px] text-gray-400 uppercase font-bold tracking-wider">{label}</div>
      <div className="text-xs font-bold text-white leading-none">{value}</div>
    </div>
    {tooltip && (
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-black/80 text-[10px] text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 z-50">
        {tooltip}
      </div>
    )}
    {children}
  </div>
);

export const MissionsPopover = () => (
  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 opacity-0 invisible group-hover/missions:opacity-100 group-hover/missions:visible transition-all duration-300 transform translate-y-2 group-hover/missions:translate-y-0 z-[100]">
    <div className="bg-slate-900/95 border border-nexus-cyan/30 rounded-xl p-0 shadow-[0_0_50px_rgba(6,182,212,0.15)] backdrop-blur-xl relative overflow-hidden ring-1 ring-white/10">
      <div className="bg-nexus-cyan/10 px-4 py-2 border-b border-nexus-cyan/20 flex items-center justify-between">
        <span className="text-[10px] uppercase font-bold text-nexus-cyan tracking-wider flex items-center gap-2"><Activity className="w-3 h-3" /> Radar de Ejecución</span>
        <span className="text-[9px] bg-nexus-cyan/20 text-nexus-cyan px-1.5 py-0.5 rounded border border-nexus-cyan/30">LIVE</span>
      </div>
      <div className="p-2 space-y-1">
        <MissionItem title="Campaña San Valentín" status="Atenea generando activos..." color="#F97316" />
        <MissionItem title="SEO Audit" status="Ícaro analizando keywords..." color="#A855F7" />
      </div>
      <div className="bg-black/20 p-2 text-center border-t border-white/5">
        <span className="text-[9px] text-gray-500 hover:text-white cursor-pointer transition-colors uppercase tracking-widest font-bold">Ver Tablero Completo</span>
      </div>
    </div>
  </div>
);

const MissionItem = ({ title, status, color }) => (
  <button className="w-full text-left p-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5 flex items-center gap-3 group/item transition-colors">
    <div className="w-1 h-8 rounded-full group-hover/item:shadow-[0_0_8px] transition-shadow" style={{ backgroundColor: color }} />
    <div>
      <div className="text-xs font-bold text-white group-hover/item:text-opacity-80 transition-colors" style={{ color: color }}>{title}</div>
      <div className="text-[10px] text-gray-400">{status}</div>
    </div>
  </button>
);

export default function CommandCenterHud() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 hidden xl:flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md shadow-2xl z-50">
      <HudPill color="#34D399" label="Estado" value="NOMINAL" tooltip="Todos los sistemas operativos" />
      <div className="w-px h-8 bg-white/10"></div>
      <div className="relative group/missions">
        <HudPill color="#06B6D4" label="Misiones" value="3 ACTIVAS" />
        <MissionsPopover />
      </div>
      <div className="w-px h-8 bg-white/10"></div>
      <HudPill color="#F97316" label="Acción" value="1 PENDIENTE" />
    </div>
  );
}
