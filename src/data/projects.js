export const projects = [
    {
        id: 'adore-tu-esencia',
        name: 'Adoré tu Esencia',
        description: 'Golden Client Inaugural. Servicios de Bienestar y Marketing Holístico.',
        status: 'onboarding',
        color: 'from-amber-400 to-yellow-600',
        activeAgents: 2, // Nexus + Tucu Red
        managerAgentId: 'tucu_red', 
        pendingApprovals: 1, // Onboarding Pending
        lastActivity: 'Audio Received',
        image: '/clients/adore-tu-esencia/assets/logo.png',
        assetsPath: 'nexus_archives/tucu_red/clients/adore-tu-esencia',
        siteUrl: '/clients/adore-tu-esencia/index.html',
        isGenerated: false, 
        source: 'golden-ticket',
        instagram: 'adoretuesencia' // Added for Neural Factory V4
    },
    {
        id: 'amora-nails',
        name: 'Amora Nails',
        description: 'Premium nail salon. Pilot client for Tucu Red.',
        status: 'pilot',
        color: 'from-fuchsia-500 to-purple-600',
        activeAgents: 3, // Nexus, Elara, Icaro
        managerAgentId: 'tucu_red', // Managed by Tucu Red Agency
        pendingApprovals: 0,
        lastActivity: 'Just Now',
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
        assetsPath: 'nexus_archives/tucu-red/clients/amora-nails/brand-kit.json',
        siteUrl: '/nexus_archives/tucu-red/clients/amora-nails/index.html',
        isGenerated: true, // Enable Preview Button
        source: 'lead-factory'
    },
    {
        id: 'tucu-red',
        name: 'Tucu Red HQ',
        description: 'Agency Operations & Command Center.',
        status: 'active',
        color: 'from-pink-500 to-rose-500',
        activeAgents: 14, // Real System Count
        managerAgentId: 'tucu_red',
        pendingApprovals: 3, // Tasks in pipeline
        lastActivity: 'System Active',
        image: null, // Force use of Icon for cleaner look, or use '/logo.png' if available
        assetsPath: 'nexus_archives/tucu-red/clients/tucu-red/client-assets.json',
        siteUrl: '#/tucu-red-public'
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
        image: '/project-icons/deco.png'
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
        image: '/project-icons/atlas.png'
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
        image: '/project-icons/licitia.png'
    },
    {
        id: 'system',
        name: 'Nexus System',
        description: 'Core Operating System & Building Context.',
        status: 'active',
        color: 'from-gray-500 to-slate-600',
        activeAgents: 14,
        managerAgentId: 'nexus',
        pendingApprovals: 0,
        lastActivity: 'System Active',
        image: null,
        assetsPath: 'nexus_archives/system/assets.json',
        siteUrl: '#/'
    }
];
