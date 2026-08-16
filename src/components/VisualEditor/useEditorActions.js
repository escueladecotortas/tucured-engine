// Archivo: frontend/src/components/VisualEditor/useEditorActions.js
// Acciones del editor: updateStyle, updateContent, updateHref, undo/redo, imagen.
// Dependencias: editor-utils.js, useEditorSave.js — Ley de 200 Líneas 2026.
import { getSmartValue, parseFilters } from './useEditorState';
import { createSaveAction } from './useEditorSave';
import { resolveProjectId, applyChangesToFrame, uploadImageToServer } from './editor-utils';


// Crea las funciones de acción vinculadas al estado del editor
export const createEditorActions = ({
    selectedElement, selectedElementRef, setSelectedElement,
    changes, setChanges, widgetChanges, setWidgetChanges,
    history, historyIndex, setHistory, setHistoryIndex,
    iframeKey, setIframeKey, setIsSaving, targetUrl,
    pushHistory, computeStateDiff, setPositionState, positionState
}) => {
    // Actualiza una propiedad CSS del elemento seleccionado
    const updateStyle = (property, value) => {
        const currentEl = selectedElementRef.current || selectedElement;
        const smartValue = getSmartValue(property, value);

        if (currentEl && currentEl.selector) {
            setChanges(prevChanges => {
                const newChanges = {
                    ...prevChanges,
                    [currentEl.selector]: {
                        ...(prevChanges[currentEl.selector] || {}),
                        [property]: smartValue,
                        nexusId: currentEl.nexusId,
                        tagName: currentEl.tagName
                    }
                };
                pushHistory(newChanges);
                return newChanges;
            });
        }

        if (selectedElementRef.current) {
            selectedElementRef.current = { ...selectedElementRef.current, [property]: smartValue };
        }
        setSelectedElement(prev => ({ ...prev, [property]: smartValue }));

        const iframe = document.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'NEXUS_UPDATE_STYLE',
                payload: { property, value: smartValue, nexusId: currentEl?.nexusId }
            }, '*');
        }
    };

    // Actualiza el focal point (objectPosition) de una imagen
    const updateFocalPoint = (axis, val) => {
        const newPos = { ...positionState, [axis]: parseFloat(val) };
        setPositionState(newPos);
        const valStr = `${newPos.x}% ${newPos.y}%`;
        updateStyle('objectPosition', valStr);
        if (selectedElement && selectedElement.objectFit !== 'cover') {
            updateStyle('objectFit', 'cover');
        }
    };

    // Actualiza un filtro CSS específico (brightness, contrast, etc.)
    const updateFilter = (name, val) => {
        const currentRef = selectedElementRef.current || selectedElement;
        const filters = parseFilters(currentRef?.filter || '');
        filters[name] = val;
        const filterString = Object.entries(filters)
            .map(([k, v]) => `${k}(${v}${k === 'blur' ? 'px' : '%'})`)
            .join(' ');
        updateStyle('filter', filterString);
    };

    // Actualiza el texto interno de un elemento
    const updateContent = (value) => {
        if (selectedElementRef.current) {
            selectedElementRef.current = { ...selectedElementRef.current, innerHTML: value, innerText: value };
        }
        setSelectedElement(prev => ({ ...prev, innerHTML: value, innerText: value }));
        const currentEl = selectedElementRef.current || selectedElement;
        if (currentEl && currentEl.selector) {
            setChanges(prev => ({
                ...prev,
                [currentEl.selector]: {
                    ...(prev[currentEl.selector] || {}),
                    innerHTML: value,
                    nexusId: currentEl.nexusId
                }
            }));
        }
        const iframe = document.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({ type: 'NEXUS_UPDATE_CONTENT', payload: { value } }, '*');
        }
    };

    // Actualiza el atributo href de un enlace
    const updateHref = (href) => {
        setSelectedElement(prev => ({ ...prev, href }));
        if (selectedElementRef.current) selectedElementRef.current.href = href;
        const currentEl = selectedElementRef.current || selectedElement;
        if (currentEl && currentEl.selector) {
            setChanges(prev => ({
                ...prev,
                [currentEl.selector]: {
                    ...(prev[currentEl.selector] || {}),
                    href,
                    nexusId: currentEl.nexusId
                }
            }));
        }
        const iframe = document.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({ type: 'NEXUS_UPDATE_HREF', payload: { href } }, '*');
        }
    };

    // Inyecta una Google Font en el iframe
    const injectFont = (fontFamily) => {
        const iframe = document.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({ type: 'NEXUS_INJECT_FONT', payload: { font: fontFamily } }, '*');
        }
    };

    // Selecciona el elemento padre en el iframe
    const selectParent = () => {
        const iframe = document.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({ type: 'NEXUS_SELECT_PARENT' }, '*');
        }
    };

    // Undo: regresa al snapshot anterior del historial
    const undo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            const targetSnapshot = history[newIndex];
            const currentSnapshot = changes;
            setHistoryIndex(newIndex);
            setChanges(targetSnapshot);
            try {
                const diff = computeStateDiff(currentSnapshot, targetSnapshot);
                applyChangesToFrame(diff, selectedElement, setSelectedElement);
            } catch (err) {
                console.error('Undo failed:', err);
                setIframeKey(k => k + 1);
            }
        }
    };

    // Redo: avanza al snapshot siguiente del historial
    const redo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            const targetSnapshot = history[newIndex];
            setHistoryIndex(newIndex);
            setChanges(targetSnapshot);
            const diff = computeStateDiff(changes, targetSnapshot);
            applyChangesToFrame(diff, selectedElement, setSelectedElement);
        }
    };

    // Sube una imagen al servidor y aplica la URL al elemento seleccionado
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const projectId = resolveProjectId(targetUrl) || 'tucu-red';
        try {
            const newUrl = await uploadImageToServer(file, projectId);
            updateStyle('src', newUrl);
            alert('✅ Image uploaded and applied!');
        } catch (err) {
            console.error('Upload Error:', err);
            alert('❌ Error subiendo imagen: ' + err.message);
        }
    };

    // handleSave delegado a useEditorSave para cumplir Ley de 200 Líneas
    const handleSave = createSaveAction({ changes, widgetChanges, setChanges, setWidgetChanges, setIsSaving, setIframeKey, targetUrl });

    return {
        updateStyle, updateFocalPoint, updateFilter,
        updateContent, updateHref, injectFont,
        selectParent, undo, redo,
        handleImageUpload, handleSave
    };
};
