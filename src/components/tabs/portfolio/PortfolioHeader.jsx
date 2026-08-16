// Archivo: frontend/src/components/tabs/portfolio/PortfolioHeader.jsx
import React from 'react';
import { Search, LayoutGrid, List } from 'lucide-react';

export function PortfolioHeader({ filter, setFilter, searchQuery, setSearchQuery, viewMode, setViewMode }) {
    const filters = ['all', 'active', 'pilot', 'onboarding', 'generated'];

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-white/5 shrink-0">
            <div className="flex gap-2">
                {filters.map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all border border-transparent ${filter === f
                            ? 'bg-indigo-600 text-white border-indigo-500/50 shadow-lg shadow-indigo-500/20'
                            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/10'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search Node..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-600 focus:border-indigo-500/50 focus:bg-indigo-900/10 focus:outline-none transition-all w-48 font-mono"
                    />
                </div>

                <div className="h-6 w-px bg-white/10 mx-1" />

                <div className="flex bg-black/20 rounded-lg p-1 border border-white/10">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-600 hover:text-white'}`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-600 hover:text-white'}`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
