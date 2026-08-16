// Archivo: frontend/src/components/VisualEditor/bridge-init.js
// Segmento 1 del Bridge: Inicialización, inyección de IDs y manejo de hover/click.
// BridgeSource.js fragmentado por Ley de 200 Líneas 2026.

export const BRIDGE_INIT = `
(function () {
    console.log("👻 Nexus Editor Bridge Initialized");
    console.log("☢️ NUCLEAR BRIDGE ACTIVE");

    let selectedElement = null;
    let currentMode = 'edit'; // 'edit' | 'browse'
    const HIGHLIGHT_BORDER = '2px solid #6366f1';
    const HOVER_BORDER = '1px dashed #a5b4fc';

    const SAFE_TAGS = [
        'H1','H2','H3','H4','H5','H6','P','SPAN','A','LI','BUTTON','LABEL',
        'TD','TH','STRONG','EM','B','I','IMG',
        'DIV','SECTION','ARTICLE','HEADER','FOOTER','NAV','MAIN','ASIDE'
    ];

    // Inyecta data-nexus-id únicos en todos los elementos seguros
    function injectNexusIds() {
        document.querySelectorAll(SAFE_TAGS.join(',')).forEach(el => {
            if (!el.hasAttribute('data-nexus-id')) {
                el.setAttribute('data-nexus-id', Math.random().toString(36).substr(2, 9));
            }
        });
    }

    injectNexusIds();
    const observer = new MutationObserver(muts => { if (muts.some(m => m.addedNodes.length > 0)) injectNexusIds(); });
    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(injectNexusIds, 2000); // Fallback para widgets lazy

    // Hover: resalta elemento bajo el cursor
    document.addEventListener('mouseover', (e) => {
        if (currentMode === 'browse') return;
        e.stopPropagation();
        if (e.target === document.body || e.target === document.documentElement) return;
        e.target.style.outline = HOVER_BORDER;
        e.target.style.cursor = 'default';
    });
    document.addEventListener('mouseout', (e) => {
        if (currentMode === 'browse') return;
        e.stopPropagation();
        e.target.style.outline = '';
        e.target.style.cursor = '';
    });

    // Click: selección de elemento (fase captura para interceptar antes de handlers nativos)
    document.addEventListener('click', (e) => {
        console.log("☢️ BRIDGE CLICK:", e.target);
        if (currentMode === 'browse') return;

        // Whitelist: widgets con interacción nativa
        if (e.target.closest('#calendar-widget-container') ||
            e.target.classList.contains('carousel-btn') ||
            e.target.closest('.carousel-btn')) return;

        // Botón de confirmación: seleccionar sin bloquear
        if (e.target.id === 'btnConfirm' || e.target.closest('#btnConfirm')) {
            e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
            selectElement(e.target.id === 'btnConfirm' ? e.target : e.target.closest('#btnConfirm') || e.target);
            return;
        }

        e.preventDefault(); e.stopPropagation();
        if (e.target === document.body || e.target === document.documentElement) return;
        const validTarget = SAFE_TAGS.includes(e.target.tagName) ? e.target : e.target.closest(SAFE_TAGS.join(','));
        if (validTarget) selectElement(validTarget);
    }, true);
`;
