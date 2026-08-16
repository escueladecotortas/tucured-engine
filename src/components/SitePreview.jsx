import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor, Edit3, ExternalLink, Layers, MousePointer2 } from 'lucide-react';

export default function SitePreview({ url = "/nexus_archives/tucu-red/clients/amora-nails/index.html" }) {
    const [activeDevice, setActiveDevice] = useState('mobile'); // 'mobile', 'tablet', 'desktop'

    const handleEdit = () => {
        window.location.hash = `#/visual-editor?url=${encodeURIComponent(url)}`;
    };

    // Device Specs for Realism
    // We scale the "Real" resolution down to fit the "Visual" container
    // UPDATE: Upsized Visual Container by 1.6x to fill new Grid Layout
    const devices = {
        desktop: {
            specs: { width: 1920, height: 1080 }, // Real 1080p
            visual: { width: 1024, height: 576 },  // 1.6x of 640x360
            scale: 0.5333, // 1024 / 1920
            styles: {
                zIndex: activeDevice === 'desktop' ? 30 : 10,
                opacity: activeDevice === 'desktop' ? 1 : 0.4,
                scale: activeDevice === 'desktop' ? 'scale-100' : 'scale-75',
                translate: activeDevice === 'desktop' ? 'translate-x-0 translate-y-0' : '-translate-y-8 -translate-x-12',
            }
        },
        tablet: {
            specs: { width: 768, height: 1024 }, // iPad Portrait
            visual: { width: 512, height: 682 }, // 1.6x of 320x426
            scale: 0.6666, // 512 / 768
            styles: {
                zIndex: activeDevice === 'tablet' ? 30 : 20,
                opacity: activeDevice === 'tablet' ? 1 : 0.6,
                scale: activeDevice === 'tablet' ? 'scale-100' : 'scale-90',
                translate: activeDevice === 'tablet' ? 'translate-x-0 translate-y-0' : 'translate-y-4 translate-x-8',
            }
        },
        mobile: {
            specs: { width: 375, height: 812 }, // iPhone X sizes
            visual: { width: 352, height: 762 }, // 1.6x of 220x476
            scale: 0.9386, // 352 / 375
            styles: {
                zIndex: activeDevice === 'mobile' ? 30 : 25,
                opacity: activeDevice === 'mobile' ? 1 : 0.8,
                scale: activeDevice === 'mobile' ? 'scale-100' : 'scale-95',
                translate: activeDevice === 'mobile' ? 'translate-x-0 translate-y-0' : 'translate-y-12 -translate-x-4',
            }
        }
    };

    return (
        <div className="h-full bg-[#050505] rounded-2xl border border-white/5 overflow-hidden flex flex-col relative group cursor-default">
            {/* Ambient Background */}
            {/* Ambient Background - UNIFIED PREMIUM STYLE */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-blue-900/5 to-transparent transition-opacity duration-700 opacity-60"></div>
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-5 pointer-events-none"></div>

            {/* Header */}
            <div className="h-10 border-b border-white/5 bg-white/5 flex items-center justify-between px-4 z-40 backdrop-blur-sm relative">
                <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                    <Layers className="w-3 h-3 text-indigo-400" />
                    <span className="tracking-widest">OMNI-CHANNEL PREVIEW</span>
                </div>

                {/* Device Toggles */}
                <div className="flex gap-2">
                    <button onClick={() => setActiveDevice('mobile')} className={`p-1.5 rounded-md transition-all ${activeDevice === 'mobile' ? 'text-indigo-400 bg-white/10' : 'text-gray-600 hover:text-gray-400'}`} title="Mobile View">
                        <Smartphone className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setActiveDevice('tablet')} className={`p-1.5 rounded-md transition-all ${activeDevice === 'tablet' ? 'text-indigo-400 bg-white/10' : 'text-gray-600 hover:text-gray-400'}`} title="Tablet View">
                        <Tablet className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setActiveDevice('desktop')} className={`p-1.5 rounded-md transition-all ${activeDevice === 'desktop' ? 'text-indigo-400 bg-white/10' : 'text-gray-600 hover:text-gray-400'}`} title="Desktop View">
                        <Monitor className="w-3.5 h-3.5" />
                    </button>
                </div>

                <a href={url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-400 transition-colors flex items-center gap-1 text-[10px] uppercase tracking-wider">
                    <span>Live Site</span>
                    <ExternalLink className="w-3 h-3" />
                </a>
            </div>

            {/* Visual Stack Area */}
            <div className="flex-1 flex items-center justify-center relative p-8 overflow-hidden perspective-1000">

                {/* Desktop Device */}
                <div
                    onClick={() => setActiveDevice('desktop')}
                    className={`absolute transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer
                    ${devices.desktop.styles.scale} ${devices.desktop.styles.translate}`}
                    style={{ zIndex: devices.desktop.styles.zIndex, opacity: devices.desktop.styles.opacity }}
                >
                    <div className="bg-[#1a1a1a] rounded-lg border border-white/10 shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/5 group/desktop hover:ring-indigo-500/30 transition-all"
                        style={{ width: devices.desktop.visual.width, height: devices.desktop.visual.height + 24 }}> {/* +24 for header */}
                        <div className="h-6 bg-white/5 border-b border-white/5 flex items-center px-3 gap-1.5 justify-between flex-shrink-0">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                            </div>
                            {activeDevice === 'desktop' && <div className="text-[9px] text-gray-600 font-mono">1920 x 1080 (Real)</div>}
                        </div>
                        <div className="flex-1 bg-black relative overflow-hidden">
                            {activeDevice === 'desktop' ? (
                                <div style={{ width: devices.desktop.specs.width, height: devices.desktop.specs.height, transform: `scale(${devices.desktop.scale})`, transformOrigin: 'top left' }}>
                                    <iframe src={url} className="w-full h-full border-none opacity-90" title="Desktop Preview" />
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-white/5 bg-[#101010]">
                                    <Monitor className="w-12 h-12" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tablet Device */}
                <div
                    onClick={() => setActiveDevice('tablet')}
                    className={`absolute transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer
                    ${devices.tablet.styles.scale} ${devices.tablet.styles.translate}`}
                    style={{ zIndex: devices.tablet.styles.zIndex, opacity: devices.tablet.styles.opacity }}
                >
                    <div className="bg-[#202020] rounded-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden ring-1 ring-white/5 group/tablet hover:ring-indigo-500/30 transition-all"
                        style={{ width: devices.tablet.visual.width, height: devices.tablet.visual.height + 32 }}>
                        <div className="flex-1 bg-black relative overflow-hidden">
                            {activeDevice === 'tablet' ? (
                                <div style={{ width: devices.tablet.specs.width, height: devices.tablet.specs.height, transform: `scale(${devices.tablet.scale})`, transformOrigin: 'top left' }}>
                                    <iframe src={url} className="w-full h-full border-none opacity-90" title="Tablet Preview" />
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-white/5 bg-[#151515]">
                                    <Tablet className="w-10 h-10" />
                                </div>
                            )}
                        </div>
                        <div className="h-8 bg-black/90 flex justify-center items-center border-t border-white/5 flex-shrink-0">
                            <div className="w-1 h-1 rounded-full bg-white/20"></div>
                        </div>
                    </div>
                </div>

                {/* Mobile Device */}
                <div
                    onClick={() => setActiveDevice('mobile')}
                    className={`absolute transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer
                    ${devices.mobile.styles.scale} ${devices.mobile.styles.translate}`}
                    style={{ zIndex: devices.mobile.styles.zIndex, opacity: devices.mobile.styles.opacity }}
                >
                    <div className="bg-black rounded-[2.5rem] border-[6px] border-zinc-800 shadow-[0_25px_60px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden ring-1 ring-white/10 group/mobile hover:ring-indigo-500/30 transition-all"
                        style={{ width: devices.mobile.visual.width, height: devices.mobile.visual.height }}>
                        <div className="h-7 bg-black flex justify-center items-center relative z-20 flex-shrink-0">
                            <div className="w-16 h-4 bg-black rounded-b-xl absolute top-0 border-b border-x border-zinc-800/50"></div>
                        </div>
                        <div className="flex-1 bg-black relative overflow-hidden">
                            {activeDevice === 'mobile' ? (
                                <div style={{ width: devices.mobile.specs.width, height: devices.mobile.specs.height, transform: `scale(${devices.mobile.scale})`, transformOrigin: 'top left' }}>
                                    <iframe src={url} className="w-full h-full border-none opacity-90" title="Mobile Preview" />
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-white/5 bg-[#0a0a0a]">
                                    <Smartphone className="w-8 h-8" />
                                </div>
                            )}
                        </div>
                        <div className="h-1 bg-white/20 w-1/3 mx-auto rounded-full mb-2 z-20 flex-shrink-0"></div>
                    </div>
                </div>

            </div>

            {/* CTA Overlay */}
            <div className="absolute bottom-6 right-6 z-50">
                <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 group/btn"
                >
                    <Edit3 className="w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform" />
                    <span>Open Editor</span>
                </button>
            </div>

            {/* Interaction Hint */}
            <div className="absolute bottom-6 left-6 pointer-events-none opacity-50">
                <p className="text-[10px] text-gray-500 font-mono tracking-widest flex items-center gap-2">
                    <MousePointer2 className="w-3 h-3" />
                    CLICK DEVICE TO ACTIVATE
                </p>
            </div>

        </div>
    );
}
