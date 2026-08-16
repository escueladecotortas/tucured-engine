import { 
    LayoutGrid, Monitor, Target, Cpu, HardDrive, 
    User, Briefcase, Database, Fingerprint, Palette, 
    Trello, Activity, FileText, ScanEye, Shield, Award, Terminal
} from 'lucide-react';

/**
 * getConsoleTabs - Genera el set completo de navegación según el contexto
 */
export const getConsoleTabs = (projectId) => {
    // 1. Definition of all available tabs
    const allTabs = [
        { id: 'overview', label: (projectId === 'system' || projectId === 'tucu-red') ? 'Panel de Control' : 'Monitor Cliente', icon: (projectId === 'system' || projectId === 'tucu-red') ? LayoutGrid : Monitor },
        { id: 'terminal', label: 'Terminal Core', icon: Terminal, colorClass: 'text-emerald-400' },
        { id: 'missions', label: 'Misiones', icon: Target },
        { id: 'agents', label: 'Neural Team', icon: Cpu },
        { id: 'vault', label: 'La Bóveda', icon: HardDrive },
        { id: 'vision', label: 'Biónica Visual', icon: ScanEye, colorClass: 'text-cyan-400' },
        { id: 'showroom', label: 'Arsenal Stitch', icon: LayoutGrid, colorClass: 'text-amber-400' },
        { id: 'widgets', label: 'Estudio Widgets', icon: Palette },
        { id: 'blueprint', label: 'Planos', icon: Trello, colorClass: 'text-indigo-400' },
        { id: 'identity', label: 'Identidad', icon: Fingerprint, colorClass: 'text-pink-400' },
        { id: 'status', label: 'Estado', icon: Activity },
        { id: 'portfolio', label: 'Portafolio', icon: User, colorClass: 'text-indigo-400' },
        { id: 'leads', label: 'Fábrica Leads', icon: Briefcase, colorClass: 'text-fuchsia-400' },
        { id: 'briefing', label: 'Estrategia', icon: FileText, colorClass: 'text-amber-400' },
        { id: 'database', label: 'S-Base', icon: Database, colorClass: 'text-emerald-400' },
        { id: 'shield', label: 'Escudo', icon: Shield, colorClass: 'text-nexus-cyan' },
        { id: 'achievements', label: 'Logros', icon: Award, colorClass: 'text-amber-400' },
        { id: 'library', label: 'Biblioteca', icon: FileText }
    ];

    // 2. Logic for Clients (Non-System, Non-Agency)
    if (projectId !== 'system' && projectId !== 'tucu-red') {
        const clientTabs = ['overview', 'terminal', 'missions', 'briefing', 'vault', 'status', 'identity', 'vision'];
        return allTabs.filter(tab => clientTabs.includes(tab.id));
    }

    // 3. Logic for System/Agency
    return allTabs;
};
