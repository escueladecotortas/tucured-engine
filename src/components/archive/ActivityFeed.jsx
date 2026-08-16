import { motion, AnimatePresence } from 'framer-motion';
import { Activity, CheckCircle, Plus, MessageSquare, Trash2, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const activityIcons = {
    project_created: { icon: Plus, color: 'text-green-400', bg: 'bg-green-500/10' },
    mission_approved: { icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    chat_message: { icon: MessageSquare, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    item_deleted: { icon: Trash2, color: 'text-red-400', bg: 'bg-red-500/10' },
    default: { icon: Activity, color: 'text-gray-400', bg: 'bg-gray-500/10' }
};

export default function ActivityFeed({ maxItems = 10 }) {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, 'activity'),
            orderBy('timestamp', 'desc'),
            limit(maxItems)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setActivities(items);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [maxItems]);

    const getTimeAgo = (timestamp) => {
        if (!timestamp) return 'hace un momento';
        const seconds = Math.floor((Date.now() - timestamp.toMillis()) / 1000);

        if (seconds < 60) return 'hace un momento';
        if (seconds < 3600) return `hace ${Math.floor(seconds / 60)} min`;
        if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)}h`;
        return `hace ${Math.floor(seconds / 86400)}d`;
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white/5 rounded-lg p-4 animate-pulse">
                        <div className="h-4 bg-white/10 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-nexus-cyan" />
                <h3 className="font-mono text-sm uppercase tracking-wider text-gray-400">
                    Activity Feed
                </h3>
            </div>

            <AnimatePresence mode="popLayout">
                {activities.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8 text-gray-500 text-sm"
                    >
                        No hay actividad reciente
                    </motion.div>
                ) : (
                    activities.map((activity, index) => {
                        const config = activityIcons[activity.type] || activityIcons.default;
                        const Icon = config.icon;

                        return (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`${config.bg} p-2 rounded-lg`}>
                                        <Icon className={`w-4 h-4 ${config.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-medium">
                                            {activity.message}
                                        </p>
                                        {activity.details && (
                                            <p className="text-gray-400 text-xs mt-1">
                                                {activity.details}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                                            <Clock className="w-3 h-3" />
                                            <span>{getTimeAgo(activity.timestamp)}</span>
                                            {activity.agent && (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-nexus-cyan">
                                                        {activity.agent}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </AnimatePresence>
        </div>
    );
}
