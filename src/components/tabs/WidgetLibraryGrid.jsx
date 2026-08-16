// Archivo: frontend/src/components/tabs/WidgetLibraryGrid.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Package, Terminal, Loader, ShoppingCart, Cloud, Layout, Code } from 'lucide-react';

const getIconForWidget = (name) => {
    const n = name.toLowerCase();
    if (n.includes('cart') || n.includes('shop')) return <ShoppingCart className="w-6 h-6 text-orange-400" />;
    if (n.includes('weather') || n.includes('clima')) return <Cloud className="w-6 h-6 text-sky-400" />;
    if (n.includes('chat') || n.includes('whatsapp')) return <Layout className="w-6 h-6 text-green-400" />;
    return <Code className="w-6 h-6 text-indigo-400" />;
};

const WidgetLibraryGrid = ({ widgets, pendingRequests, onSelect }) => (
    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-12">
        {/* Ready to Deploy */}
        <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Package size={16} /> Ready to Deploy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {widgets.map((widget) => (
                    <motion.div key={widget.id} layout className="group relative bg-[#0B0F19] border border-white/5 hover:border-indigo-500/50 rounded-xl p-5 transition-all hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/5 rounded-lg group-hover:bg-indigo-500/10 transition-colors">
                                {getIconForWidget(widget.name)}
                            </div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1 truncate">{widget.name}</h3>
                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-4">{widget.type}</p>
                        <button onClick={() => onSelect(widget)} className="w-full py-2 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-xs font-bold text-indigo-400 border border-indigo-500/20">
                            View Product
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
            <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Terminal size={16} /> The Forge (In Progress)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingRequests.map(req => (
                        <motion.div key={req.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500/50"></div>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-mono text-orange-400 uppercase">Processing</span>
                                <Loader className="w-3 h-3 text-orange-400 animate-spin" />
                            </div>
                            <h4 className="text-white font-bold text-sm mb-1">{req.title.replace('Forge Widget: ', '')}</h4>
                            <p className="text-[10px] text-gray-500">Assigned to: @antigravity</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        )}
    </div>
);

export default WidgetLibraryGrid;
