// Archivo: frontend/src/components/VisualEditor/EditorSidebar.jsx
// Sidebar del VisualEditor: tabs de Properties, Layers y Zones. Orquesta PropertiesPanel.
import React from 'react';
import { Layout, List, Map, RotateCcw } from 'lucide-react';
import SmartZonePanel from './SmartZonePanel';
import LayerList from './LayerList';
import PropertiesPanel from './PropertiesPanel';

const EditorSidebar = ({
    // Estado de tabs
    sidebarTab, setSidebarTab,
    // Layers
    elementList, isLoadingElements, fetchElementList, selectElementFromList,
    // Zones
    zones, selectedZone, isLoadingZones, fetchZones,
    handleSelectZone, handleSelectGroup, handleSelectElement, handleZoneStyleUpdate,
    targetUrl,
    // Propiedades del elemento
    selectedElement, selectedElementRef,
    openSection, setOpenSection,
    updateStyle, updateContent, updateHref, updateFocalPoint, updateFilter, injectFont,
    selectParent, handleImageUpload, handleWidgetImageUpdate,
    recentColors, addToRecentColors,
    positionState, aspectLocked, setAspectLocked,
    showResetConfirm, setShowResetConfirm,
    // Guardar
    changes, widgetChanges, isSaving, handleSave, setIframeKey
}) => {
    return (
        <aside className="w-80 shrink-0 border-l border-white/5 bg-zinc-900/95 backdrop-blur-xl z-50 flex flex-col pt-14 h-full">
            {/* Tabs */}
            <div className="flex border-b border-white/10 bg-black/20">
                <button
                    onClick={() => setSidebarTab('properties')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${sidebarTab === 'properties' ? 'text-white border-b-2 border-indigo-500 bg-white/5' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                >
                    <Layout size={12} /> Properties
                </button>
                <button
                    onClick={() => { setSidebarTab('layers'); if (elementList.length === 0) fetchElementList(); }}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${sidebarTab === 'layers' ? 'text-white border-b-2 border-indigo-500 bg-white/5' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                >
                    <List size={12} /> Layers
                </button>
                <button
                    onClick={() => { setSidebarTab('zones'); if (zones.length === 0) fetchZones(); }}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${sidebarTab === 'zones' ? 'text-white border-b-2 border-indigo-500 bg-white/5' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                >
                    <Map size={12} /> Zones
                </button>
            </div>

            {/* Contenido del tab activo */}
            {sidebarTab === 'zones' ? (
                <div className="flex-1 overflow-y-auto p-4">
                    <SmartZonePanel
                        zones={zones}
                        selectedZone={selectedZone}
                        onSelectZone={handleSelectZone}
                        onSelectGroup={handleSelectGroup}
                        onSelectElement={handleSelectElement}
                        onUpdateStyle={handleZoneStyleUpdate}
                        isLoading={isLoadingZones}
                        targetUrl={targetUrl}
                    />
                </div>
            ) : sidebarTab === 'layers' ? (
                <LayerList
                    elements={elementList}
                    selectedNexusId={selectedElement?.nexusId}
                    onSelectElement={(id) => selectElementFromList(id)}
                    isLoading={isLoadingElements}
                />
            ) : (
                <PropertiesPanel
                    selectedElement={selectedElement}
                    targetUrl={targetUrl}
                    openSection={openSection}
                    setOpenSection={setOpenSection}
                    updateStyle={updateStyle}
                    updateContent={updateContent}
                    updateHref={updateHref}
                    updateFocalPoint={updateFocalPoint}
                    updateFilter={updateFilter}
                    injectFont={injectFont}
                    selectParent={selectParent}
                    handleImageUpload={handleImageUpload}
                    handleWidgetImageUpdate={handleWidgetImageUpdate}
                    selectedElementRef={selectedElementRef}
                    recentColors={recentColors}
                    addToRecentColors={addToRecentColors}
                    positionState={positionState}
                    aspectLocked={aspectLocked}
                    setAspectLocked={setAspectLocked}
                    showResetConfirm={showResetConfirm}
                    setShowResetConfirm={setShowResetConfirm}
                />
            )}

            {/* Footer de guardado */}
            <div className="p-4 border-t border-white/5 bg-black/20 flex items-center gap-2">
                <button
                    onClick={handleSave}
                    disabled={(Object.keys(changes).length === 0 && Object.keys(widgetChanges).length === 0) || isSaving}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${(Object.keys(changes).length > 0 || Object.keys(widgetChanges).length > 0) ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 text-zinc-500 cursor-not-allowed opacity-50'}`}
                >
                    {isSaving ? (
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                    )}
                    {isSaving ? 'Syncing...' : 'Save Changes'}
                </button>
                <button onClick={() => setIframeKey(Date.now())} title="Force reload preview" className="p-2 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-lg transition-colors border border-white/5">
                    <RotateCcw size={16} />
                </button>
            </div>
            {Object.keys(changes).length > 0 && (
                <p className="text-[10px] text-center text-indigo-400 pb-2 font-mono">{Object.keys(changes).length} pending modifications</p>
            )}
        </aside>
    );
};

export default EditorSidebar;
