// Archivo: frontend/src/components/tabs/NeuralTeamData.js
import {
    Zap, Terminal, Layout, Code, FileText, TrendingUp,
    Crown, ShoppingBag, Globe, Scale, Archive, Server,
    Shield, Eye
} from 'lucide-react';

export const AGENTS = [
    { id: 'antigravity', name: 'Antigravity', role: 'Chief Architect', color: '#d946ef', icon: Zap, desc: "System Architecture & Impossible Physics" },
    { id: 'nexus', name: 'Nexus', role: 'System Operator', color: '#22d3ee', icon: Terminal, desc: "Orchestration & High-Level Strategy" },
    { id: 'atenea', name: 'Atenea', role: 'Design Lead', color: '#818cf8', icon: Layout, desc: "Visual Systems & User Experience" },
    { id: 'codi', name: 'Codi', role: 'Code Engineer', color: '#34d399', icon: Code, desc: "Full Stack Implementation" },
    { id: 'lorem', name: 'Lorem', role: 'Copywriter', color: '#fbbf24', icon: FileText, desc: "Narrative & Communication" },
    { id: 'icaro', name: 'Ícaro', role: 'Growth Hacker', color: '#f472b6', icon: TrendingUp, desc: "Market penetration & Analytics" },
    { id: 'tucu_red', name: 'Tucu Red', role: 'Agency Manager', color: '#ef4444', icon: Crown, desc: "Client Management & Business Logic" },
    { id: 'deco', name: 'Deco', role: 'E-commerce Lead', color: '#fb923c', icon: ShoppingBag, desc: "Sales & Product Strategy" },
    { id: 'atlas', name: 'Atlas', role: 'Knowledge Base', color: '#3b82f6', icon: Globe, desc: "Research & Data Synthesis" },
    { id: 'licitia', name: 'Licítia', role: 'Legal Tech', color: '#10b981', icon: Scale, desc: "Compliance & Regulations" },
    { id: 'elara', name: 'Elara', role: 'File Archivist', color: '#a78bfa', icon: Archive, desc: "File Organization & Memory" },
    { id: 'kael', name: 'Kael', role: 'SRE Engineer', color: '#64748b', icon: Server, desc: "Reliability & Performance" },
    { id: 'argus', name: 'Argus', role: 'QA Lead', color: '#06b6d4', icon: Eye, desc: "Quality Assurance & Testing" },
    { id: 'orion', name: 'Orion', role: 'Security Chief', color: '#f43f5e', icon: Shield, desc: "System Security & Protection" },
];

export const CORE_TEAM = ['antigravity', 'nexus', 'atenea', 'codi', 'lorem', 'icaro', 'elara', 'kael', 'argus', 'orion'];

export const PROJECT_MANAGERS = {
    'deco-tortas': 'deco',
    'tucu-red': 'tucu_red',
    'atlas': 'atlas',
    'licitia': 'licitia',
    'amora-nails': 'tucu_red'
};

export const getAgentsForProject = (projectId) => {
    const allManagers = ['deco', 'tucu_red', 'atlas', 'licitia'];
    const myManager = PROJECT_MANAGERS[projectId];
    const excludeManagers = allManagers.filter(m => m !== myManager);

    return AGENTS.filter(agent => {
        if (CORE_TEAM.includes(agent.id)) return true;
        if (agent.id === myManager) return true;
        if (excludeManagers.includes(agent.id)) return false;
        return true;
    });
};
