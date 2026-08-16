// Archivo: frontend/src/components/VisualEditor/ZoneInputs.jsx
// Inputs atómicos del editor de zonas: Color, Size, Select, Slider, Font, Filter, Border.
// Extraídos del monolito SmartZonePanel.jsx — máx. 200 líneas por Ley 2026.

import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import ShadowInput from './ShadowInput';

// Helper: rgb → hex
export const rgbToHex = (color) => {
    if (!color) return '#000000';
    if (color.startsWith('#')) return color;
    if (color === 'transparent') return '#000000';
    const rgb = color.match(/\d+/g);
    if (rgb && rgb.length >= 3) {
        return "#" +
            ("0" + parseInt(rgb[0], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2);
    }
    return '#000000';
};

// Botón de reset universal
export const ResetBtn = ({ onClick }) => (
    <button onClick={onClick} className="p-1 hover:bg-white/10 rounded text-zinc-600 hover:text-indigo-400 transition-colors" title="Reset">
        <RotateCcw size={10} />
    </button>
);

// Input de color con paleta de marca
export const ColorInput = ({ value, onChange, onReset, brandColors = [] }) => {
    const hexValue = rgbToHex(value);
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <div className="relative group flex items-center gap-2 flex-1">
                    <input type="color" value={hexValue} onChange={e => onChange(e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 p-0 overflow-hidden" />
                    <input type="text" value={hexValue} placeholder="#000000"
                        onChange={e => { if (e.target.value.match(/^#[0-9A-Fa-f]{0,6}$/)) onChange(e.target.value); }}
                        className="flex-1 bg-black/20 text-[10px] p-1 rounded border border-white/10 text-zinc-300 font-mono focus:border-indigo-500 outline-none" />
                </div>
                {onReset && <ResetBtn onClick={onReset} />}
            </div>
            {brandColors.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                    {brandColors.map((color, idx) => (
                        <button key={idx} onClick={() => onChange(color)} style={{ backgroundColor: color }}
                            className="w-6 h-6 rounded border border-white/20 hover:border-indigo-400 hover:scale-110 transition-all duration-150 cursor-pointer" title={color} />
                    ))}
                </div>
            )}
        </div>
    );
};

// Input de tamaño con switch de unidades
export const SizeInput = ({ value, config, onChange, onReset }) => {
    const parseValue = (val) => {
        if (!val || val === 'auto' || val === 'initial') return { num: '', unit: 'auto' };
        const match = String(val).match(/^([\d.-]+)(.*)$/);
        return match ? { num: match[1], unit: match[2] || 'px' } : { num: '', unit: 'auto' };
    };
    const parsed = parseValue(value);
    const [currentUnit, setCurrentUnit] = useState(parsed.unit === 'auto' ? (config.unit || 'px') : parsed.unit);
    useEffect(() => {
        const p = parseValue(value);
        if (p.unit !== 'auto' && p.unit !== currentUnit) setCurrentUnit(p.unit);
    }, [value]);
    const handleNumChange = (e) => {
        const val = e.target.value;
        onChange(val === '' ? 'auto' : `${val}${currentUnit}`);
    };
    const handleUnitChange = (u) => {
        setCurrentUnit(u);
        if (parsed.num !== '') onChange(`${parsed.num}${u}`);
    };
    return (
        <div className="flex items-center gap-2">
            <input type="number" value={parsed.num} onChange={handleNumChange} min="0" max={config.max || undefined} placeholder="Auto"
                className="flex-1 bg-black/20 text-[10px] p-1 rounded border border-white/10 text-zinc-300 font-mono focus:border-indigo-500 outline-none placeholder:text-zinc-600" />
            <div className="flex bg-black/20 rounded border border-white/10 overflow-hidden shrink-0">
                {['px', '%', 'auto'].map(u => (
                    <button key={u} onClick={() => u === 'auto' ? onChange('auto') : handleUnitChange(u)}
                        className={`text-[8px] px-1.5 py-1 ${currentUnit === u && value !== 'auto' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}>
                        {u === 'auto' ? 'A' : u}
                    </button>
                ))}
            </div>
            {onReset && <ResetBtn onClick={onReset} />}
        </div>
    );
};

// Select simple
export const SelectInput = ({ value, config, onChange, onReset }) => (
    <div className="flex items-center gap-2">
        <select value={value || config.options[0]} onChange={e => onChange(e.target.value)}
            className="flex-1 bg-black/20 text-[10px] p-1 rounded border border-white/10 text-zinc-300 outline-none focus:border-indigo-500">
            {config.options.map(o => <option key={o} value={o} className="bg-zinc-800 text-zinc-200 py-1">{o}</option>)}
        </select>
        {onReset && <ResetBtn onClick={onReset} />}
    </div>
);

// Slider continuo
export const SliderInput = ({ value, config, onChange, onReset }) => (
    <div className="flex items-center gap-2">
        <input type="range" min={config.min} max={config.max} step={config.step}
            value={parseFloat(value) || config.min} onChange={e => onChange(e.target.value)}
            className="flex-1 accent-indigo-500 h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer" />
        <span className="text-[10px] w-6 text-right text-zinc-400 font-mono">{parseFloat(value).toFixed(1)}</span>
        {onReset && <ResetBtn onClick={onReset} />}
    </div>
);

// Selector de fuente con pesos
export const FontInput = ({ value, weightValue, onChange, onWeightChange, onReset }) => {
    const fontWeights = {
        'Cormorant Garamond': [400,600,700], 'Montserrat': [300,400,500],
        'Inter': [300,400,500,600,700], 'Outfit': [300,400,600,800],
        'Roboto': [300,400,500,700], 'Open Sans': [300,400,600,700],
        'Lato': [300,400,700], 'Playfair Display': [400,700],
        'Merriweather': [300,400,700], 'Arial': [400,700], 'Times New Roman': [400,700]
    };
    const projectFonts = ['Cormorant Garamond','Montserrat'];
    const systemFonts = Object.keys(fontWeights).filter(f => !projectFonts.includes(f));
    const cleanedValue = value ? value.replace(/['"]/g,'').split(',')[0].trim() : 'Inter';
    const selectedFont = Object.keys(fontWeights).find(f => cleanedValue.includes(f)) || 'Inter';
    const renderOptions = (list) => list.map(font => (
        <option key={font} value={font} className="bg-zinc-800 text-zinc-200 py-1" style={{ fontFamily: font }}>{font}</option>
    ));
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <select value={selectedFont} onChange={e => onChange(`'${e.target.value}', sans-serif`)}
                    className="flex-1 bg-black/20 text-[10px] p-1 rounded border border-white/10 text-zinc-300 outline-none focus:border-indigo-500">
                    <optgroup label="Proyecto">{renderOptions(projectFonts)}</optgroup>
                    <optgroup label="Sistema">{renderOptions(systemFonts)}</optgroup>
                </select>
                {onReset && <ResetBtn onClick={onReset} />}
            </div>
            {onWeightChange && (
                <div className="flex items-center gap-2">
                    <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider w-12">Peso</span>
                    <select value={weightValue || '400'} onChange={e => onWeightChange(e.target.value)}
                        className="flex-1 bg-black/20 text-[10px] p-1 rounded border border-white/10 text-zinc-300 outline-none focus:border-indigo-500">
                        {fontWeights[selectedFont].map(w => <option key={w} value={w} className="bg-zinc-800 text-zinc-200 py-1">{w}</option>)}
                    </select>
                </div>
            )}
        </div>
    );
};

// Input de filtro CSS (blur + brightness)
export const FilterInput = ({ value, onChange, onReset }) => {
    const parseFilter = (val) => {
        if (!val || val === 'none') return { blur: 0, brightness: 100 };
        const b = val.match(/blur\(([\d.]+)px\)/);
        const br = val.match(/brightness\(([\d.]+)\)/);
        return { blur: b ? parseFloat(b[1]) : 0, brightness: br ? parseFloat(br[1]) * 100 : 100 };
    };
    const { blur, brightness } = parseFilter(value);
    const update = (b, br) => {
        const parts = [];
        if (b > 0) parts.push(`blur(${b}px)`);
        if (br !== 100) parts.push(`brightness(${br / 100})`);
        onChange(parts.length > 0 ? parts.join(' ') : 'none');
    };
    return (
        <div className="space-y-2">
            <div className="space-y-1">
                <div className="flex justify-between text-[9px] text-zinc-500"><span>Blur ({blur}px)</span></div>
                <input type="range" min="0" max="20" step="1" value={blur}
                    onChange={e => update(parseFloat(e.target.value), brightness)}
                    className="w-full accent-indigo-500 h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer" />
            </div>
            <div className="space-y-1">
                <div className="flex justify-between text-[9px] text-zinc-500"><span>Brightness ({brightness}%)</span></div>
                <input type="range" min="0" max="200" step="10" value={brightness}
                    onChange={e => update(blur, parseFloat(e.target.value))}
                    className="w-full accent-indigo-500 h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer" />
            </div>
            <div className="flex justify-end">{onReset && <ResetBtn onClick={onReset} />}</div>
        </div>
    );
};

export { ShadowInput };
