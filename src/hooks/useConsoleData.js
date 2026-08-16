import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * useConsoleData - Hook para sincronización soberana de datos
 * Implementa Capa 3 del Zero Token Bridge (LocalStorage Persistence)
 */
export function useConsoleData(projectId, staticProject) {
    const [dynamicProject, setDynamicProject] = useState(null);
    const [loadingProject, setLoadingProject] = useState(!staticProject);
    
    // 1. Persistencia de Actividad (Zero Token Capa 3)
    const [activities, setActivities] = useState(() => {
        const cached = localStorage.getItem('nexus_cache_activities');
        return cached ? JSON.parse(cached) : [];
    });

    useEffect(() => {
        const q = query(
            collection(db, 'nexus_activity'),
            orderBy('timestamp', 'desc'),
            limit(50)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newLogs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date()
            }));
            localStorage.setItem('nexus_cache_activities', JSON.stringify(newLogs));
            setActivities(newLogs);
        });
        return () => unsubscribe();
    }, []);

    // 2. Sincronización de Proyecto Dinámico
    useEffect(() => {
        if (!staticProject && projectId) {
            setLoadingProject(true);
            const docRef = doc(db, 'prospects', projectId);
            const unsub = onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setDynamicProject({
                        id: docSnap.id,
                        name: data.name,
                        status: data.status === 'generated' ? 'active' : 'pilot',
                        description: `Generated for ${data.category}`,
                        siteUrl: data.deployUrl,
                        managerAgentId: 'icaro',
                        assetsPath: data.clientPath
                    });
                }
                setLoadingProject(false);
            });
            return () => unsub();
        } else {
            setLoadingProject(false);
        }
    }, [projectId, staticProject]);

    return {
        activities,
        currentProject: staticProject || dynamicProject,
        loadingProject
    };
}
