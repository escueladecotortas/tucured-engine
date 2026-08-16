// Archivo: frontend/src/components/tabs/sop/MermaidRenderer.jsx
import React, { useRef, useState, useEffect } from 'react';

export function MermaidRenderer({ chart }) {
    const ref = useRef(null);
    const [svg, setSvg] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const renderChart = async () => {
            if (!chart) return;
            try {
                const mermaid = (await import('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs')).default;
                mermaid.initialize({ 
                    startOnLoad: false, 
                    theme: 'dark',
                    securityLevel: 'loose',
                    fontFamily: 'Outfit'
                });
                
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                const { svg } = await mermaid.render(id, chart);
                setSvg(svg);
                setError(null);
            } catch (err) {
                console.error('Mermaid render error:', err);
                setError('Error rendering graph');
            }
        };

        renderChart();
    }, [chart]);

    if (error) return <div className="text-red-400 text-xs p-2 border border-red-500/20 rounded bg-red-500/10">{error}</div>;
    if (!svg) return <div className="text-gray-500 text-xs animate-pulse p-4">Generando Gráfico...</div>;

    return <div className="mermaid-chart my-4 p-4 bg-black/20 rounded-lg border border-white/5 overflow-x-auto" dangerouslySetInnerHTML={{ __html: svg }} />;
}
