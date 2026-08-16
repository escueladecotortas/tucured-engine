// Archivo: frontend/src/components/VisualEditor/editor-utils.js
// Utilidades compartidas del editor: resolveProjectId y applyChangesToFrame.
// Extraído de useEditorActions.js — Ley de 200 Líneas 2026.

/**
 * Infiere el projectId desde la URL del iframe target.
 * Prioriza el queryParam ?projectId, luego extrae del path nexus_archives/.
 */
export const resolveProjectId = (targetUrl) => {
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    let derivedProjectId = urlParams.get('projectId');

    if (!derivedProjectId && targetUrl) {
        if (targetUrl.includes('nexus_archives')) {
            const parts = targetUrl.split('nexus_archives/');
            if (parts.length > 1) {
                let relativePath = parts[1].split('?')[0];
                if (relativePath.match(/\.[a-z0-9]+$/i)) relativePath = relativePath.substring(0, relativePath.lastIndexOf('/'));
                else if (relativePath.endsWith('/')) relativePath = relativePath.slice(0, -1);
                derivedProjectId = decodeURIComponent(relativePath);
            }
        } else if (targetUrl.includes('clients/')) {
            let clientPart = targetUrl.split('clients/')[1];
            if (clientPart.includes('/')) clientPart = clientPart.split('/')[0];
            derivedProjectId = `tucu-red/clients/${clientPart}`;
        }
        if (!derivedProjectId && targetUrl.includes('tucu-red')) derivedProjectId = 'tucu-red';
    }
    return derivedProjectId;
};

/**
 * Aplica un snapshot de cambios al iframe vía postMessage.
 * Usado por undo/redo para reverter visualmente el estado.
 */
export const applyChangesToFrame = (snapshot, selectedElement, setSelectedElement) => {
    const iframe = document.querySelector('iframe');
    if (!iframe?.contentWindow) return;
    Object.keys(snapshot).forEach(selector => {
        const styleObj = snapshot[selector];
        const nexusId = styleObj.nexusId;
        Object.entries(styleObj).forEach(([prop, val]) => {
            if (prop === 'nexusId' || prop === 'innerHTML') return;
            iframe.contentWindow.postMessage({ type: 'NEXUS_UPDATE_STYLE', payload: { property: prop, value: val, nexusId } }, '*');
            if (selectedElement?.nexusId === nexusId) {
                setSelectedElement(prev => ({ ...prev, [prop]: val }));
            }
        });
    });
};

/**
 * Sube una imagen al servidor y devuelve la URL resultante.
 * @param {File} file - Archivo a subir.
 * @param {string} projectId - ID del proyecto destino.
 * @returns {Promise<string>} - URL relativa del archivo subido.
 */
export const uploadImageToServer = async (file, projectId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project', projectId);
    formData.append('dir', 'assets/images');
    const res = await fetch('/api/files/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Upload failed');
    return `/nexus_archives/${projectId}/assets/images/${file.name}`;
};
