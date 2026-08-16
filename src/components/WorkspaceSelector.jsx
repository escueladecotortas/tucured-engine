import React, { useState } from 'react';
import { ChevronDown, Globe, Cake, Cpu, Check, Shield } from 'lucide-react';
import { WORKSPACES } from '../config/nexus.workspaces';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * WORKSPACE SELECTOR (Universe Switcher)
 * Permite cambiar entre unidades de negocio (Tucu Red vs Deco Tortas).
 * @param {string} currentWorkspace - ID del workspace actual
 * @param {function} onWorkspaceChange - Función para actualizar el estado global
 */
const WorkspaceSelector = ({ currentWorkspace, onWorkspaceChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Find full object
    const activeWS = Object.values(WORKSPACES).find(w => w.id === currentWorkspace) || WORKSPACES.TUCU_RED;

    // Icon Mapper
    const IconMap = {
        'Globe': Globe,
        'Cake': Cake,
        'Cpu': Cpu,
        'Shield': Shield
    };
    const ActiveIcon = IconMap[activeWS.icon] || Globe;

    return (
        <div className="relative mb-6 z-50">
            {/* TRIGGER BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 group"
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-2 rounded-lg bg-linear-to-br from-gray-800 to-black border border-white/5 ${activeWS.color}`}>
                        <ActiveIcon size={20} />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-100 truncate group-hover:text-blue-400 transition-colors">
                            {activeWS.name}
                        </h3>
                        <p className="text-[10px] text-gray-400 truncate tracking-wide">
                            {activeWS.description}
                        </p>
                    </div>
                </div>
                <ChevronDown size={16} className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* DROPDOWN MENU */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl ring-1 ring-white/5"
                    >
                        <div className="p-1.5 flex flex-col gap-1">
                            {Object.values(WORKSPACES).map((ws) => {
                                const WSIcon = IconMap[ws.icon];
                                const isActive = currentWorkspace === ws.id;

                                return (
                                    <button
                                        key={ws.id}
                                        onClick={() => {
                                            onWorkspaceChange(ws.id);
                                            setIsOpen(false);
                                        }}
                                        className={`
                                            flex items-center gap-3 p-2.5 rounded-lg w-full text-left transition-all
                                            ${isActive
                                                ? 'bg-blue-500/10 border border-blue-500/20'
                                                : 'hover:bg-white/5 border border-transparent'}
                                        `}
                                    >
                                        <WSIcon
                                            size={18}
                                            className={`${isActive ? ws.color : 'text-gray-500'}`}
                                        />
                                        <div className="flex-1">
                                            <span className={`block text-xs font-semibold ${isActive ? 'text-white' : 'text-gray-400'}`}>
                                                {ws.name}
                                            </span>
                                        </div>
                                        {isActive && <Check size={14} className="text-blue-400" />}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WorkspaceSelector;
