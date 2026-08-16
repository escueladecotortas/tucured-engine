import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Clock, ArrowRight } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function Roadmap({ compact = false, projectId }) {
    const [status, setStatus] = useState('onboarding');
    const [deployUrl, setDeployUrl] = useState(null);

    // Map Firestore status to Roadmap steps
    // Statuses: prospect -> generated -> deployed -> live
    useEffect(() => {
        if (!projectId) return;
        const unsub = onSnapshot(doc(db, 'prospects', projectId), (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setStatus(data.status || 'onboarding');
                setDeployUrl(data.deployUrl);
            }
        });
        return () => unsub();
    }, [projectId]);

    const STAGES = [
        { id: 'prospect', label: 'Onboarding', step: 1 },
        { id: 'generated', label: 'Strategy & Build', step: 2 },
        { id: 'deployed', label: 'Deploy & QA', step: 3 },
        { id: 'live', label: 'Live Launch', step: 4 }
    ];

    // Determine current step index
    const currentStepIndex = STAGES.findIndex(s => s.id === status);
    // If status not found (e.g. custom), default to 0
    const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

    const getStageDates = (index) => {
        // Mock dates for "Alive" feel - In real app, fetch from project.dates
        const today = new Date();
        const start = new Date(today);
        start.setDate(today.getDate() - (activeIndex - index) * 7);
        const end = new Date(start);
        end.setDate(start.getDate() + 5);

        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    };

    const currentStage = STAGES[activeIndex];

    return (
        <div className="w-full bg-[#0A0A1A]/50 border border-white/10 rounded-xl p-4 h-full flex flex-col relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] pointer-events-none"></div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-400" /> Roadmap
                </h3>
                <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-mono text-indigo-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                    ACTIVE SPRINT
                </div>
            </div>

            {/* MAIN STAGE DISPLAY (HERO) */}
            <div className="flex-1 flex flex-col justify-center items-center text-center relative z-10 mb-4">
                <div className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em] mb-2">Current Phase</div>
                <h2 className="text-2xl font-bold text-white mb-2">{currentStage.label}</h2>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="bg-white/5 px-2 py-1 rounded border border-white/10">Step {currentStage.step}/4</span>
                    <span>•</span>
                    <span className="text-indigo-400 font-mono">ETA: 2 Days</span>
                </div>
            </div>

            {/* HORIZONTAL STEPPER */}
            <div className="flex items-center justify-between relative px-2">
                {/* Connecting Line */}
                <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-white/10 -z-10">
                    {/* Progress Bar */}
                    <div
                        className="h-full bg-indigo-500 transition-all duration-1000"
                        style={{ width: `${(activeIndex / (STAGES.length - 1)) * 100}%` }}
                    ></div>
                </div>

                {STAGES.map((stage, index) => {
                    const isCompleted = index < activeIndex;
                    const isCurrent = index === activeIndex;

                    return (
                        <div key={stage.id} className="relative group">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10
                                ${isCompleted ? 'bg-[#0A0A1A] border-emerald-500 text-emerald-500' :
                                    isCurrent ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-110' :
                                        'bg-[#0A0A1A] border-gray-700 text-gray-700'}
                            `}>
                                {isCompleted ? <CheckCircle className="w-4 h-4" /> : <span className="text-[10px] font-bold">{index + 1}</span>}
                            </div>

                            {/* Hover Tooltip for inactive steps */}
                            <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-black border border-white/10 px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                                {stage.label}
                            </div>
                        </div>
                    );
                })}
            </div>

            {deployUrl && status === 'live' && (
                <a href={deployUrl} target="_blank" rel="noreferrer" className="mt-6 w-full text-center py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                    VISIT LIVE SITE <ArrowRight className="w-3 h-3" />
                </a>
            )}
        </div>
    );
}
