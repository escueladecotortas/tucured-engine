// Archivo: src/components/tabs/OverviewV2.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVibration } from "../../hooks/useVibration";
import { PowerGridLayout } from "./overview/PowerGridLayout";

/**
 * OverviewV2 - Panel Principal Operativo Tucu Red
 */
export default function OverviewV2({
  projectId,
  projectData,
  onNavigate,
}) {
  const vibe = useVibration(projectId);
  const [assets] = useState({
    audio: 0, video: 0, image: 0, documents: 0, total: 0,
  });

  return (
    <div className="w-full h-full overflow-hidden bg-slate-950 font-sans text-white relative">
      {/* Fondo plano sobrio con sutil gradiente ambiental */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-black pointer-events-none" />

      <AnimatePresence mode="wait">
        <motion.div
          key={projectId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 w-full h-full"
        >
          <PowerGridLayout 
            vibe={vibe} 
            projectData={projectData} 
            projectId={projectId} 
            assets={assets} 
            onNavigate={onNavigate} 
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
