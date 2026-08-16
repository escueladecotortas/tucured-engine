// Archivo: frontend/src/components/VisualEditor/bridge-select.js
// Segmento 2 del Bridge: getUniqueSelector, selectElement, handleInput.
// BridgeSource.js fragmentado por Ley de 200 Líneas 2026.
// ⚠️ Este código se inyecta como string en el iframe — sintaxis ES5+.

export const BRIDGE_SELECT = `
    // Genera selector único CSS para un elemento (usa data-nexus-id como prioridad)
    function getUniqueSelector(el) {
        if (!(el instanceof Element)) return;
        if (el.hasAttribute('data-nexus-id')) {
            return \`[data-nexus-id="\${el.getAttribute('data-nexus-id')}"]\ \`;
        }
        var path = [];
        while (el.nodeType === Node.ELEMENT_NODE) {
            var selector = el.nodeName.toLowerCase();
            if (el.id) { selector += '#' + el.id; path.unshift(selector); break; }
            var sib = el, nth = 1;
            while (sib = sib.previousElementSibling) { if (sib.nodeName.toLowerCase() == selector) nth++; }
            if (nth != 1) selector += ':nth-of-type(' + nth + ')';
            path.unshift(selector);
            el = el.parentNode;
        }
        return path.join(' > ');
    }

    // Construye el objeto de estilos y metadatos del elemento seleccionado
    function buildStylePayload(el) {
        const isImage = el.tagName === 'IMG';
        const SIGNIFICANT_TAGS = ['body','header','nav','main','footer','section','article'];

        // Breadcrumbs de contexto
        const breadcrumbs = [];
        let curr = el;
        while (curr && curr !== document.documentElement) {
            const tag = curr.tagName.toLowerCase();
            if (curr === el || tag === 'body' || SIGNIFICANT_TAGS.includes(tag) || (curr.id && curr.id.trim() !== '')) {
                breadcrumbs.unshift({
                    tagName: tag, nexusId: curr.getAttribute('data-nexus-id'),
                    id: curr.id, className: curr.className,
                    index: curr.parentElement ? Array.from(curr.parentElement.children).indexOf(curr) + 1 : 0
                });
            }
            curr = curr.parentElement;
        }

        const computed = window.getComputedStyle(el);
        const getStyle = (prop) => computed.getPropertyValue(prop);

        const payload = {
            tagName: el.tagName.toLowerCase(), nexusId: el.getAttribute('data-nexus-id'),
            breadcrumbs, children: Array.from(el.children).map(c => ({ tagName: c.tagName.toLowerCase(), nexusId: c.getAttribute('data-nexus-id'), id: c.id, className: c.className })),
            className: el.className, selector: getUniqueSelector(el),
            innerText: el.innerText || '', innerHTML: el.innerHTML || '', isImage,
            // Propiedades de tipografía
            color: getStyle('color'), backgroundColor: getStyle('background-color'),
            fontSize: getStyle('font-size'), fontWeight: getStyle('font-weight'),
            fontFamily: getStyle('font-family'), fontStyle: getStyle('font-style'),
            textDecoration: getStyle('text-decoration-line'), textAlign: getStyle('text-align'),
            // Espaciado
            paddingTop: getStyle('padding-top'), paddingRight: getStyle('padding-right'),
            paddingBottom: getStyle('padding-bottom'), paddingLeft: getStyle('padding-left'),
            marginTop: getStyle('margin-top'), marginRight: getStyle('margin-right'),
            marginBottom: getStyle('margin-bottom'), marginLeft: getStyle('margin-left'),
            // Layout
            borderRadius: getStyle('border-radius'), lineHeight: getStyle('line-height'),
            objectFit: getStyle('object-fit'), objectPosition: getStyle('object-position'),
            transform: getStyle('transform'), filter: getStyle('filter'), boxShadow: getStyle('box-shadow'),
            display: getStyle('display'), alignItems: getStyle('align-items'), flexDirection: getStyle('flex-direction'),
            width: el.style.width || (isImage && el.getAttribute('width') ? el.getAttribute('width') + 'px' : getStyle('width')),
            height: el.style.height || (isImage && el.getAttribute('height') ? el.getAttribute('height') + 'px' : getStyle('height')),
            parentWidth: el.parentElement ? el.parentElement.clientWidth : window.innerWidth,
            parentHeight: el.parentElement ? el.parentElement.clientHeight : window.innerHeight,
            currentWidth: el.offsetWidth, currentHeight: el.offsetHeight,
            hasChildren: el.children.length > 0,
            nexusWidget: el.getAttribute('data-nexus-widget') || null,
            widgetMeta: el.getAttribute('data-nexus-widget') === 'carousel' ? {
                images: Array.from(el.querySelectorAll('img')).map(img => ({ src: img.getAttribute('src'), nexusId: img.getAttribute('data-nexus-id') }))
            } : null,
        };

        if (isImage) { payload.src = el.src; payload.alt = el.alt; payload.naturalWidth = el.naturalWidth; payload.naturalHeight = el.naturalHeight; }
        if (el.tagName === 'A') { payload.isLink = true; payload.href = el.href; payload.target = el.target; }
        return payload;
    }

    // Selecciona un elemento: actualiza estado, aplica outline y notifica al parent
    function selectElement(el) {
        if (selectedElement) {
            selectedElement.style.outline = '';
            selectedElement.contentEditable = 'false';
            selectedElement.removeEventListener('input', handleInput);
        }
        selectedElement = el;
        selectedElement.style.outline = HIGHLIGHT_BORDER;
        const isImage = el.tagName === 'IMG';
        if (!isImage) { selectedElement.contentEditable = 'true'; selectedElement.focus(); selectedElement.addEventListener('input', handleInput); }
        window.parent.postMessage({ type: 'NEXUS_ELEMENT_SELECTED', payload: buildStylePayload(el) }, '*');
    }

    // Propaga cambios de contenido editable al parent en tiempo real
    function handleInput(e) {
        let value = e.target.innerHTML;
        if (['H1','H2','H3','H4','H5','H6','BUTTON','SPAN'].includes(e.target.tagName) && value.includes('<p>')) {
            value = value.replace(/<\\/?p[^>]*>/g, '');
        }
        window.parent.postMessage({ type: 'NEXUS_UPDATE_CONTENT', payload: { value, nexusId: selectedElement.getAttribute('data-nexus-id') } }, '*');
    }
`;
