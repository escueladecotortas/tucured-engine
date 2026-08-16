// Archivo: frontend/src/components/leads/ProspectFormSections.jsx
import React from 'react';
import { Zap, MapPin, Activity, AlertCircle } from 'lucide-react';
import { CATEGORY_TAXONOMY } from '../../data/categories';
import { TUCUMAN_CITIES, getInputClass, formatWhatsApp } from './ProspectFormUtils';

export const FormHeader = ({ hasMaps, setHasMaps }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
    <div>
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <Zap className="w-5 h-5 text-purple-400" />
        Alta Unificada de Entidad
      </h3>
      <p className="text-zinc-400 text-xs mt-1">
        El sistema C.Y.B.O.R.G. extraerá y enriquecerá los datos automáticamente.
      </p>
    </div>
    <div className="flex bg-black/20 p-1 rounded-lg w-fit">
      <button
        onClick={() => setHasMaps(true)}
        className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${hasMaps ? "bg-purple-600 text-white" : "text-zinc-500 hover:text-white"}`}
      >
        <MapPin className="w-3 h-3" />
        Tiene Google Maps
      </button>
      <button
        onClick={() => setHasMaps(false)}
        className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${!hasMaps ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-white"}`}
      >
        No tiene Maps
      </button>
    </div>
  </div>
);

export const UpsellBanner = () => (
  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
    <Activity className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
    <div>
      <p className="text-sm text-amber-200 font-medium">Modo Híbrido Activado (Solo Instagram)</p>
      <p className="text-xs text-amber-500/80 mt-1">
        Al no tener Google Maps, el scraper extrae info exclusivamente de Instagram. 
        El prospecto será marcado para ofrecerle el servicio de Alta en Maps (Upsell).
      </p>
    </div>
  </div>
);

export const IdentityFields = ({ formData, errors, onChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="text-[10px] text-zinc-400 uppercase font-bold ml-1 mb-1 block">Identidad / Nombre *</label>
      <input
        type="text"
        placeholder="Ej: La Pizzada"
        value={formData.name || ""}
        onChange={(e) => onChange("name", e.target.value)}
        className={getInputClass("name", errors)}
      />
      {errors.name && <p className="text-red-400 text-[10px] mt-1 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
    </div>
    <div>
      <label className="text-[10px] text-zinc-400 uppercase font-bold ml-1 mb-1 block">Instagram Handle *</label>
      <div className="flex items-center">
        <span className={`bg-black/40 border-l border-t border-b ${errors.instagram ? "border-red-500/60" : "border-white/20"} rounded-l-lg px-3 py-2.5 text-zinc-500`}>@</span>
        <input
          type="text"
          placeholder="usuario"
          value={formData.instagram || ""}
          onChange={(e) => onChange("instagram", e.target.value.replace(/^@/, "").trim())}
          className={`w-full bg-black/40 border-r border-t border-b ${errors.instagram ? "border-red-500/60 focus:border-red-400" : "border-white/20 focus:border-purple-500"} rounded-r-lg px-3 py-2.5 text-white focus:outline-none transition-colors font-mono text-sm`}
        />
      </div>
      {errors.instagram && <p className="text-red-400 text-[10px] mt-1 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.instagram}</p>}
    </div>
  </div>
);

export const LocationFields = ({ hasMaps, formData, errors, onChange, onCategoryChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {hasMaps ? (
      <div className="sm:col-span-2">
        <label className="text-[10px] text-purple-300 uppercase font-bold ml-1 mb-1 block">Google Maps URL *</label>
        <input
          type="text"
          placeholder="https://maps.app.goo.gl/..."
          value={formData.mapsUrl || ""}
          onChange={(e) => onChange("mapsUrl", e.target.value)}
          className={`w-full bg-purple-500/5 border ${errors.mapsUrl ? "border-red-500/60 focus:border-red-400" : "border-purple-500/30 focus:border-purple-500"} rounded-lg px-3 py-2.5 text-white focus:outline-none font-mono text-sm`}
        />
        {errors.mapsUrl && <p className="text-red-400 text-[10px] mt-1 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.mapsUrl}</p>}
      </div>
    ) : (
      <>
        <div>
          <label className="text-[10px] text-zinc-400 uppercase font-bold ml-1 mb-1 block">Rubro Principal *</label>
          <select value={formData.category || ""} onChange={(e) => onCategoryChange(e.target.value)} className={getInputClass("category", errors)}>
            <option value="" className="bg-zinc-900">Seleccione Rubro</option>
            {Object.entries(CATEGORY_TAXONOMY).map(([key, data]) => (
              <option key={key} value={key} className="bg-zinc-900">{data.label}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-400 text-[10px] mt-1 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.category}</p>}
        </div>
        <div>
          <label className="text-[10px] text-zinc-400 uppercase font-bold ml-1 mb-1 block">Ciudad *</label>
          <select value={formData.city || ""} onChange={(e) => onChange("city", e.target.value)} className={getInputClass("city", errors)}>
            <option value="" className="bg-zinc-900">Seleccione Ciudad</option>
            {TUCUMAN_CITIES.map((city) => (
              <option key={city} value={city} className="bg-zinc-900">{city}</option>
            ))}
          </select>
          {errors.city && <p className="text-red-400 text-[10px] mt-1 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.city}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="text-[10px] text-zinc-400 uppercase font-bold ml-1 mb-1 block">Dirección Física (Opcional)</label>
          <input
            type="text"
            placeholder="Ej: 25 de Mayo 500"
            value={formData.address || ""}
            onChange={(e) => onChange("address", e.target.value)}
            className={getInputClass("address", errors)}
          />
        </div>
      </>
    )}
  </div>
);

export const ContactFields = ({ formData, errors, onChange }) => (
  <div>
    <label className="text-[10px] text-zinc-400 uppercase font-bold ml-1 mb-1 block">WhatsApp Contacto</label>
    <input
      type="text"
      placeholder="Ej: +549381..."
      value={formData.whatsapp || ""}
      onChange={(e) => onChange("whatsapp", e.target.value.replace(/[^0-9+]/g, ""))}
      className={getInputClass("whatsapp", errors)}
    />
    {formData.whatsapp && (
      <p className="text-zinc-500 text-[10px] mt-1 ml-1">Formateado: {formatWhatsApp(formData.whatsapp)}</p>
    )}
  </div>
);
