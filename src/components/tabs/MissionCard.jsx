// Archivo: frontend/src/components/tabs/MissionCard.jsx
// Tarjeta individual de misión con menú de acciones y botón de ejecución.
// Extraído del monolito MissionsTab.jsx — Ley de 200 Líneas 2026.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, MoreVertical, Trash2, Edit2, Play, PlayCircle, Coins, Server,
    User, Calendar
} from 'lucide-react';
import { PRIORITY_CONFIG, STATUS_CONFIG, AGENTS } from './missions-config';

/**
 * MissionCard — Tarjeta de misión individual con menú de acciones contextual.
 */
const MissionCard = ({ mission, onStatusChange, onDelete, onEdit }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
    const [executing, setExecuting] = useState(false);

    // Resetear confirmación al cerrar el menú
    useEffect(() => {
        if (!showMenu) setIsDeleteConfirm(false);
    }, [showMenu]);

    const handleExecute = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (executing || !mission.automationType) return;
        setExecuting(true);
        try {
            const res = await fetch('/api/automations/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: mission.automationType, context: { missionId: mission.id } })
            });
            if (res.ok) onStatusChange(mission.id, 'completed');
            else console.error('Error ejecutando misión');
        } catch (err) {
            console.error(err);
        } finally {
            setExecuting(false);
        }
    };

    const priority = PRIORITY_CONFIG[mission.priority] || PRIORITY_CONFIG.medium;
    const status = STATUS_CONFIG[mission.status] || STATUS_CONFIG.pending;
    const agent = AGENTS.find(a => a.id === mission.assignedTo);

    return (
        <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className={`p-4 rounded-xl border transition-all hover:border-white/20 ${status.bg} border-${status.color}-500/20`}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Toggle completado */}
                    <button
                        onClick={() => onStatusChange(mission.id, mission.status === 'completed' ? 'pending' : 'completed')}
                        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${mission.status === 'completed' ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600 hover:border-white'}`}>
                        {mission.status === 'completed' && <CheckCircle className="w-3 h-3 text-white" />}
                    </button>
                    <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-medium mb-1 ${mission.status === 'completed' ? 'text-gray-500 line-through' : 'text-white'}`}>
                            {mission.title}
                        </h4>
                        {mission.description && <p className="text-xs text-gray-500 mb-2 line-clamp-2">{mission.description}</p>}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-${priority.color}-500/10 text-${priority.color}-400 border border-${priority.color}-500/20`}>
                                <priority.icon className="w-3 h-3" /> {priority.label}
                            </span>
                            {agent && (
                                <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-${agent.color}-500/10 text-${agent.color}-400`}>
                                    <User className="w-3 h-3" /> @{agent.name}
                                </span>
                            )}
                            {mission.dueDate && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-gray-500">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(mission.dueDate.seconds * 1000).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                                </span>
                            )}
                            {mission.automationType && (
                                <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${mission.requiresTokens ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                    {mission.requiresTokens ? <Coins className="w-3 h-3" /> : <Server className="w-3 h-3" />}
                                    {mission.requiresTokens ? 'Tokens IA' : 'Gratis/Local'}
                                </span>
                            )}
                        </div>
                        {/* Botón ejecutar automatización */}
                        {mission.automationType && mission.status !== 'completed' && (
                            <div className="mt-3 pt-3 border-t border-white/5 flex gap-2">
                                <button onClick={handleExecute} disabled={executing}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[10px] font-bold rounded-lg transition-all shadow-lg shadow-indigo-500/20">
                                    {executing
                                        ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        : <PlayCircle className="w-3.5 h-3.5 fill-current" />}
                                    {executing ? 'EJECUTANDO...' : 'EJECUTAR MISIÓN'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {/* Menú contextual */}
                <div className="relative">
                    <button onClick={() => setShowMenu(!showMenu)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                    <AnimatePresence>
                        {showMenu && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 top-8 bg-zinc-900 border border-white/10 rounded-lg shadow-xl z-50 py-1 min-w-[140px]">
                                <button onClick={() => { onEdit(mission); setShowMenu(false); }}
                                    className="w-full px-3 py-2 text-xs text-left text-gray-300 hover:bg-white/5 flex items-center gap-2">
                                    <Edit2 className="w-3 h-3" /> Editar
                                </button>
                                <button onClick={() => { onStatusChange(mission.id, 'in_progress'); setShowMenu(false); }}
                                    className="w-full px-3 py-2 text-xs text-left text-indigo-400 hover:bg-white/5 flex items-center gap-2">
                                    <Play className="w-3 h-3" /> Iniciar
                                </button>
                                {isDeleteConfirm ? (
                                    <button onClick={() => { onDelete(mission.id); setIsDeleteConfirm(false); setShowMenu(false); }}
                                        className="w-full px-3 py-2 text-xs text-left text-white bg-red-500/80 hover:bg-red-500 flex items-center gap-2 font-bold">
                                        <Trash2 className="w-3 h-3" /> ¿CONFIRMAR?
                                    </button>
                                ) : (
                                    <button onClick={() => setIsDeleteConfirm(true)}
                                        className="w-full px-3 py-2 text-xs text-left text-red-400 hover:bg-white/5 flex items-center gap-2">
                                        <Trash2 className="w-3 h-3" /> Eliminar
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default MissionCard;
