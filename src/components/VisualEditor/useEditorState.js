// Archivo: frontend/src/components/VisualEditor/useEditorState.js
// Hook maestro de estado para el VisualEditor. Gestiona selección, cambios, historial y helpers de estilos.
import { useState, useRef, useEffect } from 'react';

// Colores de marca estáticos
export const BRAND_COLORS = ['#D4AF37', '#E0B0B6', '#FCEFF1', '#2C2C2C', '#FAF9F6'];

// Parsea "50% 50%" -> { x: 50, y: 50 }
export const parseObjectPosition = (posStr) => {
    if (!posStr) return { x: 50, y: 50 };
    const parts = posStr.split(' ');
    let x = 50, y = 50;
    if (parts[0].includes('%')) x = parseFloat(parts[0]);
    else if (parts[0] === 'left') x = 0;
    else if (parts[0] === 'right') x = 100;
    else if (parts[0] === 'center') x = 50;
    if (parts.length > 1) {
        if (parts[1].includes('%')) y = parseFloat(parts[1]);
        else if (parts[1] === 'top') y = 0;
        else if (parts[1] === 'bottom') y = 100;
        else if (parts[1] === 'center') y = 50;
    }
    return { x, y };
};

// Parsea filtros CSS como string -> objeto con defaults
export const parseFilters = (filterStr) => {
    const defaults = { brightness: 100, contrast: 100, saturate: 100, grayscale: 0, blur: 0 };
    if (!filterStr || filterStr === 'none') return defaults;
    const result = { ...defaults };
    const matches = filterStr.match(/([a-z]+)\(([^)]+)\)/g);
    if (matches) {
        matches.forEach(m => {
            const parts = m.match(/([a-z]+)\(([^)]+)\)/);
            if (parts) {
                const val = parseFloat(parts[2]);
                if (!isNaN(val)) result[parts[1]] = val;
            }
        });
    }
    return result;
};

// Convierte color rgb/rgba/named a HEX
export const rgbToHex = (color) => {
    if (!color) return '#000000';
    if (color.startsWith('#')) return color;
    if (color.startsWith('rgb')) {
        const values = color.match(/\d+(\.\d+)?/g);
        if (!values || values.length < 3) return '#000000';
        const r = parseInt(values[0]).toString(16).padStart(2, '0');
        const g = parseInt(values[1]).toString(16).padStart(2, '0');
        const b = parseInt(values[2]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    }
    const d = document.createElement('div');
    d.style.color = color;
    document.body.appendChild(d);
    const computed = window.getComputedStyle(d).color;
    document.body.removeChild(d);
    if (computed && computed !== color) return rgbToHex(computed);
    return '#000000';
};

// Smart Scale: convierte px fijos a valores responsive para fuentes y anchos grandes
export const getSmartValue = (property, value) => {
    if (!value) return value;
    const stringVal = String(value);
    if (!stringVal.endsWith('px') && isNaN(parseFloat(stringVal))) return value;
    if (stringVal.includes('clamp') || stringVal.includes('min(') || stringVal.includes('calc')) return value;
    const numVal = parseFloat(stringVal);
    if (isNaN(numVal)) return value;
    if ((property === 'fontSize' || property === 'font-size') && numVal > 24) {
        const vw = (numVal / 1200) * 100;
        const minVal = Math.round(numVal / 1.8);
        return `clamp(${minVal}px, ${vw.toFixed(2)}vw, ${numVal}px)`;
    }
    if (property === 'width' && numVal > 300) return `min(100%, ${numVal}px)`;
    return value;
};

// Hook principal de estado del editor
export const useEditorState = () => {
    const [activeDevice, setActiveDevice] = useState('desktop');
    const [scale, setScale] = useState(1);
    const [targetUrl, setTargetUrl] = useState(() => {
        const params = new URLSearchParams(window.location.hash.split('?')[1]);
        let url = params.get('url') || 'http://localhost:5173';
        if (url.includes('localhost:3001')) url = url.replace('', '');
        return url;
    });
    const [selectedElement, setSelectedElement] = useState(null);
    const selectedElementRef = useRef(null);
    const [changes, setChanges] = useState({});
    const [widgetChanges, setWidgetChanges] = useState({});
    const [iframeKey, setIframeKey] = useState(Date.now());
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [elementList, setElementList] = useState([]);
    const [isLoadingElements, setIsLoadingElements] = useState(false);
    const [sidebarTab, setSidebarTab] = useState('properties');
    const [zones, setZones] = useState([]);
    const [selectedZone, setSelectedZone] = useState(null);
    const [isLoadingZones, setIsLoadingZones] = useState(false);
    const [editorMode, setEditorMode] = useState('edit');
    const [aspectLocked, setAspectLocked] = useState(true);
    const [openSection, setOpenSection] = useState('typography');
    const [history, setHistory] = useState([{}]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [positionState, setPositionState] = useState({ x: 50, y: 50 });
    const [recentColors, setRecentColors] = useState(['#EF4444', '#3B82F6', '#10B981']);
    const [isSaving, setIsSaving] = useState(false);

    // Sincronizar URL desde hashchange
    useEffect(() => {
        const handleUrlChange = () => {
            const params = new URLSearchParams(window.location.hash.split('?')[1]);
            let url = params.get('url');
            if (url) {
                if (url.includes('localhost:3001')) url = url.replace('', '');
                setTargetUrl(url);
            }
        };
        window.addEventListener('hashchange', handleUrlChange);
        window.addEventListener('popstate', handleUrlChange);
        return () => {
            window.removeEventListener('hashchange', handleUrlChange);
            window.removeEventListener('popstate', handleUrlChange);
        };
    }, []);

    // Sincronizar slider focal point cuando cambia el elemento
    useEffect(() => {
        if (selectedElement?.objectPosition) {
            setPositionState(parseObjectPosition(selectedElement.objectPosition));
        } else {
            setPositionState({ x: 50, y: 50 });
        }
    }, [selectedElement?.objectPosition]);

    const addToRecentColors = (color) => {
        if (!color || color.startsWith('rgb')) return;
        setRecentColors(prev => {
            const temp = prev.filter(c => c !== color);
            return [color, ...temp].slice(0, 8);
        });
    };

    // Push al historial de cambios
    const pushHistory = (newState) => {
        if (historyIndex >= 0 && JSON.stringify(history[historyIndex]) === JSON.stringify(newState)) return;
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newState);
        if (newHistory.length > 50) newHistory.shift();
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    // Calcula diff entre dos snapshots para undo/redo
    const computeStateDiff = (current, target) => {
        const diff = JSON.parse(JSON.stringify(target));
        Object.keys(current).forEach(selector => {
            const currentProps = current[selector];
            const targetProps = target[selector] || {};
            let missingProps = {};
            let hasMissing = false;
            Object.keys(currentProps).forEach(prop => {
                if (prop !== 'nexusId' && targetProps[prop] === undefined) {
                    missingProps[prop] = '';
                    hasMissing = true;
                }
            });
            if (hasMissing) {
                diff[selector] = { ...diff[selector], ...missingProps, nexusId: currentProps.nexusId };
            }
        });
        return diff;
    };

    return {
        activeDevice, setActiveDevice, scale, setScale,
        targetUrl, setTargetUrl,
        selectedElement, setSelectedElement, selectedElementRef,
        changes, setChanges, widgetChanges, setWidgetChanges,
        iframeKey, setIframeKey,
        showResetConfirm, setShowResetConfirm,
        elementList, setElementList, isLoadingElements, setIsLoadingElements,
        sidebarTab, setSidebarTab,
        zones, setZones, selectedZone, setSelectedZone,
        isLoadingZones, setIsLoadingZones,
        editorMode, setEditorMode,
        aspectLocked, setAspectLocked,
        openSection, setOpenSection,
        history, setHistory, historyIndex, setHistoryIndex,
        positionState, setPositionState,
        recentColors, addToRecentColors,
        isSaving, setIsSaving,
        pushHistory, computeStateDiff,
    };
};
