import { useMemo } from 'react';

// MAPA DE VIBRACIÓN SSOT
const VIBRATION_MAP = {
    'tucu-red': {
        number: 8,
        archetype: 'POWER',
        palette: { primary: '#FFD700', secondary: '#000000', accent: '#D4AF37' },
        style: 'power-grid'
    },
    'licitia': {
        number: 4,
        archetype: 'STRUCTURE',
        palette: { primary: '#10b981', secondary: '#0f172a', accent: '#34d399' },
        style: 'power-grid'
    },
    'deco-tortas': {
        number: 3,
        archetype: 'CREATOR',
        palette: { primary: '#fb923c', secondary: '#fff1f2', accent: '#f472b6' },
        style: 'creative-flow'
    },
    'atlas': {
        number: 7,
        archetype: 'SAGE',
        palette: { primary: '#3b82f6', secondary: '#020617', accent: '#60a5fa' },
        style: 'zen-focus'
    },
    'amora-nails': {
        number: 6,
        archetype: 'CAREGIVER',
        palette: { primary: '#f43f5e', secondary: '#fff1f2', accent: '#fb7185' },
        style: 'zen-focus' // O Creative Flow suave
    }
};

const DEFAULT_VIBE = {
    number: 1,
    archetype: 'GENESIS',
    palette: { primary: '#6366f1', secondary: '#000000', accent: '#818cf8' },
    style: 'power-grid'
};

export function useVibration(projectId) {
    const vibration = useMemo(() => {
        return VIBRATION_MAP[projectId] || DEFAULT_VIBE;
    }, [projectId]);

    return vibration;
}
