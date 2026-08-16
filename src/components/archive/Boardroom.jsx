import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Terminal, Loader2, Hexagon, TrendingUp, CheckCircle, Clock, AlertCircle, DollarSign, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Boardroom({ project, agents, missions, user, onBack }) {
    const [messages, setMessages] = useState([
        { role: 'model', content: `Sistema Neural Activo para ${project?.name || 'Nexus'}. ¿Cuál es tu visión, Operador?\n\n— NEXUS` }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [retryIn, setRetryIn] = useState(0);
    const messagesEndRef = useRef(null);

    // Countdown for retries if quota hit
    useEffect(() => {
        if (retryIn > 0) {
            const timer = setInterval(() => setRetryIn(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [retryIn]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const apiHistory = messages.slice(1).map(m => ({
                role: m.role,
                content: m.content
            }));

            const response = await fetch(`${API_URL}/api/nexus/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    history: apiHistory,
                    projectId: project?.id
                })
            });

            const data = await response.json();

            if (data.error) {
                if (data.details?.includes('429') || data.details?.includes('Quota')) {
                    setMessages(prev => [...prev, { role: 'model', content: `[LIMIT] Saturación de frecuencia detectada (Quota limit). El sistema está enfriando núcleos.\n\n— NEXUS` }]);
                    setRetryIn(45); // Set 45s wait based on common Gemini limits
                } else {
                    setMessages(prev => [...prev, { role: 'model', content: `[ERROR] ${data.error}\n\n— NEXUS` }]);
                }
            } else {
                setMessages(prev => [...prev, { role: 'model', content: data.response }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', content: `[ERROR] Conexión neural perdida. Verifica el backend.\n\n— NEXUS` }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleIgnite = async (mission) => {
        try {
            const response = await fetch(`${API_URL}/api/nexus/ignite-mission`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: project?.id,
                    missionId: mission.id,
                    agentId: mission.agent
                })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setMessages(prev => [...prev, { role: 'model', content: `[IGNICIÓN] Protocolo "${mission.title}" activado. Sincronizando con el Nodo ${mission.agent.toUpperCase()}...\n\n— NEXUS` }]);

        } catch (error) {
            console.error("Ignition failed:", error);
            alert("Error en la secuencia de ignición.");
        }
    };

    const handleDeleteMission = async (missionId) => {
        if (!window.confirm("¿Seguro que quieres eliminar este protocolo?")) return;
        try {
            const { deleteDoc, doc } = await import("firebase/firestore");
            const { db } = await import("../firebase");
            await deleteDoc(doc(db, "projects", project.id, "missions", missionId));
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    // Stats Calculations
    const totalMissions = missions.length;
    const completedMissions = missions.filter(m => m.status === 'done' || m.status === 'completed').length;
    const pendingApprovals = missions.filter(m => m.status === 'pending' || m.status === 'draft').length;

    return (
        <div className="flex flex-col h-full gap-6 font-outfit">

            {/* Top Bar: Live Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard icon={TrendingUp} label="Progreso" value={`${totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0}%`} color="text-cyan-400" />
                <StatCard icon={CheckCircle} label="Completado" value={completedMissions} color="text-green-400" />
                <StatCard icon={Clock} label="Pendiente" value={pendingApprovals} color="text-nexus-amber" pulse={pendingApprovals > 0} />
                <StatCard icon={DollarSign} label="Token Burn" value={`$${project?.tokenBurn?.toFixed(4) || '0.0000'}`} color="text-nexus-orange" />
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                {/* Main Chat Panel (The Architect) */}
                <div className="lg:col-span-8 flex flex-col bg-[#0A0F1A]/80 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
                        <div className="flex items-center gap-3">
                            <Terminal className="w-4 h-4 text-cyan-500" />
                            <span className="text-xs font-mono uppercase tracking-widest text-gray-400">Canal Directo: NEXUS</span>
                        </div>
                        <button
                            onClick={onBack}
                            className="text-[10px] font-mono text-gray-500 hover:text-white uppercase tracking-tighter transition-colors"
                        >
                            &larr; Volver al Dashboard
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed
                                    ${msg.role === 'user'
                                        ? 'bg-nexus-cyan/10 text-cyan-50 border border-nexus-cyan/20'
                                        : 'bg-white/5 text-gray-200 border border-white/5'
                                    }`}
                                >
                                    <div className="whitespace-pre-wrap">{msg.content}</div>
                                </div>
                            </motion.div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-3 text-cyan-400">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-xs font-mono uppercase tracking-tighter">Analizando...</span>
                                </div>
                            </div>
                        )}
                        {retryIn > 0 && (
                            <div className="flex justify-center p-4">
                                <div className="text-[10px] font-mono text-nexus-amber bg-nexus-amber/10 border border-nexus-amber/20 px-4 py-2 rounded-full animate-pulse">
                                    RECONEXIÓN EN {retryIn}s...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 bg-black/40 border-t border-white/5">
                        <div className="flex items-center gap-4 px-4 py-2 bg-white/5 rounded-xl border border-white/10 focus-within:border-nexus-cyan/50 transition-all">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={retryIn > 0 ? "Sistema enfriando núcleos..." : "Consultar al Arquitecto..."}
                                disabled={loading || retryIn > 0}
                                className="flex-1 bg-transparent border-none outline-none text-white text-sm disabled:opacity-30"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || loading || retryIn > 0}
                                className="p-2 text-cyan-500 hover:text-cyan-400 disabled:text-gray-600 transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Side Panel: Approvals & Tasks */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-6 overflow-y-auto backdrop-blur-sm">
                        <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-gray-400 mb-6 border-b border-white/5 pb-2">El Directorio</h4>

                        <div className="space-y-4">
                            {missions.length > 0 ? missions.map((m, i) => (
                                <div key={i} className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-nexus-cyan/30 transition-all group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase tracking-widest ${m.status === 'pending' || m.status === 'draft' ? 'bg-nexus-amber/20 text-nexus-amber' : 'bg-green-500/20 text-green-400'
                                            }`}>
                                            {m.status || 'draft'}
                                        </span>
                                        <Hexagon className="w-3 h-3 text-gray-600 group-hover:text-nexus-cyan transition-colors" />
                                    </div>
                                    <h5 className="text-sm font-bold text-gray-200 mb-1">{m.title}</h5>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-tighter mb-3">Agente: {m.agent || 'Cortez'}</p>

                                    {(m.status === 'pending' || m.status === 'draft') ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleIgnite(m)}
                                                className="flex-1 py-2 bg-nexus-cyan/20 hover:bg-nexus-cyan/40 text-nexus-cyan text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg border border-nexus-cyan/30 transition-all"
                                            >
                                                Aprobar Ignición
                                            </button>
                                            <button
                                                onClick={() => handleDeleteMission(m.id)}
                                                className="p-2 bg-red-500/10 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/20 transition-all"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-[10px] text-gray-500 italic flex items-center gap-2">
                                            <CheckCircle className="w-3 h-3 text-green-500" /> Protocolo en Operación
                                        </div>
                                    )}
                                </div>
                            )) : (
                                <div className="text-center py-8 text-gray-600">
                                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                    <p className="text-xs italic">No hay misiones pendientes de aprobación.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-nexus-cyan/10 to-transparent border border-nexus-cyan/20 rounded-2xl">
                        <h5 className="text-xs font-bold text-nexus-cyan uppercase tracking-widest mb-2">Estado del Nodo: NEXUS</h5>
                        <p className="text-[10px] text-gray-400 leading-relaxed italic">
                            "Operando en modo Arquitecto. El control del gasto y la precisión neural son nominales."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color, pulse = false }) {
    return (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-black/20 ${color} group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-4 h-4 ${pulse ? 'animate-pulse' : ''}`} />
                </div>
                <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{label}</p>
                    <p className={`text-lg font-bold ${color}`}>{value}</p>
                </div>
            </div>
        </div>
    );
}
