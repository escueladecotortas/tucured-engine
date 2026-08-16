// Archivo: frontend/src/components/tabs/NeuralFactoryHeader.jsx
import React from 'react';

const NeuralFactoryHeader = ({ activeTab, setActiveTab, tabs }) => (
    <div className="flex-none p-6 pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
            <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">Neural Factory</h2>
            <p className="text-sm text-zinc-400">Plataforma de Operaciones Tácticas v3.0</p>
        </div>

        <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-white/10 backdrop-blur-md">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === tab.id
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                        : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                >
                    <tab.icon className="w-3 h-3" />
                    {tab.label}
                </button>
            ))}
        </div>
    </div>
);

export default NeuralFactoryHeader;
