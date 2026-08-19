// Archivo: src/components/modals/ApiHealthModal.jsx
// Modal Diagnóstico de Conectividad Multicloud con Visor de Errores Completo y Copia — Ley de 200 líneas

import React, { useState, useEffect } from 'react';
import { X, Activity, RefreshCw, Zap, Cpu, Server, Cloud, Database, Globe } from 'lucide-react';
import { ApiProbeCard } from './ApiProbeCard';

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
          {PROVIDERS.map((p) => (
            <ApiProbeCard
              key={p.id}
              p={p}
              res={healthData[p.id]}
              isTesting={testingId === p.id}
              isCopied={copiedId === p.id}
              onTestSingleProbe={testSingleProbe}
              onCopyError={handleCopyError}
            />
          ))}
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
