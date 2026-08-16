// Archivo: frontend/src/components/tabs/WidgetStudio.jsx
import React, { useState, useEffect } from 'react';
import { Package, Plus, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import toast from 'react-hot-toast';
import { STANDARD_WIDGETS_LIST } from '../widgets/library/registry';
import WidgetProductModal from './WidgetProductModal';
import WidgetLibraryGrid from './WidgetLibraryGrid';

/**
 * WidgetStudio Orchestrator
 * Complies with 200-line limit by delegating UI and Modals
 */
export default function WidgetStudio({ projectId }) {
    const [widgets] = useState(STANDARD_WIDGETS_LIST);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [creationMode, setCreationMode] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [configWidget, setConfigWidget] = useState(null);

    useEffect(() => {
        const q = query(collection(db, 'tasks'), where('type', '==', 'widget_request'), where('status', '!=', 'completed'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snap) => setPendingRequests(snap.docs.map(d => ({ id: d.id, ...d.data() }))), (err) => console.error(err));
        return () => unsubscribe();
    }, []);

    const handleCreateRequest = async () => {
        if (!prompt.trim()) return;
        try {
            await addDoc(collection(db, 'tasks'), {
                title: `Forge Widget: ${prompt}`,
                description: `Request to build a new React Widget: ${prompt}`,
                type: 'widget_request', status: 'pending', priority: 'high', assignedTo: 'antigravity',
                createdAt: serverTimestamp(), projectId: projectId || 'system', aiGenerated: true
            });
            toast.success("Sent to Forge!");
            setPrompt('');
            setCreationMode(false);
        } catch (error) { toast.error("Failed to send."); }
    };

    return (
        <div className="h-full flex flex-col bg-[#050510] relative overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0A0A1A]">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Package className="text-indigo-400" /> WIDGET STUDIO</h2>
                    <p className="text-[10px] text-gray-500 font-mono mt-1 uppercase tracking-widest">Library & Forge</p>
                </div>
                <button onClick={() => setCreationMode(!creationMode)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-indigo-900/20">
                    <Plus size={16} /> Request New
                </button>
            </div>

            <AnimatePresence>
                {creationMode && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-8 mt-6">
                        <div className="p-6 bg-[#0F172A] border border-indigo-500/30 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 animate-pulse"></div>
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Terminal size={14} className="text-indigo-400" /> Describe your Widget</h3>
                            <div className="flex gap-4">
                                <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g. 3D Product Slider..." className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none font-mono text-sm" onKeyDown={(e) => e.key === 'Enter' && handleCreateRequest()} autoFocus />
                                <button onClick={handleCreateRequest} className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white font-bold text-sm transition-all">Forge It</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <WidgetLibraryGrid widgets={widgets} pendingRequests={pendingRequests} onSelect={setConfigWidget} />

            <AnimatePresence>
                {configWidget && <WidgetProductModal widget={configWidget} onClose={() => setConfigWidget(null)} />}
            </AnimatePresence>
        </div>
    );
}
