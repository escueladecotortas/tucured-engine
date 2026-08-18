// Archivo: src/components/tabs/identity/IdentityAssetSection.jsx
// Visores DESIGN.md y stitch-manifest.json conectados a ruta real del cliente (Ley de 200 líneas)

import React, { useState } from 'react';
import { FolderOpen, FileText, Layers, X, Loader2, AlertCircle } from 'lucide-react';
import FileManager from '../../FileManager';

// Mini modal de documento
function DocModal({ title, icon: Icon, color, content, loading, onClose }) {
  const colors = {
    violet: 'text-violet-400 border-violet-500/30 bg-violet-500/5',
    cyan:   'text-cyan-400   border-cyan-500/30   bg-cyan-500/5'
  };
  const cls = colors[color] || colors.violet;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-3 border-b border-zinc-800 ${cls}`}>
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            <span className="font-bold text-sm font-mono">{title}</span>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 transition-colors"><X className="w-4 h-4" /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-40 gap-2 text-zinc-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs">Cargando documento...</span>
            </div>
          ) : content ? (
            <DesignRenderer content={content} isDesign={color === 'violet'} />
          ) : (
            <div className="flex flex-col items-center justify-center h-40 gap-2 text-zinc-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-xs">Documento no disponible para este cliente</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Renderizador inteligente: extrae colores y tipografías de DESIGN.md o muestra JSON
function DesignRenderer({ content, isDesign }) {
  if (!isDesign) {
    // JSON: stitch-manifest.json
    try {
      const parsed = JSON.parse(content);
      return (
        <pre className="p-5 text-[11px] text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap break-words">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      );
    } catch {
      return <pre className="p-5 text-[11px] text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap">{content}</pre>;
    }
  }

  // DESIGN.md: extraer colores hex y tipografías
  const hexMatches = [...content.matchAll(/#([0-9A-Fa-f]{6})\b/g)].map(m => '#' + m[1]);
  const uniqueColors = [...new Set(hexMatches)].slice(0, 8);
  const fontMatches = [...content.matchAll(/font(?:[-_\s]?family)?[:\s]+["']?([A-Za-z\s]+)["']?/gi)].map(m => m[1].trim());
  const uniqueFonts = [...new Set(fontMatches)].slice(0, 4);

  return (
    <div className="p-5 space-y-5">
      {/* Paleta cromática */}
      {uniqueColors.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">🎨 Paleta Cromática</p>
          <div className="flex flex-wrap gap-2">
            {uniqueColors.map(color => (
              <button key={color} onClick={() => navigator.clipboard?.writeText(color)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-700 hover:border-zinc-500 bg-zinc-900 transition-all group"
                title={`Copiar ${color}`}>
                <span className="w-5 h-5 rounded-md shadow border border-white/10 flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-[10px] font-mono text-zinc-300 group-hover:text-white">{color}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tipografías */}
      {uniqueFonts.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">🔤 Tipografías</p>
          <div className="flex flex-wrap gap-2">
            {uniqueFonts.map(font => (
              <span key={font} className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 font-medium" style={{ fontFamily: font }}>
                {font}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contenido raw */}
      <details className="cursor-pointer">
        <summary className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors">Ver documento completo</summary>
        <pre className="mt-2 text-[10px] text-zinc-400 font-mono leading-relaxed whitespace-pre-wrap break-words max-h-80 overflow-y-auto">{content}</pre>
      </details>
    </div>
  );
}

// Hook de carga bajo demanda con caché
function useDocViewer(projectId) {
  const [cache, setCache] = useState({});
  const [loading, setLoading] = useState({});

  // Resuelve el slug real del cliente desde nexus_archives/tucu-red/clients/<slug>/
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
  const [openModal, setOpenModal] = useState(null); // 'design' | 'manifest' | null
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

      {/* Modales */}
      {openModal === 'design' && (
        <DocModal
          title={`DESIGN.md — ${projectId}`}
          icon={FileText} color="violet"
          content={cache.design} loading={loading.design}
          onClose={() => setOpenModal(null)}
        />
      )}
      {openModal === 'manifest' && (
        <DocModal
          title={`stitch-manifest.json — ${projectId}`}
          icon={Layers} color="cyan"
          content={cache.manifest} loading={loading.manifest}
          onClose={() => setOpenModal(null)}
        />
      )}
    </div>
  );
}
