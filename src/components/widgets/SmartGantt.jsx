// Archivo: frontend/src/components/widgets/SmartGantt.jsx
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

// Componentes Atómicos
import { TacticalHeader } from './tactical/TacticalHeader';
import { TaskItem } from './tactical/TaskItem';
import { TacticalFooter, EmptyState } from './tactical/TacticalExtras';

/**
 * RADAR TÁCTICO (Vanguardia 2026)
 * Anteriormente SmartGantt. Monitor de misiones críticas y automaciones.
 * Cumple con la Ley de 200 líneas (< 100 líneas efectivas).
 */
const TacticalCenter = ({ projectId }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [executingId, setExecutingId] = useState(null);

    useEffect(() => {
        const targetId = projectId || 'system';
        const q = query(collection(db, 'tasks'), where('projectId', '==', targetId));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            // Priorización: En Progreso -> Nuevas -> Recientes
            loaded.sort((a, b) => {
                if (a.status === 'in_progress' && b.status !== 'in_progress') return -1;
                if (b.status === 'in_progress' && a.status !== 'in_progress') return 1;
                return (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0);
            });

            setTasks(loaded.filter(t => t.status !== 'completed').slice(0, 6)); 
            setLoading(false);
        });

        return () => unsubscribe();
    }, [projectId]);

    const handleAction = async (task) => {
        if (executingId) return;
        setExecutingId(task.id);
        
        try {
            const taskRef = doc(db, 'tasks', task.id);
            const isFinishing = task.status === 'in_progress' || task.status === 'review';
            
            await updateDoc(taskRef, {
                status: isFinishing ? 'completed' : 'in_progress',
                completedAt: isFinishing ? serverTimestamp() : null,
                updatedAt: serverTimestamp()
            });
        } catch (e) { console.error("Tactical Error:", e); }
        finally { setTimeout(() => setExecutingId(null), 500); }
    };

    return (
        <div className="flex flex-col h-full bg-[#0A0A1A]/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden relative group shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

            <TacticalHeader taskCount={tasks.length} />

            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 relative z-10">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center text-indigo-500/50 gap-4">
                        <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] font-mono tracking-widest uppercase">Escaneando Prioridades...</span>
                    </div>
                ) : tasks.length === 0 ? <EmptyState /> : (
                    <div className="space-y-3">
                        <AnimatePresence>
                            {tasks.map(task => (
                                <TaskItem key={task.id} task={task} executingId={executingId} onAction={handleAction} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
            
            <TacticalFooter projectId={projectId} />
        </div>
    );
};

export default TacticalCenter;
