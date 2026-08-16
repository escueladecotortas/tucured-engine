import React from 'react';
import { CheckCircle, Circle, FileAudio, FileVideo, FileImage, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ChecklistItem = ({ label, done }) => (
    <div className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
        {done ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4 text-gray-600" />}
        <span className={`text-sm ${done ? 'text-gray-300 decoration-slice' : 'text-gray-500'}`}>{label}</span>
    </div>
);

const AssetStatus = ({ type, count, icon: Icon }) => (
    <div 
        onClick={() => window.location.hash = `#/project/adore-tu-esencia?tab=vault`}
        className="bg-white/5 rounded-lg p-3 flex flex-col items-center justify-center gap-2 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors"
    >
        <Icon className={`w-5 h-5 ${count > 0 ? 'text-amber-400' : 'text-gray-600'}`} />
        <span className="text-xs font-mono text-gray-400">{type}</span>
        <span className="text-lg font-bold text-white">{count}</span>
    </div>
);

export default function WelcomeKitTracker({ project, assets = { audio: 0, video: 0, image: 0, documents: 0 } }) {
    // Assets are now passed from OverviewV2
    
    // Derived checklist states based on real assets
    const hasAudio = assets.audio > 0;
    const hasBrief = assets.documents > 0;
    const hasIdentity = assets.image > 0;

    const steps = [
        { label: "Alta en Firestore (ID: adore-tu-esencia)", done: true },
        { label: "Estructura de Directorios (Raw Inputs)", done: true },
        { label: `Recepción de Activos (${assets.total} items)`, done: assets.total > 0 },
        { label: "Análisis Vibracional (Brief)", done: hasBrief },
        { label: "Generación de Brief (SOP-001)", done: false },
        { label: "Kit de Bienvenida Digital (PDF/Link)", done: false }
    ];

    return (
        <div className="h-full flex flex-col gap-6 p-4">
             {/* Header */}
             <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <Shield className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Golden Client Tracker</h3>
                    <p className="text-xs text-amber-500/80 font-mono tracking-wider">PROTOCOL: INAUGURAL-001</p>
                </div>
             </div>

             {/* Asset Grid */}
             <div className="grid grid-cols-3 gap-4">
                <AssetStatus type="AUDIOS" count={assets.audio} icon={FileAudio} />
                <AssetStatus type="VIDEOS" count={assets.video} icon={FileVideo} />
                <AssetStatus type="IMAGENES" count={assets.image} icon={FileImage} />
             </div>

             {/* Checklist */}
             <div className="flex-1 bg-black/20 rounded-xl border border-white/10 p-4 overflow-y-auto custom-scrollbar">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Secuencia de Activación</h4>
                <div className="flex flex-col">
                    {steps.map((step, i) => (
                        <ChecklistItem key={i} {...step} />
                    ))}
                </div>
             </div>

             {/* Action Button */}
             <button className="w-full py-3 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-lg text-white font-bold text-sm tracking-wide shadow-lg shadow-amber-900/20 hover:shadow-amber-900/40 transition-all flex items-center justify-center gap-2 group">
                <span>INICIAR DECODIFICACIÓN</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </button>
        </div>
    );
}
