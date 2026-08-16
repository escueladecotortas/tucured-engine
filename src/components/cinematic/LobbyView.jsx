// Archivo: frontend/src/components/cinematic/LobbyView.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Lock } from 'lucide-react';

export function LobbyView({ bgVideo, bgImage, floors, onFloorSelect }) {
    return (
        <motion.div
            key="lobby"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, transition: { duration: 1 } }}
            className="absolute inset-0"
        >
            <div className="absolute inset-0">
                {bgVideo ? (
                    <video src={bgVideo} autoPlay loop muted className="w-full h-full object-cover" />
                ) : (
                    <img src={bgImage} alt="Lobby" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
            </div>

            <div className="absolute inset-0 flex items-center justify-end pr-[10%]">
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 50 }}
                    className="w-[380px] bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl"
                >
                    <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Directorio</h2>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">Panel de Acceso</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                            <span className="text-[8px] text-emerald-500 font-bold uppercase">Online</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        {floors.map((f) => (
                            <button
                                key={f.floor}
                                disabled={f.locked || f.isCurrent}
                                onClick={() => onFloorSelect(f)}
                                className={`group relative flex items-center justify-between p-4 rounded-xl transition-all ${f.isCurrent ? 'bg-white/5 border border-white/10' : f.locked ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/10 border border-transparent hover:border-white/20'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`text-lg font-mono font-bold w-8 ${f.isCurrent ? 'text-white/40' : 'text-gray-400 group-hover:text-amber-400'}`}>{f.floor}</span>
                                    <span className={`text-sm tracking-wide ${f.isCurrent ? 'text-white/60' : 'text-gray-300 group-hover:text-white'}`}>{f.label}</span>
                                </div>
                                <div>
                                    {f.locked && <Lock className="w-3 h-3 text-gray-500" />}
                                    {!f.locked && !f.isCurrent && <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-400" />}
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
