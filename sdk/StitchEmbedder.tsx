/**
 * STITCH SDK: SOVEREIGN EMBEDDER v3.8 (Debug Mode)
 * 🛡️ Certificación de Estabilidad Nuclear
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { StitchFactory } from '../components/StitchFactory';

// @ts-ignore
import styles from '../app/globals.css?inline';

class StitchEmbed extends HTMLElement {
    private _root: any = null;
    private _mountPoint: HTMLElement | null = null;

    constructor() {
        super();
        // Shadow DOM DESACTIVADO para evitar bloqueos de motores externos
    }

    connectedCallback() {
        this.init();
        this.render();
    }

    private init() {
        if (!this._mountPoint) {
            if (!document.getElementById('stitch-global-styles')) {
                const styleSheet = document.createElement('style');
                styleSheet.id = 'stitch-global-styles';
                styleSheet.textContent = `
                    ${styles}
                    stitch-widget { 
                        display: block; 
                        width: 100%; 
                        min-height: 700px;
                        background: #050505;
                    }
                `;
                document.head.appendChild(styleSheet);
            }
            
            this._mountPoint = document.createElement('div');
            this._mountPoint.id = 'stitch-mount';
            this.appendChild(this._mountPoint);
            this._root = createRoot(this._mountPoint);
        }
    }

    static get observedAttributes() {
        return ['widget', 'data', 'vibe'];
    }

    attributeChangedCallback() {
        this.render();
    }

    disconnectedCallback() {
        if (this._root) {
            this._root.unmount();
            this._root = null;
        }
    }

    private render() {
        if (!this._root) this.init();
        
        const widget = this.getAttribute('widget');
        const vibe = this.getAttribute('vibe') || '1';
        let data = {};

        try {
            data = JSON.parse(this.getAttribute('data') || '{}');
        } catch (e) {
            console.error('[StitchSDK] Error parsing widget data', e);
        }

        if (!widget || !this._root) return;

        // RENDER DIRECTO SIN STRICT MODE
        this._root.render(
            <div className="stitch-sovereign-wrapper" key={widget}>
                <StitchFactory component={widget} data={data} vibe={vibe} />
            </div>
        );
    }
}

// Registro del Custom Element
if (!customElements.get('stitch-widget')) {
    customElements.define('stitch-widget', StitchEmbed);
}
