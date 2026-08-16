// Archivo: frontend/src/components/mobile/DashboardCards.jsx
import React from 'react';
import { Activity, Shield } from 'lucide-react';

export function DashboardCards() {
    const handleTest = async () => {
        try {
            const r = await fetch('/api/nexus/ping');
            const d = await r.json();
            alert(`LINK OK: ${d.server}\nTIME: ${d.time}`);
        } catch (e) { alert(`LINK FAIL: ${e.message}`); }
    };

    return (
        <div className="grid grid-cols-2 gap-3 p-4 shrink-0">
            <button onClick={handleTest} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 flex flex-col items-center justify-center active:scale-95 transition-transform">
                <Activity size={20} className="text-blue-500 mb-1" />
                <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">System Health</span>
                <span className="text-xs font-bold text-blue-400">TAP TO TEST</span>
            </button>
            <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-xl flex flex-col items-center justify-center gap-1">
                <Shield size={18} className="text-amber-500" />
                <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">Security</span>
                <span className="text-xs font-bold text-amber-400">LEVEL 5 SECURE</span>
            </div>
        </div>
    );
}
