// Archivo: frontend/src/components/VisualEditor/EditorHeader.jsx
// Header del VisualEditor: navegación, undo/redo, modo edit/browse, selector de dispositivo y zoom.
import React from 'react';
import { Undo, Redo, RotateCcw } from 'lucide-react';

const DEVICES = [
    { id: 'mobile', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { id: 'tablet', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'desktop', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
];

const EditorHeader = ({
    historyIndex, history, undo, redo,
    editorMode, setEditorMode, setSelectedElement,
    activeDevice, setActiveDevice,
    scale, setScale,
    onBack
}) => {
    return (
        <header className="absolute top-0 left-0 right-0 h-14 bg-zinc-900/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 z-50">
            {/* Izquierda: navegación y controles de edición */}
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="text-zinc-500 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <span className="font-mono text-xs tracking-widest text-indigo-400">VISUAL EDITOR MODE</span>

                <div className="h-6 w-px bg-white/10 mx-2" />

                {/* Undo / Redo */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={undo}
                        disabled={historyIndex <= 0}
                        className={`p-1.5 rounded hover:bg-white/10 transition-colors ${historyIndex > 0 ? 'text-zinc-300' : 'text-zinc-700 cursor-not-allowed'}`}
                        title="Undo"
                    >
                        <Undo size={14} />
                    </button>
                    <button
                        onClick={redo}
                        disabled={historyIndex >= history.length - 1}
                        className={`p-1.5 rounded hover:bg-white/10 transition-colors ${historyIndex < history.length - 1 ? 'text-zinc-300' : 'text-zinc-700 cursor-not-allowed'}`}
                        title="Redo"
                    >
                        <Redo size={14} />
                    </button>
                </div>

                <div className="h-6 w-px bg-white/10 mx-2" />

                {/* Toggle Edit/Browse */}
                <div className="flex bg-black/50 rounded-lg p-0.5 border border-white/5">
                    <button
                        onClick={() => {
                            setEditorMode('edit');
                            document.querySelector('iframe')?.contentWindow.postMessage({ type: 'NEXUS_SET_MODE', payload: 'edit' }, '*');
                        }}
                        className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-colors ${editorMode === 'edit' ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:text-white'}`}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => {
                            setEditorMode('browse');
                            setSelectedElement(null);
                            document.querySelector('iframe')?.contentWindow.postMessage({ type: 'NEXUS_SET_MODE', payload: 'browse' }, '*');
                        }}
                        className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-colors ${editorMode === 'browse' ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:text-white'}`}
                    >
                        Navigate
                    </button>
                </div>
            </div>

            {/* Centro: selector de dispositivo */}
            <div className="flex bg-black/50 rounded-lg p-1 border border-white/5">
                {DEVICES.map(dev => (
                    <button
                        key={dev.id}
                        onClick={() => setActiveDevice(dev.id)}
                        className={`p-2 rounded-md transition-all ${activeDevice === dev.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50' : 'text-zinc-500 hover:text-white'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={dev.icon} />
                        </svg>
                    </button>
                ))}
            </div>

            {/* Derecha: zoom */}
            <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-mono hidden sm:block">ZOOM</span>
                <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-20 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
            </div>
        </header>
    );
};

export default EditorHeader;
