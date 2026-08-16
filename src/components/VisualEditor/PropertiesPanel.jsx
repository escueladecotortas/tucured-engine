// Archivo: frontend/src/components/VisualEditor/PropertiesPanel.jsx
// Panel de propiedades del elemento seleccionado (Typography, Colors, Layout, Image, Link).
// Delegaciones: ResetModal, ImageEffectsPanel, LayoutPanel, AccordionSection — Ley de 200 Líneas 2026.
import React from 'react';
import { Layout, Type, Palette, Image, Link2, ExternalLink, Italic, Underline, ArrowLeft } from 'lucide-react';
import NumberInput from './NumberInput';
import FontPicker from './FontPicker';
import CarouselWidgetPanel from './CarouselWidgetPanel';
import BrandKitPanel from './BrandKitPanel';
import ResetModal from './ResetModal';
import ImageEffectsPanel from './ImageEffectsPanel';
import LayoutPanel from './LayoutPanel';
import AccordionSection from './AccordionSection';
import { rgbToHex, BRAND_COLORS } from './useEditorState';

const PropertiesPanel = ({
    selectedElement, targetUrl,
    openSection, setOpenSection,
    updateStyle, updateContent, updateHref, updateFocalPoint, updateFilter, injectFont,
    selectParent, handleImageUpload, handleWidgetImageUpdate,
    selectedElementRef, recentColors, addToRecentColors,
    positionState, aspectLocked, setAspectLocked,
    showResetConfirm, setShowResetConfirm
}) => {
    if (!selectedElement) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-50">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                </div>
                <h4 className="text-lg font-medium text-white mb-2">Editor Ready</h4>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-[200px]">Click on any element in the preview to customize its properties.</p>
            </div>
        );
    }

    // INTERCEPTOR: widget carousel
    if (selectedElement.nexusWidget === 'carousel') {
        return (
            <div className="flex-1 overflow-y-auto p-4">
                <CarouselWidgetPanel
                    selectedElement={selectedElement}
                    updateStyle={updateStyle}
                    targetUrl={targetUrl}
                    onUpdateImages={(newImages, carouselNexusId) => {
                        const nexusId = carouselNexusId || selectedElementRef.current?.nexusId || selectedElement.nexusId;
                        handleWidgetImageUpdate(newImages, nexusId);
                    }}
                />
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Header */}
            <div className="border-b border-white/5 pb-4 space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white tracking-wide">
                        {selectedElement.isImage ? '🖼️ Image' : selectedElement.tagName === 'BUTTON' ? '🔘 Button' : selectedElement.tagName === 'A' ? '🔗 Link' : '📦 Element'}
                        <span className="text-[10px] font-normal text-zinc-500 font-mono ml-2 opacity-50">
                            {selectedElement.className ? `.${selectedElement.className.split(' ')[0]}` : `#${selectedElement.tagName?.toLowerCase()}`}
                        </span>
                    </h3>
                    <button onClick={selectParent} className="p-1.5 text-xs bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded border border-white/10 transition-colors" title="Select Parent">
                        <ArrowLeft size={12} className="rotate-90" />
                    </button>
                </div>
                {selectedElement.innerText && !selectedElement.isImage && (
                    <div className="bg-black/30 p-2 rounded border border-white/5">
                        <label className="text-[9px] text-zinc-500 uppercase font-bold">Content</label>
                        {selectedElement.hasChildren
                            ? <div className="p-2 bg-white/5 rounded text-[10px] text-zinc-400 italic text-center">Select specific text to edit.</div>
                            : <textarea value={selectedElement.innerText} onChange={(e) => updateContent(e.target.value)} className="w-full bg-transparent text-[11px] text-zinc-300 font-mono focus:outline-none resize-y min-h-[60px] border-l-2 border-transparent focus:border-indigo-500 pl-2 transition-colors" />
                        }
                    </div>
                )}
                {selectedElement.isImage && selectedElement.src && (
                    <div className="bg-black/30 p-2 rounded border border-white/5">
                        <img src={selectedElement.src} alt="Preview" className="w-full h-20 object-cover rounded opacity-80" />
                        <p className="text-[10px] text-zinc-500 mt-1 truncate">{selectedElement.naturalWidth}×{selectedElement.naturalHeight}px</p>
                    </div>
                )}
            </div>

            {/* Link Settings */}
            {(selectedElement.tagName === 'A' || selectedElement.href) && (
                <AccordionSection title="Link Settings" icon={Link2} isOpen={openSection === 'link'} onToggle={() => setOpenSection(openSection === 'link' ? '' : 'link')}>
                    <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg p-2 focus-within:border-indigo-500 transition-colors">
                        <ExternalLink size={14} className="text-zinc-500" />
                        <input type="text" value={selectedElement.href || ''} onChange={(e) => updateHref(e.target.value)} className="bg-transparent border-none text-xs text-white w-full focus:outline-none font-mono" placeholder="https://..." />
                    </div>
                </AccordionSection>
            )}

            {/* Typography */}
            {!selectedElement.isImage && (
                <AccordionSection title="Typography" icon={Type} isOpen={openSection === 'typography'} onToggle={() => setOpenSection(openSection === 'typography' ? '' : 'typography')}>
                    <div className="space-y-3">
                        <FontPicker currentFont={selectedElement.fontFamily} onFontChange={(font) => updateStyle('fontFamily', font)} onInjectFont={injectFont} />
                        <NumberInput label="Font Size" value={selectedElement.fontSize} onChange={(val) => updateStyle('fontSize', val)} step={1} />
                        <div className="flex gap-1">
                            {['12px', '16px', '24px', '32px', '48px'].map(size => (
                                <button key={size} onClick={() => updateStyle('fontSize', size)} className="flex-1 py-1 text-[10px] border border-white/10 rounded hover:bg-white/10 transition-colors">{size.replace('px', '')}</button>
                            ))}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                            <span className="text-xs text-zinc-400">Align</span>
                            <div className="flex bg-black/40 rounded border border-white/10 p-1">
                                {['left', 'center', 'right'].map(align => (
                                    <button key={align} onClick={() => updateStyle('textAlign', align)} className={`p-1 rounded hover:bg-white/10 text-[10px] ${selectedElement.textAlign === align ? 'text-indigo-400' : 'text-zinc-500'}`}>{align[0].toUpperCase()}</button>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2 pt-2 border-t border-white/10">
                            <button onClick={() => updateStyle('fontWeight', selectedElement.fontWeight === '700' ? '400' : '700')} className={`px-2 py-1 rounded border text-[10px] ${selectedElement.fontWeight === '700' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'border-white/10 text-zinc-500'}`}>Bold</button>
                            <button onClick={() => updateStyle('textDecoration', selectedElement.textDecoration === 'underline' ? 'none' : 'underline')} className={`p-2 rounded border transition-colors ${selectedElement.textDecoration === 'underline' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-black/40 border-white/10 text-zinc-400'}`}><Underline size={14} /></button>
                            <button onClick={() => updateStyle('fontStyle', selectedElement.fontStyle === 'italic' ? 'normal' : 'italic')} className={`p-2 rounded border transition-colors ${selectedElement.fontStyle === 'italic' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-black/40 border-white/10 text-zinc-400'}`}><Italic size={14} /></button>
                        </div>
                    </div>
                </AccordionSection>
            )}

            {/* Colors */}
            <AccordionSection title="Colors" icon={Palette} isOpen={openSection === 'colors'} onToggle={() => setOpenSection(openSection === 'colors' ? '' : 'colors')}>
                <div className="space-y-4">
                    <div>
                        <span className="text-xs text-zinc-400">Text Color</span>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/20">
                                <input type="color" value={selectedElement.color?.startsWith('rgb') ? rgbToHex(selectedElement.color) : (selectedElement.color || '#ffffff')} onChange={(e) => { updateStyle('color', e.target.value); addToRecentColors(e.target.value); }} className="absolute -top-1 -left-1 w-8 h-8 cursor-pointer p-0 border-0 opacity-0" />
                                <div className="w-full h-full" style={{ backgroundColor: selectedElement.color || '#fff' }} />
                            </div>
                            <input type="text" value={selectedElement.color?.startsWith('rgb') ? rgbToHex(selectedElement.color) : (selectedElement.color || '')} onChange={(e) => updateStyle('color', e.target.value)} className="w-20 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs font-mono text-zinc-300 focus:outline-none uppercase" placeholder="#HEX" />
                        </div>
                        <div className="flex gap-1.5 flex-wrap mt-2">
                            {BRAND_COLORS.map(color => <button key={color} onClick={() => { updateStyle('color', color); addToRecentColors(color); }} className="w-5 h-5 rounded-full border border-white/10 hover:scale-110 transition-transform" style={{ backgroundColor: color }} title={color} />)}
                        </div>
                    </div>
                    <div className="pt-3 border-t border-white/5">
                        <span className="text-xs text-zinc-400">Background</span>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/20">
                                <input type="color" value={selectedElement.backgroundColor && selectedElement.backgroundColor !== 'transparent' ? (selectedElement.backgroundColor.startsWith('rgb') ? rgbToHex(selectedElement.backgroundColor) : selectedElement.backgroundColor) : '#000000'} onChange={(e) => { updateStyle('backgroundColor', e.target.value); addToRecentColors(e.target.value); }} className="absolute -top-1 -left-1 w-8 h-8 cursor-pointer p-0 border-0 opacity-0" />
                                <div className="w-full h-full" style={{ backgroundColor: selectedElement.backgroundColor || 'transparent' }} />
                            </div>
                            <input type="text" value={selectedElement.backgroundColor === 'transparent' ? 'TRANSPARENT' : (selectedElement.backgroundColor?.startsWith('rgb') ? rgbToHex(selectedElement.backgroundColor) : (selectedElement.backgroundColor || ''))} onChange={(e) => updateStyle('backgroundColor', e.target.value)} className="w-24 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs font-mono text-zinc-300 focus:outline-none uppercase" placeholder="#HEX" />
                            <button onClick={() => updateStyle('backgroundColor', 'transparent')} className="text-[10px] text-zinc-500 hover:text-white border border-white/10 rounded px-1">∅</button>
                        </div>
                        {recentColors.length > 0 && (
                            <div className="flex gap-1.5 flex-wrap mt-2">
                                {recentColors.map((color, i) => <button key={i} onClick={() => updateStyle('backgroundColor', color)} className="w-5 h-5 rounded hover:scale-110 transition-transform shadow-sm border border-white/10" style={{ backgroundColor: color }} title={color} />)}
                            </div>
                        )}
                    </div>
                </div>
            </AccordionSection>

            {/* Image & Effects — delegado a ImageEffectsPanel */}
            {selectedElement.isImage && (
                <AccordionSection title="Image & Effects" icon={Image} isOpen={openSection === 'image'} onToggle={() => setOpenSection(openSection === 'image' ? '' : 'image')}>
                    <ImageEffectsPanel
                        selectedElement={selectedElement}
                        updateStyle={updateStyle}
                        updateFocalPoint={updateFocalPoint}
                        updateFilter={updateFilter}
                        handleImageUpload={handleImageUpload}
                        positionState={positionState}
                    />
                </AccordionSection>
            )}

            {/* Layout & Space — delegado a LayoutPanel */}
            <AccordionSection title="Layout & Space" icon={Layout} isOpen={openSection === 'layout'} onToggle={() => setOpenSection(openSection === 'layout' ? '' : 'layout')}>
                <LayoutPanel
                    selectedElement={selectedElement}
                    updateStyle={updateStyle}
                    aspectLocked={aspectLocked}
                    setAspectLocked={setAspectLocked}
                />
            </AccordionSection>

            {/* Reset & Brand Kit */}
            <div className="pt-6 border-t border-white/5">
                <button onClick={() => setShowResetConfirm(true)} className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded border border-red-500/20 text-xs uppercase tracking-wider transition-colors">Reset Styles</button>
            </div>
            <div className="border-t border-white/5 pt-6">
                <BrandKitPanel projectPath={targetUrl} />
            </div>

            {/* Modal de confirmación — delegado a ResetModal */}
            {showResetConfirm && <ResetModal updateStyle={updateStyle} setShowResetConfirm={setShowResetConfirm} />}
        </div>
    );
};

export default PropertiesPanel;
