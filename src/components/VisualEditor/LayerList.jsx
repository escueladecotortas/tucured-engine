import React, { useState } from 'react';
import {
    Image, Type, Link, Box, ChevronDown, ChevronRight,
    Heading, FileText, List, Layout, MousePointer, Filter
} from 'lucide-react';

/**
 * LayerList - Shows all editable elements grouped by section
 * Allows selecting elements from a list instead of clicking on the page
 */
const LayerList = ({ elements, selectedNexusId, onSelectElement, isLoading }) => {
    const [expandedSections, setExpandedSections] = useState({});
    const [showContainers, setShowContainers] = useState(false);
    const [filterType, setFilterType] = useState('all'); // all, image, text, button

    // Icon mapping
    const getIcon = (type) => {
        switch (type) {
            case 'image': return <Image size={14} className="text-purple-400" />;
            case 'heading': return <Heading size={14} className="text-yellow-400" />;
            case 'text': return <FileText size={14} className="text-blue-400" />;
            case 'button': return <Link size={14} className="text-green-400" />;
            case 'container': return <Box size={14} className="text-zinc-500" />;
            case 'list': return <List size={14} className="text-orange-400" />;
            default: return <Layout size={14} className="text-zinc-400" />;
        }
    };

    // Section labels
    const getSectionLabel = (sectionId) => {
        const labels = {
            'hero': '🎯 Hero',
            'header': '📌 Header',
            'experiencia': '✨ Experiencia',
            'portfolio': '🖼️ Portfolio',
            'reviews': '⭐ Reviews',
            'contacto': '📞 Contacto',
            'footer': '📋 Footer',
            'navbar': '🧭 Navegación',
            'other': '📦 Otros'
        };
        return labels[sectionId] || `📁 ${sectionId}`;
    };

    // Group elements by section
    const groupedElements = (elements || []).reduce((acc, el) => {
        // Apply filters
        if (!showContainers && el.isContainer) return acc;
        if (filterType !== 'all' && el.type !== filterType) return acc;

        const section = el.section || 'other';
        if (!acc[section]) acc[section] = [];
        acc[section].push(el);
        return acc;
    }, {});

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Expand all by default on first render
    const sectionKeys = Object.keys(groupedElements);
    if (sectionKeys.length > 0 && Object.keys(expandedSections).length === 0) {
        const initial = {};
        sectionKeys.forEach(s => initial[s] = true);
        setExpandedSections(initial);
    }

    if (isLoading) {
        return (
            <div className="p-4 text-center text-zinc-500 text-sm">
                <div className="animate-pulse">Cargando elementos...</div>
            </div>
        );
    }

    if (!elements || elements.length === 0) {
        return (
            <div className="p-4 text-center text-zinc-500 text-sm">
                No hay elementos editables
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Filters */}
            <div className="p-2 border-b border-white/10 flex gap-1 flex-wrap">
                <button
                    onClick={() => setFilterType('all')}
                    className={`px-2 py-1 text-[10px] rounded ${filterType === 'all' ? 'bg-indigo-500 text-white' : 'bg-black/30 text-zinc-400 hover:bg-black/50'}`}
                >
                    Todos
                </button>
                <button
                    onClick={() => setFilterType('image')}
                    className={`px-2 py-1 text-[10px] rounded ${filterType === 'image' ? 'bg-purple-500 text-white' : 'bg-black/30 text-zinc-400 hover:bg-black/50'}`}
                >
                    🖼️ Imágenes
                </button>
                <button
                    onClick={() => setFilterType('text')}
                    className={`px-2 py-1 text-[10px] rounded ${filterType === 'text' ? 'bg-blue-500 text-white' : 'bg-black/30 text-zinc-400 hover:bg-black/50'}`}
                >
                    📝 Texto
                </button>
                <button
                    onClick={() => setFilterType('button')}
                    className={`px-2 py-1 text-[10px] rounded ${filterType === 'button' ? 'bg-green-500 text-white' : 'bg-black/30 text-zinc-400 hover:bg-black/50'}`}
                >
                    🔗 Botones
                </button>
                <button
                    onClick={() => setShowContainers(!showContainers)}
                    className={`px-2 py-1 text-[10px] rounded flex items-center gap-1 ${showContainers ? 'bg-zinc-600 text-white' : 'bg-black/30 text-zinc-500 hover:bg-black/50'}`}
                    title="Mostrar/ocultar contenedores"
                >
                    <Box size={10} /> {showContainers ? 'Ocultar' : 'Mostrar'} contenedores
                </button>
            </div>

            {/* Element List */}
            <div className="flex-1 overflow-y-auto">
                {sectionKeys.map(section => (
                    <div key={section} className="border-b border-white/5">
                        {/* Section Header */}
                        <button
                            onClick={() => toggleSection(section)}
                            className="w-full px-3 py-2 flex items-center gap-2 text-left hover:bg-white/5 text-sm font-medium text-zinc-300"
                        >
                            {expandedSections[section] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                            {getSectionLabel(section)}
                            <span className="text-[10px] text-zinc-500 ml-auto">
                                {groupedElements[section].length}
                            </span>
                        </button>

                        {/* Section Items */}
                        {expandedSections[section] && (
                            <div className="pb-1">
                                {groupedElements[section].map(el => (
                                    <button
                                        key={el.nexusId}
                                        onClick={() => onSelectElement(el.nexusId)}
                                        className={`w-full px-3 py-1.5 flex items-center gap-2 text-left text-xs transition-colors
                                            ${selectedNexusId === el.nexusId
                                                ? 'bg-indigo-500/30 text-white border-l-2 border-indigo-400'
                                                : 'hover:bg-white/5 text-zinc-400 border-l-2 border-transparent'
                                            }
                                            ${el.isContainer ? 'opacity-60' : ''}
                                            ${el.parentNexusId ? 'pl-6' : 'pl-4'}
                                        `}
                                    >
                                        {getIcon(el.type)}
                                        <span className="truncate flex-1">{el.label}</span>
                                        <span className="text-[9px] text-zinc-600 uppercase">{el.tagName}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Stats */}
            <div className="p-2 border-t border-white/10 text-[10px] text-zinc-500 text-center">
                {elements.length} elementos totales
            </div>
        </div>
    );
};

export default LayerList;
