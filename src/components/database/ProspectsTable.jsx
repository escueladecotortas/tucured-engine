// Archivo: frontend/src/components/database/ProspectsTable.jsx
// Célula atómica: Tabla de prospectos con acciones tácticas

import React from "react";
import { Phone, Globe, Zap, Trash2, MessageCircle, MapPin, Star, ArrowUpRight, RefreshCw, Database } from "lucide-react";
import { generateSlug, resolveAssetUrl, computeScore } from "./DbUtils";

const STATUS_STYLES = {
  generated: "bg-blue-500/10 text-blue-400 border-blue-500/20 dot-blue-500",
  stitch_ready: "bg-purple-500/10 text-purple-400 border-purple-500/20 dot-purple-500",
  ready: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 dot-emerald-500",
  enriched: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 dot-indigo-500",
  new: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 dot-cyan-500",
};

const ScoreBadge = ({ score }) => {
  const color = score >= 80 ? "emerald" : score >= 50 ? "blue" : score >= 30 ? "yellow" : "red";
  return (
    <div className={`px-2 py-1 rounded text-xs font-bold bg-${color}-500/10 text-${color}-400 border border-${color}-500/20 w-fit`}>
      {score} / 100
    </div>
  );
};

export default function ProspectsTable({ prospects, onGenerate, onCall, onOutreach, onDelete, onOpenGallery }) {
  return (
    <div className="flex-1 bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
      <div className="overflow-y-auto custom-scrollbar flex-1">
        <table className="w-full text-left border-collapse table-fixed">
          <thead className="bg-black/50 text-zinc-500 text-[10px] font-semibold tracking-widest uppercase sticky top-0 backdrop-blur-md z-10 border-b border-zinc-800/80">
            <tr>
              <th className="px-6 py-4 align-middle w-[30%]">Identity</th>
              <th className="px-4 py-4 align-middle w-[35%] text-center">Intelligence</th>
              <th className="px-4 py-4 align-middle w-[15%] text-center">Status</th>
              <th className="px-6 py-4 align-middle w-[20%] text-right">Tactical Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {prospects.map((p) => {
              const slug = p.slug || p.clientId || generateSlug(p.name);
              const logoSrc = p.logoUrl ? resolveAssetUrl(p.logoUrl, slug) : p.photos?.[0] ? resolveAssetUrl(p.photos[0], slug) : null;
              const statusKey = p.status || "new";
              const styleClass = STATUS_STYLES[statusKey] || "bg-zinc-800 text-zinc-400 border-zinc-700";

              return (
                <tr key={p.id} className="group hover:bg-white/5 transition-colors">
                  {/* Identity */}
                  <td className="px-6 py-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700/50">
                        {logoSrc
                          ? <img src={logoSrc} alt={p.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
                          : <span className="font-bold text-zinc-400">{(p.name || "?")[0].toUpperCase()}</span>
                        }
                      </div>
                      <div>
                        <div className="font-bold text-white leading-tight">{p.name}</div>
                        <div className="text-xs text-zinc-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {p.city || "Tucumán"} • {p.category}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Intelligence Card */}
                  <td className="px-4 py-0 align-middle text-center">
                    <div className="flex flex-col gap-2.5 items-center justify-center w-full h-full py-4">
                      <ScoreBadge score={computeScore(p)} />
                      <div
                        onClick={() => onOpenGallery(p)}
                        className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700 w-56 text-[10px] text-zinc-400 cursor-pointer hover:bg-zinc-700/50 hover:border-zinc-500 transition-all group/intel flex flex-col relative overflow-hidden shadow-md mx-auto"
                      >
                        <div className="relative z-10 w-full flex flex-col gap-2">
                          <div className="flex w-full justify-between items-center px-2">
                            <span className="text-zinc-500 uppercase font-bold text-[9px]">Activos Visuales</span>
                            <strong className="text-white text-xs bg-zinc-700 px-2 py-0.5 rounded">{p.photos?.length || 0}</strong>
                          </div>
                          <div className="flex w-full justify-between items-center px-2">
                            <span className="text-zinc-500 uppercase font-bold text-[9px]">Redes</span>
                            <strong className={p.instagram || p.instagramData ? "text-purple-400 text-xs" : "text-zinc-600 text-[10px]"}>
                              {p.instagram ? `@${p.instagram.replace("@", "")}` : p.instagramData ? "Vinculado" : "---"}
                            </strong>
                          </div>
                          <div className="flex w-full justify-between items-center px-2">
                            <span className="text-zinc-500 uppercase font-bold text-[9px]">Google Maps</span>
                            <strong className="text-emerald-400 text-xs">{p.reviews || 0} <span className="text-zinc-500 text-[10px] font-normal">reviews</span></strong>
                          </div>
                        </div>
                        <div className="mt-4 w-full text-[10px] text-zinc-500 group-hover/intel:text-indigo-400 font-medium flex items-center justify-center border-t border-zinc-700/50 pt-3 transition-colors">
                          Abrir Bóveda de Activos <ArrowUpRight className="w-3.5 h-3.5 ml-1 opacity-50 group-hover/intel:opacity-100" />
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 align-middle text-center">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize border ${styleClass}`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                      {statusKey.replace("_", " ")}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 align-middle text-right">
                    <div className="flex items-center justify-end gap-2">
                      {["ready", "new", "enriched", "generated", "stitch_ready"].includes(statusKey) && (
                        <button onClick={() => onGenerate(p)} className={`p-2 ${statusKey === "generated" || statusKey === "stitch_ready" ? "bg-amber-600 hover:bg-amber-500" : "bg-emerald-600 hover:bg-emerald-500"} text-white rounded-lg transition-all shadow-lg`} title="Generar / Regenerar Sitio">
                          {statusKey === "generated" || statusKey === "stitch_ready" ? <RefreshCw className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                        </button>
                      )}
                      {p.phone && (
                        <button onClick={() => onOutreach(p)} className="p-2 bg-zinc-800 hover:bg-green-600 text-zinc-400 hover:text-white rounded-lg transition-all" title="WhatsApp Strategy">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => onCall(p)} className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-all" title="Simular Llamada (TTS)">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(p)} className="p-2 bg-zinc-800 hover:bg-red-900/50 text-zinc-400 hover:text-red-400 rounded-lg transition-all" title="Eliminar Prospecto">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {statusKey === "generated" && (
                        <a href={p.siteUrl || p.deployUrl || "#"} target="_blank" rel="noreferrer" className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all" title="Ver Sitio">
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                      {statusKey === "stitch_ready" && (
                        <button
                          onClick={() => { if (p.stitchPrompt) navigator.clipboard.writeText(p.stitchPrompt); }}
                          className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all" title="Copiar Payload Stitch"
                        >
                          <Database className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {prospects.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-zinc-500 italic">No assets found matching filtering criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-zinc-900/80 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono flex justify-between">
        <div>DB_VERSION: 5.1.0-Scalable</div>
        <div>{prospects.length} RECORDS DISPLAYED</div>
      </div>
    </div>
  );
}
