// Archivo: frontend/src/components/tabs/OverviewV2.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVibration } from "../../hooks/useVibration";
import { getFloorAsset } from "../../config/CinematicConfig";
import { PowerGridLayout } from "./overview/PowerGridLayout";

/**
 * OverviewV2 - Cinematic Project Dashboard
 * Vanguardia 2026: Refactored for Iron Doctrine compliance.
 */
export default function OverviewV2({
  projectId,
  projectData,
  onNavigate,
}) {
  const vibe = useVibration(projectId);
  const [assets, setAssets] = useState({
    audio: 0, video: 0, image: 0, documents: 0, total: 0,
  });

  useEffect(() => {
    // TODO: Implement assets-summary fetch when backend is ready
  }, [projectId]);

  const renderFloor = () => {
    const isNight = new Date().getHours() >= 19 || new Date().getHours() < 6;
    const bgAsset = getFloorAsset(projectId || "system", isNight);

    return (
      <div className="relative w-full h-full bg-black overflow-hidden animate-in fade-in duration-1000">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          {bgAsset ? (
            <img src={bgAsset} alt="Office" className="w-full h-full object-cover opacity-50" />
          ) : (
            <div className="w-full h-full bg-gray-900" />
          )}
          <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/50 to-transparent"></div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 w-full h-full">
          <PowerGridLayout 
            vibe={vibe} 
            projectData={projectData} 
            projectId={projectId} 
            assets={assets} 
            onNavigate={onNavigate} 
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full overflow-hidden bg-black font-sans text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={projectId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-full"
        >
          {renderFloor()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
