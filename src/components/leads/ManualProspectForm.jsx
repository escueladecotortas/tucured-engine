// Archivo: frontend/src/components/leads/ManualProspectForm.jsx
import React from "react";
import { Zap, Activity } from "lucide-react";
import { useManualProspect } from "./useManualProspect";
import { 
  FormHeader, UpsellBanner, IdentityFields, 
  LocationFields, ContactFields 
} from "./ProspectFormSections";

/**
 * ManualProspectForm - Orquestador para agregar prospectos manualmente
 */
export default function ManualProspectForm({
  formData,
  onChange,
  onSubmit,
  isExtracting,
  extractionStatus,
}) {
  const {
    hasMaps, setHasMaps, errors,
    handleChange, handleCategoryChange, handleSubmit
  } = useManualProspect(formData, onChange, onSubmit);

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-5">
      <FormHeader hasMaps={hasMaps} setHasMaps={setHasMaps} />

      {!hasMaps && <UpsellBanner />}

      <div className="space-y-4 animate-in fade-in duration-300">
        <IdentityFields formData={formData} errors={errors} onChange={handleChange} />
        
        <LocationFields 
          hasMaps={hasMaps} 
          formData={formData} 
          errors={errors} 
          onChange={handleChange} 
          onCategoryChange={handleCategoryChange} 
        />

        <ContactFields formData={formData} errors={errors} onChange={handleChange} />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isExtracting}
        className={`w-full mt-4 ${isExtracting ? "bg-purple-800 border-purple-500 cursor-not-allowed" : "bg-purple-600 border-transparent hover:bg-purple-500"} border text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-900/40 transition-all flex flex-col items-center justify-center gap-1 group`}
      >
        <div className="flex items-center gap-2">
          {isExtracting ? (
            <Activity className="w-4 h-4 animate-spin text-purple-300" />
          ) : (
            <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
          )}
          {isExtracting ? "Procesando Extracción..." : "Iniciar Extracción (C.Y.B.O.R.G.)"}
        </div>
        {isExtracting && extractionStatus && (
          <div className="text-[10px] text-purple-300 font-mono font-medium animate-pulse mt-1 tracking-wide">
            {extractionStatus}
          </div>
        )}
      </button>
    </div>
  );
}
