// Archivo: frontend/src/hooks/useStatusData.js
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit, doc } from 'firebase/firestore';
import { db } from '../firebase';

export function useStatusData(projectId) {
    const [projectStatus, setProjectStatus] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!projectId) return;

        const unsubProject = onSnapshot(doc(db, 'prospects', projectId), (doc) => {
            if (doc.exists()) {
                setProjectStatus(doc.data());
            }
        });

        const qTasks = query(collection(db, 'tasks'), where('projectId', '==', projectId));
        const unsubTasks = onSnapshot(qTasks, (snap) => {
            setTasks(snap.docs.map(d => d.data()));
        });

        const qActivity = query(
            collection(db, 'nexus_activity'),
            where('projectId', '==', projectId),
            orderBy('timestamp', 'desc'),
            limit(1)
        );

        let unsubActivity = () => { };
        try {
            unsubActivity = onSnapshot(qActivity, (snap) => {
                if (!snap.empty) setActivity(snap.docs.map(d => d.data()));
            }, (err) => console.log("Activity stream limited."));
        } catch (e) { console.log("Skipping activity stream"); }

        setLoading(false);

        return () => {
            unsubProject();
            unsubTasks();
            unsubActivity();
        };
    }, [projectId]);

    // Metrics Calculation
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const deployDate = projectStatus?.lastDeploy ? new Date(projectStatus.lastDeploy) : null;
    const daysUp = deployDate ? Math.floor((new Date() - deployDate) / (1000 * 60 * 60 * 24)) : 0;

    return {
        projectStatus,
        tasks,
        activity,
        loading,
        metrics: {
            completedTasks,
            totalTasks,
            progress,
            daysUp,
            deployDate
        }
    };
}
