/**
 * NEXUS PRO MAX - WORKSPACE DEFINITIONS
 * Define los "Universos" o Unidades de Negocio del sistema.
 */

export const WORKSPACES = {
    NEXUS_OS: {
        id: 'system',
        name: 'NEXUS OS',
        icon: 'Cpu',
        color: 'text-amber-500',
        description: 'System Core & Global Ops',
        collections: {
            clients: 'global_clients',
            projects: 'global_projects'
        }
    },
    TUCU_RED: {
        id: 'tucu-red',
        name: 'Tucu Red Strategy',
        icon: 'Globe', // Lucide Icon Name
        color: 'text-blue-400',
        description: 'Marketing & Digital Expansion',
        collections: {
            clients: 'tucu_red_clients',
            projects: 'tucu_red_projects'
        }
    },
    DECO_TORTAS: {
        id: 'deco-tortas',
        name: 'Deco Tortas Ops',
        icon: 'Cake',
        color: 'text-pink-400',
        description: 'Bakery Operations & Logistics',
        collections: {
            clients: 'deco_tortas_clients',
            projects: 'deco_tortas_orders'
        }
    },
    ATLAS: {
        id: 'atlas',
        name: 'Atlas Strategy',
        icon: 'Globe',
        color: 'text-blue-500', // Matches Agent Color
        description: 'Global Strategic Consulting',
        collections: {
            clients: 'atlas_clients',
            projects: 'atlas_projects'
        }
    },
    LICITIA: {
        id: 'licitia',
        name: 'Licítia Legal',
        icon: 'Shield',
        color: 'text-emerald-500', // Matches Agent Color
        description: 'Legal & Smart Contracts',
        collections: {
            clients: 'licitia_clients',
            projects: 'licitia_cases'
        }
    }
};

export const DEFAULT_WORKSPACE = 'tucu-red';
