'use client';

import React, { useState } from 'react';

export default function StitchDebugPage() {
    const [html, setHtml] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    // Scraper State
    const [keyword, setKeyword] = useState('');
    const [city, setCity] = useState('San Miguel de Tucumán');
    const [scrapedLeads, setScrapedLeads] = useState<any[]>([]);
    const [scraping, setScraping] = useState(false);
    const [statusLog, setStatusLog] = useState<string[]>([]);
    const [deployedUrl, setDeployedUrl] = useState<string | null>(null);

    // SSE Streaming Logic (Alive Interface)
    const startAliveStream = (leadId: string) => {
        // En lugar de golpear el backend cada 5 seg, abrimos una tubería de streaming real
        const eventSource = new EventSource(`/api/alive?leadId=${leadId}`);

        eventSource.addEventListener('agentStatus', (e) => {
            const data = JSON.parse(e.data);
            
            // Actualizamos la UI en tiempo real solo cuando Firestore emita un cambio
            setStatusLog(prev => {
                const newLog = `Estado: ${data.status}`;
                // Avoid duplicating consecutive identical status lines
                if (prev.length > 0 && prev[prev.length - 1] === newLog) return prev;
                return [...prev, newLog];
            });

            if (data.status === 'deployed' && data.deployUrl) {
                setDeployedUrl(data.deployUrl);
                setHtml(null); // Limpiar iframe local
                
                // Misión completada, cortamos el stream para ahorrar recursos del cliente
                eventSource.close();
                alert(`🚀 SITIO DESPLEGADO: ${data.deployUrl}`);
            } else if (data.status === 'not_found' || data.status === 'failed') {
                eventSource.close();
                alert(`⚠️ Proceso detenido. Estado final: ${data.status}`);
            }
        });

        eventSource.addEventListener('error', (e) => {
             console.error('SSE Error:', e);
             eventSource.close();
             // Intentar reconectar o mostrar error
             setStatusLog(prev => [...prev, `[Conexión perdída... reintentando...]`]);
        });
    };

    const handleScrape = async () => {
        if (!keyword || !city) return alert("Ingresá rubro y ciudad");
        setScraping(true);
        try {
            const res = await fetch('http://localhost:5000/api/leads/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keyword, city, limit: 5 })
            });
            const data = await res.json();
            if (data.success) {
                setScrapedLeads(data.leads);
            } else {
                alert("Error scraping: " + data.error);
            }
        } catch (e: any) {
            alert("Error de conexión: " + e.message);
        } finally {
            setScraping(false);
        }
    };

    const generateSite = async (leadData?: any) => {
        setLoading(true);
        console.log("⚡ [DEBUG] Generando sitio para:", leadData?.name);

        try {
            // 1. Si viene del Scraper, tiene datos reales. Si no, usamos Mock iPetra.
            const payload = leadData ? {
                name: leadData.name,
                category: keyword || "Negocio Local",
                address: leadData.address,
                city: city,
                rating: leadData.rating,
                reviews: leadData.reviews,
                phone: "5493816202789", // Placeholder para demo
                photos: [] // Se enriquecerán en el backend
            } : {
                 // Mock iPetra (Fallback Manual)
                 name: "iPetraStore",
                 category: "Tecnología",
                 city: "San Miguel de Tucumán"
            };

            // 2. Disparamos a /api/leads para iniciar el Circuito Soberano (The Director)
            // Esto guardará el lead, enriquecerá con AI y generará el sitio.
            const response = await fetch('http://localhost:5000/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                setStatusLog([`✅ Circuito Iniciado (ID: ${data.id})`, "⏳ Abriendo Tubería de Streaming SSE..."]);
                // Start Alive Stream (Server-Sent Events)
                startAliveStream(data.id);
            } else {
                throw new Error(data.error);
            }

        } catch (e: any) {
             alert(`❌ Error iniciando circuito: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (html) {
        return (
            <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: '#111827' }}>
                <div style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', borderBottom: '1px solid #374151' }}>
                    <span style={{ fontSize: '0.875rem' }}>🟢 Nexus Stitch Preview Mode</span>
                    <button 
                        onClick={() => setHtml(null)} 
                        style={{ backgroundColor: '#DC2626', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                    >
                        Cerrar Monitor
                    </button>
                </div>
                <iframe 
                    srcDoc={html} 
                    style={{ width: '100%', flex: 1, border: 'none' }}
                    title="Preview"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8 text-white">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500 mb-8">
                Nexus Stitch Engine
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
                
                {/* Panel 1: Scraper en Vivo */}
                <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl">
                    <h2 className="text-2xl font-bold mb-4 text-emerald-400 flex items-center gap-2">
                        <span>📡</span> Live Scraper
                    </h2>
                    <p className="text-gray-400 mb-6 text-sm">Validación en tiempo real con Google Maps.</p>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-gray-500 mb-1">KEYWORD</label>
                            <input 
                                type="text" 
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Ej: Pizzería, Estética, Taller..."
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-gray-500 mb-1">CIUDAD</label>
                            <input 
                                type="text" 
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Ej: San Miguel de Tucumán"
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                        <button 
                            onClick={handleScrape}
                            disabled={scraping}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {scraping ? 'Escanenando Frecuencias...' : '🔍 Buscar Oportunidades'}
                        </button>
                    </div>

                    {/* Resultados */}
                    <div className="mt-8 space-y-3 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {scrapedLeads.map((lead, idx) => (
                            <div key={idx} className="bg-gray-900/50 p-4 rounded-xl border border-gray-700 hover:border-emerald-500/50 transition-colors flex justify-between items-center group">
                                <div>
                                    <h3 className="font-bold text-white group-hover:text-emerald-300 transition-colors">{lead.name}</h3>
                                    <p className="text-xs text-gray-400">{lead.address}</p>
                                    <div className="flex gap-2 mt-1">
                                        {lead.rating && <span className="text-xs bg-yellow-400/10 text-yellow-400 px-1.5 py-0.5 rounded">★ {lead.rating}</span>}
                                        {!lead.hasWebsite && <span className="text-xs bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded">NO WEB</span>}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => generateSite(lead)}
                                    className="bg-gray-800 hover:bg-indigo-600 text-gray-300 hover:text-white p-2 rounded-lg transition-all"
                                    title="Generar Sitio para este Lead"
                                >
                                    ⚡
                                </button>
                            </div>
                        ))}
                        {scrapedLeads.length === 0 && !scraping && (
                            <div className="text-center text-gray-600 py-10 font-mono text-sm">
                                [SIN DATOS] Iniciar escaneo...
                            </div>
                        )}
                    </div>
                </div>

                {/* Panel 2: Generador Manual */}
                <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl flex flex-col justify-center text-center">
                    <h2 className="text-2xl font-bold mb-4 text-indigo-400">Generación Sintética</h2>
                    <p className="text-gray-400 mb-8">
                        Usar datos 'mock' para prueba de concepto rápida.
                    </p>
                    <button 
                        onClick={() => generateSite()}
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? 'Tejiendo sitio...' : '🧵 Generar Mock (iPetra)'}
                    </button>
                    <div className="text-xs text-gray-500 font-mono mt-4">
                        Endpoint: POST /api/stitch/generate
                    </div>
                    {/* Status Log */}
                    <div className="mt-4 text-left bg-black/50 p-4 rounded-lg text-xs font-mono text-green-400 h-32 overflow-y-auto">
                        {statusLog.map((log, i) => <div key={i}>{log}</div>)}
                        {deployedUrl && (
                             <a href={deployedUrl} target="_blank" className="block mt-2 text-white bg-green-600 p-2 text-center rounded hover:bg-green-500">
                                 VER SITIO EN VIVO 🚀
                             </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
