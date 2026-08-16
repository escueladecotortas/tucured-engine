(function () {
    console.log("👻 Nexus Editor Bridge Initialized (Lightweight)");

    let selectedElement = null;
    const HIGHLIGHT_BORDER = '2px solid #6366f1'; // Indigo 500
    const HOVER_BORDER = '1px dashed #a5b4fc'; // Indigo 300

    // 1. Hover Effect
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

    // 0. ID Injection & Initialization
    const SAFE_TAGS = [
        'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'A', 'LI', 'BUTTON', 'LABEL',
        'TD', 'TH', 'STRONG', 'EM', 'B', 'I', 'IMG',
        'DIV', 'SECTION', 'ARTICLE', 'HEADER', 'FOOTER', 'NAV', 'MAIN', 'ASIDE'
    ];

    function injectNexusIds() {
        const elements = document.querySelectorAll(SAFE_TAGS.join(','));
        elements.forEach(el => {
            if (!el.hasAttribute('data-nexus-id')) {
                el.setAttribute('data-nexus-id', Math.random().toString(36).substr(2, 9));
            }
        });
        console.log(`👻 Nexus IDs injected into ${elements.length} elements`);
    }

    injectNexusIds();

    const observer = new MutationObserver((mutations) => {
        let needsReinjection = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) needsReinjection = true;
        });
        if (needsReinjection) injectNexusIds();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Fallback: Interval cleaning for lazy-loaded widgets
    setInterval(() => {
        injectNexusIds();
    }, 2000);

    // Mode State
    let currentMode = 'edit'; // 'edit' or 'browse'


    // 2. Click Interception & Selection (CAPTURE PHASE - runs before other handlers)
    document.addEventListener('click', (e) => {
        console.log("☢️ NUCLEAR BRIDGE CLICK CHECK:", e.target);
        if (currentMode === 'browse') return; // Bypass if browsing

        // ALLOW LIST: Navigation Controls (Calendar Arrows) - Allow event to pass through so booking.js works
        // NUCLEAR OPTION: Whitelist the ENTIRE widget container
        const widgetContainer = e.target.closest('#calendar-widget-container');

        if (widgetContainer ||
            e.target.classList.contains('carousel-btn') || e.target.closest('.carousel-btn')) {
            // Allow default action (booking.js / carousel click)
            return; // ALLOW
        }

        // Special handling for calendar widget button
        if (e.target.id === 'btnConfirm' || e.target.closest('#btnConfirm') ||
            e.target.hasAttribute('data-nexus-id') && e.target.getAttribute('data-nexus-id') === 'btn_booking') {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            selectElement(e.target.id === 'btnConfirm' ? e.target : e.target.closest('#btnConfirm') || e.target);
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        if (e.target === document.body || e.target === document.documentElement) return;

        let validTarget = null;
        if (SAFE_TAGS.includes(e.target.tagName)) {
            validTarget = e.target;
        } else {
            validTarget = e.target.closest(SAFE_TAGS.join(','));
        }

        if (validTarget) {
            selectElement(validTarget);
        }
    }, true); // TRUE = CAPTURE PHASE

    function getUniqueSelector(el) {
        if (!(el instanceof Element)) return;

        // 1. Prioritize Nexus ID (Strongest Specifity for this system)
        if (el.hasAttribute('data-nexus-id')) {
            return `[data-nexus-id="${el.getAttribute('data-nexus-id')}"]`;
        }

        var path = [];
        while (el.nodeType === Node.ELEMENT_NODE) {
            var selector = el.nodeName.toLowerCase();
            if (el.id) {
                selector += '#' + el.id;
                path.unshift(selector);
                break;
            } else {
                var sib = el, nth = 1;
                while (sib = sib.previousElementSibling) {
                    if (sib.nodeName.toLowerCase() == selector) nth++;
                }
                if (nth != 1) selector += ":nth-of-type(" + nth + ")";
            }
            path.unshift(selector);
            el = el.parentNode;
        }
        return path.join(" > ");
    }

    function selectElement(el) {
        if (selectedElement) {
            selectedElement.style.outline = '';
            selectedElement.contentEditable = "false";
            selectedElement.removeEventListener('input', handleInput);
        }

        selectedElement = el;
        selectedElement.style.outline = HIGHLIGHT_BORDER;

        const isImage = el.tagName === 'IMG';
        if (!isImage) {
            selectedElement.contentEditable = "true";
            selectedElement.focus();
            selectedElement.addEventListener('input', handleInput);
        }

        // Analyze Properties
        // Breadcrumbs
        const breadcrumbs = [];
        let curr = el;
        const SIGNIFICANT_TAGS = ['body', 'header', 'nav', 'main', 'footer', 'section', 'article'];

        while (curr && curr !== document.documentElement) {
            const tag = curr.tagName.toLowerCase();
            const hasId = curr.id && curr.id.trim() !== '';

            // Always include: Selected Element, Body, Semantic Tags, or Elements with ID
            if (curr === el || tag === 'body' || SIGNIFICANT_TAGS.includes(tag) || hasId) {
                // Sibling Index
                let index = 0;
                if (curr.parentElement) {
                    index = Array.from(curr.parentElement.children).indexOf(curr) + 1;
                }

                breadcrumbs.unshift({
                    tagName: tag,
                    nexusId: curr.getAttribute('data-nexus-id'),
                    id: curr.id,
                    className: curr.className,
                    index: index // Add index like [1]
                });
            }
            curr = curr.parentElement;
        }

        // Capture Children for "Down" navigation
        const childrenList = Array.from(el.children).map(child => ({
            tagName: child.tagName.toLowerCase(),
            nexusId: child.getAttribute('data-nexus-id'),
            id: child.id,
            className: child.className
        }));

        // Debug "Turnos"
        if (el.innerText.toLowerCase().includes('turnos')) {
            console.log("Turnos Button Selected:", el);
            console.log("Computed Margin:", window.getComputedStyle(el).marginTop);
            console.log("Parent Display:", window.getComputedStyle(el.parentElement).display);
        }

        const styles = {
            tagName: el.tagName.toLowerCase(),
            nexusId: el.getAttribute('data-nexus-id'),
            breadcrumbs: breadcrumbs,
            children: childrenList, // Send children
            className: el.className,
            selector: getUniqueSelector(el),
            innerText: el.innerText || '',
            innerHTML: el.innerHTML || '',
            isImage: isImage,

            // Visual Properties
            color: getStyle('color'),
            backgroundColor: getStyle('background-color'),
            fontSize: getStyle('font-size'),
            fontWeight: getStyle('font-weight'),
            fontFamily: getStyle('font-family'),
            fontStyle: getStyle('font-style'),
            textDecoration: getStyle('text-decoration-line'), // Usually reports 'none' or 'underline'
            textAlign: getStyle('text-align'),

            // Spacing (Granular for Inputs)
            padding: getStyle('padding'), // Keep for reference
            paddingTop: getStyle('padding-top'),
            paddingRight: getStyle('padding-right'),
            paddingBottom: getStyle('padding-bottom'),
            paddingLeft: getStyle('padding-left'),

            margin: getStyle('margin'), // Keep for reference
            marginTop: getStyle('margin-top'),
            marginRight: getStyle('margin-right'),
            marginBottom: getStyle('margin-bottom'),
            marginLeft: getStyle('margin-left'),

            borderRadius: getStyle('border-radius'),
            // For ALL elements: prefer inline style over computed (which reflects rendered size)
            // For images: also check HTML attributes
            width: el.style.width ? el.style.width :
                (isImage && el.getAttribute('width') ? el.getAttribute('width') + 'px' : getStyle('width')),
            height: el.style.height ? el.style.height :
                (isImage && el.getAttribute('height') ? el.getAttribute('height') + 'px' : getStyle('height')),
            // Dimensions for Unit Conversion (Use Client Dimension for Content Box context)
            parentWidth: el.parentElement ? el.parentElement.clientWidth : window.innerWidth,
            parentHeight: el.parentElement ? el.parentElement.clientHeight : window.innerHeight,

            lineHeight: getStyle('line-height'),
            objectFit: getStyle('object-fit'),
            objectPosition: getStyle('object-position'),
            transform: getStyle('transform'),
            filter: getStyle('filter'),
            boxShadow: getStyle('box-shadow'),

            // Flexbox
            display: getStyle('display'),
            alignItems: getStyle('align-items'),
            flexDirection: getStyle('flex-direction'),

            // Safety
            hasChildren: el.children.length > 0,

            // Widget Logic
            nexusWidget: el.getAttribute('data-nexus-widget') || null,
            widgetMeta: (el.getAttribute('data-nexus-widget') === 'carousel') ? {
                images: Array.from(el.querySelectorAll('img')).map(img => ({
                    src: img.getAttribute('src'),
                    nexusId: img.getAttribute('data-nexus-id')
                }))
            } : null,
        };

        if (isImage) {
            styles.src = el.src;
            styles.alt = el.alt;
            styles.naturalWidth = el.naturalWidth;
            styles.naturalHeight = el.naturalHeight;
        }

        // Capture dimensions for all elements (for Aspect Ratio Lock)
        styles.currentWidth = el.offsetWidth;
        styles.currentHeight = el.offsetHeight;

        if (el.tagName === 'A') {
            styles.isLink = true;
            styles.href = el.href;
            styles.target = el.target;
        }



        window.parent.postMessage({
            type: 'NEXUS_ELEMENT_SELECTED',
            payload: styles
        }, '*');
    }

    function handleInput(e) {
        let value = e.target.innerHTML;
        const tagName = e.target.tagName;

        if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BUTTON', 'SPAN'].includes(tagName)) {
            if (value.includes('<p>')) {
                value = value.replace(/<\/?p[^>]*>/g, "");
            }
        }

        window.parent.postMessage({
            type: 'NEXUS_UPDATE_CONTENT',
            payload: { value, nexusId: selectedElement.getAttribute('data-nexus-id') }
        }, '*');
    }

    // 3. Listen for Updates
    window.addEventListener('message', (event) => {
        const { type, payload } = event.data;

        if (type === 'NEXUS_UPDATE_STYLE') {
            let targetEl = selectedElement;

            // Allow targeting specific element by ID (for Undo/Redo)
            if (payload.nexusId) {
                const found = document.querySelector(`[data-nexus-id="${payload.nexusId}"]`);
                if (found) targetEl = found;
            }

            if (targetEl) {
                if (payload.property && payload.value !== undefined) {
                    const kebabProperty = payload.property.replace(/([A-Z])/g, '-$1').toLowerCase();
                    targetEl.style.setProperty(kebabProperty, payload.value, 'important');

                    // Maintain outline if it's the selected element
                    if (targetEl === selectedElement) {
                        targetEl.style.outline = HIGHLIGHT_BORDER;
                    }


                }
            }
        }

        if (type === 'NEXUS_UPDATE_CONTENT') {
            if (selectedElement && selectedElement.innerHTML !== payload.value) {
                selectedElement.innerHTML = payload.value;
            }
        }

        if (type === 'NEXUS_INJECT_FONT') {
            const fontFamily = payload.font;
            if (fontFamily) {
                const existingLink = document.querySelector(`link[href*="${fontFamily.replace(/ /g, '+')}"]`);
                if (!existingLink) {
                    const link = document.createElement('link');
                    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}&display=swap`;
                    link.rel = 'stylesheet';
                    document.head.appendChild(link);
                }
            }
        }

        if (type === 'NEXUS_UPDATE_HREF') {
            if (selectedElement && selectedElement.tagName === 'A') {
                selectedElement.href = payload.href;
            }
        }

        if (type === 'NEXUS_SELECT_PARENT') {
            if (selectedElement && selectedElement.parentElement && selectedElement.parentElement !== document.body) {
                selectElement(selectedElement.parentElement);
            }
        }

        if (type === 'NEXUS_SELECT_ID') {
            if (payload.nexusId) {
                const el = document.querySelector(`[data-nexus-id="${payload.nexusId}"]`);
                if (el) selectElement(el);
            }
        }

        if (type === 'NEXUS_SET_MODE') {
            currentMode = payload;
            console.log(`👻 Mode set to: ${currentMode}`);
            if (currentMode === 'browse') {
                if (selectedElement) {
                    selectedElement.style.outline = '';
                    selectedElement.contentEditable = "false";
                    selectedElement = null;
                }
            }
        }

        if (type === 'NEXUS_UPDATE_WIDGET_IMAGES') {
            // Note: images come directly in event.data, not in payload
            const images = event.data.images || payload?.images || [];
            if (selectedElement && selectedElement.getAttribute('data-nexus-widget') === 'carousel') {

                // 1. Inject Swiper Dependencies if missing
                // Now handled by initSwiperWidgets(), but we call it here to ensure availability
                initSwiperWidgets();

                // 2. Prepare Container Structure for Swiper
                let swiperContainer = selectedElement.querySelector('.swiper');
                if (!swiperContainer) {
                    // Check for old container and remove/replace
                    const oldContainer = selectedElement.querySelector('.carousel-container');
                    if (oldContainer) oldContainer.remove();

                    swiperContainer = document.createElement('div');
                    swiperContainer.className = 'swiper mySwiper w-full h-full';
                    // Add styles to ensure visibility
                    swiperContainer.style.width = '100%';
                    swiperContainer.style.height = '100%';

                    selectedElement.appendChild(swiperContainer);
                }

                // Reset inner HTML to standard Swiper structure
                swiperContainer.innerHTML = ' <div class="swiper-wrapper"></div> <div class="swiper-pagination"></div> <div class="swiper-button-next"></div> <div class="swiper-button-prev"></div> ';

                const wrapper = swiperContainer.querySelector('.swiper-wrapper');

                if (images.length > 0) {
                    // Build base URL for resolving relative paths (backend server)
                    const backendBase = 'http://localhost:3001';
                    const currentPath = window.location.pathname;

                    // Improved Project Path Extraction
                    // /nexus_archives/PROJECT_NAME/index.html -> PROJECT_NAME
                    const pathMatch = currentPath.match(/\/nexus_archives\/([^/]+)/);
                    const projectPath = pathMatch ? pathMatch[1] : '';

                    console.log(`🎠 Carousel Update: Processing ${images.length} images. Project Path: ${projectPath}`);

                    images.forEach((imgData, index) => {
                        const slide = document.createElement('div');
                        slide.className = 'swiper-slide flex items-center justify-center bg-black/5';
                        slide.setAttribute('data-nexus-id', 'slide_' + Date.now() + '_' + index);

                        // Ensure slide takes full size
                        slide.style.width = '100%';
                        slide.style.height = '100%';

                        const img = document.createElement('img');
                        img.className = 'w-full h-full object-cover';

                        // PRIORITY 1: previewSrc from Editor (Absolute URL)
                        let distinctSrc = imgData.previewSrc;

                        // PRIORITY 2: src (Relative or Absolute)
                        if (!distinctSrc) {
                            let rawSrc = imgData.src;
                            if (rawSrc && !rawSrc.startsWith('http') && !rawSrc.startsWith('data:') && !rawSrc.startsWith('blob:')) {
                                // Convert relative path to Backend Absolute URL
                                if (projectPath) {
                                    distinctSrc = `${backendBase}/nexus_archives/${projectPath}/${rawSrc.replace(/^\//, '')}`;
                                } else {
                                    distinctSrc = rawSrc;
                                }
                            } else {
                                distinctSrc = rawSrc;
                            }
                        }

                        if (distinctSrc && distinctSrc.trim() !== '' && !distinctSrc.includes('undefined')) {
                            img.src = distinctSrc;
                        } else {
                            img.src = 'https://images.unsplash.com/photo-1542377281-a95cda774d09?q=80&w=400&auto=format&fit=crop';
                        }

                        img.alt = 'Slide ' + (index + 1);
                        img.onerror = function () {
                            this.src = 'https://images.unsplash.com/photo-1542377281-a95cda774d09?q=80&w=400&auto=format&fit=crop';
                            this.onerror = null;
                        };

                        if (imgData.src && imgData.src.trim() !== '') {
                            img.setAttribute('data-save-src', imgData.src);
                        }

                        if (imgData.nexusId) {
                            img.setAttribute('data-nexus-id', imgData.nexusId);
                        } else {
                            img.setAttribute('data-nexus-id', 'img_slide_' + Date.now() + '_' + index);
                        }

                        slide.appendChild(img);
                        wrapper.appendChild(slide);
                    });

                    injectNexusIds();
                    console.log(`✅ Carousel (Swiper) structure updated with ${images.length} slides`);

                    // 3. Initialize Swiper
                    // Cleanup old instance first
                    if (selectedElement._swiper) {
                        try {
                            selectedElement._swiper.destroy(true, true);
                        } catch (e) { console.warn('Swiper destroy error', e); }
                        selectedElement._swiper = null;
                    }

                    // Use common initialization
                    setTimeout(() => {
                        if (window.Swiper) {
                            initializeSwiperInstances();
                        } else {
                            // Fallback if script loading delayed
                            initSwiperWidgets();
                        }
                    }, 500);
                }
            }
        }

        // NEW: Get list of all editable elements for Layer List
        if (type === 'NEXUS_GET_ELEMENT_LIST') {
            const EDITABLE_TAGS = ['IMG', 'H1', 'H2', 'H3', 'H4', 'P', 'SPAN', 'A', 'BUTTON', 'DIV', 'SECTION', 'HEADER', 'FOOTER', 'NAV', 'UL', 'LI'];
            const elements = [];

            document.querySelectorAll('[data-nexus-id]').forEach(el => {
                const nexusId = el.getAttribute('data-nexus-id');
                const tagName = el.tagName;

                // Get readable label
                let label = '';
                if (tagName === 'IMG') {
                    label = el.alt || 'Imagen';
                } else if (tagName === 'A') {
                    label = el.innerText?.trim().substring(0, 30) || 'Enlace';
                } else if (['H1', 'H2', 'H3', 'H4', 'P', 'SPAN', 'BUTTON', 'LI'].includes(tagName)) {
                    label = el.innerText?.trim().substring(0, 30) || tagName;
                } else {
                    label = el.className?.split(' ')[0] || tagName.toLowerCase();
                }

                // Get section (parent section id)
                const section = el.closest('section, header, footer, nav');
                const sectionId = section?.id || section?.className?.split(' ')[0] || 'other';

                // Get parent nexus-id for hierarchy
                const parentWithId = el.parentElement?.closest('[data-nexus-id]');
                const parentNexusId = parentWithId?.getAttribute('data-nexus-id') || null;

                // Determine element type for icon
                let type = 'other';
                if (tagName === 'IMG') type = 'image';
                else if (['H1', 'H2', 'H3', 'H4'].includes(tagName)) type = 'heading';
                else if (['P', 'SPAN'].includes(tagName)) type = 'text';
                else if (tagName === 'A' || tagName === 'BUTTON') type = 'button';
                else if (['DIV', 'SECTION', 'HEADER', 'FOOTER', 'NAV'].includes(tagName)) type = 'container';
                else if (tagName === 'UL' || tagName === 'LI') type = 'list';

                elements.push({
                    nexusId,
                    tagName: tagName.toLowerCase(),
                    label,
                    section: sectionId,
                    parentNexusId,
                    type,
                    isContainer: ['DIV', 'SECTION', 'HEADER', 'FOOTER', 'NAV', 'UL'].includes(tagName)
                });
            });

            window.parent.postMessage({
                type: 'NEXUS_ELEMENT_LIST',
                payload: elements
            }, '*');
        }

        // NEW: Get semantic zones for Smart Zone Panel
        if (type === 'NEXUS_GET_ZONES') {
            const zones = [];

            document.querySelectorAll('[data-nexus-zone]').forEach(zoneEl => {
                const zoneId = zoneEl.getAttribute('data-nexus-zone');
                const nexusId = zoneEl.getAttribute('data-nexus-id');

                // Find groups within this zone
                const groups = [];
                zoneEl.querySelectorAll('[data-nexus-group]').forEach(groupEl => {
                    groups.push({
                        id: groupEl.getAttribute('data-nexus-group'),
                        nexusId: groupEl.getAttribute('data-nexus-id'),
                        tagName: groupEl.tagName.toLowerCase(),
                        childCount: groupEl.children.length
                    });
                });

                zones.push({
                    id: zoneId,
                    nexusId: nexusId,
                    tagName: zoneEl.tagName.toLowerCase(),
                    groups: groups,
                    rect: zoneEl.getBoundingClientRect()
                });
            });

            console.log(`👻 Detected ${zones.length} semantic zones`);

            window.parent.postMessage({
                type: 'NEXUS_ZONES_LIST',
                payload: zones
            }, '*');
        }

        // NEW: Select a zone by ID
        if (type === 'NEXUS_SELECT_ZONE') {
            if (payload.zoneId) {
                const zoneEl = document.querySelector(`[data-nexus-zone="${payload.zoneId}"]`);
                if (zoneEl) {
                    zoneEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    selectElement(zoneEl);
                }
            }
        }

        // NEW: Select a group within a zone
        // NEW: Select a group within a zone
        if (type === 'NEXUS_SELECT_GROUP') {
            if (payload.groupId) {
                const groupEl = document.querySelector(`[data-nexus-group="${payload.groupId}"]`);
                if (groupEl) {
                    groupEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    selectElement(groupEl);
                }
            }
        }

        // NEW: Select element by CSS selector (for Smart Zone Panel)
        if (type === 'NEXUS_SELECT_BY_SELECTOR') {
            if (payload.selector) {
                const el = document.querySelector(payload.selector);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    selectElement(el);
                    console.log(`👻 Selected by selector: ${payload.selector}`);
                } else {
                    console.warn(`⚠️ Element not found: ${payload.selector}`);
                }
            }
        }

        // NEW: Update style by CSS selector (for Smart Zone Panel inline editing)
        if (type === 'NEXUS_UPDATE_STYLE_BY_SELECTOR') {
            if (payload.selector && payload.property && payload.value !== undefined) {
                const elements = document.querySelectorAll(payload.selector);
                elements.forEach(el => {
                    const kebabProperty = payload.property.replace(/([A-Z])/g, '-$1').toLowerCase();
                    el.style.setProperty(kebabProperty, payload.value, 'important');
                });
                if (elements.length > 0) {
                    console.log(`👻 Updated ${payload.property} on ${elements.length} elements matching ${payload.selector}`);
                }
            }
        }

        // NEW: Get computed styles for an element
        if (type === 'NEXUS_GET_ELEMENT_STYLES') {
            const { selector, elementKey, properties } = payload || {};
            if (selector && properties) {
                const el = document.querySelector(selector);
                if (el) {
                    const computed = window.getComputedStyle(el);
                    const styles = {};
                    properties.forEach(prop => {
                        const kebabProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
                        styles[prop] = computed.getPropertyValue(kebabProp);
                    });
                    // Send back to parent
                    window.parent.postMessage({
                        type: 'NEXUS_ELEMENT_STYLES_RESPONSE',
                        elementKey,
                        styles
                    }, '*');
                    console.log(`👻 Sent styles for ${elementKey}:`, styles);
                }
            }
        }
        // NEW: Batch get styles for Smart Zone Panel
        if (type === 'NEXUS_BATCH_GET_STYLES') {
            const { requestList } = payload || {};
            if (requestList && Array.isArray(requestList)) {
                const results = {};
                console.log(`👻 Batch Requesting Styles for ${requestList.length} items`);

                requestList.forEach(req => {
                    // Try to find within specific container if provided, otherwise global
                    let container = document;
                    if (req.containerSelector) {
                        container = document.querySelector(req.containerSelector) || document;
                    }

                    const el = container.querySelector(req.selector);

                    if (el) {
                        const computed = window.getComputedStyle(el);
                        const styles = {};

                        // Default properties if not provided
                        const properties = req.properties || ['color', 'fontSize', 'fontWeight', 'lineHeight', 'textAlign', 'backgroundColor', 'padding', 'margin', 'borderRadius', 'border', 'boxShadow', 'width', 'height', 'objectFit', 'filter', 'opacity', 'display', 'gap', 'alignItems', 'justifyContent'];

                        properties.forEach(prop => {
                            const kebabProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
                            styles[prop] = computed.getPropertyValue(kebabProp);
                        });

                        // Metadata
                        styles.nexusId = el.getAttribute('data-nexus-id');
                        styles.src = el.src || '';

                        // Special handling for widget data
                        if (el.getAttribute('data-nexus-widget') === 'carousel') {
                            styles.widgetMeta = {
                                images: Array.from(el.querySelectorAll('img')).map(img => ({
                                    src: img.getAttribute('src'),
                                    nexusId: img.getAttribute('data-nexus-id')
                                }))
                            };
                            // Also capture dimensions
                            styles.width = el.style.width || computed.width;
                            styles.height = el.style.height || computed.height;
                        }

                        results[req.id] = styles;
                    }
                });

                window.parent.postMessage({
                    type: 'NEXUS_BATCH_STYLES_RESPONSE',
                    payload: results
                }, '*');
            }
        }
    });

    function initSwiperWidgets() {
        const swipers = document.querySelectorAll('.swiper');
        if (swipers.length > 0) {
            console.log(`🎠 Found ${swipers.length} Swiper instance(s) - initializing...`);

            // 1. Inject Swiper Dependencies if missing
            if (!document.querySelector('#swiper-css')) {
                const link = document.createElement('link');
                link.id = 'swiper-css';
                link.rel = 'stylesheet';
                link.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
                document.head.appendChild(link);
            }

            // 1b. Inject Custom Overrides for Visibility
            if (!document.querySelector('#swiper-overrides')) {
                const style = document.createElement('style');
                style.id = 'swiper-overrides';
                style.innerHTML = `
                    .swiper-pagination {
                        z-index: 50 !important;
                        bottom: 10px !important;
                        pointer-events: auto !important;
                    }
                    .swiper-pagination-bullet {
                        background: white !important;
                        opacity: 0.5;
                        width: 10px;
                        height: 10px;
                        margin: 0 4px !important;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    }
                    .swiper-pagination-bullet-active {
                        opacity: 1;
                        background: #6366f1 !important; /* Indigo 500 */
                        transform: scale(1.2);
                    }
                    .swiper-button-next, .swiper-button-prev {
                        color: white !important;
                        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                        z-index: 50 !important;
                    }
                `;
                document.head.appendChild(style);
            }

            if (!window.Swiper) {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
                script.onload = () => {
                    console.log('✅ Swiper CDN loaded dynamically (init)');
                    initializeSwiperInstances();
                };
                document.head.appendChild(script);
            } else {
                initializeSwiperInstances();
            }
        }
    }

    function initializeSwiperInstances() {
        if (!window.Swiper) return;

        document.querySelectorAll('.swiper').forEach(container => {
            // Check if already initialized to prevent double init
            if (container.swiper) return;

            // REPAIR: Ensure controls exist (DOM Structure Repair)
            if (!container.querySelector('.swiper-pagination')) {
                const pag = document.createElement('div');
                pag.className = 'swiper-pagination';
                container.appendChild(pag);
            }
            if (!container.querySelector('.swiper-button-next')) {
                const next = document.createElement('div');
                next.className = 'swiper-button-next';
                container.appendChild(next);
            }
            if (!container.querySelector('.swiper-button-prev')) {
                const prev = document.createElement('div');
                prev.className = 'swiper-button-prev';
                container.appendChild(prev);
            }

            // Lock container editing to prevent deletion of structural divs
            container.contentEditable = "false";

            // Force visibility (fix for hidden dots/container)
            container.style.display = 'block';
            container.style.visibility = 'visible';

            new Swiper(container, {
                loop: true,
                pagination: { el: ".swiper-pagination", clickable: true },
                navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
                autoplay: { delay: 3000, disableOnInteraction: false },
            });
        });
        console.log('🚀 Swiper instances initialized');
    }

    // Call on load
    initSwiperWidgets();

    // Re-check periodically (for dynamic changes)
    setInterval(() => {
        if (document.querySelector('.swiper') && !document.querySelector('.swiper-initialized')) {
            initSwiperWidgets();
        }
    }, 2000);

    function getStyle(prop) {
        return window.getComputedStyle(selectedElement).getPropertyValue(prop);
    }
})();
