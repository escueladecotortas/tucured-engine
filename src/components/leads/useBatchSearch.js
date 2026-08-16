// Archivo: frontend/src/components/leads/useBatchSearch.js
import { useState } from 'react';
import { calculateLeadScore } from './BatchSearchData';

/**
 * Custom hook for Batch Search logic.
 * Harmonized to match BatchSearch.jsx expectations.
 */
export function useBatchSearch(onImport) {
    const [form, setForm] = useState({
        query: '',
        customQuery: '',
        location: 'San Miguel de Tucumán',
        amount: 10,
        filterNoWeb: false
    });
    
    const [isScraping, setIsScraping] = useState(false);
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState([]);
    const [results, setResults] = useState([]);
    const [step, setStep] = useState('input');
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const effectiveQuery = form.query === '__custom__' ? form.customQuery : form.query;

    const startScraping = async () => {
        console.log('🚀 [C.Y.B.O.R.G.] Iniciando extracción...', { query: effectiveQuery, location: form.location });
        if (!effectiveQuery) {
            console.warn('⚠️ [C.Y.B.O.R.G.] Query vacía, abortando.');
            return;
        }
        setStep('scraping');
        setIsScraping(true);
        setLogs([]);
        setResults([]);
        setProgress(0);
        setError(null);

        const progressInterval = setInterval(() => {
            setProgress(prev => (prev >= 90 ? 90 : prev + Math.random() * 5));
        }, 800);

        const logStages = ['Iniciando navegador...', `Buscando "${effectiveQuery}"...`, 'Cargando Maps...', 'Escaneando...', 'Extrayendo datos...', 'Identificando sin web...'];
        let logIndex = 0;
        const logInterval = setInterval(() => {
            if (logIndex < logStages.length) { 
                setLogs(prev => [...prev, logStages[logIndex]]); 
                console.log(`[C.Y.B.O.R.G. Log] ${logStages[logIndex]}`);
                logIndex++; 
            }
        }, 2500);

        try {
            console.log('📡 [C.Y.B.O.R.G.] Llamando al endpoint: /api/leads/scrape');
            const res = await fetch('/api/leads/scrape', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keyword: effectiveQuery, city: form.location, limit: form.amount })
            });
            console.log('📥 [C.Y.B.O.R.G.] Respuesta recibida:', res.status);
            clearInterval(progressInterval);
            clearInterval(logInterval);
            if (!res.ok) throw new Error('Error del servidor');
            const data = await res.json();
            if (!data.success || !data.leads?.length) throw new Error('No se encontraron resultados');

            const mapped = data.leads.map((l, i) => ({
                id: `scrape-${Date.now()}-${i}`, 
                name: l.name || 'Sin nombre',
                category: l.category || effectiveQuery, 
                address: l.address || 'Sin dirección',
                city: form.location, 
                phone: l.phone || '', 
                rating: l.rating || null,
                reviews: l.reviews || 0, 
                status: 'new', 
                platform: 'google_maps',
                leadScore: calculateLeadScore ? calculateLeadScore(l) : 50, 
                mapsLink: l.mapsLink || '',
                photos: l.imageUrl ? [l.imageUrl] : [], 
                website: l.website || null,
                hasWebsite: l.hasWebsite || false
            }));

            setProgress(100);
            setLogs(prev => [...prev, `✅ Extracción completa: ${mapped.length} encontrados.`]);
            setResults(mapped);
            setIsScraping(false);
            setStep('results');
        } catch (err) {
            clearInterval(progressInterval); 
            clearInterval(logInterval);
            setError(err.message);
            setLogs(prev => [...prev, `❌ Error: ${err.message}`]);
            setIsScraping(false);
            setTimeout(() => { setStep('input'); setError(null); }, 5000);
        }
    };

    const downloadResults = () => {
        const toDownload = form.filterNoWeb ? results.filter(r => !r.hasWebsite) : results;
        const blob = new Blob([JSON.stringify(toDownload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads-${effectiveQuery.replace(/\s+/g, '-')}.json`;
        a.click();
    };

    const clearResults = () => {
        setResults([]);
        setStep('input');
        setProgress(0);
        setLogs([]);
    };

    const reScrapeLead = (id) => {
        console.log('Re-scraping lead:', id);
        // Implementación futura
    };

    return {
        form,
        isScraping,
        progress,
        logs,
        results,
        step,
        error,
        handleInputChange,
        startScraping,
        downloadResults,
        clearResults,
        reScrapeLead
    };
}

export default useBatchSearch;
