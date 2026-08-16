// Archivo: frontend/src/components/dashboard/intelligence/IntelligenceTabs.jsx
import React from 'react';

export function IntelligenceTabs({ activeTab, setActiveTab, counts }) {
    const tabs = [
        { id: 'insights', label: 'Transcripciones', count: counts.insights },
        { id: 'needs', label: 'Necesidades', count: counts.needs },
        { id: 'strategy', label: 'Estrategia', count: 3 }
    ];

    return (
        <div className="flex gap-2">
            {tabs.map((tab) => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-widest flex items-center gap-2 ${
                        activeTab === tab.id 
                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5'
                    }`}
                >
                    {tab.label}
                    {tab.count !== undefined && (
                        <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${activeTab === tab.id ? 'bg-white/20' : 'bg-white/5'}`}>
                            {tab.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}
