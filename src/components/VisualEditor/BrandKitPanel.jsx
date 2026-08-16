import React, { useState, useEffect } from 'react';
import { Palette, Type, Sparkles, Copy, Check } from 'lucide-react';

const BrandKitPanel = ({ projectPath }) => {
    const [brandKit, setBrandKit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copiedColor, setCopiedColor] = useState(null);

    useEffect(() => {
        const loadBrandKit = async () => {
            try {
                // Construct URL to fetch brand-kit.json from the project
                const baseUrl = projectPath || '';
                const url = baseUrl.replace('index.html', 'brand-kit.json');

                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    setBrandKit(data);
                }
            } catch (error) {
                console.log('Brand kit not found, using defaults');
            } finally {
                setLoading(false);
            }
        };

        if (projectPath) {
            loadBrandKit();
        }
    }, [projectPath]);

    const copyToClipboard = (color, name) => {
        navigator.clipboard.writeText(color);
        setCopiedColor(name);
        setTimeout(() => setCopiedColor(null), 1500);
    };

    if (loading) {
        return (
            <div className="p-4 text-gray-400 text-sm">
                Cargando Brand Kit...
            </div>
        );
    }

    if (!brandKit) {
        return (
            <div className="p-4 text-gray-500 text-sm">
                No hay Brand Kit definido para este proyecto.
            </div>
        );
    }

    const colors = brandKit.brand || {};
    const typography = brandKit.typography || {};

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2 text-white">
                <Sparkles size={16} className="text-amber-400" />
                <span className="font-medium">Brand Kit</span>
            </div>

            {/* Color Palette */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider">
                    <Palette size={12} />
                    Paleta de Colores
                </div>
                <div className="grid grid-cols-5 gap-2">
                    {Object.entries(colors).map(([name, value]) => (
                        <div
                            key={name}
                            className="relative group cursor-pointer"
                            onClick={() => copyToClipboard(value, name)}
                            title={`${name}: ${value}`}
                        >
                            <div
                                className="w-8 h-8 rounded-md border border-white/20 transition-transform group-hover:scale-110"
                                style={{ backgroundColor: value }}
                            />
                            {copiedColor === name && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-1 rounded">
                                    <Check size={10} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="text-xs text-gray-500">
                    Click para copiar código hex
                </div>
            </div>

            {/* Typography */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider">
                    <Type size={12} />
                    Tipografías
                </div>
                <div className="space-y-2">
                    {typography.headingFont && (
                        <div className="bg-white/5 rounded-md p-2">
                            <div className="text-xs text-gray-500">Títulos</div>
                            <div
                                className="text-white text-lg"
                                style={{ fontFamily: typography.headingFont }}
                            >
                                {typography.headingFont}
                            </div>
                        </div>
                    )}
                    {typography.bodyFont && (
                        <div className="bg-white/5 rounded-md p-2">
                            <div className="text-xs text-gray-500">Cuerpo</div>
                            <div
                                className="text-white"
                                style={{ fontFamily: typography.bodyFont }}
                            >
                                {typography.bodyFont}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Notes */}
            {brandKit.notes && (
                <div className="text-xs text-gray-400 italic border-l-2 border-amber-500/50 pl-2">
                    {brandKit.notes}
                </div>
            )}
        </div>
    );
};

export default BrandKitPanel;
