// Archivo: frontend/src/components/dashboard/intelligence/StrategicResponse.jsx
import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

export function StrategicResponse({ projectId, createdMissions }) {
    const strategies = [
        { id: "1", title: "Anti-Ansiedad Packs", desc: "Implementar sistema de 'Alertas de Stock' y reserva previa." },
        { id: "2", title: "Captura de Tráfico (QR)", desc: "Diseño de tarjetas con QR code gigante en el packaging." },
        { id: "3", title: "Narrativa de Calidad", desc: "Landing enfocada en Artesanía y Garantía de Entrega." }
    ];

    return (
        <div className="space-y-4">
            <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <h4 className="flex items-center gap-2 text-[10px] font-bold text-amber-400 mb-4 uppercase tracking-widest">
                    <AlertTriangle className="w-3.5 h-3.5" /> Propuestas Estratégicas
                </h4>
                <div className="space-y-4">
                    {strategies.map((s) => (
                        <StrategyCard 
                            key={s.id}
                            step={s.id}
                            title={s.title}
                            desc={s.desc}
                            projectId={projectId}
                            status={createdMissions[s.title]}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function StrategyCard({ step, title, desc, projectId, status }) {
    const [loading, setLoading] = useState(false);

    const handleExecute = async () => {
        if (!projectId) return;
        setLoading(true);
        try {
            await addDoc(collection(db, "tasks"), {
                projectId,
                title: `[STRATEGY] ${title}`,
                description: desc,
                status: 'pending',
                priority: 'high',
                type: 'mission',
                createdAt: new Date(),
                assignedTo: 'nexus'
            });
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className={`flex gap-4 items-start p-3 rounded-lg border transition-all group ${status ? 'bg-white/5 border-white/10' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}>
            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-mono text-[10px] font-bold shrink-0 mt-1">{step}</div>
            <div className="flex-1">
                <h5 className="text-xs font-bold text-gray-200">{title}</h5>
                <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{desc}</p>
            </div>
            
            {status ? (
                <div className={`px-2 py-1 rounded border text-[9px] font-bold flex items-center gap-1 ${status === 'completed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'}`}>
                    <CheckCircle className="w-3 h-3" /> {status.toUpperCase()}
                </div>
            ) : (
                <button onClick={handleExecute} disabled={loading} className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 bg-amber-500 text-black text-[9px] font-bold rounded flex items-center gap-1 disabled:opacity-50">
                    <Zap className="w-3 h-3" /> {loading ? '...' : 'EJECUTAR'}
                </button>
            )}
        </div>
    );
}
