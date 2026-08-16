import React, { useState } from 'react';
import { BRIDGE_CODE } from './BridgeSource';

const DeviceFrame = ({
    device = 'desktop',
    url,
    scale = 1,
    className = '',
    reloadKey = Date.now()
}) => {
    const [isLoading, setIsLoading] = useState(true);

    // Dimensiones base por dispositivo
    const dimensions = {
        mobile: { width: '390px', height: '844px', label: 'Mobile (iPhone 13)' },
        tablet: { width: '768px', height: '1024px', label: 'Tablet (iPad Mini)' },
        desktop: { width: '1440px', height: '900px', label: 'Desktop (Laptop)' }
    };

    const currentDim = dimensions[device] || dimensions.desktop;

    const injectBridge = async (iframe) => {
        try {
            // Intentar inyectar solo si es Same-Origin
            const doc = iframe.contentDocument || iframe.contentWindow.document;

            // Evitar inyección doble
            if (doc.getElementById('nexus-bridge-inline')) return;

            console.log("👻 Injecting INLINE Bridge (Nuclear Method)...");

            const script = doc.createElement('script');
            script.id = 'nexus-bridge-inline';
            script.textContent = BRIDGE_CODE; // Direct injection
            doc.body.appendChild(script);
            console.log('👻 Bridge Injected Successfully (Inline Const)');

        } catch (err) {
            console.warn('⚠️ Bridge Injection Failed (CORS or Network?):', err);
        }
    };

    return (
        <div className={`flex flex-col items-center group ${className}`}>
            {/* Header del dispositivo */}
            <div className="mb-2 flex items-center gap-2 text-xs font-mono text-zinc-300 transition-opacity">
                <span className="capitalize">{currentDim.label}</span>
                {device !== 'desktop' && <span>{currentDim.width} x {currentDim.height}</span>}
            </div>

            {/* Frame Container with Shadow/Border */}
            <div
                className={`relative bg-white transition-all duration-300 ease-in-out border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden
          ${device === 'mobile' ? 'rounded-[30px] border-8 border-zinc-900' : ''}
          ${device === 'tablet' ? 'rounded-[20px] border-8 border-zinc-900' : ''}
          ${device === 'desktop' ? 'rounded-md border border-zinc-200 shadow-2xl' : ''}
        `}
                style={{
                    width: currentDim.width,
                    height: currentDim.height,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center'
                }}
            >
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-50 text-zinc-400">
                        <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                )}

                <iframe
                    id="preview-frame"
                    src={`${url}${url.includes('?') ? '&' : '?'}t=${reloadKey}`}
                    className="w-full h-full bg-white"
                    onLoad={(e) => {
                        setIsLoading(false);
                        injectBridge(e.target);
                    }}
                    title={`Preview ${device}`}
                // removido sandbox para permitir same-origin access si es posible
                // sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                />
            </div>
        </div>
    );
};

export default DeviceFrame;
