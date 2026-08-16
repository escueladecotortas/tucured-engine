// Archivo: frontend/src/components/tabs/identity/IdentityBrandSection.jsx
import React from 'react';
import { Palette, Type } from 'lucide-react';
import { ColorPill } from './ColorPill';
import { VibrationalGrid } from './VibrationalGrid';

export function IdentityBrandSection({ brandKit, onUpdate, t, onCopyColor }) {
    if (!brandKit) return null;

    return (
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
            <VibrationalGrid 
                selectedVibration={brandKit.vibration} 
                onSelect={(id) => onUpdate({ vibration: id })} 
            />

            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5 text-indigo-400" /> {t('identity.color_palette')}
                </h3>
                <div className="grid grid-cols-1 gap-1">
                    {Object.entries(brandKit.colors || {}).map(([key, value]) => (
                        <ColorPill
                            key={key}
                            color={value}
                            name={key.charAt(0).toUpperCase() + key.slice(1)}
                            onCopy={onCopyColor}
                        />
                    ))}
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Type className="w-3.5 h-3.5 text-pink-400" /> {t('identity.typography')}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-black/20 rounded-lg border border-white/5">
                        <span className="text-[9px] text-gray-500 font-mono block mb-1">Heading</span>
                        <div className="text-xl text-white font-bold truncate" style={{ fontFamily: brandKit.fonts?.heading }}>
                            {brandKit.fonts?.heading || 'Sans Serif'}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5 truncate" style={{ fontFamily: brandKit.fonts?.heading }}>
                            The quick brown fox
                        </div>
                    </div>

                    <div className="p-2.5 bg-black/20 rounded-lg border border-white/5">
                        <span className="text-[9px] text-gray-500 font-mono block mb-1">Body</span>
                        <div className="text-base text-white font-medium truncate" style={{ fontFamily: brandKit.fonts?.body }}>
                            {brandKit.fonts?.body || 'Sans Serif'}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5 truncate" style={{ fontFamily: brandKit.fonts?.body }}>
                            Minimalist design.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
