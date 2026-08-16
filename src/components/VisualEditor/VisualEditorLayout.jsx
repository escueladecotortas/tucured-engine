// Archivo: frontend/src/components/VisualEditor/VisualEditorLayout.jsx
// Orquestador principal del VisualEditor. Compone: useEditorState + useEditorActions + Header + Canvas + Sidebar.
import React, { useEffect } from 'react';
import DeviceFrame from './DeviceFrame';
import EditorHeader from './EditorHeader';
import EditorSidebar from './EditorSidebar';
import { useEditorState } from './useEditorState';
import { createEditorActions } from './useEditorActions';

const VisualEditorLayout = () => {
    const navigate = (path) => { window.location.hash = path; };
    const state = useEditorState();
    const {
        activeDevice, setActiveDevice, scale, setScale,
        targetUrl, selectedElement, setSelectedElement, selectedElementRef,
        changes, setChanges, widgetChanges, setWidgetChanges,
        iframeKey, setIframeKey, showResetConfirm, setShowResetConfirm,
        elementList, setElementList, isLoadingElements, setIsLoadingElements,
        sidebarTab, setSidebarTab, zones, setZones,
        selectedZone, setSelectedZone, isLoadingZones, setIsLoadingZones,
        editorMode, setEditorMode, aspectLocked, setAspectLocked,
        openSection, setOpenSection, history, historyIndex,
        setHistory, setHistoryIndex, positionState, setPositionState,
        recentColors, addToRecentColors, isSaving, setIsSaving,
        pushHistory, computeStateDiff
    } = state;

    // Acciones del editor
    const actions = createEditorActions({
        selectedElement, selectedElementRef, setSelectedElement,
        changes, setChanges, widgetChanges, setWidgetChanges,
        history, historyIndex, setHistory, setHistoryIndex,
        iframeKey, setIframeKey, setIsSaving, targetUrl,
        pushHistory, computeStateDiff, setPositionState, positionState
    });

    // Bridge: listener de mensajes postMessage del iframe
    useEffect(() => {
        const handleMessage = (event) => {
            const { type, payload } = event.data;
            if (type === 'NEXUS_ELEMENT_SELECTED') {
                setSelectedElement(payload);
                selectedElementRef.current = payload;
            }
            if (type === 'NEXUS_UPDATE_CONTENT' && payload?.value !== undefined) {
                const currentRef = selectedElementRef.current;
                if (currentRef && currentRef.nexusId === payload.nexusId) {
                    currentRef.innerHTML = payload.value;
                    currentRef.innerText = payload.value;
                    setChanges(prev => ({ ...prev, [currentRef.selector]: { ...(prev[currentRef.selector] || {}), innerHTML: payload.value, nexusId: payload.nexusId } }));
                    setSelectedElement(prev => ({ ...prev, innerHTML: payload.value, innerText: payload.value }));
                }
            }
            if (type === 'NEXUS_STYLE_SELECTED') {
                const currentRef = selectedElementRef.current;
                if (currentRef) {
                    const updates = {};
                    Object.keys(payload).forEach(key => { updates[key] = payload[key]; currentRef[key] = payload[key]; });
                    if (Object.keys(updates).length > 0) {
                        setChanges(prev => ({ ...prev, [currentRef.selector]: { ...(prev[currentRef.selector] || {}), ...updates, nexusId: currentRef.nexusId } }));
                        setSelectedElement(prev => ({ ...prev, ...updates }));
                    }
                }
            }
            if (type === 'NEXUS_ELEMENT_LIST') { setElementList(payload); setIsLoadingElements(false); }
            if (type === 'NEXUS_ZONES_LIST') { setZones(payload); setIsLoadingZones(false); }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Auto-fetch de elementos y zonas al cargar / recargar el iframe
    useEffect(() => {
        const timer = setTimeout(() => { fetchElementList(); fetchZones(); }, 2000);
        return () => clearTimeout(timer);
    }, [iframeKey]);

    // Helpers de comunicación con el iframe
    const fetchElementList = () => {
        setIsLoadingElements(true);
        const iframe = document.getElementById('preview-frame');
        if (iframe?.contentWindow) iframe.contentWindow.postMessage({ type: 'NEXUS_GET_ELEMENT_LIST' }, '*');
    };
    const fetchZones = () => {
        setIsLoadingZones(true);
        const iframe = document.getElementById('preview-frame');
        if (iframe?.contentWindow) iframe.contentWindow.postMessage({ type: 'NEXUS_GET_ZONES' }, '*');
    };
    const selectElementFromList = (nexusId) => {
        const iframe = document.getElementById('preview-frame');
        if (iframe?.contentWindow) iframe.contentWindow.postMessage({ type: 'NEXUS_SELECT_ID', payload: { nexusId } }, '*');
    };
    const handleSelectZone = (zone) => {
        setSelectedZone(zone);
        const iframe = document.getElementById('preview-frame');
        if (iframe?.contentWindow) iframe.contentWindow.postMessage({ type: 'NEXUS_SELECT_ZONE', payload: { zoneId: zone.id } }, '*');
    };
    const handleSelectGroup = (group) => {
        const iframe = document.getElementById('preview-frame');
        if (iframe?.contentWindow) iframe.contentWindow.postMessage({ type: 'NEXUS_SELECT_GROUP', payload: { groupId: group.id } }, '*');
    };
    const handleSelectElement = (element, group) => {
        const selector = `[data-nexus-group="${group.id}"] ${element.tag}`;
        const iframe = document.getElementById('preview-frame');
        if (iframe?.contentWindow) iframe.contentWindow.postMessage({ type: 'NEXUS_SELECT_BY_SELECTOR', payload: { selector } }, '*');
    };
    const handleWidgetImageUpdate = (newImages, nexusId) => {
        if (!nexusId) return;
        if (selectedElementRef.current?.nexusId === nexusId) {
            setSelectedElement(prev => ({ ...prev, widgetMeta: { ...prev.widgetMeta, images: newImages } }));
        }
        setWidgetChanges(prev => ({ ...prev, [nexusId]: { type: 'carousel', nexusId, images: newImages.map(img => ({ src: img.src, alt: img.alt || '' })) } }));
        const iframe = document.getElementById('preview-frame');
        if (iframe?.contentWindow) iframe.contentWindow.postMessage({ type: 'NEXUS_UPDATE_WIDGET_IMAGES', images: newImages }, '*');
    };
    const handleZoneStyleUpdate = (selector, property, value, nexusIdFromZone) => {
        if (property === 'widget-images') {
            const images = typeof value === 'string' ? JSON.parse(value) : value;
            handleWidgetImageUpdate(images, nexusIdFromZone);
            return;
        }
        if (!selector) return;
        const cssProperty = property === 'rotate' ? 'transform' : property;
        const cssValue = property === 'rotate' ? `rotate(${value})` : value;
        const nexusIdTarget = nexusIdFromZone || selectedElementRef.current?.nexusId;
        if (nexusIdTarget && selectedElementRef.current?.nexusId === nexusIdTarget) {
            const updates = { [cssProperty]: cssValue };
            setSelectedElement(prev => ({ ...prev, ...updates }));
            selectedElementRef.current = { ...selectedElementRef.current, ...updates };
        }
        const finalSelector = nexusIdTarget ? `[data-nexus-id="${nexusIdTarget}"]` : selector;
        setChanges(prev => ({ ...prev, [finalSelector]: { selector: finalSelector, [cssProperty]: cssValue, isSmartZone: true, nexusId: nexusIdTarget } }));
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-white font-sans selection:bg-indigo-500/30">
            {/* Header */}
            <EditorHeader
                historyIndex={historyIndex}
                history={history}
                undo={actions.undo}
                redo={actions.redo}
                editorMode={editorMode}
                setEditorMode={setEditorMode}
                setSelectedElement={setSelectedElement}
                activeDevice={activeDevice}
                setActiveDevice={setActiveDevice}
                scale={scale}
                setScale={setScale}
                onBack={() => navigate('/')}
            />

            {/* Canvas principal */}
            <main className="flex-1 overflow-auto bg-[#050505] flex justify-center items-start pt-28 pb-20">
                <div className="transition-all duration-500 ease-out will-change-transform">
                    <DeviceFrame
                        device={activeDevice}
                        url={targetUrl}
                        scale={scale}
                        className="transition-all duration-500 shadow-2xl"
                        reloadKey={iframeKey}
                    />
                </div>
            </main>

            {/* Sidebar */}
            <EditorSidebar
                sidebarTab={sidebarTab} setSidebarTab={setSidebarTab}
                elementList={elementList} isLoadingElements={isLoadingElements}
                fetchElementList={fetchElementList} selectElementFromList={selectElementFromList}
                zones={zones} selectedZone={selectedZone} isLoadingZones={isLoadingZones}
                fetchZones={fetchZones} handleSelectZone={handleSelectZone}
                handleSelectGroup={handleSelectGroup} handleSelectElement={handleSelectElement}
                handleZoneStyleUpdate={handleZoneStyleUpdate} targetUrl={targetUrl}
                selectedElement={selectedElement} selectedElementRef={selectedElementRef}
                openSection={openSection} setOpenSection={setOpenSection}
                updateStyle={actions.updateStyle} updateContent={actions.updateContent}
                updateHref={actions.updateHref} updateFocalPoint={actions.updateFocalPoint}
                updateFilter={actions.updateFilter} injectFont={actions.injectFont}
                selectParent={actions.selectParent} handleImageUpload={actions.handleImageUpload}
                handleWidgetImageUpdate={handleWidgetImageUpdate}
                recentColors={recentColors} addToRecentColors={addToRecentColors}
                positionState={positionState} aspectLocked={aspectLocked} setAspectLocked={setAspectLocked}
                showResetConfirm={showResetConfirm} setShowResetConfirm={setShowResetConfirm}
                changes={changes} widgetChanges={widgetChanges} isSaving={isSaving}
                handleSave={actions.handleSave} setIframeKey={setIframeKey}
            />
        </div>
    );
};

export default VisualEditorLayout;
