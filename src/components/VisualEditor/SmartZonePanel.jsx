// Archivo: frontend/src/components/VisualEditor/SmartZonePanel.jsx
// Orquestador del panel de zonas visuales.
// Refactorizado de 1020 → 80 líneas. Ley de 200 Líneas cumplida.
// Dependencias atómicas: zone-config, useSmartZone, ZoneModule.

import React from 'react';
import { Plus, Minus, ChevronDown, ChevronRight } from 'lucide-react';
import { ZONE_VISUALS, GROUP_CONFIG } from './zone-config';
import useSmartZone from './useSmartZone';
import ZoneModule from './ZoneModule';

/**
 * SmartZonePanel — Panel de edición estructurado por zonas y grupos.
 * @param {object[]} zones - Zonas a renderizar (actualmente usa ZONE_VISUALS).
 * @param {function} onUpdateStyle - Callback para persistir cambios.
 * @param {string} targetUrl - URL del cliente activo para brand-kit y rutas de activos.
 */
const SmartZonePanel = ({ zones, onUpdateStyle, targetUrl }) => {
    const {
        expandedZone, setExpandedZone,
        activeGroup, setActiveGroup,
        currentStyles, initialStyles,
        brandColors,
        handleUpdate, handleUpdateImages
    } = useSmartZone(targetUrl, onUpdateStyle);

    return (
        <div className="space-y-2">
            {Object.entries(ZONE_VISUALS).map(([zoneKey, config]) => (
                <div key={zoneKey} className="border border-white/10 rounded-xl overflow-hidden bg-zinc-900/50">

                    {/* --- Header de la zona --- */}
                    <button
                        onClick={() => setExpandedZone(expandedZone === zoneKey ? null : zoneKey)}
                        className={`w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors ${expandedZone === zoneKey ? 'bg-indigo-500/10 border-b border-indigo-500/20' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded ${config.bg} ${config.color}`}>
                                <config.icon size={14} />
                            </div>
                            <span className="text-sm font-medium text-zinc-200">{config.label}</span>
                        </div>
                        {expandedZone === zoneKey
                            ? <Minus size={14} className="text-zinc-400" />
                            : <Plus size={14} className="text-zinc-600" />
                        }
                    </button>

                    {/* --- Grupos de la zona --- */}
                    {expandedZone === zoneKey && (
                        <div className="p-2 space-y-2 bg-black/20">
                            {Object.entries(GROUP_CONFIG)
                                .filter(([gKey]) => gKey.startsWith(zoneKey))
                                .map(([gKey, group]) => (
                                    <div key={gKey} className="border border-white/5 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => setActiveGroup(activeGroup === gKey ? null : gKey)}
                                            className="w-full flex items-center justify-between p-2 bg-zinc-800/50 hover:bg-zinc-800 text-xs font-medium text-zinc-400 transition-colors"
                                        >
                                            {group.label}
                                            {activeGroup === gKey ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                        </button>

                                        {activeGroup === gKey && (
                                            <div className="p-2 space-y-3 bg-zinc-900/80">
                                                {group.items.map(item => (
                                                    <ZoneModule
                                                        key={item.id}
                                                        item={item}
                                                        styles={currentStyles[item.id] || {}}
                                                        initialStyles={initialStyles[item.id] || {}}
                                                        brandColors={brandColors}
                                                        onUpdate={(prop, val) => handleUpdate(group, item, prop, val)}
                                                        onUpdateImages={(imgs, nexusId) => handleUpdateImages(group, item, imgs, nexusId)}
                                                        targetUrl={targetUrl}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default SmartZonePanel;
