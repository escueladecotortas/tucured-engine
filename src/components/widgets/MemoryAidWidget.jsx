import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Brain, CheckCircle, Trash2, Plus, Terminal } from 'lucide-react';

export default function MemoryAidWidget() {
    const [tasks, setTasks] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);

    // ... logic same ...

    useEffect(() => {
        const q = query(
            collection(db, 'nexus_memory'),
            where('status', '==', 'pending')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            fetched.sort((a, b) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0));
            setTasks(fetched);
        });

        return () => unsubscribe();
    }, []);

    const handleComplete = async (id) => {
        try {
            await deleteDoc(doc(db, 'nexus_memory', id));
        } catch (e) {
            console.error("Error completing task", e);
        }
    };

    return (
        <div className="glass-panel rounded-2xl p-6 flex flex-col h-full max-h-[400px] relative overflow-hidden group border border-white/10 bg-gradient-to-br from-nexus-bg/50 to-nexus-orange/5">
            {/* Nano Texture Overlay */}
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-nexus-orange/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            {/* Header Interactive */}
            <div
                className="flex items-center gap-3 mb-4 relative z-10 cursor-pointer group/header"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className={`p-2 rounded-lg border transition-all duration-300 ${isExpanded ? 'bg-nexus-orange/10 text-nexus-orange border-nexus-orange/20 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'bg-white/5 text-gray-400 border-white/10 group-hover/header:bg-nexus-orange/10 group-hover/header:text-nexus-orange'}`}>
                    <Brain className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold tracking-tight text-white text-sm font-['Outfit'] flex items-center gap-2 uppercase">
                        ENLACE NEURAL
                        {!isExpanded && tasks.length > 0 && <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexus-orange opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-nexus-orange"></span></span>}
                    </h3>
                    <p className="text-[10px] text-nexus-orange/70 uppercase tracking-wider font-semibold transition-colors group-hover/header:text-nexus-orange">
                        {isExpanded ? 'Memoria Activa del Socio' : 'Click para Expandir'}
                    </p>
                </div>
            </div>

            {/* Content Logic */}
            <div className={`flex-1 overflow-y-auto custom-scrollbar relative z-10 transition-all duration-500 ease-in-out ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}`}>

                {!isExpanded ? (
                    /* SUMMARY VIEW (Greeting) */
                    <div className="flex flex-col justify-center h-32 items-center text-center p-4 bg-white/5 rounded-xl border border-white/5 mt-2 backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/5 opacity-50"></div>
                        <span className="text-lg font-['Outfit'] font-light text-white mb-1 relative z-10">
                            Status: <span className="font-bold text-nexus-orange">Sincronizado</span>.
                        </span>
                        {tasks.length > 0 ? (
                            <>
                                <p className="text-xs text-text-muted mb-3 max-w-[200px] relative z-10">
                                    Detectados <strong className="text-white">{tasks.length} temas</strong> en la memoria compartida.
                                </p>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
                                    className="relative z-10 px-4 py-1.5 bg-nexus-orange/10 hover:bg-nexus-orange/20 text-nexus-orange text-xs font-bold uppercase tracking-wider rounded-lg border border-nexus-orange/20 transition-all hover:scale-105 hover:shadow-[0_0_10px_rgba(249,115,22,0.2)]"
                                >
                                    Revisar Pendientes
                                </button>
                            </>
                        ) : (
                            <p className="text-xs text-text-muted relative z-10">
                                Tu memoria está limpia, Socio. <br /> Sistemas nominales.
                            </p>
                        )}
                    </div>
                ) : (
                    /* EXPANDED LIST VIEW */
                    <div className="space-y-3 pr-2 animate-fadeIn">
                        {tasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <CheckCircle className="w-8 h-8 text-gray-600 mb-2 opacity-50" />
                                <span className="text-gray-500 text-xs italic">
                                    Nada pendiente por aquí.
                                </span>
                            </div>
                        ) : (
                            tasks.map(task => (
                                <div key={task.id} className="group/item relative bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 hover:border-nexus-orange/30 transition-all text-sm shadow-sm hover:shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-nexus-orange shrink-0 shadow-[0_0_5px_#F97316]"></div>
                                        <span className="text-gray-200 leading-relaxed font-medium">{task.content}</span>
                                    </div>

                                    {/* Actions Overlay */}
                                    <button
                                        onClick={() => handleComplete(task.id)}
                                        className="absolute top-3 right-3 p-1.5 bg-nexus-success/20 text-nexus-success rounded-lg opacity-0 group-hover/item:opacity-100 transition-all hover:bg-nexus-success hover:text-white border border-nexus-success/30"
                                        title="Marcar como Completado"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}

            </div>

            {/* Footer / Status */}
            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest relative z-10">
                <span>Sync: Active</span>
                <span className="flex items-center gap-1 text-nexus-blue"><div className="w-1.5 h-1.5 rounded-full bg-nexus-cyan animate-pulse shadow-[0_0_8px_#06B6D4]"></div> Cloud Linked</span>
            </div>
        </div>
    );
}
