// Archivo: frontend/src/components/VisualEditor/ImageEffectsPanel.jsx
// Sección de propiedades de imagen (focal point, filtros, bordes) — Ley de 200 Líneas 2026.
import React from 'react';
import { Sparkles } from 'lucide-react';
import NumberInput from './NumberInput';
import ShadowInput from './ShadowInput';
import { parseFilters } from './useEditorState';

/**
 * Panel de efectos de imagen: focal point, filtros CSS, radio de borde.
 */
const ImageEffectsPanel = ({ selectedElement, updateStyle, updateFocalPoint, updateFilter, handleImageUpload, positionState }) => (
    <div className="space-y-4">
        <input
            type="text"
            value={selectedElement.src || ''}
            onChange={(e) => updateStyle('src', e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-zinc-300 font-mono"
            placeholder="https://..."
        />
        <label className="cursor-pointer flex items-center justify-center gap-2 w-full py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[10px] text-zinc-400 hover:text-white transition-colors uppercase font-bold tracking-wider">
            Upload New Image
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>

        {/* Focal Point */}
        <div className="space-y-2 pt-2 border-t border-white/5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-2">
                <Sparkles size={12} />Focal Point
            </label>
            {['x', 'y'].map(axis => (
                <div key={axis} className="space-y-1">
                    <div className="flex justify-between text-[10px] text-zinc-400">
                        <span>{axis === 'x' ? 'Horizontal' : 'Vertical'}</span>
                        <span>{positionState[axis]}%</span>
                    </div>
                    <input
                        type="range" min="0" max="100" step="1"
                        value={positionState[axis]}
                        onChange={(e) => updateFocalPoint(axis, e.target.value)}
                        className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                </div>
            ))}
        </div>

        {/* Filtros CSS */}
        <div className="space-y-2 pt-2 border-t border-white/5">
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Effects</span>
            <ShadowInput
                value={selectedElement.boxShadow}
                originalValue={selectedElement.boxShadow}
                onChange={(v) => updateStyle('boxShadow', v)}
                onReset={() => updateStyle('boxShadow', 'none')}
            />
            {['brightness', 'contrast', 'saturate', 'grayscale'].map(f => {
                const filters = parseFilters(selectedElement.filter);
                return (
                    <div key={f} className="space-y-1">
                        <div className="flex justify-between text-[10px] text-zinc-400 capitalize">
                            <span>{f}</span><span>{filters[f]}%</span>
                        </div>
                        <input
                            type="range" min="0" max="200" step="5"
                            value={filters[f] !== undefined ? filters[f] : (f === 'grayscale' ? 0 : 100)}
                            onChange={(e) => updateFilter(f, e.target.value)}
                            className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                    </div>
                );
            })}
            <NumberInput label="Corner Radius (px)" value={selectedElement.borderRadius} onChange={v => updateStyle('borderRadius', v)} suffix="px" />
        </div>
    </div>
);

export default ImageEffectsPanel;
