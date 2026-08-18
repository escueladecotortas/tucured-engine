// Archivo: src/components/tabs/missions-config.js
// Configuración estática del módulo de Misiones: prioridades, estados, agentes.

import { AlertCircle, Zap, Target, Clock } from 'lucide-react';

export const PRIORITY_CONFIG = {
    critical: { label: 'Crítica', color: 'red',    icon: AlertCircle },
    high:     { label: 'Alta',    color: 'orange', icon: Zap },
    medium:   { label: 'Media',   color: 'yellow', icon: Target },
    low:      { label: 'Baja',    color: 'blue',   icon: Clock }
};

export const STATUS_CONFIG = {
    pending:     { label: 'Pendiente',   color: 'gray',    bg: 'bg-gray-500/10' },
    in_progress: { label: 'En Progreso', color: 'indigo',  bg: 'bg-indigo-500/10' },
    review:      { label: 'En Revisión', color: 'yellow',  bg: 'bg-yellow-500/10' },
    completed:   { label: 'Completada',  color: 'emerald', bg: 'bg-emerald-500/10' },
    blocked:     { label: 'Bloqueada',   color: 'red',     bg: 'bg-red-500/10' }
};

export const AGENTS = [
    { id: 'codi',     name: 'Codi',    role: 'Developer', color: 'cyan' },
    { id: 'atenea',   name: 'Atenea',  role: 'Design',    color: 'purple' },
    { id: 'icaro',    name: 'Ícaro',   role: 'Growth',    color: 'orange' },
    { id: 'lorem',    name: 'Lorem',   role: 'Copy',      color: 'pink' },
    { id: 'argus',    name: 'Argus',   role: 'QA',        color: 'emerald' },
    { id: 'kael',     name: 'Kael',    role: 'DevOps',    color: 'blue' },
    { id: 'nexus',    name: 'Nexus',   role: 'Orchestrator', color: 'indigo' },
    { id: 'tucu-red', name: 'Tucu',    role: 'Manager',   color: 'rose' }
];
