// Archivo: src/components/tabs/identity/IdentityAssetSection.jsx
// Visores DESIGN.md y stitch-manifest.json conectados a ruta real del cliente (Ley de 200 líneas)

import React, { useState } from 'react';
import { FolderOpen, FileText, Layers } from 'lucide-react';
import FileManager from '../../FileManager';
import { IdentityDocModal } from './IdentityDocModal';

function useDocViewer(projectId) {
  const [cache, setCache] = useState({});
  const [loading, setLoading] = useState({});

  const slug = projectId || '';

  const load = async (type) => {
    if (cache[type]) return;
    setLoading(prev => ({ ...prev, [type]: true }));
    try {
      const url = type === 'design'
        ? `/api/nexus/assets/design-md?slug=${slug}`
        : `/api/nexus/assets/stitch-manifest?slug=${slug}`;
      const res = await fetch(url);
      const text = type === 'design' ? await res.text() : JSON.stringify(await res.json(), null, 2);
      setCache(prev => ({ ...prev, [type]: res.ok ? text : null }));
    } catch {
      setCache(prev => ({ ...prev, [type]: null }));
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  return { cache, loading, load };
}

export function IdentityAssetSection({ projectId, t }) {
  const [openModal, setOpenModal] = useState(null);
  const { cache, loading, load } = useDocViewer(projectId);

  const handleOpen = (type) => {
    setOpenModal(type);
    load(type);
  };

  return (
    <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-xl flex flex-col overflow-hidden shadow-2xl relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />

      {/* Header con visores */}
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">{t('identity.asset_vault')}</span>
        </div>

        {/* Botones visores */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpen('design')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 text-violet-400 text-[10px] font-bold transition-all"
            title="Ver DESIGN.md — paleta cromática, tipografía y tokens"
          >
            <FileText className="w-3 h-3" /> DESIGN.md
          </button>
          <button
            onClick={() => handleOpen('manifest')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold transition-all"
            title="Ver stitch-manifest.json — widgets y prompt de Stitch"
          >
            <Layers className="w-3 h-3" /> MANIFEST
          </button>
          <div className="text-[10px] text-gray-500 font-mono ml-1">
            /clients/{projectId}/
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative z-10">
        <FileManager projectId={projectId} rootPath={'assets'} />
      </div>

      {/* Modales Atómicos */}
      {openModal === 'design' && (
        <IdentityDocModal
          title={`DESIGN.md — ${projectId}`}
          icon={FileText} color="violet"
          content={cache.design} loading={loading.design}
          onClose={() => setOpenModal(null)}
        />
      )}
      {openModal === 'manifest' && (
        <IdentityDocModal
          title={`stitch-manifest.json — ${projectId}`}
          icon={Layers} color="cyan"
          content={cache.manifest} loading={loading.manifest}
          onClose={() => setOpenModal(null)}
        />
      )}
    </div>
  );
}
