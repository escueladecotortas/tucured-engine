import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Target, Sparkles, AlertTriangle, Phone, Globe, Star, Navigation } from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet Default Icon Issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons for Status
const createIcon = (color) => new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${color};"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
});

const Icons = {
    new: createIcon('#6366f1'), // Indigo
    ready: createIcon('#10b981'), // Emerald
    generating: createIcon('#3b82f6'), // Blue
    generated: createIcon('#a855f7'), // Purple
    incomplete: createIcon('#eab308'), // Yellow
};

// Map Controller to update view
const MapController = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) map.flyTo(center, 14);
    }, [center, map]);
    return null;
};

export default function MapRadar({ prospects, onSelect }) {
    const [center, setCenter] = useState([-26.8241400, -65.2226000]); // San Miguel de Tucumán default
    const [selectedProspect, setSelectedProspect] = useState(null);
    const [filter, setFilter] = useState('all'); // all, ready, generated

    // Prepare markers with fake coordinates if missing (Simulation for now)
    // In production, scraper should provide lat/lng
    const markers = prospects.map((p, i) => {
        // Deterministic pseudo-random based on ID hash to keep position stable
        const hash = p.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);

        // Base coordinate + Jitter
        // If we had real coords, use them. Else, simulate around Tucuman center
        const lat = p.lat || (-26.8241400 + (Math.sin(hash) * 0.05));
        const lng = p.lng || (-65.2226000 + (Math.cos(hash) * 0.05));

        return { ...p, position: [lat, lng] };
    }).filter(p => {
        if (filter === 'all') return true;
        if (filter === 'ready') return p.status === 'ready' || p.status === 'new';
        if (filter === 'generated') return p.status === 'generated';
        return true;
    });

    return (
        <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
            {/* Map */}
            <MapContainer
                center={center}
                zoom={13}
                style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
                className="z-0"
            >
                {/* Dark Matter Tiles (Voyager) */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <MapController center={center} />

                {markers.map((prospect) => (
                    <Marker
                        key={prospect.id}
                        position={prospect.position}
                        icon={Icons[prospect.status === 'generated' ? 'generated' : (prospect.status === 'ready' ? 'ready' : 'new')] || Icons.new}
                        eventHandlers={{
                            click: () => setSelectedProspect(prospect),
                        }}
                    >
                    </Marker>
                ))}
            </MapContainer>

            {/* Overlay UI: Filters */}
            <div className="absolute top-4 left-4 z-[400] bg-black/80 backdrop-blur-md border border-white/10 p-2 rounded-lg flex flex-col gap-2 shadow-xl">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${filter === 'all' ? 'bg-white/20 text-white' : 'text-zinc-400 hover:text-white'}`}
                >
                    Todos ({prospects.length})
                </button>
                <div className="h-[1px] bg-white/10"></div>
                <button
                    onClick={() => setFilter('ready')}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-2 ${filter === 'ready' ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-400 hover:text-emerald-400'}`}
                >
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    Objetivos
                </button>
                <button
                    onClick={() => setFilter('generated')}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-2 ${filter === 'generated' ? 'bg-purple-500/20 text-purple-400' : 'text-zinc-400 hover:text-purple-400'}`}
                >
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    Conquistados
                </button>
            </div>

            {/* Overlay UI: Selected Prospect Card */}
            {selectedProspect && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] w-[90%] max-w-sm">
                    <div className="bg-zinc-900/90 backdrop-blur-xl border border-indigo-500/30 p-4 rounded-xl shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedProspect(null)}
                            className="absolute top-2 right-2 text-zinc-500 hover:text-white"
                        >
                            <span className="sr-only">Cerrar</span>
                            ✕
                        </button>

                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

                        <div className="flex items-start gap-4 mb-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10 text-lg shadow-inner">
                                {selectedProspect.category ? selectedProspect.category[0].toUpperCase() : '🏢'}
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg leading-tight">{selectedProspect.name}</h3>
                                <p className="text-zinc-400 text-xs flex items-center gap-1 mt-1">
                                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                    <span className="text-white font-bold">{selectedProspect.rating || 'N/A'}</span>
                                    <span className="opacity-50">({selectedProspect.reviews || 0})</span>
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            {selectedProspect.phone && (
                                <div className="text-sm text-zinc-300 flex items-center gap-2 bg-black/30 p-2 rounded">
                                    <Phone className="w-3 h-3 text-indigo-400" />
                                    {selectedProspect.phone}
                                </div>
                            )}
                            {selectedProspect.address && (
                                <div className="text-sm text-zinc-300 flex items-center gap-2 bg-black/30 p-2 rounded truncate">
                                    <Navigation className="w-3 h-3 text-indigo-400" />
                                    <span className="truncate">{selectedProspect.address}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedProspect.name + ' ' + selectedProspect.address)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg font-bold text-xs shadow-lg border border-white/10 flex items-center justify-center gap-2 transition-colors"
                            >
                                <Navigation className="w-3 h-3" />
                                Cómo llegar
                            </a>

                            {selectedProspect.status === 'ready' && (
                                <button
                                    onClick={() => onSelect(selectedProspect)}
                                    className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg font-bold text-xs shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="w-3 h-3" />
                                    Generar Sitio
                                </button>
                            )}
                            {selectedProspect.status === 'generated' && (
                                <a
                                    href={selectedProspect.siteUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-bold text-xs shadow-lg shadow-blue-900/20 text-center flex items-center justify-center gap-2"
                                >
                                    <Globe className="w-3 h-3" />
                                    Ver Web
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}