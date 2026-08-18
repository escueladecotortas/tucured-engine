// Archivo: src/components/database/GalleryModal.jsx
// Modal de Bóveda Visual con Selector Interactivo de Roles Semánticos (Ley de 200 líneas)

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Trash2, Database, X, Sparkles, Loader2, Tag } from "lucide-react";
import { generateSlug, resolveAssetUrl } from "./DbUtils";
import { useToast } from "../Toast";

const ROLE_OPTIONS = [
  { value: "hero", label: "Hero Banner", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  { value: "logo", label: "Logo Identidad", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  { value: "showcase", label: "Showcase (Producto)", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { value: "atmosphere", label: "Atmosphere (Local)", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  { value: "discard", label: "🗑️ Descartar Activo", color: "bg-red-500/20 text-red-300 border-red-500/30" }
];

export default function GalleryModal({ prospect, onClose, onRemovePhoto }) {
  if (!prospect) return null;
  const { addToast } = useToast();
  const slug = prospect.slug || prospect.clientId || generateSlug(prospect.name);
  const [liveAssets, setLiveAssets] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatingUrl, setUpdatingUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch(`/api/nexus/assets/list?slug=${slug}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.success && Array.isArray(data.assets) && data.assets.length > 0) {
          setLiveAssets(data.assets);
        }
      })
      .catch(() => {})
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [slug]);

  const handleRoleChange = async (item, newRole) => {
    setUpdatingUrl(item.raw);
    try {
      const res = await fetch("/api/nexus/assets/reclassify", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, photoUrl: item.raw, newRole })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Error al reclasificar");

      if (newRole === "discard") {
        setLiveAssets(prev => (prev || []).filter(a => a.url !== item.raw && !a.url.endsWith(item.raw)));
        addToast("🗑️ Activo descartado de la Bóveda", "info");
      } else {
        setLiveAssets(prev => (prev || []).map(a => (a.url === item.raw || a.url.endsWith(item.raw)) ? { ...a, role: newRole } : a));
        const opt = ROLE_OPTIONS.find(o => o.value === newRole);
        addToast(`🏷️ Rol asignado: ${opt?.label || newRole}`, "success");
      }
    } catch (err) {
      addToast(`❌ Error: ${err.message}`, "error");
    } finally {
      setUpdatingUrl(null);
    }
  };

  const categorizedPhotos = useMemo(() => {
    if (liveAssets && liveAssets.length > 0) {
      return liveAssets.map(a => ({ raw: a.url, resolved: resolveAssetUrl(a.url, slug), role: a.role || "general" }));
    }
    const sp = prospect.semantic_photos || {};
    const items = [];
    const seen = new Set();
    const addPhoto = (url, role) => {
      if (!url || typeof url !== "string") return;
      const resolved = resolveAssetUrl(url, slug);
      if (!seen.has(resolved)) { seen.add(resolved); items.push({ raw: url, resolved, role }); }
    };
    if (sp.logo) addPhoto(sp.logo, "logo");
    if (sp.hero) addPhoto(sp.hero, "hero");
    if (Array.isArray(sp.showcase)) sp.showcase.forEach(u => addPhoto(u, "showcase"));
    if (Array.isArray(sp.atmosphere)) sp.atmosphere.forEach(u => addPhoto(u, "atmosphere"));
    (Array.isArray(prospect.photos) ? prospect.photos : []).forEach(u => {
      const role = u.includes("ambient_") ? "atmosphere" : u.includes("product_") ? "showcase" : u.includes("hero") ? "hero" : u.includes("logo") ? "logo" : "general";
      addPhoto(u, role);
    });
    return items;
  }, [prospect, slug, liveAssets]);

  const logoSrc = resolveAssetUrl(prospect.logoUrl || prospect.semantic_photos?.logo || categorizedPhotos[0]?.resolved, slug);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} className="relative w-full max-w-5xl max-h-[85vh] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-linear-to-r from-zinc-900 via-zinc-900 to-black">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-black/60 border border-zinc-800 p-1 flex items-center justify-center overflow-hidden">
              <img src={logoSrc} className="max-w-full max-h-full object-contain" alt="Logo" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(prospect.name)}&background=0D0D12&color=fff`; }} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 font-display">{prospect.name} <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">Bóveda Visual</span></h3>
              <p className="text-xs text-zinc-500 font-mono flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-amber-400" /> {categorizedPhotos.length} Activos Curados por Rol Visual</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>

        {/* Grid de Activos con Dropdowns */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-zinc-950/40">
          {loading ? (
            <div className="py-24 text-center flex flex-col items-center justify-center gap-2"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /><p className="text-xs text-zinc-500 font-mono">Sincronizando Bóveda de Activos...</p></div>
          ) : categorizedPhotos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categorizedPhotos.map((item, i) => (
                <div key={i} className="group aspect-square rounded-xl bg-black/80 border border-zinc-800/80 overflow-hidden relative shadow-lg flex flex-col justify-between p-2">
                  <img src={item.resolved} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none" alt="" />
                  <div className="relative z-10 flex justify-between items-center w-full">
                    {/* Selector interactivo de Rol */}
                    <select
                      value={item.role}
                      onChange={(e) => handleRoleChange(item, e.target.value)}
                      disabled={updatingUrl === item.raw}
                      className="bg-black/80 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono font-bold rounded-lg px-2 py-1 outline-none cursor-pointer hover:border-cyan-400 transition-colors"
                    >
                      {ROLE_OPTIONS.map(opt => <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">{opt.label}</option>)}
                    </select>
                    <button className="w-7 h-7 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-cyan-600 transition-all opacity-0 group-hover:opacity-100" onClick={() => window.open(item.resolved, "_blank")} title="Ver original"><ArrowUpRight className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="relative z-10 flex justify-end">
                    <button onClick={() => handleRoleChange(item, "discard")} className="w-7 h-7 rounded-lg bg-black/80 backdrop-blur-md border border-red-500/30 text-red-400 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100" title="Descartar"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center"><Database className="w-12 h-12 text-zinc-700 mx-auto mb-3" /><p className="text-zinc-400 text-sm">Sin activos visuales persistidos.</p></div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-black border-t border-zinc-800 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
          <div>SLUG: {slug}</div>
          <div>ENRICHED_STATUS: {prospect.status?.toUpperCase() || "NEW"}</div>
        </div>
      </motion.div>
    </div>
  );
}
