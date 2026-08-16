// Archivo: frontend/src/components/database/GalleryModal.jsx
// Célula atómica: Modal de Bóveda de Activos Visuales

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Trash2, Database, X } from "lucide-react";
import { generateSlug, resolveAssetUrl } from "./DbUtils";

export default function GalleryModal({ prospect, onClose, onRemovePhoto }) {
  if (!prospect) return null;

  const slug = prospect.slug || prospect.clientId || generateSlug(prospect.name);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl max-h-[85vh] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-linear-to-r from-zinc-900 to-black">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-white/5 border border-zinc-800 p-1 flex items-center justify-center">
              <img
                src={prospect.logoUrl || prospect.imageUrl || prospect.photos?.[0]}
                className="max-w-full max-h-full object-contain"
                alt="Logo"
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(prospect.name)}`; }}
              />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display text-white">{prospect.name}</h3>
              <p className="text-xs text-zinc-500 font-mono">
                Bóveda de Inteligencia Visual • {prospect.photos?.length || 0} Activos
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Grid de fotos */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-zinc-950/20">
          {prospect.photos?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {prospect.photos.map((photo, i) => {
                const url = resolveAssetUrl(photo, slug);
                const label = photo.includes("insta_") ? "IG" : "Maps";
                return (
                  <div key={i} className="aspect-square rounded-xl bg-black border border-zinc-800 overflow-hidden group cursor-pointer relative">
                    <img
                      src={url}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onClick={(e) => { e.stopPropagation(); window.open(url, "_blank"); }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600 text-xs font-mono">${label} #${i + 1}<br/>No disponible</div>`;
                      }}
                    />
                    <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="w-8 h-8 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-indigo-600 transition-all"
                        onClick={(e) => { e.stopPropagation(); window.open(url, "_blank"); }}
                        title="Abrir original"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                      <button
                        className="w-8 h-8 rounded-lg bg-black/80 backdrop-blur-md border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
                        onClick={(e) => { e.stopPropagation(); onRemovePhoto(prospect, i, photo); }}
                        title="Descartar activo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center">
              <Database className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
              <p className="text-zinc-500 italic">No se encontraron activos visuales para este prospecto.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-black border-t border-zinc-800 flex justify-between items-center text-[10px] text-zinc-600 font-mono">
          <div>SOURCE: {prospect.platform || "NEXUS_CYBORG"}</div>
          <div>ENRICHED_AT: {prospect.enrichedAt ? new Date(prospect.enrichedAt).toLocaleString() : "PENDING"}</div>
        </div>
      </motion.div>
    </div>
  );
}
