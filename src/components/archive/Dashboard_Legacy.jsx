import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from '../firebase';
import { Hexagon, Star, Activity, Palette, Zap, Layers, RefreshCw, ChevronLeft, Folder, Terminal, X } from 'lucide-react';
import AgentModal from './AgentModal';
import MissionModal from './MissionModal';
import GenesisWizard from './GenesisWizard';
import NexusTerminal from './NexusTerminal';
import Boardroom from './Boardroom';
import ActivityFeed from './ActivityFeed';

// Icon Map
const ICON_MAP = {
    hexagon: Hexagon,
    star: Star,
    "trending-up": Activity,
    palette: Palette
};

export default function Dashboard({ user }) {
    // Determine initial project ID: Default to Nexus Core if self-hosting
    const [currentProjectId, setCurrentProjectId] = useState("nexus-evolution");
    const [view, setView] = useState('boardroom'); // 'overview' or 'boardroom'

    const [project, setProject] = useState(null);
    const [agents, setAgents] = useState([]);
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Neural State (Modals)
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [selectedMission, setSelectedMission] = useState(null);
    const [showWizard, setShowWizard] = useState(false);
    const [showTerminal, setShowTerminal] = useState(false);

    // Project History State
    const [allProjects, setAllProjects] = useState([]);

    // Keyboard Shortcut: CTRL+SPACE opens Terminal (Fallback)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.code === 'Space') {
                e.preventDefault();
                setShowTerminal(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Fetch Trigger (to allow reload)
    const fetchProjectData = async (pid) => {
        setLoading(true);
        try {
            const projectSnap = await getDoc(doc(db, "projects", pid));
            if (projectSnap.exists()) {
                setProject(projectSnap.data());

                // Fetch Agents
                const agentsSnap = await getDocs(collection(db, "projects", pid, "agents"));
                setAgents(agentsSnap.docs.map(d => ({ ...d.data(), id: d.id })));

                // Fetch Missions
                const missionsSnap = await getDocs(collection(db, "projects", pid, "missions"));
                setMissions(missionsSnap.docs.map(d => ({ ...d.data(), id: d.id })));

                // If we are in Nexus Core, fetch ALL projects for history
                if (pid === "nexus-core-v1") {
                    const projectsQ = query(collection(db, "projects"), orderBy("createdAt", "desc"));
                    const projectsSnap = await getDocs(projectsQ);
                    setAllProjects(projectsSnap.docs.map(d => ({ ...d.data(), id: d.id })).filter(p => p.id !== 'nexus-evolution'));
                }
            } else {
                console.error("Project not found:", pid);
                setProject(null);
            }
        } catch (err) {
            console.error("Error fetching project:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectData(currentProjectId);
    }, [currentProjectId]);

    const handleDeleteProject = async (e, projectId) => {
        e.stopPropagation();
        if (!window.confirm("¿Confirmar purga del proyecto? Los datos se perderán en el vacío.")) return;
        try {
            const { deleteDoc, doc } = await import("firebase/firestore");
            await deleteDoc(doc(db, "projects", projectId));
            setAllProjects(prev => prev.filter(p => p.id !== projectId));
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleProjectCreated = (newId) => {
        console.log("🚀 Project Created! Switching to:", newId);
        setCurrentProjectId(newId);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-nexus-bg flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-nexus-cyan w-10 h-10 mb-4" />
                <p className="font-mono text-nexus-cyan animate-pulse">Estableciendo conexión con Nexus...</p>
            </div>
        );
    }

    if (!project) return (
        <div className="min-h-screen bg-nexus-bg flex flex-col items-center justify-center text-white">
            <h1 className="text-4xl font-bold mb-4">Señal Perdida</h1>
            <p className="text-gray-400 mb-8">No se detecta ningún proyecto activo en la frecuencia {currentProjectId}.</p>
            <button
                onClick={() => setCurrentProjectId("nexus-core-v1")}
                className="px-6 py-3 bg-gray-800 text-white font-bold rounded hover:bg-gray-700 transition-colors mb-4"
            >
                Volver al Núcleo
            </button>
            <button
                onClick={() => setShowWizard(true)}
                className="px-6 py-3 bg-nexus-amber text-black font-bold rounded hover:bg-amber-400 transition-colors"
            >
                Iniciar Protocolo Genesis
            </button>
            {showWizard && <GenesisWizard onClose={() => setShowWizard(false)} onProjectCreated={handleProjectCreated} />}
        </div>
    );

    const isNexusCore = currentProjectId === 'nexus-evolution';

    return (
        <div className="min-h-screen bg-nexus-bg text-white p-6 font-outfit relative overflow-hidden flex flex-col">
            {/* Atmosphere */}
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-nexus-amber/5 rounded-full blur-[120px] z-0" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-nexus-orange/5 rounded-full blur-[120px] z-0" />

            {/* TOP NAVIGATION BAR */}
            <header className="relative z-20 flex items-center justify-between mb-8 px-4">
                <div className="flex items-center gap-8">
                    {/* Brand / Title */}
                    <div onClick={() => setCurrentProjectId('nexus-evolution')} className="cursor-pointer group flex items-center gap-3">
                        <Hexagon className="w-8 h-8 text-nexus-cyan animate-pulse-slow" />
                        <div>
                            <h2 className="text-xl font-bold tracking-[0.3em] text-white group-hover:text-nexus-cyan transition-colors">NEXUS CORE NETWORK</h2>
                            <p className="text-[9px] font-mono text-gray-500 uppercase tracking-[0.2em]">{isNexusCore ? 'SISTEMA OPERATIVO CENTRAL' : project?.name}</p>
                        </div>
                    </div>

                    {/* View Switcher */}
                    {!isNexusCore && (
                        <nav className="flex items-center bg-white/5 rounded-full p-1 border border-white/5">
                            <button
                                onClick={() => setView('overview')}
                                className={`px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${view === 'overview' ? 'bg-white/10 text-white shadow-xl' : 'text-gray-500 hover:text-white'}`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setView('boardroom')}
                                className={`px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${view === 'boardroom' ? 'bg-nexus-cyan/20 text-nexus-cyan shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'text-gray-500 hover:text-white'}`}
                            >
                                Boardroom
                            </button>
                        </nav>
                    )}
                </div>

                <div className="flex items-center gap-6">
                    {!isNexusCore && (
                        <button
                            onClick={() => setCurrentProjectId('nexus-evolution')}
                            className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-[.2em] transition-all"
                        >
                            &larr; Volver al Núcleo
                        </button>
                    )}
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest">{user.displayName || 'Operador'}</span>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full animate-pulse ${isNexusCore ? 'bg-nexus-cyan' : 'bg-green-500'}`} />
                                <span className="text-[10px] font-mono text-gray-400">ONLINE</span>
                            </div>
                        </div>
                        <button
                            onClick={() => window.location.reload()} // Simple logout sim for now
                            className="p-2 hover:bg-white/5 rounded-full text-gray-600 hover:text-white transition-all transform hover:rotate-12"
                            title="Cerrar Sesión Local"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="relative z-10 flex-1 w-full max-w-[1600px] mx-auto overflow-hidden">
                <AnimatePresence mode="wait">
                    {view === 'overview' || isNexusCore ? (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full"
                        >
                            {/* AGENT ORBIT */}
                            <div className="lg:col-span-8 p-8 rounded-3xl bg-white/5 border border-white/5 shadow-2xl backdrop-blur-md overflow-y-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-gray-400 font-mono text-xs uppercase tracking-[0.3em]">Red de Nodos Activos</h3>
                                    {isNexusCore && (
                                        <button onClick={() => setShowWizard(true)} className="flex items-center gap-2 px-4 py-2 bg-nexus-cyan/10 border border-nexus-cyan/20 rounded-full text-nexus-cyan text-[10px] font-bold uppercase tracking-widest hover:bg-nexus-cyan/20 transition-all shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                                            <Zap className="w-3 h-3" /> Iniciar Nuevo Proyecto
                                        </button>
                                    )}
                                </div>

                                {isNexusCore && (
                                    <div className="mb-10 p-6 bg-nexus-cyan/5 border border-nexus-cyan/10 rounded-2xl">
                                        <p className="text-xs text-gray-400 leading-relaxed">
                                            <strong className="text-nexus-cyan uppercase tracking-tighter">Estado del Sistema:</strong> Bienvenido al Núcleo de Nexus. Desde aquí puedes orquestar tus proyectos activos o manifestar nuevas realidades. Selecciona un proyecto en el panel derecho para entrar al <span className="text-white font-bold">Boardroom</span>.
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                                    {agents.map((agent, i) => {
                                        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                                        const Icon = ICON_MAP[agent.icon] || Hexagon;
                                        const isActive = agent.status === 'active' || agent.status === 'working';
                                        const dynamicColor = agent.color || project?.theme || '#F59E0B';

                                        return (
                                            <motion.div
                                                key={agent.id}
                                                whileHover={{ y: -5 }}
                                                className="flex flex-col items-center cursor-pointer"
                                                onClick={() => setSelectedAgent(agent)}
                                            >
                                                <div className={`relative w-24 h-24 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 ${isActive ? 'shadow-[0_0_40px_-10px_rgba(245,158,11,0.3)]' : 'grayscale opacity-40'}`}
                                                    style={{ backgroundColor: `${dynamicColor}15`, border: `1px solid ${dynamicColor}30` }}
                                                >
                                                    <Icon className="w-10 h-10" style={{ color: dynamicColor }} />
                                                    {isActive && (
                                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-nexus-bg animate-pulse" />
                                                    )}
                                                </div>
                                                <h4 className="font-bold text-sm tracking-[0.2em]">{agent.id?.toUpperCase() || 'NODE'}</h4>
                                                <p className="text-[10px] text-gray-500 uppercase mt-1 tracking-wider">{agent.role}</p>
                                                {agent.status === 'working' && (
                                                    <span className="text-[9px] text-nexus-cyan font-mono animate-pulse mt-1 text-center max-w-[120px]">
                                                        {agent.current_task || 'Procesando...'}
                                                    </span>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* SIDEBAR: HISTORY / MISSIONS */}
                            <div className="lg:col-span-4 p-8 rounded-3xl bg-white/5 border border-white/5 shadow-2xl backdrop-blur-md overflow-y-auto">
                                {isNexusCore ? (
                                    <>
                                        <h3 className="text-gray-400 font-mono text-xs uppercase tracking-[0.3em] mb-8">Red de Proyectos</h3>
                                        <div className="space-y-4">
                                            {allProjects.map((p) => (
                                                <div key={p.id} onClick={() => setCurrentProjectId(p.id)} className="p-5 rounded-2xl bg-black/20 border border-white/5 hover:border-nexus-cyan/50 hover:bg-white/5 cursor-pointer transition-all flex items-center justify-between group">
                                                    <div>
                                                        <h5 className="font-bold text-gray-200 group-hover:text-nexus-cyan">{p.name}</h5>
                                                        <p className="text-[10px] text-gray-500 uppercase tracking-tighter mt-1">{p.slogan || 'Proyecto Activo'}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Folder className="w-4 h-4 text-gray-600 group-hover:text-nexus-cyan" />
                                                        <button
                                                            onClick={(e) => handleDeleteProject(e, p.id)}
                                                            className="p-1 px-2 text-xs font-bold text-gray-700 hover:text-red-500 hover:bg-red-500/10 rounded transition-all"
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-gray-400 font-mono text-xs uppercase tracking-[0.3em] mb-8">Protocolos Activos</h3>
                                        <div className="space-y-4">
                                            {missions.map((m, i) => (
                                                <div key={i} onClick={() => setSelectedMission(m)} className="p-5 rounded-2xl bg-black/20 border border-white/5 hover:border-nexus-amber/50 cursor-pointer transition-all">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span className="text-[10px] font-mono text-nexus-amber uppercase">{m.agent}</span>
                                                        <Layers className="w-3 h-3 text-gray-600" />
                                                    </div>
                                                    <h5 className="text-sm font-bold text-gray-300 leading-tight">{m.title}</h5>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="boardroom"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full"
                        >
                            <Boardroom
                                project={project}
                                agents={agents}
                                missions={missions}
                                user={user}
                                onBack={() => setView('overview')}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* MODALS */}
            <AnimatePresence>
                {selectedAgent && <AgentModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />}
                {selectedMission && <MissionModal mission={selectedMission} onClose={() => setSelectedMission(null)} />}
                {showWizard && <GenesisWizard onClose={() => setShowWizard(false)} onProjectCreated={handleProjectCreated} />}
                {showTerminal && <NexusTerminal isOpen={showTerminal} onClose={() => setShowTerminal(false)} />}
            </AnimatePresence>

            {/* FLOATING TERMINAL BUTTON */}
            <motion.button
                onClick={() => setShowTerminal(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-cyan-600 hover:bg-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-colors"
                title="CTRL + SPACE"
            >
                <Terminal className="w-6 h-6 text-white" />
            </motion.button>
        </div>
    );
}

function Loader2({ className }) {
    // Re-implementation since it's used in loading state and import might be tricky if not careful
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    )
}
