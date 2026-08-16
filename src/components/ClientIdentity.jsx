import React, { useState, useEffect } from 'react';
import { Hash, MapPin, MessageCircle, Instagram, Shield, User, Bot, Crown } from 'lucide-react';
import CredentialManager from './CredentialManager';
import { Terminal, Cpu, Database, Activity, Zap } from 'lucide-react';

const ICONS = {
    Cpu, Shield, Database, Activity, Zap, Terminal, User, Bot, Crown
};

export default function ClientIdentity({ clientName = "Amora Nails", assetsPath, managerAgentId }) {
    const [clientData, setClientData] = useState(null);
    const [managerAgent, setManagerAgent] = useState(null);

    // Fetch Manager Agent
    useEffect(() => {
        if (!managerAgentId) return;
        fetch('/api/nexus/agents/list')
            .then(res => res.json())
            .then(agents => {
                const found = agents.find(a => a.id === managerAgentId);
                setManagerAgent(found);
            })
            .catch(err => console.error("Failed to fetch manager agent", err));
    }, [managerAgentId]);

    useEffect(() => {
        if (!assetsPath) return;

        fetch(`/api/artifact?path=${encodeURIComponent(assetsPath)}`)
            .then(res => res.json())
            .then(data => {
                try {
                    const json = JSON.parse(data.content);
                    setClientData(json);
                } catch (e) {
                    console.error("Failed to parse client assets", e);
                }
            })
            .catch(err => console.error("Failed to load client identity data", err));
    }, [assetsPath]);

    const phoneNumber = clientData?.phone || "+54 381 477-8530"; // Fallback to original if missing
    const instagramHandle = clientData?.instagram || "@amora.nails";

    return (
        <div className="h-full p-6 overflow-y-auto custom-scrollbar space-y-8">
            {/* 1. CREDENTIALS (Business Critical - Top Priority) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CredentialManager clientId="amora-nails" />

                {/* MANAGER AGENT CARD */}
                {managerAgent && (
                    <div className={`rounded-xl border p-6 flex items-start gap-4 transition-all hover:bg-white/5 relative overflow-hidden ${managerAgent.border || 'border-indigo-500/30'} ${managerAgent.bg || 'bg-indigo-500/10'}`}>
                        {/* Background Ambient */}
                        <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-[60px] opacity-20 ${managerAgent.bg?.replace('/10', '') || 'bg-indigo-500'}`}></div>

                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-lg z-10 ${managerAgent.border || 'border-indigo-500'} ${managerAgent.bg || 'bg-indigo-900'}`}>
                            {ICONS[managerAgent.icon] ?
                                React.createElement(ICONS[managerAgent.icon], { className: `w-6 h-6 ${managerAgent.color}` }) :
                                <Bot className="w-6 h-6 text-white" />
                            }
                        </div>

                        <div className="flex-1 z-10">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className={`text-lg font-bold ${managerAgent.color || 'text-white'}`}>{managerAgent.name}</h3>
                                <span className="text-[10px] bg-black/30 border border-white/10 px-2 py-0.5 rounded text-gray-300 uppercase">Project Lead</span>
                            </div>
                            <p className="text-xs text-gray-300 font-mono mb-3">{managerAgent.role}</p>
                            <div className="text-[10px] text-gray-400 bg-black/20 p-2 rounded border border-white/5 italic">
                                "{managerAgent.system_prompt?.split('\n')[0].replace('//', '') || 'System Ready.'}"
                            </div>
                        </div>
                        {/* Status Dot */}
                        <div className="absolute top-4 right-4 flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${managerAgent.color?.replace('text-', 'bg-') || 'bg-emerald-400'}`}></span>
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${managerAgent.color?.replace('text-', 'bg-') || 'bg-emerald-500'}`}></span>
                            </span>
                            <span className="text-[9px] uppercase tracking-wider text-gray-500">Active</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 2. Contact Card */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 relative overflow-hidden h-full">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Contact Vectors
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-white font-medium text-sm">Main Location</h3>
                                <p className="text-gray-400 text-xs mt-1">Juan Bautista Alberdi 720</p>
                                <p className="text-gray-500 text-[10px] mt-0.5">San Miguel de Tucumán, Argentina</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                                <MessageCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-white font-medium text-sm">WhatsApp Business</h3>
                                <p className="text-gray-400 text-xs mt-1">{phoneNumber}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
                                <Instagram className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-white font-medium text-sm">Social Feed</h3>
                                <p className="text-gray-400 text-xs mt-1">{instagramHandle}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Brand DNA */}
                <div className="bg-gradient-to-br from-indigo-900/40 to-black border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
                    <div>
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                            <Hash className="w-4 h-4 text-fuchsia-400" /> Brand DNA
                        </h2>

                        <div className="space-y-6">
                            {/* Colors */}
                            <div>
                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-2">Primary Palette</div>
                                <div className="flex gap-2 flex-wrap">
                                    {(clientData?.brand ? Object.entries(clientData.brand) : []).map(([key, color]) => (
                                        <div
                                            key={key}
                                            className="w-10 h-10 rounded-full border-2 border-white/10 shadow-lg"
                                            style={{ backgroundColor: color }}
                                            title={key}
                                        ></div>
                                    ))}
                                    {!clientData?.brand && (
                                        // Fallback if no data
                                        <>
                                            <div className="w-10 h-10 rounded-full bg-[#E9B8C7] border-2 border-white/10 shadow-lg"></div>
                                            <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border-2 border-white/10 shadow-lg"></div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Voice */}
                            <div>
                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-2">Voice & Tone</div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-indigo-300">Sophisticated</span>
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-indigo-300">Warm</span>
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-indigo-300">Empathetic</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 mt-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Hash className="w-3 h-3 text-fuchsia-400" />
                            <div className="text-[10px] text-fuchsia-400 uppercase tracking-wider">Energy Signature</div>
                        </div>
                        <p className="text-xs text-gray-400 italic">
                            "Business path aligned with creativity and structural growth (Path 4). High resonance with aesthetic transformation."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
