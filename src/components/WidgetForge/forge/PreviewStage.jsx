// Archivo: frontend/src/components/WidgetForge/forge/PreviewStage.jsx
import React from 'react';
import { Monitor, Smartphone, Maximize2, RefreshCw, ExternalLink } from 'lucide-react';

export function PreviewStage({ viewMode, setViewMode, iframeRef, onRefresh }) {
    return (
        <div className="flex-1 flex flex-col bg-[#050505] relative overflow-hidden">
            {/* Toolbar Superior */}
            <div className="h-14 border-b border-white/5 flex items-center justify-between px-8 bg-[#0A0A0A]/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-6">
                    <div className="flex bg-[#151518] rounded-lg p-1 border border-white/5">
                        <ViewButton 
                            active={viewMode === 'desktop'} 
                            onClick={() => setViewMode('desktop')} 
                            icon={<Monitor className="w-4 h-4" />} 
                            label="Desktop" 
                        />
                        <ViewButton 
                            active={viewMode === 'mobile'} 
                            onClick={() => setViewMode('mobile')} 
                            icon={<Smartphone className="w-4 h-4" />} 
                            label="Mobile" 
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <IconButton icon={<RefreshCw className="w-4 h-4" />} onClick={onRefresh} tooltip="Recargar" />
                    <IconButton icon={<Maximize2 className="w-4 h-4" />} onClick={() => {}} tooltip="Pantalla Completa" />
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded text-[10px] font-bold text-indigo-400 hover:bg-indigo-500/20 transition-all uppercase tracking-widest">
                        <ExternalLink className="w-3 h-3" /> Ver Live
                    </button>
                </div>
            </div>

            {/* Area de Preview */}
            <div className="flex-1 overflow-auto p-12 flex justify-center items-start custom-scrollbar bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]">
                <div 
                    className={`bg-white shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-700 ease-out origin-top rounded-xl overflow-hidden border border-white/10 ${
                        viewMode === 'mobile' ? 'w-[375px] h-[812px]' : 'w-full max-w-[1280px] aspect-video'
                    }`}
                >
                    <iframe
                        ref={iframeRef}
                        className="w-full h-full border-none pointer-events-auto"
                        title="Widget Preview"
                        sandbox="allow-same-origin allow-scripts allow-forms"
                    />
                </div>
            </div>
        </div>
    );
}

function ViewButton({ active, onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-bold transition-all uppercase tracking-wider ${
                active ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'
            }`}
        >
            {icon} {label}
        </button>
    );
}

function IconButton({ icon, onClick, tooltip }) {
    return (
        <button 
            onClick={onClick}
            title={tooltip}
            className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
        >
            {icon}
        </button>
    );
}
