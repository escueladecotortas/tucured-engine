// Archivo: frontend/src/hooks/useClientPortfolio.js
import { useState, useEffect } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { projects } from '../data/projects';

// Semantic Color Assignment (Orion Protocol)
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

export function useClientPortfolio() {
    const [generatedClients, setGeneratedClients] = useState([]);
    const [viewMode, setViewMode] = useState('grid');
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [clientToDelete, setClientToDelete] = useState(null);

    useEffect(() => {
        fetch('/api/prospects')
            .then(res => res.json())
            .then(data => {
                if (data.prospects) setGeneratedClients(data.prospects);
            })
            .catch(err => console.error(err));
    }, []);

    const existingClients = projects.filter(p => p.id !== 'tucu-red' && p.status !== 'idle');
    const existingIds = new Set(existingClients.map(c => c.id));

    const allClients = [
        ...existingClients.map(c => ({
            ...c,
            source: 'project',
            isGenerated: c.isGenerated || false,
            lastActivity: c.lastActivity === 'Just Now' ? '⚠️ High Traffic Detected from Instagram' : c.lastActivity
        })),
        ...generatedClients
            .filter(c => !existingIds.has(c.clientId || c.id))
            .map(c => ({
                id: c.clientId || c.id,
                name: c.name,
                description: c.description || `Auto-Generated Instance`,
                image: null,
                status: c.status || 'generated',
                deployUrl: c.deployUrl,
                previewUrl: c.previewUrl,
                source: 'db',
                isGenerated: c.status === 'generated',
                activeAgents: 1,
                color: getSemanticColor(c.name),
                lastActivity: c.lastActivity || 'Active in Portfolio'
            }))
    ].filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' ? true : filter === 'generated' ? client.isGenerated : client.status === filter;
        return matchesSearch && matchesFilter;
    });

    const confirmDelete = async () => {
        if (!clientToDelete) return;
        try {
            if (clientToDelete.source === 'db') {
                await deleteDoc(doc(db, 'prospects', clientToDelete.id));
                setGeneratedClients(prev => prev.filter(c => (c.clientId || c.id) !== clientToDelete.id));
                setClientToDelete(null);
            } else {
                alert("Cannot delete hardcoded project from system yet.");
            }
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Error al eliminar: " + error.message);
        }
    };

    return {
        allClients,
        viewMode,
        setViewMode,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        clientToDelete,
        setClientToDelete,
        confirmDelete
    };
}
