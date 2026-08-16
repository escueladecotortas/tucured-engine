// Archivo: frontend/src/components/widgets/NetlifyHealth.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Zap, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';

const NetlifyHealth = () => {
    const [quota, setQuota] = useState({
        used: 85, // En GB o MB dependiendo del plan
        total: 100,
        bandwidthUsed: 42,
        bandwidthTotal: 100,
        buildMinutesUsed: 120,
        buildMinutesTotal: 300,
        status: 'nominal'
    });

    // En un futuro, Kael conectará esto con el Netlify API
    useEffect(() => {
        // Mock fetch de cuotas
    }, []);

    const getProgressColor = (percent) => {
        if (percent > 90) return 'bg-red-500';
        if (percent > 70) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    return (
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Netlify Health</h3>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-400">NOMINAL</span>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-gray-400 uppercase font-bold tracking-tighter">Bandwidth (GB)</span>
                        <span className="text-white font-mono">{quota.bandwidthUsed} / {quota.bandwidthTotal}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(quota.bandwidthUsed / quota.bandwidthTotal) * 100}%` }}
                            className={`h-full ${getProgressColor((quota.bandwidthUsed / quota.bandwidthTotal) * 100)}`}
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-gray-400 uppercase font-bold tracking-tighter">Build Minutes</span>
                        <span className="text-white font-mono">{quota.buildMinutesUsed} / {quota.buildMinutesTotal}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(quota.buildMinutesUsed / quota.buildMinutesTotal) * 100}%` }}
                            className={`h-full ${getProgressColor((quota.buildMinutesUsed / quota.buildMinutesTotal) * 100)}`}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase font-bold">
                    <Zap className="w-3 h-3 text-amber-400" />
                    Fast Builds: ON
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    SSL: Active
                </div>
            </div>
        </div>
    );
};

export default NetlifyHealth;
