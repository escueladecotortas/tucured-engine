import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

const ShadowInput = ({ value, originalValue, onChange, onReset, brandColors = [] }) => {
    // Utility to parse color to HEX
    const parseColor = (val) => {
        if (!val || val === 'transparent' || val === 'rgba(0, 0, 0, 0)') return '#000000';
        if (val.startsWith('#')) return val.slice(0, 7); // Remove alpha if present
        const rgbaMatch = val.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
        if (rgbaMatch) {
            const [, r, g, b] = rgbaMatch;
            return '#' + [r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
        }
        return '#000000';
    };

    // Parse shadow value to extract blur and color
    const parseShadow = (shadow) => {
        if (!shadow || shadow === 'none') return { blur: 0, color: 'rgba(0,0,0,0.3)' };
        const blurMatch = shadow.match(/(\d+)px/g);
        const colorMatch = shadow.match(/rgba?\([^)]+\)|#[a-fA-F0-9]{3,8}/);
        return {
            blur: blurMatch ? parseInt(blurMatch[blurMatch.length - 1]) : 10,
            color: colorMatch ? colorMatch[0] : 'rgba(0,0,0,0.3)'
        };
    };

    const parsed = parseShadow(value || originalValue);

    // USE STATE to persist the selected color
    const [selectedColor, setSelectedColor] = useState(parsed.color);
    const blur = parsed.blur;

    // Update selectedColor when parsing a new value that has a color
    useEffect(() => {
        if (value && value !== 'none') {
            const newParsed = parseShadow(value);
            if (newParsed.color !== 'rgba(0,0,0,0.3)' && newParsed.color !== selectedColor) {
                setSelectedColor(newParsed.color);
            }
        }
    }, [value]);

    const buildShadow = (newBlur, newColor) => {
        if (newBlur === 0) return 'none';
        // Logic: Offset Y is approx 40% of blur to give natural depth
        return `0 ${Math.round(newBlur * 0.4)}px ${newBlur}px ${newColor}`;
    };

    // When changing blur, use the selectedColor
    const handleBlurChange = (newBlur) => {
        onChange(buildShadow(newBlur, selectedColor));
    };

    // When changing color, update state AND apply
    const handleColorChange = (newColor) => {
        setSelectedColor(newColor);
        onChange(buildShadow(blur || 15, newColor));
    };

    const hexColor = parseColor(selectedColor);

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500 w-14">Intensidad</span>
                <input
                    type="range"
                    min={0}
                    max={60}
                    step={2}
                    value={blur}
                    onChange={(e) => handleBlurChange(parseInt(e.target.value))}
                    className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-pink-500"
                />
                <span className="text-[10px] text-zinc-400 w-8 text-right font-mono">{blur}px</span>
                <button onClick={onReset} className="p-1 hover:bg-white/10 rounded text-zinc-500 hover:text-amber-400" title="Reset">
                    <RotateCcw size={12} />
                </button>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500 w-14">Color</span>
                <input
                    type="color"
                    value={hexColor}
                    onChange={(e) => handleColorChange(e.target.value + '80')}
                    className="w-6 h-6 rounded border border-white/20 cursor-pointer bg-transparent"
                />
                <input
                    type="text"
                    value={hexColor}
                    onChange={(e) => {
                        if (e.target.value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                            handleColorChange(e.target.value + '80');
                        }
                    }}
                    className="flex-1 bg-black/20 text-[10px] p-1 rounded border border-white/10 text-zinc-300 font-mono"
                    placeholder="#000000"
                />
            </div>
            {/* Brand Color Palette */}
            {brandColors.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                    {brandColors.map((color, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleColorChange(color + '80')}
                            style={{ backgroundColor: color }}
                            className="w-5 h-5 rounded border border-white/20 hover:border-indigo-400 hover:scale-110 transition-all cursor-pointer"
                            title={color}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShadowInput;

