// ============================================
// COMMAND PALETTE - Global Access System
// NEXUS PRO v1.0
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Terminal, Zap, Shield, Cpu,
    ArrowRight, Command, FileText, Database,
    Layout, Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Assuming router usage or similar

// Mock Data for Quick Actions
const ACTIONS = [
    { id: 'new-mission', label: 'Ignite New Mission', icon: Zap, type: 'action', shortcut: 'N' },
    { id: 'open-vault', label: 'Open The Vault', icon: Database, type: 'nav', shortcut: 'V' },
    { id: 'view-kpis', label: 'View System KPIs', icon: Layout, type: 'nav', shortcut: 'S' },
    { id: 'agent-lab', label: 'Open Agent Lab', icon: Cpu, type: 'nav', shortcut: 'A' },
];

const AGENTS = [
    { id: 'antigravity', name: 'Antigravity', role: 'Chief Architect', icon: Zap },
    { id: 'nexus', name: 'Nexus', role: 'System Operator', icon: Terminal },
    { id: 'atenea', name: 'Atenea', role: 'Design Lead', icon: 'palette' }, // Mock icon
    { id: 'codi', name: 'Codi', role: 'Code Engineer', icon: 'code' },
    { id: 'icaro', name: 'Ícaro', role: 'Growth Hacker', icon: 'trending-up' },
    { id: 'elara', name: 'Elara', role: 'Archivist', icon: 'folder' },
];

export default function CommandPalette({ isOpen, onClose, onExecute }) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);

    const filteredItems = [
        ...ACTIONS.filter(a => a.label.toLowerCase().includes(query.toLowerCase())),
        ...AGENTS.filter(a => a.name.toLowerCase().includes(query.toLowerCase())).map(a => ({
            ...a,
            type: 'agent',
            label: `Invoke @${a.name}`,
            description: a.role
        }))
    ];

    useEffect(() => {
        if (isOpen) {
            // Small timeout to ensure DOM render
            setTimeout(() => inputRef.current?.focus(), 50);
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Keyboard Navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filteredItems.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredItems[selectedIndex]) {
                    handleSelect(filteredItems[selectedIndex]);
                }
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredItems, selectedIndex, onClose]);

    const handleSelect = (item) => {
        if (onExecute) {
            onExecute(item);
        } else {
            console.log("Executing:", item);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Palette */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className="w-full max-w-2xl bg-[#0A0A1A] border border-white/10 rounded-xl shadow-2xl overflow-hidden relative z-10 flex flex-col"
                >
                    {/* Header / Input */}
                    <div className="flex items-center px-4 py-4 border-b border-white/10 gap-3">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Type a command or search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 bg-transparent text-lg text-white placeholder-gray-500 focus:outline-none font-outfit"
                        />
                        <div className="flex gap-2">
                            <kbd className="hidden sm:inline-block px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-gray-400 font-mono">ESC</kbd>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2 space-y-1">
                        {filteredItems.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                No commands found for "{query}"
                            </div>
                        ) : (
                            filteredItems.map((item, index) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleSelect(item)}
                                    // Mouse enter doesn't auto-scroll usually, but updates selection
                                    onMouseEnter={() => setSelectedIndex(index)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all clickable-scale text-left group
                                        ${index === selectedIndex ? 'bg-indigo-600/20 text-white shadow-sm ring-1 ring-white/10' : 'text-gray-400 hover:bg-white/5'}
                                    `}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-md ${index === selectedIndex ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400'}`}>
                                            {/* Render Icon dynamically if it's a component or fallback */}
                                            {typeof item.icon === 'string' ? <Terminal className="w-4 h-4" /> : <item.icon className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <div className={`text-sm font-medium ${index === selectedIndex ? 'text-white' : 'text-gray-300'}`}>
                                                {item.label}
                                            </div>
                                            {item.description && (
                                                <div className="text-[10px] text-gray-500">
                                                    {item.description}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {item.shortcut && (
                                        <div className="text-xs font-mono opacity-50">
                                            {item.shortcut}
                                        </div>
                                    )}

                                    {/* Enter hint on selection */}
                                    {index === selectedIndex && (
                                        <ArrowRight className="w-4 h-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-black/20 px-4 py-2 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500">
                        <div className="flex gap-4">
                            <span><span className="text-white">↑↓</span> Navigate</span>
                            <span><span className="text-white">↵</span> Select</span>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Command className="w-3 h-3" />
                            <span>Nexus Command</span>
                        </div>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
}
