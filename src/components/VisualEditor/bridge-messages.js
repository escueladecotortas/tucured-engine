// Archivo: frontend/src/components/VisualEditor/bridge-messages.js
// Segmento 3 del Bridge: Listener de mensajes del parent (postMessage handlers).
// BridgeSource.js fragmentado por Ley de 200 Líneas 2026.

export const BRIDGE_MESSAGES = `
    // Escucha todos los comandos enviados por el parent (VisualEditor)
    window.addEventListener('message', (event) => {
        const { type, payload } = event.data;

        // Actualiza estilo inline de elemento seleccionado (con soporte Undo/Redo por nexusId)
        if (type === 'NEXUS_UPDATE_STYLE') {
            let targetEl = selectedElement;
            if (payload.nexusId) { const found = document.querySelector(\`[data-nexus-id="\${payload.nexusId}"]\`); if (found) targetEl = found; }
            if (targetEl && payload.property && payload.value !== undefined) {
                const cssProp = payload.property.replace(/([A-Z])/g, '-$1').toLowerCase();
                targetEl.style.setProperty(cssProp, payload.value, 'important');
                if (targetEl === selectedElement) targetEl.style.outline = HIGHLIGHT_BORDER;
            }
        }

        // Actualiza el innerHTML del elemento seleccionado
        if (type === 'NEXUS_UPDATE_CONTENT') {
            if (selectedElement && selectedElement.innerHTML !== payload.value) selectedElement.innerHTML = payload.value;
        }

        // Inyecta fuente de Google Fonts dinámicamente en el iframe
        if (type === 'NEXUS_INJECT_FONT') {
            const ff = payload.font;
            if (ff && !document.querySelector(\`link[href*="\${ff.replace(/ /g, '+')}"]\`)) {
                const link = document.createElement('link');
                link.href = \`https://fonts.googleapis.com/css2?family=\${ff.replace(/ /g, '+')}&display=swap\`;
                link.rel = 'stylesheet';
                document.head.appendChild(link);
            }
        }

        // Actualiza href de un link seleccionado
        if (type === 'NEXUS_UPDATE_HREF') {
            if (selectedElement && selectedElement.tagName === 'A') selectedElement.href = payload.href;
        }

        // Navega al elemento padre del elemento seleccionado
        if (type === 'NEXUS_SELECT_PARENT') {
            if (selectedElement?.parentElement && selectedElement.parentElement !== document.body)
                selectElement(selectedElement.parentElement);
        }

        // Selecciona elemento por data-nexus-id
        if (type === 'NEXUS_SELECT_ID') {
            if (payload.nexusId) { const el = document.querySelector(\`[data-nexus-id="\${payload.nexusId}"]\`); if (el) selectElement(el); }
        }

        // Cambia modo (edit/browse) y limpia selección si pasa a browse
        if (type === 'NEXUS_SET_MODE') {
            currentMode = payload;
            if (currentMode === 'browse' && selectedElement) {
                selectedElement.style.outline = '';
                selectedElement.contentEditable = 'false';
                selectedElement = null;
            }
        }

        // Obtiene estilos en batch para múltiples selectores (SmartZonePanel)
        if (type === 'NEXUS_BATCH_GET_STYLES') {
            const results = {};
            payload.requestList.forEach(req => {
                const fullSel = req.selector === '&' ? req.containerSelector : req.containerSelector + ' ' + req.selector;
                const el = document.querySelectorAll(fullSel)[0];
                if (el) {
                    const computed = window.getComputedStyle(el);
                    const styles = {};
                    (req.properties || []).forEach(prop => {
                        styles[prop] = computed.getPropertyValue(prop.replace(/([A-Z])/g, '-$1').toLowerCase());
                    });
                    styles.nexusId = el.getAttribute('data-nexus-id');
                    results[req.id] = styles;
                }
            });
            window.parent.postMessage({ type: 'NEXUS_BATCH_STYLES_RESPONSE', payload: results }, '*');
        }

        // Actualiza estilo de todos los elementos que coincidan con un selector CSS
        if (type === 'NEXUS_UPDATE_STYLE_BY_SELECTOR') {
            const { selector, property, value } = payload;
            document.querySelectorAll(selector).forEach(el => {
                let cssProp = property.replace(/([A-Z])/g, '-$1').toLowerCase();
                let cssVal = value;
                if (property === 'rotate') { cssProp = 'transform'; cssVal = 'rotate(' + value + ')'; }
                el.style.setProperty(cssProp, cssVal, 'important');
                if (selectedElement === el) el.style.outline = HIGHLIGHT_BORDER;
            });
        }

        // Feedback visual de selección de grupo
        if (type === 'NEXUS_SELECT_GROUP') {
            document.querySelectorAll('.nexus-group-overlay').forEach(el => el.remove());
            console.log('Group selected:', payload.groupId);
        }

        // Selecciona elemento por selector CSS (con scroll suave)
        if (type === 'NEXUS_SELECT_BY_SELECTOR') {
            const el = document.querySelector(payload.selector);
            if (el) { selectElement(el); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        }

        // Extrae imágenes de un widget carousel para el panel de edición
        if (type === 'NEXUS_GET_WIDGET_DATA') {
            const { nexusId, type: widgetType } = payload;
            const widgetEl = document.querySelector(\`[data-nexus-id="\${nexusId}"]\`);
            if (widgetEl && widgetType === 'carousel') {
                const images = Array.from(widgetEl.querySelectorAll('img')).map(img => ({
                    src: img.getAttribute('src'), alt: img.getAttribute('alt') || '', nexusId: img.getAttribute('data-nexus-id')
                }));
                window.parent.postMessage({ type: 'NEXUS_WIDGET_DATA_RESPONSE', payload: { nexusId, data: { images } } }, '*');
            }
        }
    });

    function getStyle(prop) { return window.getComputedStyle(selectedElement).getPropertyValue(prop); }
})();
`;
