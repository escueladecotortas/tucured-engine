// Archivo: src/components/DatabaseView.jsx
// Orquestador del módulo de Base de Datos de Prospectos — Ley de 200 líneas

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import DbKpis from "./database/DbKpis";
import ProspectsTable from "./database/ProspectsTable";
import GalleryModal from "./database/GalleryModal";

const STATUSES = ["all", "new", "enriched", "ready", "stitch_ready", "generated"];

export default function DatabaseView({ prospects, onGenerate, onCall, onOutreach, onDelete, onUpdateLead }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedGallery, setSelectedGallery] = useState(null);

  const filtered = useMemo(() =>
    prospects.filter((p) => {
      const matchSearch =
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus === "all" || p.status === filterStatus;
      return matchSearch && matchStatus;
    }),
    [prospects, searchTerm, filterStatus]
  );

  const handleRemovePhoto = (prospect, index, photoUrl) => {
    if (!window.confirm("¿Descartar este activo de la Bóveda?")) return;
    const updated = { ...prospect, photos: prospect.photos.filter((_, i) => i !== index) };
    setSelectedGallery(updated);
    if (onUpdateLead) onUpdateLead(updated);
    fetch(`/api/prospects/${prospect.id}/photos`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index, photoUrl }),
    }).catch((err) => console.error("Error al borrar foto:", err));
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <DbKpis prospects={prospects} />

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por nombre o rubro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-indigo-500 outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                filterStatus === s
                  ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.15)] scale-105"
                  : "bg-zinc-800/40 border border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-700/60"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <ProspectsTable
        prospects={filtered}
        onGenerate={onGenerate}
        onCall={onCall}
        onOutreach={onOutreach}
        onDelete={onDelete}
        onOpenGallery={setSelectedGallery}
        onUpdateLead={onUpdateLead}
      />

      {selectedGallery && (
        <GalleryModal
          prospect={selectedGallery}
          onClose={() => setSelectedGallery(null)}
          onRemovePhoto={handleRemovePhoto}
        />
      )}
    </div>
  );
}
