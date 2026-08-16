// Archivo: frontend/src/hooks/useIdentityData.js
import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useToast } from '../components/Toast';
import { useLanguage } from '../context/LanguageContext';

const DEFAULT_KIT = {
    vibration: '1',
    colors: {
        primary: '#6366F1',
        secondary: '#10B981',
        accent: '#F59E0B',
        background: '#0F172A',
        text: '#F8FAFC'
    },
    fonts: {
        heading: 'Outfit',
        body: 'Inter'
    }
};

export function useIdentityData(projectId) {
    const { addToast } = useToast();
    const { t } = useLanguage();
    const [brandKit, setBrandKit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!projectId) return;

        const unsub = onSnapshot(doc(db, 'prospects', projectId), (docSnap) => {
            if (docSnap.exists() && docSnap.data().brandKit) {
                setBrandKit({
                    ...DEFAULT_KIT,
                    ...docSnap.data().brandKit
                });
            } else {
                setBrandKit(DEFAULT_KIT);
            }
            setLoading(false);
        });

        return () => unsub();
    }, [projectId]);

    const handleSave = async () => {
        if (!projectId) return;
        setSaving(true);
        try {
            await updateDoc(doc(db, 'prospects', projectId), { brandKit });
            addToast(t('identity.saving') || 'Guardando...', 'success');
        } catch (error) {
            console.error("Save error:", error);
            addToast('Error saving', 'error');
        } finally {
            setSaving(false);
        }
    };

    const updateBrandKit = (updates) => {
        setBrandKit(prev => ({ ...prev, ...updates }));
    };

    return {
        brandKit,
        loading,
        saving,
        handleSave,
        updateBrandKit,
        t
    };
}
