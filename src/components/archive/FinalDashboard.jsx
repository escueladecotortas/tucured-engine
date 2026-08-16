import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, limit, onSnapshot, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Activity, CheckCircle, Lightbulb, Folder, FileText, Play, X, Sparkles } from 'lucide-react';
import DocumentModal from './DocumentModal';
import { ProjectCard, ActivityFeedItem } from './NexusDashboard';

export default function FinalDashboard() {
    const [activities, setActivities] = useState([]);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [kpis, setKpis] = useState(null);
    const [documents, setDocuments] = useState({});
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [selectedProject, setSelectedProject] = useState('all');
    const [loading, setLoading] = useState(true);
    const [taskFeedback, setTaskFeedback] = useState(null);

    useEffect(() => {
        // Activities listener
        const q = query(collection(db, 'nexus_activity'), orderBy('timestamp', 'desc'), limit(20));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setActivities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), timestamp: doc.data().timestamp?.toDate() })));
            setLoading(false);
        });

        // Tasks listener (with filter)
        const tasksQuery = selectedProject === 'all'
            ? query(collection(db, 'tasks'), orderBy('priority', 'desc'))
            : query(collection(db, 'tasks'), where('projectId', '==', selectedProject), orderBy('priority', 'desc'));

        const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
            setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // KPIs with intelligent metrics
        const loadKPIs = async () => {
            const kpisSnapshot = await getDocs(query(collection(db, 'kpis'), orderBy('date', 'desc'), limit(1)));
            if (!kpisSnapshot.empty) {
                const kpiData = kpisSnapshot.docs[0].data();
                setKpis({
                    ...kpiData,
                    intelligent: {
                        automationRate: Math.round((activities.filter(a => a.agent !== 'leo').length / Math.max(activities.length, 1)) * 100),
                        taskCompletionRate: Math.round((tasks.filter(t => t.status === 'completed').length / Math.max(tasks.length, 1)) * 100),
                        activeAgents: new Set(activities.map(a => a.agent)).size
                    }
                });
            }
        };
        loadKPIs();

        // Documents organized by project
        setDocuments({
            'tucu-red': [
                { id: 1, name: 'Análisis de Mercado', filename: 'nexus_analisis_mercado_tucured.md', icon: '📊' },
                { id: 2, name: 'Estrategia Marketing', filename: 'icaro_estrategia_marketing_tucured.md', icon: '🎯' },
                { id: 3, name: 'Proyecto Def.', filename: 'proyecto_tucured.md', icon: '📁' },
            ],
            'nexus-os': [
                { id: 4, name: 'Arquitectura Técnica', filename: 'arquitectura_tecnica_completa.md', icon: '🏗️' },
                { id: 5, name: 'Guía de Agentes', filename: 'guia_uso_agentes.md', icon: '📖' },
                { id: 6, name: 'Normalización BD', filename: 'firestore_normalization_plan.md', icon: '🗄️' },
                { id: 7, name: 'Cómo funciona Antigravity', filename: 'como_funciona_antigravity.md', icon: '🤖' },
                { id: 8, name: 'Task Tracker', filename: 'task.md', icon: '✅' },
            ]
        });

        // Projects
        setProjects([
            { id: 'tucu-red', name: 'Tucu Red', emoji: '🔴', color: 'from-orange-500 to-red-600', textColor: 'text-orange-400', progress: 30 },
            { id: 'nexus-os', name: 'Nexus OS', emoji: '⚡', color: 'from-cyan-500 to-purple-600', textColor: 'text-cyan-400', progress: 65 }
        ]);

        return () => { unsubscribe(); unsubscribeTasks(); };
    }, [selectedProject, activities.length, tasks.length]);

    const handleTaskAction = async (task) => {
        setTaskFeedback({ task: task.title, status: 'loading' });

        try {
            const response = await fetch('http://localhost:3000/api/activity/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'chat',
                    message: `⏳ Task iniciado: ${task.title}`,
                    agent: task.assignedTo,
                    projectId: task.projectId
                })
            });

            if (response.ok) {
                setTaskFeedback({ task: task.title, status: 'success' });
                setTimeout(() => setTaskFeedback(null), 3000);
            } else {
                throw new Error('Error del servidor');
            }
        } catch (error) {
            setTaskFeedback({ task: task.title, status: 'error', message: error.message });
            setTimeout(() => setTaskFeedback(null), 5000);
        }
    };

    const filteredTasks = selectedProject === 'all' ? tasks : tasks.filter(t => t.projectId === selectedProject);
    const filteredActivities = selectedProject === 'all' ? activities : activities.filter(a => a.projectId === selectedProject);
    const currentDocs = selectedProject === 'all'
        ? (documents['tucu-red'] || []).concat(documents['nexus-os'] || [])
        : (documents[selectedProject] || []);

    if (loading) {
        return (
            <div className="min-h-screen bg-nexus-bg flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-nexus-cyan animate-spin" />
                    <p className="text-white text-lg">Cargando Nexus OS...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-nexus-bg p-6">
            <div className="max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-nexus-cyan" />
                        Nexus OS Dashboard
                    </h1>

                    {/* Modern AI Filter - Chips instead of dropdown */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">Proyecto:</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedProject('all')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedProject === 'all'
                                        ? 'bg-gradient-to-r from-nexus-cyan to-nexus-purple text-white shadow-lg shadow-nexus-cyan/50'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Todos
                                </span>
                            </button>
                            {projects.map(project => (
                                <button
                                    key={project.id}
                                    onClick={() => setSelectedProject(project.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedProject === project.id
                                            ? `bg-gradient-to-r ${project.color} text-white shadow-lg`
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <span>{project.emoji}</span>
                                        {project.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Task Feedback Toast */}
                <AnimatePresence>
                    {taskFeedback && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.9 }}
                            className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl border backdrop-blur-lg ${taskFeedback.status === 'loading' ? 'bg-blue-500/20 border-blue-400' :
                                    taskFeedback.status === 'success' ? 'bg-green-500/20 border-green-400' :
                                        'bg-red-500/20 border-red-400'
                                }`}
                        >
                            <p className="text-white font-medium">
                                {taskFeedback.status === 'loading' && `⏳ Ejecutando: ${taskFeedback.task}`}
                                {taskFeedback.status === 'success' && `✅ Task activado: ${taskFeedback.task}`}
                                {taskFeedback.status === 'error' && `❌ Error: ${taskFeedback.message}`}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Column 1: Projects + Docs */}
                    <div className="space-y-6">
                        {/* Projects */}
                        <div>
                            <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                <Folder className="w-4 h-4 text-nexus-cyan" />
                                Proyectos ({selectedProject === 'all' ? projects.length : 1})
                            </h2>
                            <div className="space-y-3">
                                {projects
                                    .filter(p => selectedProject === 'all' || p.id === selectedProject)
                                    .map(project => (
                                        <motion.div
                                            key={project.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`bg-gradient-to-br ${project.color} p-5 rounded-xl shadow-lg`}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-2xl">{project.emoji}</span>
                                                <h3 className="text-white font-bold">{project.name}</h3>
                                            </div>
                                            <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${project.progress}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className="bg-white h-2 rounded-full"
                                                ></motion.div>
                                            </div>
                                            <p className="text-white/80 text-xs">{project.progress}% completo</p>
                                        </motion.div>
                                    ))}
                            </div>
                        </div>

                        {/* Documents */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-purple-400" />
                                Documentos ({currentDocs.length})
                            </h3>
                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                {currentDocs.map(doc => (
                                    <button
                                        key={doc.id}
                                        onClick={() => setSelectedDocument(doc)}
                                        className="w-full flex items-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-left group border border-transparent hover:border-purple-400/50"
                                    >
                                        <span className="text-xl">{doc.icon}</span>
                                        <span className="text-sm text-white flex-1 group-hover:text-purple-300 transition-colors">{doc.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* KPIs */}
                        {kpis?.intelligent && (
                            <div className="bg-gradient-to-br from-nexus-cyan/10 to-nexus-purple/10 border border-nexus-cyan/30 rounded-xl p-5">
                                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-nexus-cyan" />
                                    Métricas Inteligentes
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <p className="text-3xl font-bold text-nexus-cyan">{kpis.intelligent.automationRate}%</p>
                                        <p className="text-xs text-gray-400 mt-1">Automatización</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-nexus-purple">{kpis.intelligent.taskCompletionRate}%</p>
                                        <p className="text-xs text-gray-400 mt-1">Completados</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Column 2: Tasks */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Tasks ({filteredTasks.filter(t => t.status === 'pending').length} Pendientes)
                        </h3>
                        <div className="space-y-3 max-h-[700px] overflow-y-auto">
                            {filteredTasks.map(task => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-nexus-cyan/50 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <p className="text-sm font-medium text-white flex-1 leading-snug">{task.title}</p>
                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${task.priority === 'critical' ? 'bg-red-500/30 text-red-300 border border-red-400/50' :
                                                task.priority === 'high' ? 'bg-orange-500/30 text-orange-300 border border-orange-400/50' :
                                                    task.priority === 'medium' ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-400/50' :
                                                        'bg-gray-500/30 text-gray-300 border border-gray-400/50'
                                            }`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-3 flex items-center gap-2">
                                        <span>{task.assignedTo}</span>
                                        <span>•</span>
                                        <span>{task.estimatedTime}</span>
                                    </p>
                                    <button
                                        onClick={() => handleTaskAction(task)}
                                        className="w-full px-4 py-2 bg-gradient-to-r from-nexus-cyan to-nexus-purple hover:shadow-lg hover:shadow-nexus-cyan/50 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Play className="w-4 h-4" />
                                        Activar Task
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Column 3: Activity */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-nexus-cyan" />
                            Actividad Reciente
                        </h2>
                        <div className="space-y-2 max-h-[700px] overflow-y-auto">
                            {filteredActivities.map(activity => (
                                <ActivityFeedItem key={activity.id} activity={activity} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Document Modal */}
                {selectedDocument && (
                    <DocumentModal document={selectedDocument} onClose={() => setSelectedDocument(null)} />
                )}
            </div>
        </div>
    );
}
