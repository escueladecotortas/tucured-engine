// Archivo: frontend/src/components/tucured/landing/NexusBridge.jsx
import { useEffect } from 'react';

export const useNexusBridge = (siteData, setSiteData) => {
    useEffect(() => {
        const handleClick = (e) => {
            const el = e.target.closest('[data-stitch-id]');
            if (el) {
                const stitchId = el.getAttribute('data-stitch-id');
                window.parent.postMessage({
                    type: 'STITCH_CLICK',
                    stitchId: stitchId,
                    content: el.innerText
                }, '*');
            }
        };

        const handleMessage = (event) => {
            if (event.data.type === 'UPDATE_STITCH') {
                setSiteData(prev => {
                    const newData = { ...prev };
                    const keys = event.data.stitchId.split('.');
                    let current = newData;
                    for (let i = 0; i < keys.length - 1; i++) {
                        if (!current[keys[i]]) current[keys[i]] = {};
                        current = current[keys[i]];
                    }
                    current[keys[keys.length - 1]] = event.data.content;
                    return newData;
                });
            }
        };

        window.addEventListener('click', handleClick);
        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('click', handleClick);
            window.removeEventListener('message', handleMessage);
        };
    }, [siteData, setSiteData]);
};
