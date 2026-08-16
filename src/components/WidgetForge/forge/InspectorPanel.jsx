// Archivo: frontend/src/components/WidgetForge/forge/InspectorPanel.jsx
import React from 'react';
import { MousePointer, Type, Image as ImageIcon, Zap, Save, Upload, Layers } from 'lucide-react';

export function InspectorPanel({ selection, handlers, onSave }) {
    const { handleContentChange, handleImageSrcChange, handleStyleChange, handleFileUpload } = handlers;

    return (
        <div className="w-[340px] border-r border-white/10 bg-[#0A0A0A] flex flex-col z-20 shadow-2xl">
            <div className="h-14 border-b border-white/5 flex items-center px-6 bg-[#0F0F12]">
                <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-indigo-500" />
                    <h2 className="text-xs font-bold text-white tracking-[0.2em] uppercase">NEXUS STUDIO</h2>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {!selection ? (
                    <EmptyState />
                ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
                        <IdBadge id={selection.nexusId} />
                        {selection.tagName === 'IMG' ? (
                            <ImageEditor selection={selection} onSrcChange={handleImageSrcChange} onStyleChange={handleStyleChange} onFileUpload={handleFileUpload} />
                        ) : (
                            <TextEditor selection={selection} onContentChange={handleContentChange} />
                        )}
                        <StyleEditor onStyleChange={handleStyleChange} />
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-white/5 bg-[#0F0F12]">
                <button onClick={onSave} className="w-full py-3 bg-white text-black hover:bg-indigo-50 text-xs font-bold uppercase tracking-widest rounded flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" /> Guardar Cambios
                </button>
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <MousePointer className="w-12 h-12 text-indigo-400 mb-4 animate-bounce" />
            <h3 className="text-sm font-bold text-white mb-2">Nada Seleccionado</h3>
            <p className="text-xs text-gray-400 max-w-[200px]">Haz clic en cualquier elemento para editar.</p>
        </div>
    );
}

function IdBadge({ id }) {
    return <div className="px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 mb-6 font-mono text-[10px] text-indigo-400 break-all">{id}</div>;
}

function TextEditor({ selection, onContentChange }) {
    return (
        <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Type className="w-3 h-3" /> Contenido</h4>
            <textarea
                value={selection.innerText || ''}
                onChange={(e) => onContentChange(e.target.value)}
                className="w-full h-32 bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none resize-none"
                placeholder="Editar texto..."
            />
        </div>
    );
}

function ImageEditor({ selection, onSrcChange, onStyleChange, onFileUpload }) {
    return (
        <div className="space-y-6 border-b border-white/5 pb-6">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><ImageIcon className="w-3 h-3" /> Imagen</h4>
            <div className="space-y-2">
                <input type="file" accept="image/*" id="file-upload" onChange={onFileUpload} className="hidden" />
                <label htmlFor="file-upload" className="w-full px-3 py-2 bg-indigo-600 text-white text-xs font-bold rounded cursor-pointer flex items-center justify-center gap-2"><Upload className="w-3 h-3" /> Elegir Imagen</label>
            </div>
            <div className="space-y-2">
                <span className="text-xs text-gray-300">Ancho (px)</span>
                <input type="range" min="50" max="800" step="10" onChange={(e) => onStyleChange('width', `${e.target.value}px`)} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
            </div>
            <input type="text" value={selection.src || ''} onChange={(e) => onSrcChange(e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded p-2 text-xs text-white font-mono" />
        </div>
    );
}

function StyleEditor({ onStyleChange }) {
    return (
        <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Zap className="w-3 h-3" /> Estilo</h4>
            <div className="grid grid-cols-2 gap-3">
                <ColorInput label="Texto" onChange={(v) => onStyleChange('color', v)} />
                <ColorInput label="Fondo" onChange={(v) => onStyleChange('backgroundColor', v)} />
            </div>
            <div className="space-y-2">
                <span className="text-xs text-gray-300">Fuente (em)</span>
                <input type="range" min="0.5" max="5" step="0.1" onChange={(e) => onStyleChange('fontSize', `${e.target.value}em`)} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
            </div>
        </div>
    );
}

function ColorInput({ label, onChange }) {
    return (
        <div className="flex flex-col gap-2 p-2 bg-[#1A1A1A] rounded border border-white/10">
            <span className="text-[10px] text-gray-500 uppercase">{label}</span>
            <input type="color" className="w-full h-6 rounded cursor-pointer bg-transparent border-none p-0" onChange={(e) => onChange(e.target.value)} />
        </div>
    );
}
