// Archivo: frontend/src/components/tabs/overview/PowerGridLayout.jsx
import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import TokenObservabilityWidget from '../../widgets/TokenObservabilityWidget';
import WelcomeKitTracker from '../../dashboard/WelcomeKitTracker';
import SmartGantt from '../../widgets/SmartGantt';
import { KpiBar } from './KpiBar';

export function PowerGridLayout({ vibe, projectData, projectId, assets, onNavigate }) {
    return (
        <div className="flex flex-col h-full animate-in fade-in duration-1000 relative">
            <KpiBar vibe={vibe} projectData={projectData} />

            <div className="flex-1 p-4 lg:p-8 flex flex-col gap-6 overflow-hidden max-w-7xl mx-auto w-full">
                {/* Upper Section: Observability */}
                {(projectId === "system" || projectId === "tucu-red") && (
                    <div className="shrink-0 animate-in slide-in-from-top-4 duration-700">
                        <TokenObservabilityWidget vibe={vibe} />
                    </div>
                )}

                {/* Lower Section: Smart Gantt & Tracking */}
                <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-6">
                    {projectId === "adore-tu-esencia" ? (
                        <>
                            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shrink-0">
                                <WelcomeKitTracker project={projectData} assets={assets} />
                            </div>

                            <div
                                onClick={() => onNavigate && onNavigate("briefing")}
                                className="shrink-0 h-[100px] bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-fuchsia-500/20 rounded-lg group-hover:bg-fuchsia-500/30 transition-colors">
                                        <Clock className="w-6 h-6 text-fuchsia-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Estrategia & Inteligencia</h3>
                                        <p className="text-xs text-gray-400 font-mono">5 Audios Procesados • 12 Needs Detected</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                            </div>
                        </>
                    ) : (
                        <div className="h-full animate-in slide-in-from-bottom-8 duration-700">
                            <SmartGantt projectId={projectId} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
