// Archivo: frontend/src/components/VisualEditor/useEditorSave.js
// Lógica de persistencia: buildPatchPayload + handleSave.
// Extraído de useEditorActions.js para cumplir Ley de 200 Líneas 2026.

import { resolveProjectId } from './editor-utils';

/**
 * Transforma el mapa de cambios en los 4 tipos de parche (CSS, HTML, atributos, widgets).
 * @param {object} changes - Mapa selector → propiedades modificadas.
 * @returns {{ cssPatch, htmlPatch, attrPatch }} - Arrays de parches para la API.
 */
export const buildPatchPayload = (changes) => {
    const cssPatch = [], htmlPatch = [], attrPatch = [];

    Object.entries(changes).forEach(([selector, properties]) => {
        const styleProps = {};
        let contentChange = null, hrefChange = null;
        const nexusId = properties.nexusId;

        Object.entries(properties).forEach(([key, value]) => {
            // Normaliza camelCase → kebab-case
            let finalKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            if (key === 'backgroundColor') finalKey = 'background-color';

            if (key === 'innerHTML') contentChange = value;
            else if (key === 'href') hrefChange = value;
            else if (!['nexusId', 'innerText', 'tagName'].includes(key) && !key.startsWith('_')) {
                styleProps[finalKey] = value;
            }
        });

        if (Object.keys(styleProps).length > 0) cssPatch.push({ selector, styles: styleProps });
        if (contentChange !== null) htmlPatch.push({ selector, content: contentChange, nexusId });
        if (hrefChange !== null && nexusId) attrPatch.push({ nexusId, selector, href: hrefChange });

        // Parche de atributos inline (para persistir estilos como atributos HTML)
        if (nexusId && Object.keys(styleProps).length > 0) {
            const inlineStyle = Object.entries(styleProps).map(([k, v]) => `${k}: ${v} !important`).join('; ');
            const attrs = { style: inlineStyle };
            if (properties.tagName?.toUpperCase() === 'IMG') {
                if (styleProps.width) attrs.width = String(styleProps.width).replace('px', '');
                if (styleProps.height) attrs.height = String(styleProps.height).replace('px', '');
            }
            attrPatch.push({ nexusId, selector, ...attrs });
        }
    });

    return { cssPatch, htmlPatch, attrPatch };
};

/**
 * Crea la función handleSave vinculada al estado del editor.
 * Envía todos los parches a la API y resetea el estado de cambios.
 */
export const createSaveAction = ({ changes, widgetChanges, setChanges, setWidgetChanges, setIsSaving, setIframeKey, targetUrl }) =>
    async () => {
        const hasChanges = Object.keys(changes).length > 0;
        const hasWidgetChanges = Object.keys(widgetChanges).length > 0;
        if (!hasChanges && !hasWidgetChanges) return;

        const { cssPatch, htmlPatch, attrPatch } = buildPatchPayload(changes);
        const derivedProjectId = resolveProjectId(targetUrl);
        const targetPath = document.querySelector('iframe')?.contentWindow?.location?.pathname;

        setIsSaving(true);
        try {
            const requests = [];
            const pid = derivedProjectId || 'tucu-red';
            const base = { method: 'POST', headers: { 'Content-Type': 'application/json' } };

            if (cssPatch.length > 0) requests.push(fetch('/api/nexus/apply-patch', { ...base, body: JSON.stringify({ projectId: pid, patchData: cssPatch, targetPath }) }));

            if (htmlPatch.length > 0) {
                const updates = {};
                htmlPatch.forEach(item => { if (item.nexusId) updates[item.nexusId] = item.content; });
                if (Object.keys(updates).length > 0) requests.push(fetch('/api/nexus/update_content_json', { ...base, body: JSON.stringify({ projectId: pid, updates, targetPath }) }));
                requests.push(fetch('/api/nexus/apply-html-patch', { ...base, body: JSON.stringify({ projectId: pid, patchData: htmlPatch, targetPath }) }));
            }

            if (attrPatch.length > 0) requests.push(fetch('/api/nexus/update_html_attrs', { ...base, body: JSON.stringify({ projectId: pid, attrPatches: attrPatch, targetPath }) }));
            if (Object.keys(widgetChanges).length > 0) requests.push(fetch('/api/nexus/update_widget', { ...base, body: JSON.stringify({ projectId: pid, widgets: widgetChanges, targetPath }) }));

            await Promise.all(requests);
            setChanges({});
            setWidgetChanges({});
            setIframeKey(Date.now());
        } catch (error) {
            console.error('Save Error:', error);
            alert('❌ Network/Save Error');
        } finally {
            setIsSaving(false);
        }
    };
