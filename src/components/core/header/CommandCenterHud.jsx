// Archivo: src/components/core/header/CommandCenterHud.jsx
import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Cpu } from 'lucide-react';

export default function CommandCenterHud() {
  const [health, setHealth] = useState({ status: 'ONLINE', services: 51, engine: 'v10.0' });

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setHealth({
            status: data.status || 'HEALTHY',
            services: data.servicesCount || 51,
            engine: 'v10.0'
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 hidden xl:flex items-center gap-3 bg-black/40 px-3.5 py-1.5 rounded-2xl border border-white/5 backdrop-blur-md shadow-2xl z-50">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399]" />
        <span className="text-[10px] font-mono font-bold text-white tracking-widest uppercase">
          TUCU RED ENGINE {health.engine}
        </span>
      </div>
      <div className="w-px h-4 bg-white/10" />
      <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-cyan-400">
        <Cpu className="w-3 h-3 text-cyan-400" />
        <span>{health.services} SERVICIOS</span>
      </div>
      <div className="w-px h-4 bg-white/10" />
      <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold font-mono">
        {health.status}
      </span>
    </div>
  );
}
