import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, limit, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Activity, CheckCircle, Lightbulb, FileCode, Folder, FileText, ExternalLink, Play, CheckSquare } from 'lucide-react';
import DocumentModal from './DocumentModal';

// Component imports from original
import { ProjectCard, ActivityFeedItem } from './NexusDashboard';

export default function EnhancedDashboard() {
    const [activities, setActivities] = useState([]);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [kpis, setKpis] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [showAllTasks, setShowAllTasks] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Activities listener
        const q = query(collection(db, 'nexus_activity'), orderBy('timestamp', 'desc'), limit(15));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate()
            }));
            setActivities(items);
            setLoading(false);
        });

        // Tasks listener
        const tasksQuery = query(collection(db, 'tasks'), orderBy('priority', 'desc'));
        const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
            setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // KPIs loader
        const loadKPIs = async () => {
            const kpisQuery = query(collection(db, 'kpis'), orderBy('date', 'desc'), limit(1));
            const kpisSnapshot = await getDocs(kpisQuery);
            if (!kpisSnapshot.empty) {
                const kpiData = kpisSnapshot.docs[0].data();
                // Calculate intelligent metrics
                const enhancedKPIs = {
                    ...kpiData,
                    intelligent: {
                        automationRate: Math.round((activities.filter(a => a.agent !== 'leo').length / activities.length) * 100) || 0,
                        taskCompletionRate: Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) || 0,
                        agentUtilization: 8, // Total agents available
                        systemUptime: '1h 20m' // From process start
                    }
                };
                setKpis(enhancedKPIs);
            }
        };
        loadKPIs();

        // Documents configuration
        setDocuments([
            { id: 1, name: 'Análisis Mercado', filename: 'nexus_analisis_mercado_tucured.md', category: 'strategy', icon: '📊' },
            { id: 2, name: 'Estrategia Marketing', filename: 'icaro_estrategia_marketing_tucured.md', category: 'marketing', icon: '🎯' },
            { id: 3, name: 'Arquitectura Técnica', filename: 'arquitectura_tecnica_completa.md', category: 'technical', icon: '🏗️' },
            { id: 4, name: 'Guía de Agentes', filename: 'guia_uso_agentes.md', category: 'guide', icon: '📖' },
            { id: 5, name: 'Plan Normalización BD', filename: 'firestore_normalization_plan.md', category: 'technical', icon: '🗄️' },
            { id: 6, name: 'Proyecto Tucu Red', filename: 'proyecto_tucured.md', category: 'project', icon: '📁' },
            { id: 7, name: 'Task Tracker', filename: 'task.md', category: 'tracking', icon: '✅' },
            { id: 8, name: 'Cómo funciona Antigravity', filename: 'como_funciona_antigravity.md', category: 'guide', icon: '🤖' },
        ]);

        // Projects
        setProjects([
            { id: 'tucu-red', name: 'Tucu Red', tagline: 'Conectamos tu negocio', status: 'En Desarrollo', progress: 30 },
            { id: 'nexus-os', name: 'Nexus OS', tagline: 'Sistema de agentes IA', status: 'En Desarrollo', progress: 65 }
        ]);

        return () => { unsubscribe(); unsubscribeTasks(); };
    }, [activities.length, tasks.length]);

    const handleTaskAction = async (task) => {
        console.log('Executing task:', task.id, task.title);

        // Mark task as in-progress in Firestore
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
                alert(`Task "${task.title}" activado. Asignado a: ${task.assignedTo}`);
            }
        } catch (error) {
            console.error('Error activating task:', error);
            alert('Error al activar task: ' + error.message);
        }
    };

    const openDocument = (doc) => {
        setSelectedDocument(doc);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-nexus-bg flex items-center justify-center">
                <div className="text-white">Cargando Dashboard Mejorado...</div>
            </div>
        );
    }

    const tasksToShow = showAllTasks ? tasks : tasks.slice(0, 5);
    const pendingTasks = tasks.filter(t => t.status === 'pending');

    return (
        <div className="min-h-screen bg-nexus-bg p-8">
            <div className="max-w-[1800px] mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Nexus OS</h1>
                        <p className="text-gray-400">Dashboard Completo - Tiempo Real</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm">
                            ● Sistema Activo
                        </span>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* Left Column: Projects + Documents */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Projects */}
                        <div>
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Folder className="w-5 h-5 text-nexus-cyan" />
                                Proyectos Activos
                            </h2>
                            <div className="space-y-4">
                                {projects.map(project => (
                                    <ProjectCard key={project.id} project={project} />
                                ))}
                            </div>
                        </div>

                        {/* Documents Panel */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-purple-400" />
                                Documentos Clave
                            </h3>
                            <div className="space-y-2">
                                {documents.map(doc => (
                                    <button
                                        key={doc.id}
                                        onClick={() => openDocument(doc)}
                                        className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left group"
                                    >
                                        <span className="text-2xl">{doc.icon}</span>
                                        <div className="flex-1">
                                            <p className="text-sm text-white">{doc.name}</p>
                                            <p className="text-xs text-gray-500">{doc.category}</p>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-nexus-cyan" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Intelligent KPIs */}
                        {kpis?.intelligent && (
                            <div className="bg-gradient-to-br from-nexus-cyan/10 to-nexus-purple/10 border border-nexus-cyan/30 rounded-2xl p-6">
                                <h3 className="text-sm font-semibold text-white mb-4">🧠 KPIs Inteligentes</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-400">Automatización</p>
                                        <p className="text-xl font-bold text-white">{kpis.intelligent.automationRate}%</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Finalización Tasks</p>
                                        <p className="text-xl font-bold text-white">{kpis.intelligent.taskCompletionRate}%</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Agentes Activos</p>
                                        <p className="text-xl font-bold text-white">{kpis.intelligent.agentUtilization}/8</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Uptime Sistema</p>
                                        <p className="text-xl font-bold text-white">{kpis.intelligent.systemUptime}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Center Column: Tasks Management */}
                    <div className="xl:col-span-1 space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                    <CheckSquare className="w-4 h-4 text-blue-400" />
                                    Tasks ({pendingTasks.length} Pendientes)
                                </h3>
                                <button
                                    onClick={() => setShowAllTasks(!showAllTasks)}
                                    className="text-xs text-nexus-cyan hover:text-white"
                                >
                                    {showAllTasks ? 'Ver Menos' : `Ver Todas (${tasks.length})`}
                                </button>
                            </div>
                            <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                {tasksToShow.map(task => (
                                    <div key={task.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                                        <div className="flex items-start justify-between mb-2">
                                            <p className="text-sm font-medium text-white flex-1">{task.title}</p>
                                            <span className={`px-2 py-1 text-xs rounded-full ml-2 ${task.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                                                task.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                                    task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mb-2">
                                            {task.projectId} • {task.assignedTo}
                                        </p>
                                        <button
                                            onClick={() => handleTaskAction(task)}
                                            className="w-full px-3 py-1 bg-nexus-cyan/20 hover:bg-nexus-cyan/30 text-nexus-cyan rounded text-xs flex items-center justify-center gap-1 transition-colors"
                                        >
                                            <Play className="w-3 h-3" />
                                            Ejecutar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Basic KPIs */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <p className="text-xs text-gray-400 mb-1">Decisiones</p>
                                <p className="text-2xl font-bold text-green-400">
                                    {activities.filter(a => a.type === 'decision').length}
                                </p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <p className="text-xs text-gray-400 mb-1">Skills</p>
                                <p className="text-2xl font-bold text-yellow-400">
                                    {activities.filter(a => a.type === 'skill').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Activity Feed */}
                    <div className="xl:col-span-1">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-8">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-nexus-cyan" />
                                Actividad Reciente
                            </h2>
                            <div className="space-y-2 max-h-[700px] overflow-y-auto">
                                {activities.length === 0 ? (
                                    <p className="text-gray-500 text-sm text-center py-8">
                                        No hay actividad
                                    </p>
                                ) : (
                                    activities.map(activity => (
                                        <ActivityFeedItem key={activity.id} activity={activity} />
                                    ))
                                )}
                            </div>
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
