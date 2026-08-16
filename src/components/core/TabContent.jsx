// Archivo: frontend/src/components/core/TabContent.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './index.jsx';
import { getTabComponent } from './tabcontent/TabMapping';

/**
 * TabContent - Renderizador de contenido por tab
 * Refactorizado para cumplir con la Ley de 200 líneas.
 * 
 * @param {string} selectedTab - Tab activo
 * @param {Object} currentProject - Proyecto actual
 * @param {string} projectId - ID del proyecto
 * @param {Object} activeWidgets - Estado de widgets
 * @param {Array} activities - Lista de actividades para logs
 */
export default function TabContent({
    selectedTab,
    currentProject,
    projectId,
    activeWidgets,
    activities = [],
    selectedAgent = null,
    onAgentClick = null,
    onNavigate = null
}) {
    const widthClass = (activeWidgets['turnero-basic'] || activeWidgets['promo-popup'])
        ? 'col-span-12 lg:col-span-9'
        : 'col-span-12';

    return (
        <div className={`${widthClass} flex flex-col gap-4 overflow-hidden min-h-0 z-10 h-full`}>
            <GlassCard className="flex-1 border-indigo-500/20 shadow-[0_0_50px_-12px_rgba(99,102,241,0.2)] relative h-full">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent to-transparent pointer-events-none"></div>
                <div className="h-full p-1 overflow-hidden relative z-10">
                    <React.Suspense fallback={
                        <div className="flex h-full items-center justify-center text-xs text-indigo-400 animate-pulse">
                            Inicializando Módulo...
                        </div>
                    }>
                        <motion.div
                            key={selectedTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            {getTabComponent(selectedTab, {
                                projectId,
                                currentProject,
                                activities,
                                selectedAgent,
                                onAgentClick,
                                onNavigate
                            })}
                        </motion.div>
                    </React.Suspense>
                </div>
            </GlassCard >
        </div>
    );
}
