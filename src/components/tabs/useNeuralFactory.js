// Archivo: frontend/src/components/tabs/useNeuralFactory.js
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useToast } from '../Toast';
import { useNeuralActions } from './neural-factory/useNeuralActions';

/**
 * useNeuralFactory - Hook principal para la gestión de leads y generación de sitios.
 * Refactorizado para cumplir con la Ley de 200 líneas.
 */
export function useNeuralFactory() {
    const [activeTab, setActiveTab] = useState('search');
    const [prospects, setProspects] = useState([]);
    const [searchMethod, setSearchMethod] = useState('scrape');
    const [formData, setFormData] = useState({
        name: '', instagram: '', category: '', subcategory: '',
        address: '', city: 'San Miguel de Tucumán', whatsapp: '', 
        mapsUrl: '', goal: 'auto', audience: 'auto', fastTrack: false
    });
    const [isValidatingAddress, setIsValidatingAddress] = useState(false);
    const [showGenerationModal, setShowGenerationModal] = useState(false);
    const [currentGeneration, setCurrentGeneration] = useState(null);
    const [generationLogs, setGenerationLogs] = useState([]);
    const [activeAgents, setActiveAgents] = useState([]);
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractionStatus, setExtractionStatus] = useState('');
    const [useAI, setUseAI] = useState(false);
    const [outreachModalOpen, setOutreachModalOpen] = useState(false);
    const [targetProspect, setTargetProspect] = useState(null);

    const { addToast } = useToast();

    // Hook de acciones extraído para reducir tamaño
    const { handleManualAdd, executeGeneration } = useNeuralActions({
        setProspects, addToast, setIsExtracting, setExtractionStatus, 
        setGenerationLogs, setActiveAgents, useAI, currentGeneration
    });

    useEffect(() => {
        const socketUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin;
        const socket = io(socketUrl);
        socket.on('terminal:output', (data) => {
            if (data?.line && (data.line.includes('[Stitch') || data.line.includes('Agente') || data.line.match(/(✅|🛡️|📥|❌|⏳|⬇️|🧬)/))) {
                setGenerationLogs(prev => [...prev, { message: data.line, timestamp: new Date(data.timestamp || Date.now()) }]);
            }
        });
        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        fetch('/api/prospects')
            .then(res => res.json())
            .then(data => data.prospects && setProspects(data.prospects))
            .catch(err => console.error("Failed to load prospects", err));
    }, []);

    const handleBatchImport = (newProspects) => {
        const enriched = newProspects.map(p => ({
            ...p, id: p.id || `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, status: 'new'
        }));
        setProspects(prev => [...enriched, ...prev]);
        addToast(`Importados ${enriched.length} prospectos`, 'success');
        setActiveTab('radar');
        fetch('/api/prospects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prospects: enriched })
        }).catch(err => console.error("Failed to save batch", err));
    };

    const handleValidateAddress = async () => {
        if (!formData.address) return;
        setIsValidatingAddress(true);
        try {
            const res = await fetch('/api/validate-address', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: formData.address, city: formData.city })
            });
            const data = await res.json();
            if (data.success) {
                setFormData(prev => ({
                    ...prev, address: data.formattedAddress || prev.address,
                    notes: (prev.notes || '') + `\nMaps Link: ${data.googleUrl || 'Verificado'}`
                }));
                addToast('Dirección verificada en Google Maps', 'success');
            } else addToast('Dirección no encontrada en Maps', 'warning');
        } catch (err) {
            addToast('Error al validar dirección', 'error');
        } finally { setIsValidatingAddress(false); }
    };

    const handleDelete = async (prospect) => {
        addToast('🗑️ Eliminando prospecto y archivos...', 'info');
        setProspects(prev => prev.filter(p => p.id !== prospect.id));
        try {
            const res = await fetch(`/api/prospects/${prospect.id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) addToast('✅ Prospecto eliminado completamente', 'success');
            else throw new Error(data.error);
        } catch (err) { addToast('❌ Error al eliminar en servidor', 'error'); }
    };

    const handleSendWhatsApp = (prospect, message) => {
        const phone = prospect.phone?.replace(/\D/g, '');
        window.open(phone ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : `https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
        setOutreachModalOpen(false);
    };

    return {
        activeTab, setActiveTab, prospects, searchMethod, setSearchMethod,
        formData, setFormData, isValidatingAddress, showGenerationModal, setShowGenerationModal,
        currentGeneration, setCurrentGeneration, generationLogs, setGenerationLogs,
        activeAgents, isExtracting, extractionStatus, useAI, setUseAI,
        outreachModalOpen, setOutreachModalOpen, targetProspect, setTargetProspect,
        handleBatchImport, handleValidateAddress, handleDelete, 
        handleManualAdd: (hasMaps) => handleManualAdd(formData, setFormData, hasMaps),
        executeGeneration, handleSendWhatsApp, 
        handleRadarSelect: (p) => { setTargetProspect(p); setOutreachModalOpen(true); },
        handleGenerateSite: (p) => { setCurrentGeneration(p); setShowGenerationModal(true); setGenerationLogs([]); }
    };
}
