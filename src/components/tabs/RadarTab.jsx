// Archivo: frontend/src/components/tabs/RadarTab.jsx
import React from 'react';
import MapRadar from '../MapRadar';

const InfoIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const RadarTab = ({ prospects, onSelect }) => (
    <div className="animate-in fade-in zoom-in duration-300 h-full flex flex-col gap-4">
        <div className="glass-panel p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
            <p className="text-xs text-indigo-300 flex items-center gap-2">
                <InfoIcon />
                Visualizando <strong>{prospects.length}</strong> objetivos en el radar táctico.
            </p>
        </div>
        <MapRadar prospects={prospects} onSelect={onSelect} />
    </div>
);

export default RadarTab;
