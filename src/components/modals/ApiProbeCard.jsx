// Archivo: src/components/modals/ApiProbeCard.jsx
// Subcomponente Atómico: Tarjeta Individual de Probe Multicloud (Ley de 200 líneas)

import React from 'react';
import { Zap, CheckCircle2, AlertCircle, Clock, Copy, Check } from 'lucide-react';

export function ApiProbeCard({ p, res, isTesting, isCopied, onTestSingleProbe, onCopyError }) {
  const Icon = p.icon;
  const isConnected = res?.status === 'connected';
  const isError = res?.status === 'error';

  return (
    <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg bg-zinc-800 ${p.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">{p.name}</h3>
              <span className="text-[11px] text-zinc-400 block">{p.role}</span>
            </div>
          </div>
          {/* Status Badge */}
          {res ? (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 border ${
              isConnected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              {isConnected ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
              {isConnected ? 'Conectado' : 'Fallo'}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-800 text-zinc-500">Pendiente</span>
          )}
        </div>

        {/* Status / Error Box Expandible */}
        <div className="mt-3 py-2 px-3 rounded-lg bg-black/40 border border-white/5 min-h-[48px] flex items-center justify-between text-xs">
          {res ? (
            isConnected ? (
              <>
                <span className="text-zinc-300 font-mono text-[11px] truncate max-w-[190px]" title={res.model || res.username || res.name}>
                  {res.username ? `@${res.username}` : (res.model ? `${res.model}` : res.name || res.response || 'OK')}
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {res.latencyMs}ms
                </span>
              </>
            ) : (
              <div className="w-full flex items-start justify-between gap-2">
                <div className="text-red-400 text-[10px] font-mono leading-tight max-h-16 overflow-y-auto custom-scrollbar break-words flex-1 pr-1" title={res.error}>
                  {res.error || 'Error de conexión desconocido'}
                </div>
                <button
                  onClick={() => onCopyError(p.id, res.error)}
                  className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 text-[10px] flex items-center gap-1 transition-all flex-shrink-0"
                  title="Copiar error completo"
                >
                  {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{isCopied ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            )
          ) : (
            <span className="text-zinc-500 text-[11px]">Presioná probar para verificar</span>
          )}
        </div>
      </div>

      {/* Probe Action Button */}
      <div className="mt-3 pt-2 border-t border-white/5 flex justify-end">
        <button
          onClick={() => onTestSingleProbe(p.id)}
          disabled={isTesting}
          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <Zap className={`w-3 h-3 text-amber-400 ${isTesting ? 'animate-bounce' : ''}`} />
          {isTesting ? 'Probando...' : 'Probar Ahora'}
        </button>
      </div>
    </div>
  );
}
