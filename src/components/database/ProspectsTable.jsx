// Archivo: src/components/database/ProspectsTable.jsx
// Tabla Reactiva con Botón [🌐 Ver Web], Forja Aislada, Deploy Netlify y Extracción CYBORG (Ley de 200 líneas)

import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { generateSlug, resolveAssetUrl, computeScore } from "./DbUtils";
import { useToast } from "../Toast";
import { DesignMdViewer, StitchManifestViewer } from "./ProspectDocViewers";
import { TacticalActionsCell } from "./TacticalActionsCell";

const STATUS_STYLES = {
  deployed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  generated: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  stitch_ready: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  ready: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  enriched: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  new: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

const ScoreBadge = ({ score }) => {
  const color = score >= 80 ? "emerald" : score >= 50 ? "blue" : score >= 30 ? "yellow" : "red";
  return <div className={`px-2 py-1 rounded text-xs font-bold bg-${color}-500/10 text-${color}-400 border border-${color}-500/20 w-fit`}>{score} / 100</div>;
};

export default function ProspectsTable({ prospects, onGenerate, onCall, onOutreach, onDelete, onOpenGallery, onUpdateLead }) {
  const { addToast } = useToast();
  const [localList, setLocalList] = useState(prospects || []);
  const [copiedId, setCopiedId] = useState(null);
  const [extractingId, setExtractingId] = useState(null);
  const [deployingId, setDeployingId] = useState(null);

  useEffect(() => { setLocalList(prospects || []); }, [prospects]);

  const handleCopyPayload = async (p) => {
    const slug = p.slug || p.clientId || generateSlug(p.name);
    try {
      const res = await fetch(`/api/nexus/assets/payload?slug=${slug}`);
      const data = res.ok ? await res.json() : null;
      const text = JSON.stringify(data?.payload || p, null, 2);
      await navigator.clipboard.writeText(text);
      setCopiedId(p.id);
      setTimeout(() => setCopiedId(null), 2000);
      addToast('📋 Payload de Stitch copiado', 'success');
    } catch (err) {
      navigator.clipboard.writeText(JSON.stringify(p, null, 2));
      setCopiedId(p.id);
      setTimeout(() => setCopiedId(null), 2000);
      addToast('📋 Payload copiado', 'info');
    }
  };

  const handleCyborgReExtract = async (p) => {
    if (extractingId) return;
    setExtractingId(p.id);
    addToast(`⚡ Extrayendo datos CYBORG para "${p.name}"...`, 'info');
    try {
      const res = await fetch('/api/leads/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: p.id, lead: p })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Fallo en extracción');
      const updated = { ...p, ...data.lead, status: 'stitch_ready' };
      setLocalList(prev => prev.map(item => (item.id === p.id || item.slug === p.slug) ? updated : item));
      if (onUpdateLead) onUpdateLead(updated);
      addToast(`⚡ Datos actualizados vía CYBORG para ${p.name}`, 'success');
    } catch (err) {
      addToast(`❌ Error: ${err.message}`, 'error');
    } finally {
      setExtractingId(null);
    }
  };

  const handleDeployNetlify = async (p) => {
    const slug = p.slug || generateSlug(p.name);
    setDeployingId(p.id);
    addToast(`🚀 Desplegando "${p.name}" en Netlify Cloud...`, 'info');
    try {
      const res = await fetch('/api/forge/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: p.id, slug })
      });
      const data = await res.json();
      if (data.success && data.deployUrl) {
        addToast(`✅ Despliegue exitoso: ${data.deployUrl}`, 'success');
        const updated = { ...p, status: 'deployed', deployUrl: data.deployUrl, deployedAt: new Date().toISOString() };
        setLocalList(prev => prev.map(item => item.id === p.id ? updated : item));
        if (onUpdateLead) onUpdateLead(updated);
      } else {
        throw new Error(data.error || 'Fallo en deploy Netlify');
      }
    } catch (err) {
      addToast(`❌ Deploy fallido: ${err.message}`, 'error');
    } finally {
      setDeployingId(null);
    }
  };

  return (
    <div className="flex-1 bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
      <div className="overflow-y-auto custom-scrollbar flex-1">
        <table className="w-full text-left border-collapse table-fixed">
          <thead className="bg-black/50 text-zinc-500 text-[10px] font-semibold tracking-widest uppercase sticky top-0 backdrop-blur-md z-10 border-b border-zinc-800/80">
            <tr>
              <th className="px-6 py-4 align-middle w-[26%]">Identity</th>
              <th className="px-4 py-4 align-middle w-[32%] text-center">Intelligence</th>
              <th className="px-4 py-4 align-middle w-[14%] text-center">Status</th>
              <th className="px-6 py-4 align-middle w-[28%] text-right">Tactical Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {localList.map((p) => {
              const slug = p.slug || p.clientId || generateSlug(p.name);
              const logoSrc = p.logoUrl ? resolveAssetUrl(p.logoUrl, slug) : p.photos?.[0] ? resolveAssetUrl(p.photos[0], slug) : null;
              const statusKey = p.status || "new";
              const styleClass = STATUS_STYLES[statusKey] || "bg-zinc-800 text-zinc-400 border-zinc-700";
              const hasGeneratedSite = (statusKey === "generated" || statusKey === "deployed") && (!!p.deployUrl || !!p.siteUrl || !!p.localUrl);
              const webUrl = p.deployUrl || p.siteUrl || p.localUrl || `/clients/${slug}/index.html`;

              return (
                <tr key={p.id} className="group hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700/50 flex-shrink-0">
                        {logoSrc ? <img src={logoSrc} alt={p.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} /> : <span className="font-bold text-zinc-400">{(p.name || "?")[0].toUpperCase()}</span>}
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-white leading-tight truncate">{p.name}</div>
                        <div className="text-xs text-zinc-500 flex items-center gap-1 truncate"><MapPin className="w-3 h-3 flex-shrink-0" /> {p.city || "Tucumán"} • {p.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-0 align-middle text-center">
                    <div className="flex flex-col gap-2 items-center justify-center w-full h-full py-3">
                      <ScoreBadge score={computeScore(p)} />
                      <div onClick={() => onOpenGallery(p)} className="bg-zinc-800/50 p-2.5 rounded-xl border border-zinc-700 w-48 text-[10px] text-zinc-400 cursor-pointer hover:bg-zinc-700/50 hover:border-zinc-500 transition-all flex flex-col gap-0.5 shadow-md mx-auto">
                        <span className="text-zinc-500 uppercase font-bold text-[9px]">Activos Visuales</span>
                        <span className="text-xs text-white font-mono">{p.photos?.length || 0} Fotos Indexadas</span>
                      </div>
                      <div className="flex items-center gap-1.5"><DesignMdViewer slug={slug} /><StitchManifestViewer slug={slug} /></div>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase border ${styleClass}`}>{statusKey}</span>
                  </td>
                  <TacticalActionsCell
                    p={p}
                    statusKey={statusKey}
                    hasGeneratedSite={hasGeneratedSite}
                    webUrl={webUrl}
                    extractingId={extractingId}
                    deployingId={deployingId}
                    copiedId={copiedId}
                    onCyborgReExtract={handleCyborgReExtract}
                    onGenerate={onGenerate}
                    onDeployNetlify={handleDeployNetlify}
                    onOutreach={onOutreach}
                    onCall={onCall}
                    onDelete={onDelete}
                    onCopyPayload={handleCopyPayload}
                  />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
