// Archivo: src/components/leads/modal/GenerationResult.jsx
// Gate 3: Preview local + Botón de Deploy a Netlify MANUAL (Ley de 200 líneas)

import React, { useState } from 'react';
import { Globe, Eye, Rocket, CheckCircle2 } from 'lucide-react';
import { MatrixConsole } from './MatrixConsole';

export function GenerationResult({ isSuccess, finalUrl, logs, onClose, prospect }) {
  const [deploying, setDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState(null);

  const handleOpenPreview = () => {
    const href = finalUrl?.localHref || finalUrl?.href;
    if (href) window.open(href, '_blank');
  };

  // Gate 3: Deploy MANUAL a Netlify — solo cuando el PO presiona el botón
  const handleDeploy = async () => {
    if (deploying) return;
    setDeploying(true);
    try {
      const slug = prospect?.slug || finalUrl?.label?.replace('.tucured.ar', '') || '';
      const res = await fetch('/api/forge/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug })
      });
      const data = await res.json();
      const deployUrl = data.deployUrl || `https://${slug}.tucured.ar`;
      const now = new Date();
      const ts = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getFullYear()} - ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
      setDeployResult({ url: deployUrl, ts, success: data.success !== false });
    } catch (err) {
      setDeployResult({ error: err.message, success: false });
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="text-center py-4 space-y-6">
      {isSuccess ? (
        <div className="space-y-4 animate-in fade-in zoom-in duration-500">
          <div className="text-5xl">🎉</div>
          <h3 className="text-xl font-black text-emerald-400 uppercase tracking-tighter">¡SITIO FORJADO!</h3>

          {/* Acciones Gate 3 */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Preview local — siempre disponible */}
            {finalUrl?.localHref && (
              <button
                onClick={handleOpenPreview}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded-full font-bold text-xs shadow-lg hover:scale-105 transition-all uppercase tracking-wider"
              >
                <Eye size={14} /> 👁️ Ver Preview Local
              </button>
            )}

            {/* Deploy a Netlify — MANUAL, requiere acción explícita */}
            {!deployResult ? (
              <button
                onClick={handleDeploy}
                disabled={deploying}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-full font-bold text-xs shadow-lg shadow-purple-500/30 hover:scale-105 transition-all uppercase tracking-wider disabled:opacity-60 disabled:cursor-wait"
              >
                {deploying
                  ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Desplegando...</>
                  : <><Rocket size={14} /> 🚀 Desplegar a Netlify</>
                }
              </button>
            ) : deployResult.success ? (
              <div className="flex flex-col items-center gap-1">
                <a href={deployResult.url} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full font-bold text-xs shadow-lg hover:scale-105 transition-all uppercase tracking-wider">
                  <CheckCircle2 size={14} /> <Globe size={14} /> {finalUrl?.label}
                </a>
                <span className="text-[9px] text-zinc-500 font-mono">Último Despliegue: {deployResult.ts}</span>
              </div>
            ) : (
              <div className="text-xs text-red-400 font-bold">❌ Deploy falló: {deployResult.error}</div>
            )}
          </div>

          {/* Aviso Gate 3 */}
          {!deployResult && (
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest">
              ⚠️ El sitio existe localmente. El deploy a producción es manual.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-5xl">⚠️</div>
          <h3 className="text-lg font-black text-red-400 uppercase tracking-tighter">Pipeline Interrumpido</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Revisá la consola para más detalles técnicos.</p>
        </div>
      )}

      <MatrixConsole logs={logs} />

      <button
        onClick={onClose}
        className="px-8 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest"
      >
        Cerrar Protocolo
      </button>
    </div>
  );
}
