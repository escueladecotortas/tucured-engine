// ============================================
// SIDEBAR PANEL - Panel lateral de la consola
// Extraído de NexusConsoleRedesign.jsx
// ============================================

import React from 'react';
import { GlassCard } from './index.jsx';

// Lazy imports para widgets del sidebar
const Roadmap = React.lazy(() => import('../Roadmap'));
const CommercialData = React.lazy(() => import('../CommercialData'));
const AgentStatusHub = React.lazy(() => import('../AgentStatusHub'));
const SmartNotepad = React.lazy(() => import('../SmartNotepad'));
const TurneroWidget = React.lazy(() => import('../widgets/TurneroWidget'));
const MemoryAidWidget = React.lazy(() => import('../widgets/MemoryAidWidget'));
const NetlifyHealth = React.lazy(() => import('../widgets/NetlifyHealth'));


/**
 * SidebarPanel - Panel lateral con widgets dinámicos
 * 
 * @param {Object} activeWidgets - Estado de widgets activos {'turnero-basic': bool, 'promo-popup': bool}
 * @param {string} projectId - ID del proyecto actual
 * @param {Object} projectData - Datos del proyecto (para config de widgets)
 */
export default function SidebarPanel({ activeWidgets, projectId, projectData }) {
    // La barra lateral ahora contiene herramientas del sistema (Memoria, Notepad), 
    // por lo que siempre debe renderizarse a menos que se indique lo contrario explícitamente.
    // (Condición anterior de turnero/promo eliminada para permitir herramientas 'Pro')

    // Config del turnero basada en datos del proyecto
    const turneroConfig = {
        businessName: projectData?.name || 'Mi Negocio',
        whatsappNumber: projectData?.phone || projectData?.whatsapp || '',
        workDays: projectData?.workDays || [1, 2, 3, 4, 5, 6],
        startHour: projectData?.startHour || 9,
        endHour: projectData?.endHour || 20,
        slotDuration: projectData?.slotDuration || 60,
    };

    return (
        <div className="col-span-12 lg:col-span-3 h-full overflow-hidden min-h-0 z-20 flex flex-col gap-4">

            {/* Netlify Health Widget - Critical Monitoring */}
            <div className="shrink-0">
                <React.Suspense fallback={<div className="h-24 bg-nexus-card animate-pulse rounded-2xl" />}>
                    <NetlifyHealth />
                </React.Suspense>
            </div>

            {/* Agent Activity Hub (Discreto) */}

            <div className="shrink-0">
                <React.Suspense fallback={<div className="h-20 bg-nexus-card animate-pulse rounded-lg" />}>
                    <AgentStatusHub projectId={projectId} />
                </React.Suspense>
            </div>

            {/* ENLACE NEURAL (Memory Aid) - High Priority */}
            <div className="flex-shrink-0">
                <React.Suspense fallback={<div className="h-32 bg-nexus-card animate-pulse rounded-lg" />}>
                    <MemoryAidWidget />
                </React.Suspense>
            </div>

            {/* Smart Notepad (Utility Only) */}
            <div className="flex-1 min-h-0 relative flex flex-col glass-panel rounded-xl overflow-hidden border border-white/5">
                <div className="p-3 border-b border-white/5 bg-white/5">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Notas Rápidas</span>
                </div>
                <React.Suspense fallback={<div className="p-4 text-xs text-text-muted">Cargando Notas...</div>}>
                    <SmartNotepad clientId={projectId} />
                </React.Suspense>
            </div>
        </div>
    );
}

