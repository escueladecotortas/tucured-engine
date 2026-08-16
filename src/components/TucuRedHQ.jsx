'use client';
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { projects } from '../data/projects';
import TucuRedHQHeader from './tucured/TucuRedHQHeader';
import StatsSummary from './tucured/StatsSummary';
import ClientGrid from './tucured/ClientGrid';

export default function TucuRedHQ({ onOpenClient }) {
    const [generatedClients, setGeneratedClients] = useState([]);
    const [viewMode, setViewMode] = useState('grid');
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch('/api/prospects')
            .then(res => res.json())
            .then(data => {
                if (data.prospects) {
                    setGeneratedClients(data.prospects.filter(p => p.status === 'generated' || p.status === 'generated_no_deploy'));
                }
            })
            .catch(err => console.error(err));
    }, []);

    const existingClients = projects.filter(p => p.id !== 'tucu-red' && p.status !== 'idle');

    const getSemanticColor = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes('carn') || lower.includes('vaca') || lower.includes('parri') || lower.includes('asado') || lower.includes('burger')) return 'from-red-600 to-rose-700';
        if (lower.includes('helad') || lower.includes('ice') || lower.includes('postre') || lower.includes('dulce') || lower.includes('cream')) return 'from-pink-500 to-fuchsia-600';
        if (lower.includes('pan') || lower.includes('cafe') || lower.includes('pasteleria') || lower.includes('bakery')) return 'from-amber-500 to-orange-600';
        if (lower.includes('verd') || lower.includes('frut') || lower.includes('jardin') || lower.includes('campo') || lower.includes('natural')) return 'from-emerald-500 to-green-600';
        if (lower.includes('farm') || lower.includes('salud') || lower.includes('med') || lower.includes('dent')) return 'from-cyan-500 to-teal-500';
        if (lower.includes('tech') || lower.includes('compu') || lower.includes('cell') || lower.includes('movil')) return 'from-violet-500 to-purple-600';

        const colors = [
            'from-indigo-600 to-blue-600',
            'from-violet-600 to-fuchsia-600',
            'from-teal-600 to-emerald-600',
            'from-orange-500 to-red-500',
            'from-cyan-600 to-blue-600'
        ];
        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    const allClients = [
        ...existingClients.map(c => ({
            ...c,
            source: 'project',
            isGenerated: c.isGenerated || false,
            lastActivity: c.lastActivity === 'Just Now' ? '⚠️ High Traffic Detected from Instagram' : c.lastActivity
        })),
        ...generatedClients.map(c => ({
            id: c.clientId || c.id,
            name: c.name,
            description: `Auto-Generated Instance`,
            status: 'generated',
            deployUrl: c.deployUrl,
            source: 'lead-factory',
            isGenerated: true,
            activeAgents: 1,
            color: getSemanticColor(c.name),
            lastActivity: 'New Site Ready for Deployment'
        }))
    ].filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' ? true : filter === 'generated' ? client.isGenerated : client.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="h-full bg-[#02040A] text-white overflow-y-auto custom-scrollbar font-['Outfit'] p-8 relative">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,\u0076\u0061\u0072(--tw-gradient-stops))] from-indigo-900/10 via-[#02040A] to-[#02040A] pointer-events-none" />
            
            <TucuRedHQHeader 
                title={<>Tucu Red <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">HQ</span></>}
                subtitle="System Online v3.2" 
            />

            <StatsSummary stats={{
                status: 'NOMINAL',
                activeProjects: existingClients.length,
                pendingMissions: 3 // Mocked for now
            }} />

            <ClientGrid 
                clients={allClients} 
                viewMode={viewMode}
                onOpenClient={onOpenClient}
            />
        </div>
    );
}
