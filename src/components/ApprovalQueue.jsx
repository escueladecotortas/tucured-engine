import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Check, X, MessageSquare, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { Toast } from './Toast';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function ApprovalQueue({ onClose }) {
    const { t } = useLanguage();
    const { currentUser } = useAuth();
    const [approvals, setApprovals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [toast, setToast] = useState(null);
    const [tab, setTab] = useState('pending'); // 'pending' | 'history'

    useEffect(() => {
        let q;
        if (tab === 'pending') {
            q = query(collection(db, 'approvals'), where('status', '==', 'pending'));
        } else {
            q = query(collection(db, 'approvals'), where('status', 'in', ['approved', 'rejected', 'pending']));
            q = query(collection(db, 'approvals'), where('status', 'in', ['approved', 'rejected']));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Client-side sort
            items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            setApprovals(items);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [tab]);

    const handleAction = async (id, action, item) => {
        setProcessingId(id);
        try {
            const response = await fetch('/api/nexus/approve-item', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    approvalId: id,
                    action, // 'approve', 'reject', 'undo'
                    projectId: item.projectId,
                    actor: currentUser?.displayName || currentUser?.email || 'user'
                })
            });

            if (!response.ok) throw new Error('Action failed');

            let msg = 'Processed';
            if (action === 'approve') msg = 'Approved';
            if (action === 'reject') msg = 'Rejected';
            if (action === 'undo') msg = 'Restored to Pending';

            setToast({ type: 'success', message: `Item ${msg} successfully` });
        } catch (error) {
            console.error(error);
            setToast({ type: 'error', message: "Failed to process approval" });
        } finally {
            setProcessingId(null);
            setTimeout(() => setToast(null), 3000);
        }
    };

    return (
        <div className="bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-xl p-4 md:p-6 h-full flex flex-col w-full max-w-2xl relative shadow-2xl">
            <div className="flex flex-col xl:flex-row items-center justify-between mb-4 gap-2 border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-400" />
                    {t('approval.title')}
                </h2>

                <div className="flex items-center gap-3">
                    <div className="flex bg-black/40 rounded-lg p-1">
                        <button
                            onClick={() => setTab('pending')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${tab === 'pending' ? 'bg-white/10 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            {t('approval.pending')}
                        </button>
                        <button
                            onClick={() => setTab('history')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${tab === 'history' ? 'bg-white/10 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            {t('approval.history')}
                        </button>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center text-gray-500 text-xs animate-pulse">Cargando datos...</div>
            ) : approvals.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                    <Check className="w-10 h-10 text-gray-500 mb-2" />
                    <p className="text-sm text-gray-400">
                        {tab === 'pending' ? t('approval.no_pending') : t('approval.no_history')}
                    </p>
                </div>
            ) : (
                <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2">
                    <AnimatePresence>
                        {approvals.map(item => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className={`border rounded-lg p-4 group transition-all ${item.status === 'rejected' ? 'bg-red-900/10 border-red-500/20' :
                                    item.status === 'approved' ? 'bg-green-900/10 border-green-500/20' :
                                        'bg-black/20 border-white/10 hover:border-nexus-cyan/30'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${item.priority === 'critical' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                                        <span className="text-xs text-gray-400 uppercase tracking-wider">{item.type || 'TASK'}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] text-gray-500 font-mono block">
                                            {new Date(item.createdAt?.seconds * 1000).toLocaleDateString()}
                                        </span>
                                        {item.status !== 'pending' && (
                                            <span className={`text-[10px] font-bold uppercase ${item.status === 'approved' ? 'text-green-500' : 'text-red-500'}`}>
                                                {item.status === 'approved' ? t('approval.approve') : t('approval.reject')}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{item.description}</p>

                                {item.previewData && (
                                    <div className="bg-black/40 rounded p-3 mb-4 font-mono text-xs text-gray-300 border-l-2 border-nexus-cyan">
                                        <div className="flex items-center gap-2 mb-1 text-nexus-cyan">
                                            <FileText className="w-3 h-3" /> {t('approval.preview')}
                                        </div>
                                        {item.previewData}
                                    </div>
                                )}

                                {tab === 'pending' && (
                                    <div className="flex items-center gap-3 mt-4">
                                        <button
                                            disabled={processingId === item.id}
                                            onClick={() => handleAction(item.id, 'approve', item)}
                                            className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 hover:border-green-500 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                                        >
                                            {processingId === item.id ? <div className="w-3 h-3 animate-spin rounded-full border-2 border-green-500 border-t-transparent" /> : <Check className="w-4 h-4" />}
                                            {t('approval.approve')}
                                        </button>
                                        <button
                                            disabled={processingId === item.id}
                                            onClick={() => handleAction(item.id, 'reject', item)}
                                            className="px-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 hover:border-red-500 py-2 rounded-lg transition-all"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                {tab === 'history' && (
                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                                        <span className="text-[10px] text-gray-500 font-mono flex items-center gap-2">
                                            {t('approval.decided_by')}: <span className="text-white">{item.decidedBy ? item.decidedBy.toUpperCase() : 'USER'}</span>
                                        </span>
                                        <button
                                            disabled={processingId === item.id}
                                            onClick={() => handleAction(item.id, 'undo', item)}
                                            className="px-3 py-1.5 bg-gray-700/50 hover:bg-gray-600 text-gray-300 text-xs rounded-lg flex items-center gap-2 transition-all"
                                        >
                                            <div className="w-3 h-3 border border-gray-400 rounded-full flex items-center justify-center text-[8px]">↺</div>
                                            {t('approval.undo')}
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
        </div>
    );
}
