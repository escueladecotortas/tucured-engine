// Archivo: frontend/src/components/VisualEditor/useSmartZone.js
// Hook de estado y efectos para SmartZonePanel.
// Gestiona: estilos actuales, estilos iniciales, brand-kit y comunicación con iframe.

import { useState, useEffect, useRef } from 'react';
import { GROUP_CONFIG, MODULE_PROPS } from './zone-config';

/**
 * useSmartZone — centraliza el estado reactivo del panel de zonas.
 * @param {string} targetUrl - URL del iframe de previsualización.
 * @param {function} onUpdateStyle - Callback para persistir cambios al orquestador.
 */
const useSmartZone = (targetUrl, onUpdateStyle) => {
    const [expandedZone, setExpandedZone] = useState('hero');
    const [activeGroup, setActiveGroup] = useState(null);
    const [currentStyles, setCurrentStyles] = useState({});
    const [initialStyles, setInitialStyles] = useState({});
    const [brandColors, setBrandColors] = useState([]);
    const initialStylesCaptured = useRef({});

    // Carga colores del brand-kit desde el archivo del proyecto
    useEffect(() => {
        if (!targetUrl) return;
        let projectPath = null;
        const match1 = targetUrl.match(/nexus_archives\/([^/]+\/clients\/[^/]+)\//);
        if (match1) projectPath = match1[1];
        if (!projectPath) {
            const match2 = targetUrl.match(/nexus_archives\/([^/]+)\//);
            if (match2) projectPath = match2[1];
        }
        if (!projectPath) return;
        fetch(`/api/files/read?path=nexus_archives/${projectPath}/brand-kit.json`)
            .then(r => r.json())
            .then(d => {
                if (d.success && d.content) {
                    const kit = JSON.parse(d.content);
                    const colors = [
                        kit.brand?.primaryColor, kit.brand?.secondaryColor,
                        kit.brand?.accentColor, kit.brand?.backgroundColor, kit.brand?.textColor
                    ].filter(Boolean);
                    setBrandColors(colors);
                }
            })
            .catch(e => console.error('useSmartZone: Error cargando brand-kit:', e));
    }, [targetUrl]);

    // Solicita estilos al iframe cuando cambia el grupo activo
    useEffect(() => {
        if (!activeGroup) return;
        const group = GROUP_CONFIG[activeGroup];
        if (!group) return;
        const requestList = group.items.map(item => ({
            id: item.id,
            selector: item.selector,
            containerSelector: group.containerSelector,
            properties: MODULE_PROPS[item.type]
        }));
        const iframe = document.getElementById('preview-frame');
        if (!iframe?.contentWindow) return;
        iframe.contentWindow.postMessage({ type: 'NEXUS_BATCH_GET_STYLES', payload: { requestList } }, '*');
        iframe.contentWindow.postMessage({
            type: 'NEXUS_SELECT_GROUP',
            payload: { groupId: activeGroup, containerSelector: group.containerSelector }
        }, '*');
    }, [activeGroup]);

    // Escucha respuestas del iframe
    useEffect(() => {
        const handleMessage = (event) => {
            const { type, payload } = event.data;

            // Respuesta de estilos en batch
            if (type === 'NEXUS_BATCH_STYLES_RESPONSE') {
                setCurrentStyles(prev => ({ ...prev, ...payload }));
                // Encadena fetch de widgets carousel si los hay
                if (activeGroup && GROUP_CONFIG[activeGroup]) {
                    GROUP_CONFIG[activeGroup].items.forEach(item => {
                        if (item.type === 'widget-carousel' && payload[item.id]?.nexusId) {
                            const iframe = document.getElementById('preview-frame');
                            iframe?.contentWindow?.postMessage({
                                type: 'NEXUS_GET_WIDGET_DATA',
                                payload: { nexusId: payload[item.id].nexusId, type: 'carousel' }
                            }, '*');
                        }
                    });
                }
                // Guarda estilos iniciales (sin pisar los ya capturados)
                setInitialStyles(prev => {
                    const next = { ...prev };
                    Object.entries(payload).forEach(([k, v]) => { if (!next[k]) next[k] = v; });
                    return next;
                });
            }

            // Respuesta de datos de widget
            if (type === 'NEXUS_WIDGET_DATA_RESPONSE') {
                const { nexusId, data } = payload;
                let targetItemId = null;
                if (activeGroup && GROUP_CONFIG[activeGroup]) {
                    const found = GROUP_CONFIG[activeGroup].items.find(item =>
                        currentStyles[item.id]?.nexusId === nexusId || item.type === 'widget-carousel'
                    );
                    if (found) targetItemId = found.id;
                }
                if (targetItemId) {
                    setCurrentStyles(prev => ({ ...prev, [targetItemId]: { ...prev[targetItemId], widgetMeta: data } }));
                }
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [activeGroup, currentStyles]);

    // Actualiza un estilo y notifica al iframe y al orquestador
    const handleUpdate = (group, item, prop, val) => {
        let fullSelector = `${group.containerSelector} ${item.selector}`;
        if (item.selector === '&') fullSelector = group.containerSelector;
        const iframe = document.getElementById('preview-frame');
        if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'NEXUS_UPDATE_STYLE_BY_SELECTOR',
                payload: { selector: fullSelector, property: prop, value: val }
            }, '*');
        }
        if (onUpdateStyle) {
            const targetNexusId = currentStyles[item.id]?.nexusId;
            onUpdateStyle(fullSelector, prop, val, targetNexusId);
        }
        setCurrentStyles(prev => ({ ...prev, [item.id]: { ...prev[item.id], [prop]: val } }));
    };

    // Actualiza imágenes del widget carousel
    const handleUpdateImages = (group, item, images, nexusId) => {
        const iframe = document.getElementById('preview-frame');
        if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage({ type: 'NEXUS_UPDATE_WIDGET_IMAGES', data: { images }, payload: { images } }, '*');
        }
        if (onUpdateStyle) {
            let fullSelector = `${group.containerSelector} ${item.selector}`;
            if (item.selector === '&') fullSelector = group.containerSelector;
            onUpdateStyle(fullSelector, 'widget-images', JSON.stringify(images), nexusId);
        }
        if (activeGroup === 'portfolio-content') {
            setCurrentStyles(prev => ({ ...prev, carousel: { ...prev.carousel, widgetMeta: { images } } }));
        }
    };

    return {
        expandedZone, setExpandedZone,
        activeGroup, setActiveGroup,
        currentStyles, initialStyles,
        brandColors,
        handleUpdate, handleUpdateImages
    };
};

export default useSmartZone;
