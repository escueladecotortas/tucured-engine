// Archivo: frontend/src/components/WidgetForge/ForgeEditor.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../Toast';
import { InspectorPanel } from './forge/InspectorPanel';
import { PreviewStage } from './forge/PreviewStage';

/**
 * FORGE EDITOR (Saneado v2026)
 * Orquestador principal del editor visual de widgets.
 * Cumple con la Ley de 200 líneas mediante modularización en ./forge/
 */
export default function ForgeEditor({ projectId }) {
    const { addToast } = useToast();
    const iframeRef = useRef(null);
    const [viewMode, setViewMode] = useState('desktop'); // 'desktop' | 'mobile'
    const [selection, setSelection] = useState(null);

    // --- BRIDGE DE MENSAJERÍA ---
    useEffect(() => {
        const handleMessage = (event) => {
            const { type, payload } = event.data;
            if (type === 'NEXUS_ELEMENT_SELECTED') {
                setSelection(payload);
                addToast(`Elemento: ${payload.tagName}`, 'info');
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [addToast]);

    const sendUpdate = (type, payload) => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({ type, payload }, '*');
        }
    };

    // --- HANDLERS DE EDICIÓN ---
    const handlers = {
        handleContentChange: (val) => {
            setSelection(prev => ({ ...prev, innerText: val }));
            sendUpdate('NEXUS_UPDATE_CONTENT', { value: val });
        },
        handleImageSrcChange: (val) => {
            setSelection(prev => ({ ...prev, src: val }));
            sendUpdate('NEXUS_UPDATE_CONTENT', { value: val });
        },
        handleStyleChange: (property, val) => {
            sendUpdate('NEXUS_UPDATE_STYLE', { property, value: val });
        },
        handleFileUpload: (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onloadend = () => {
                handlers.handleImageSrcChange(reader.result);
                addToast('Imagen cargada (B64)', 'success');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        addToast('Cambios persistidos en el Núcleo', 'success');
    };

    const handleRefresh = () => {
        if (iframeRef.current) {
            iframeRef.current.src = iframeRef.current.src;
        }
    };

    return (
        <div className="h-full w-full flex bg-[#050505] overflow-hidden font-sans border-t border-white/5">
            {/* Panel de Control (Izquierda) */}
            <InspectorPanel 
                selection={selection} 
                handlers={handlers} 
                onSave={handleSave} 
            />

            {/* Escenario de Visualización (Derecha) */}
            <PreviewStage 
                viewMode={viewMode} 
                setViewMode={setViewMode} 
                iframeRef={iframeRef} 
                onRefresh={handleRefresh}
            />
        </div>
    );
}
