// Archivo: frontend/src/components/VisualEditor/ZoneModule.jsx
// PropertyField + ZoneModule — renderizadores de módulos y sus propiedades.
// Extraídos del monolito SmartZonePanel.jsx. Máx. 200 líneas — Ley 2026.

import React, { useState, useEffect } from 'react';
import { Type, Image, Box, RotateCcw } from 'lucide-react';
import { ColorInput, SizeInput, SelectInput, SliderInput, FontInput, FilterInput, ResetBtn, ShadowInput } from './ZoneInputs';
import { PROP_CONFIG, MODULE_PROPS } from './zone-config';
import CarouselWidgetPanel from './CarouselWidgetPanel';

// --- Input de borde compuesto ---
const BorderInput = ({ value, onChange, onReset, brandColors = [] }) => {
    const parseBorder = (val) => {
        if (!val || val === 'none' || val === '0px') return { width: 0, style: 'solid', color: '#c9a87c' };
        const hexMatch = val.match(/#[a-fA-F0-9]{3,6}/);
        const rgbMatch = val.match(/rgba?\([^)]+\)/);
        let color = '#c9a87c';
        if (hexMatch) color = hexMatch[0];
        else if (rgbMatch) color = rgbMatch[0];
        const widthMatch = val.match(/(\d+)px/);
        const width = widthMatch ? parseInt(widthMatch[1]) : 0;
        const style = val.includes('dashed') ? 'dashed' : val.includes('dotted') ? 'dotted' : 'solid';
        return { width, style, color };
    };
    const [localWidth, setLocalWidth] = useState(() => parseBorder(value).width);
    const [localStyle, setLocalStyle] = useState(() => parseBorder(value).style);
    const [localColor, setLocalColor] = useState(() => parseBorder(value).color);
    useEffect(() => {
        const p = parseBorder(value);
        setLocalWidth(p.width); setLocalStyle(p.style); setLocalColor(p.color);
    }, [value]);
    const apply = (w, s, c) => onChange(w === 0 ? 'none' : `${w}px ${s} ${c}`);
    const handleWidth = (e) => { const w = parseInt(e.target.value) || 0; setLocalWidth(w); apply(w, localStyle, localColor); };
    const handleStyle = (e) => { const s = e.target.value; setLocalStyle(s); const w = localWidth === 0 ? 1 : localWidth; setLocalWidth(w); apply(w, s, localColor); };
    const handleColor = (c) => { setLocalColor(c); const w = localWidth === 0 ? 1 : localWidth; setLocalWidth(w); apply(w, localStyle, c); };
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <input type="number" value={localWidth} onChange={handleWidth} min="0" max="20"
                    className="w-12 bg-black/20 text-[10px] p-1 rounded border border-white/10 text-zinc-300" />
                <span className="text-[10px] text-zinc-500">px</span>
                <select value={localStyle} onChange={handleStyle}
                    className="flex-1 bg-black/20 text-[10px] p-1 rounded border border-white/10 text-zinc-300">
                    <option value="solid" className="bg-zinc-800">Sólido</option>
                    <option value="dashed" className="bg-zinc-800">Rayado</option>
                    <option value="dotted" className="bg-zinc-800">Punteado</option>
                </select>
            </div>
            <div className="flex items-center gap-2">
                <input type="color" value={localColor} onChange={e => handleColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0" />
                <input type="text" value={localColor} onChange={e => { if (e.target.value.match(/^#[0-9A-Fa-f]{0,6}$/)) handleColor(e.target.value); }}
                    className="flex-1 bg-black/20 text-[10px] p-1 rounded border border-white/10 text-zinc-300 font-mono" placeholder="#000000" />
                {onReset && <ResetBtn onClick={onReset} />}
            </div>
            {brandColors.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                    {brandColors.map((c, i) => (
                        <button key={i} onClick={() => handleColor(c)} style={{ backgroundColor: c }}
                            className="w-5 h-5 rounded border border-white/20 hover:border-indigo-400 hover:scale-110 transition-all cursor-pointer" />
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Campo de propiedad genérico ---
export const PropertyField = ({ propKey, value, onChange, initialValue, brandColors = [] }) => {
    const config = PROP_CONFIG[propKey];
    if (!config) return null;
    const handleReset = () => {
        if (initialValue !== undefined && initialValue !== null && initialValue !== '') return onChange(initialValue);
        if (config.type === 'color') onChange('');
        else if (config.type === 'shadow') onChange('none');
        else if (config.type === 'size') onChange('auto');
        else if (config.type === 'slider') onChange(config.min);
        else if (['border','filter'].includes(config.type)) onChange('none');
        else if (config.type === 'rotation') onChange('0deg');
        else onChange('initial');
    };
    return (
        <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
                <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">{config.label}</label>
            </div>
            {config.type === 'color'    && <ColorInput value={value} brandColors={brandColors} onChange={onChange} onReset={handleReset} />}
            {config.type === 'size'     && <SizeInput value={value} config={config} onChange={onChange} onReset={handleReset} />}
            {config.type === 'select'   && <SelectInput value={value} config={config} onChange={onChange} onReset={handleReset} />}
            {config.type === 'slider'   && <SliderInput value={value} config={config} onChange={onChange} onReset={handleReset} />}
            {config.type === 'shadow'   && <ShadowInput value={value} brandColors={brandColors} onChange={onChange} onReset={handleReset} />}
            {config.type === 'border'   && <BorderInput value={value} brandColors={brandColors} onChange={onChange} onReset={handleReset} />}
            {config.type === 'font'     && <FontInput value={value} onChange={onChange} onReset={handleReset} />}
            {config.type === 'filter'   && <FilterInput value={value} onChange={onChange} onReset={handleReset} />}
            {config.type === 'rotation' && <SliderInput value={parseFloat(value?.replace('deg','')) || 0} config={{ min:0, max:360, step:1 }} onChange={v => onChange(v+'deg')} onReset={handleReset} />}
        </div>
    );
};

// --- Módulo de zona (contenedor de propiedades) ---
const ZoneModule = ({ item, styles, initialStyles = {}, brandColors = [], onUpdate, onUpdateImages, targetUrl }) => {
    if (item.type === 'widget-carousel') {
        return (
            <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                <div className="flex items-center gap-2 mb-3 text-indigo-400 border-b border-indigo-500/10 pb-2">
                    <Box size={14} />
                    <span className="text-xs font-bold uppercase tracking-wide">{item.label}</span>
                </div>
                <CarouselWidgetPanel
                    selectedElement={{ nexusId: styles.nexusId, widgetMeta: styles.widgetMeta || { images: [] }, width: styles.width, height: styles.height }}
                    updateStyle={(k, v) => onUpdate(k, v)}
                    onUpdateImages={(imgs) => onUpdateImages(imgs, styles.nexusId)}
                    targetUrl={targetUrl}
                />
            </div>
        );
    }
    const propsToShow = MODULE_PROPS[item.type] || [];
    return (
        <div className="bg-zinc-900/50 p-3 rounded-lg border border-white/5 space-y-3 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                <div className="flex items-center gap-2 text-zinc-400">
                    {item.type === 'text'      && <Type size={12} />}
                    {item.type === 'image'     && <Image size={12} />}
                    {item.type === 'container' && <Box size={12} />}
                    <span className="text-xs font-semibold text-zinc-200">{item.label}</span>
                </div>
                <span className="text-[9px] text-zinc-600 font-mono bg-black/30 px-1 rounded">{item.selector}</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
                {propsToShow.map(prop => (
                    <div key={prop}>
                        <PropertyField propKey={prop} value={styles[prop]} initialValue={initialStyles[prop]}
                            brandColors={brandColors} onChange={(val) => onUpdate(prop, val)} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ZoneModule;
