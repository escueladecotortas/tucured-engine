// Archivo: src/components/database/TacticalActionsCell.jsx
// Subcomponente Atómico: Celda de Acciones Tácticas para ProspectsTable (Ley de 200 líneas)

import React from 'react';
import { Phone, Globe, Zap, Trash2, MessageCircle, RefreshCw, Database, Check, Bot, Rocket } from 'lucide-react';

export function TacticalActionsCell({
  p,
  statusKey,
  hasGeneratedSite,
  webUrl,
  extractingId,
  deployingId,
  copiedId,
  onCyborgReExtract,
  onGenerate,
  onDeployNetlify,
  onOutreach,
  onCall,
  onDelete,
  onCopyPayload
}) {
  return (
    <td className="px-6 py-4 align-middle text-right">
      <div className="flex items-center justify-end gap-1.5 flex-wrap">
        {/* 1. Re-extracción CYBORG */}
        <button
          onClick={() => onCyborgReExtract(p)}
          disabled={extractingId === p.id}
          className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${
            extractingId === p.id
              ? "bg-cyan-600 text-white animate-pulse"
              : "bg-cyan-600/20 hover:bg-cyan-600 text-cyan-400 hover:text-white border-cyan-500/30"
          }`}
          title="⚡ Extraer Datos (CYBORG)"
        >
          {extractingId === p.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
        </button>

        {/* 2. Forjar / Regenerar */}
        <button
          onClick={() => onGenerate(p)}
          className={`p-2 rounded-xl ${
            statusKey === "generated" || statusKey === "deployed" ? "bg-amber-600 hover:bg-amber-500" : "bg-emerald-600 hover:bg-emerald-500"
          } text-white transition-all shadow-lg`}
          title="Forjar / Regenerar Sitio"
        >
          {statusKey === "generated" || statusKey === "deployed" ? <RefreshCw className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
        </button>

        {/* 3. Ver Web / Preview Local (Solo activo si status === 'generated' o 'deployed') */}
        <button
          onClick={() => hasGeneratedSite && window.open(webUrl, "_blank")}
          disabled={!hasGeneratedSite}
          className={`p-2 rounded-xl transition-all shadow-lg flex items-center justify-center ${
            hasGeneratedSite
              ? "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
              : "bg-zinc-800/60 text-zinc-600 border border-zinc-700/30 cursor-not-allowed opacity-40"
          }`}
          title={hasGeneratedSite ? "🌐 Ver Web / Preview Local" : "Web no generada aún (requiere forja en Gate 2)"}
        >
          <Globe className="w-3.5 h-3.5" />
        </button>

        {/* 4. Desplegar Netlify (Solo activo si status === 'generated' o 'deployed') */}
        <button
          onClick={() => onDeployNetlify(p)}
          disabled={deployingId === p.id || !hasGeneratedSite}
          className={`p-2 rounded-xl border transition-all shadow-lg flex items-center justify-center ${
            hasGeneratedSite
              ? "bg-teal-600/20 hover:bg-teal-600 text-teal-400 hover:text-white border-teal-500/30 cursor-pointer"
              : "bg-zinc-800/60 text-zinc-600 border border-zinc-700/30 cursor-not-allowed opacity-40"
          }`}
          title={hasGeneratedSite ? "🚀 Desplegar a Netlify" : "Requiere forja local previa (Gate 2)"}
        >
          {deployingId === p.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Rocket className="w-3.5 h-3.5" />}
        </button>

        {/* 5. WhatsApp & Llamada */}
        {p.phone && (
          <button onClick={() => onOutreach(p)} className="p-2 bg-zinc-800 hover:bg-green-600 text-zinc-400 hover:text-white rounded-xl transition-all" title="WhatsApp Strategy">
            <MessageCircle className="w-3.5 h-3.5" />
          </button>
        )}
        <button onClick={() => onCall(p)} className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl transition-all" title="Simular Llamada">
          <Phone className="w-3.5 h-3.5" />
        </button>

        {/* 6. Borrado */}
        <button onClick={() => onDelete(p)} className="p-2 bg-zinc-800 hover:bg-red-900/50 text-zinc-400 hover:text-red-400 rounded-xl transition-all" title="Eliminar">
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* 7. Copiar Payload Stitch */}
        <button
          onClick={() => onCopyPayload(p)}
          className={`p-2 rounded-xl ${copiedId === p.id ? "bg-emerald-600 text-white" : "bg-purple-600 hover:bg-purple-500 text-white"} transition-all shadow-lg flex items-center`}
          title="Copiar Payload Stitch"
        >
          {copiedId === p.id ? <Check className="w-3.5 h-3.5 animate-bounce" /> : <Database className="w-3.5 h-3.5" />}
        </button>
      </div>
    </td>
  );
}
