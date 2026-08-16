// Archivo: frontend/src/components/tabs/identity/IdentityAssetSection.jsx
import React from 'react';
import { FolderOpen } from 'lucide-react';
import FileManager from '../../FileManager';

export function IdentityAssetSection({ projectId, t }) {
    return (
        <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-xl flex flex-col overflow-hidden shadow-2xl relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>

            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20 backdrop-blur-sm z-10">
                <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{t('identity.asset_vault')}</span>
                </div>
                <div className="text-[10px] text-gray-500 font-mono">
                    /nexus_archives/{projectId}/assets
                </div>
            </div>

            <div className="flex-1 overflow-hidden relative z-10">
                <FileManager projectId={projectId} rootPath={'assets'} />
            </div>
        </div>
    );
}
