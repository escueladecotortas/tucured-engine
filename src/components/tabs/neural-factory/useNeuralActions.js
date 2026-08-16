// Archivo: frontend/src/components/tabs/neural-factory/useNeuralActions.js
import { useState } from 'react';

export function useNeuralActions({ setProspects, addToast, setIsExtracting, setExtractionStatus, setGenerationLogs, setActiveAgents, useAI, currentGeneration }) {
    
    const handleManualAdd = async (formData, setFormData) => {
        if (!formData.name) return addToast('El nombre del negocio es obligatorio', 'warning');
        
        const hasMaps = !!formData.mapsUrl || (!formData.whatsapp && formData.address);

        const newProspect = {
            id: `manual-${Date.now()}`, name: formData.name, status: 'enriching_cyborg',
            leadScore: hasMaps ? 10 : 8, platform: 'cyborg_injection',
            phone: formData.whatsapp || '', instagram: formData.instagram || '',
            goal: formData.goal || 'auto', audience: formData.audience || 'auto', vibe: 'auto',
            usp: '', category: hasMaps ? 'auto' : (formData.category || 'auto'),
            subcategory: hasMaps ? 'auto' : (formData.subcategory || 'auto'),
            mapsUrl: formData.mapsUrl || '', address: formData.address || '',
            city: formData.city || 'San Miguel de Tucumán', upsell_maps: !hasMaps, createdAt: new Date().toISOString()
        };

        setProspects(prev => [newProspect, ...prev]);
        addToast(hasMaps ? 'Iniciando Extracción Total...' : 'Iniciando Extracción Híbrida (IG)...', 'success');

        try {
            await fetch('/api/prospects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prospects: [newProspect] })
            });
            setIsExtracting(true);
            setExtractionStatus(hasMaps ? 'Localizando entidad en Maps... 0%' : 'Analizando huella digital en IG... 0%');
            
            // Hardening: AbortController & Timeout (60s)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000);

            const enrichRes = await fetch('/api/leads/enrich', {
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                    'x-api-key': 'nexus_hardened_2026_audit' // Inyectado según auditoría
                },
                body: JSON.stringify({ leadId: newProspect.id }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            const enrichData = await enrichRes.json();
            
            if (enrichData.success) {
                setExtractionStatus('✅ Extracción Completada.');
                addToast(`✅ C.Y.B.O.R.G. ha procesado ${formData.name}`, 'success');
                setProspects(prev => prev.map(p => p.id === newProspect.id ? { ...p, ...enrichData.lead, status: 'new' } : p));
            } else {
                setExtractionStatus('❌ Falló la extracción.');
                addToast(`❌ Falla en sistema C.Y.B.O.R.G.: ${enrichData.error}`, 'error');
                setProspects(prev => prev.map(p => p.id === newProspect.id ? { ...p, status: 'error' } : p));
            }
            setTimeout(() => setIsExtracting(false), 2000);
        } catch (err) { 
            if (err.name === 'AbortError') {
                addToast('❌ Tiempo excedido (60s): La extracción tardó demasiado.', 'error');
            } else {
                addToast('❌ Error de conexión al guardar', 'error'); 
            }
            setIsExtracting(false); 
        }
        
        setFormData({
            name: '', instagram: '', category: '', subcategory: '',
            address: '', city: 'San Miguel de Tucumán', whatsapp: '', 
            mapsUrl: '', goal: 'auto', audience: 'auto', fastTrack: false
        });
    };

    const executeGeneration = async (engine) => {
        if (!currentGeneration) return;
        setGenerationLogs([{ message: `Iniciando secuencia ${engine}...`, timestamp: new Date() }]);
        const agents = engine === 'stitch-mcp' ? [
            { name: 'Orion', task: '🔱 Validación' }, { name: 'Atenea', task: '🎨 Diseño' },
            { name: 'Lorem', task: '✍️ Copy' }, { name: 'Codi', task: '⚡ Prompt' }
        ] : [
            { name: 'Codi', task: 'Código' }, { name: 'Lorem', task: 'Copy' }, { name: 'Atenea', task: '🎨 Diseño' }
        ];
        setActiveAgents(agents);
        try {
            const payload = engine === 'stitch-mcp' ? { ...currentGeneration, forceRegenerate: currentGeneration.status === 'generated' } : {
                prospectId: currentGeneration.id, name: currentGeneration.name, category: currentGeneration.category,
                phone: currentGeneration.phone || '', instagram: currentGeneration.instagram || '',
                address: currentGeneration.address || '', photos: currentGeneration.photos || [],
                forceRegenerate: currentGeneration.status === 'generated', usp: currentGeneration.usp || '',
                goal: currentGeneration.goal || 'leads', audience: currentGeneration.audience || 'local',
                vibe: currentGeneration.vibe || '2', skipEnrichment: !useAI
            };
            const res = await fetch(`/api/forge/${engine}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                setGenerationLogs(prev => [...prev, { message: `✅ ${data.deployUrl || data.message || 'Completado'}`, timestamp: new Date() }]);
                addToast(`✅ Operación completada para ${currentGeneration.name}`, 'success');
                setProspects(prev => prev.map(p => p.id === currentGeneration.id ? { ...p, status: 'generated', siteUrl: data.deployUrl || data.mcpResult?.deployUrl } : p));
            } else {
                if (data.blockers) data.blockers.forEach(b => setGenerationLogs(prev => [...prev, { message: b, timestamp: new Date() }]));
                setGenerationLogs(prev => [...prev, { message: `❌ Error: ${data.error || 'Fallo'}`, timestamp: new Date() }]);
                addToast(`Error: ${data.error}`, 'error');
            }
        } catch (err) { addToast('Error de conexión', 'error'); }
        setActiveAgents([]);
    };

    return { handleManualAdd, executeGeneration };
}
