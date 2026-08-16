// Archivo: frontend/src/hooks/useBlueprint.js
import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useToast } from '../components/Toast';

export function useBlueprint(projectId) {
    const { addToast } = useToast();
    const [blueprint, setBlueprint] = useState({
        archetype: 'landing_sales',
        objective: '',
        uvp: '',
        sections: ['hero_static', 'features_grid', 'contact_form']
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!projectId) return;
        const unsub = onSnapshot(doc(db, 'prospects', projectId), (docSnap) => {
            if (docSnap.exists() && docSnap.data().blueprint) {
                setBlueprint(docSnap.data().blueprint);
            }
            setLoading(false);
        });
        return () => unsub();
    }, [projectId]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateDoc(doc(db, 'prospects', projectId), { blueprint });
            addToast('Blueprint saved successfully', 'success');
        } catch (error) {
            console.error("Save error:", error);
            addToast('Error saving blueprint', 'error');
        } finally {
            setSaving(false);
        }
    };

    const toggleSection = (sectionId) => {
        setBlueprint(prev => {
            const exists = prev.sections.includes(sectionId);
            return {
                ...prev,
                sections: exists
                    ? prev.sections.filter(s => s !== sectionId)
                    : [...prev.sections, sectionId]
            };
        });
    };

    const setArchetype = (archetypeId) => {
        setBlueprint(prev => ({ ...prev, archetype: archetypeId }));
    };

    const updateStrategy = (field, value) => {
        setBlueprint(prev => ({ ...prev, [field]: value }));
    };

    return {
        blueprint,
        loading,
        saving,
        handleSave,
        toggleSection,
        setArchetype,
        updateStrategy
    };
}
