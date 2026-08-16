// Archivo: frontend/src/components/tabs/IdentityTab.jsx
'use client';
import React from 'react';
import { Layers, Save } from 'lucide-react';
import { useIdentityData } from '../../hooks/useIdentityData';
import { IdentityBrandSection } from './identity/IdentityBrandSection';
import { IdentityAssetSection } from './identity/IdentityAssetSection';
import { useToast } from '../Toast';

export default function IdentityTab({ projectId }) {
    const { addToast } = useToast();
    const { 
        brandKit, 
        loading, 
        saving, 
        handleSave, 
        updateBrandKit, 
        t 
    } = useIdentityData(projectId);

    if (loading) return <div className="p-10 flex items-center justify-center text-indigo-400 animate-pulse font-mono text-xs">SYNCING BRAND DNA...</div>;

    return (
        <div className="h-full flex flex-col p-6 overflow-hidden">
            {/* Header Compacto */}
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Layers className="w-5 h-5 text-indigo-400" />
                        {t('identity.title')}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">{t('identity.subtitle')}</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                >
                    {saving ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    {saving ? t('identity.saving') : t('identity.save_changes')}
                </button>
            </div>

            {/* Bento Grid Layout */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden min-h-0">
                <IdentityBrandSection 
                    brandKit={brandKit} 
                    onUpdate={updateBrandKit} 
                    t={t} 
                    onCopyColor={(color) => addToast(`Color ${color} copied`, 'success')}
                />

                <IdentityAssetSection 
                    projectId={projectId} 
                    t={t} 
                />
            </div>
        </div>
    );
}
