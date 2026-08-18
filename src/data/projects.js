// Archivo: src/data/projects.js
// Proyectos del portafolio Nexus OS — source:'mock' excluye del portafolio activo

export const projects = [
    {
        id: 'tucu-red',
        name: 'Tucu Red HQ',
        description: 'Agency Operations & Command Center.',
        status: 'active',
        color: 'from-pink-500 to-rose-500',
        activeAgents: 14,
        managerAgentId: 'tucu_red',
        pendingApprovals: 3,
        lastActivity: 'System Active',
        image: null,
        assetsPath: 'nexus_archives/tucu-red/clients/tucu-red/client-assets.json',
        siteUrl: '#/tucu-red-public',
        source: 'agency'
    },
    {
        id: 'deco-tortas',
        name: 'Deco Tortas',
        description: 'E-commerce platform for custom cake decorations.',
        status: 'idle',
        color: 'from-amber-400 to-orange-500',
        activeAgents: 0,
        managerAgentId: 'deco',
        pendingApprovals: 0,
        lastActivity: 'Not started',
        image: '/project-icons/deco.png',
        source: 'pipeline'
    },
    {
        id: 'atlas',
        name: 'Atlas',
        description: 'Internal knowledge base and documentation system.',
        status: 'idle',
        color: 'from-blue-400 to-indigo-600',
        activeAgents: 0,
        managerAgentId: 'atlas',
        pendingApprovals: 0,
        lastActivity: 'Planned',
        image: '/project-icons/atlas.png',
        source: 'pipeline'
    },
    {
        id: 'licitia',
        name: 'Licítia',
        description: 'Legal tech platform for automated contract analysis.',
        status: 'idle',
        color: 'from-emerald-400 to-teal-600',
        activeAgents: 0,
        managerAgentId: 'licitia',
        pendingApprovals: 0,
        lastActivity: 'Coming Soon',
        image: '/project-icons/licitia.png',
        source: 'pipeline'
    },
    // Mocks desactivados (source:'mock' → filtrados en useClientPortfolio)
    { id: 'adore-tu-esencia', name: 'Adoré tu Esencia', source: 'mock', status: 'idle', color: 'from-amber-400 to-yellow-600', activeAgents: 0, pendingApprovals: 0, lastActivity: '', image: null },
    { id: 'amora-nails',      name: 'Amora Nails',      source: 'mock', status: 'idle', color: 'from-fuchsia-500 to-purple-600', activeAgents: 0, pendingApprovals: 0, lastActivity: '', image: null },
    { id: 'system',           name: 'Nexus System',     source: 'mock', status: 'idle', color: 'from-gray-500 to-slate-600', activeAgents: 0, pendingApprovals: 0, lastActivity: '', image: null },
];
