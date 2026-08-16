// Archivo: frontend/src/components/VisualEditor/LayoutPanel.jsx
// Sección Layout & Space (margin, padding, dimensiones) — Ley de 200 Líneas 2026.
import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import NumberInput from './NumberInput';

const MARGIN_PROPS = ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'];
const PADDING_PROPS = ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'];

/**
 * Panel de layout: margin, padding, dimensiones con aspect-ratio lock.
 */
const LayoutPanel = ({ selectedElement, updateStyle, aspectLocked, setAspectLocked }) => (
    <div className="space-y-4">
        <span className="text-xs text-zinc-400">Margin</span>
        <div className="grid grid-cols-2 gap-1">
            {MARGIN_PROPS.map(p => (
                <div key={p} className="bg-black/20 p-1 rounded border border-white/5">
                    <NumberInput label={p.replace('margin', '')} value={selectedElement[p]} onChange={(v) => updateStyle(p, v)} step={1} />
                </div>
            ))}
        </div>
        <span className="text-xs text-zinc-400">Padding</span>
        <div className="grid grid-cols-2 gap-1">
            {PADDING_PROPS.map(p => (
                <div key={p} className="bg-black/20 p-1 rounded border border-white/5">
                    <NumberInput label={p.replace('padding', '')} value={selectedElement[p]} onChange={(v) => updateStyle(p, v)} step={1} />
                </div>
            ))}
        </div>
        <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Dimensions</span>
            <button
                onClick={() => setAspectLocked(!aspectLocked)}
                className={`p-1.5 rounded border transition-colors ${aspectLocked ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-black/20 border-white/10 text-zinc-500'}`}
            >
                {aspectLocked ? <Lock size={12} /> : <Unlock size={12} />}
            </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                <NumberInput label="Width" value={selectedElement.width} onChange={(val) => {
                    updateStyle('width', val);
                    if (aspectLocked && selectedElement.width && selectedElement.height) {
                        const ratio = (parseFloat(val) || 0) / (parseFloat(selectedElement.width) || 1);
                        updateStyle('height', `${Math.round((parseFloat(selectedElement.height) || 0) * ratio)}px`);
                    }
                }} step={1} />
            </div>
            <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                <NumberInput label="Height" value={selectedElement.height} onChange={(val) => {
                    updateStyle('height', val);
                    if (aspectLocked && selectedElement.width && selectedElement.height) {
                        const ratio = (parseFloat(val) || 0) / (parseFloat(selectedElement.height) || 1);
                        updateStyle('width', `${Math.round((parseFloat(selectedElement.width) || 0) * ratio)}px`);
                    }
                }} step={1} />
            </div>
        </div>
    </div>
);

export default LayoutPanel;
