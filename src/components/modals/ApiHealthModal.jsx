// Archivo: src/components/modals/ApiHealthModal.jsx
// Modal Diagnóstico de Conectividad Multicloud con Visor de Errores Completo y Copia — Ley de 200 líneas

import React, { useState, useEffect } from 'react';
import { X, Activity, RefreshCw, Zap, CheckCircle2, AlertCircle, Clock, Server, Cloud, Cpu, Database, Globe, Copy, Check } from 'lucide-react';

const PROVIDERS = [
  { id: 'gemini', name: 'Google Gemini 2.5', role: 'Visión & Fallover AI', icon: Cpu, color: 'text-blue-400' },
  { id: 'groq', name: 'Groq Cloud AI', role: 'Cortex Narrativo & Copy', icon: Zap, color: 'text-amber-400' },
  { id: 'stitch', name: 'Google Stitch MCP', role: 'Forja de Sitios Web', icon: Server, color: 'text-emerald-400' },
  { id: 'apify', name: 'Apify Actor Cloud', role: 'Extracción Maps / IG', icon: Cloud, color: 'text-purple-400' },
  { id: 'firebase', name: 'Cloud Firestore', role: 'Persistencia SSOT', icon: Database, color: 'text-amber-500' },
  { id: 'netlify', name: 'Netlify Deploy API', role: 'Orquestación de Hosting', icon: Globe, color: 'text-cyan-400' }
];

export default function ApiHealthModal({ isOpen, onClose }) {
  const [healthData, setHealthData] = useState({});
  const [loadingAll, setLoadingAll] = useState(false);
  const [testingId, setTestingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fetchAllProbes = async () => {
    setLoadingAll(true);
    try {
      const res = await fetch('/api/nexus/health/apis');
      const data = await res.json();
      if (data.providers) setHealthData(data.providers);
    } catch (e) {
      console.error('Error fetching probes:', e);
    }
    setLoadingAll(false);
  };

  const testSingleProbe = async (providerId) => {
    setTestingId(providerId);
    try {
      const res = await fetch('/api/nexus/health/test-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: providerId })
      });
      const data = await res.json();
      setHealthData(prev => ({ ...prev, [providerId]: data }));
    } catch (e) {
      setHealthData(prev => ({ ...prev, [providerId]: { status: 'error', error: e.message } }));
    }
    setTestingId(null);
  };

  const handleCopyError = (providerId, errorText) => {
    if (!errorText) return;
    navigator.clipboard.writeText(errorText);
    setCopiedId(providerId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  useEffect(() => {
    if (isOpen) fetchAllProbes();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#12141a] border border-white/10 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#161922]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-wide">Salud de APIs Multicloud</h2>
              <p className="text-xs text-zinc-400">Probes de conectividad y latencia en tiempo real</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAllProbes}
              disabled={loadingAll}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 flex items-center gap-1.5 transition-colors border border-white/5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingAll ? 'animate-spin' : ''}`} />
              Probar Todas
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar">
          {PROVIDERS.map((p) => {
            const Icon = p.icon;
            const res = healthData[p.id];
            const isConnected = res?.status === 'connected';
            const isError = res?.status === 'error';
            const isTesting = testingId === p.id;
            const isCopied = copiedId === p.id;

            return (
              <div key={p.id} className="p-4 rounded-xl bg-zinc-900/80 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between">
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
                            onClick={() => handleCopyError(p.id, res.error)}
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
                    onClick={() => testSingleProbe(p.id)}
                    disabled={isTesting}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Zap className={`w-3 h-3 text-amber-400 ${isTesting ? 'animate-bounce' : ''}`} />
                    {isTesting ? 'Probando...' : 'Probar Ahora'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#161922] flex items-center justify-between text-xs text-zinc-400">
          <span>Auto-Switch Activo: <strong className="text-zinc-200 font-normal">Gemini 2.5 ↔ Groq Cloud</strong></span>
          <span className="font-mono text-[11px] text-zinc-500">Tucu Red Engine v11.1</span>
        </div>
      </div>
    </div>
  );
}
