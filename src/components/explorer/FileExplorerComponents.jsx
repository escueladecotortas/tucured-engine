// Archivo: src/components/explorer/FileExplorerComponents.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Folder, File, ImageIcon, FileText, HardDrive, LayoutGrid, List, Upload, X, Trash2, Edit3 } from 'lucide-react';

export const ExplorerSidebar = () => (
  <div className="w-64 bg-white/5 border-r border-white/10 p-4 flex flex-col gap-2 hidden md:flex font-mono">
    <div className="px-4 py-3 mb-4">
      <h2 className="text-lg font-bold text-white tracking-wider flex items-center gap-2">
        <HardDrive className="w-5 h-5 text-indigo-400" />
        ARCHIVIST
      </h2>
      <p className="text-[10px] text-gray-500 font-mono mt-1">DISCO LOCAL / MOTOR</p>
    </div>
    <div className="flex items-center gap-3 px-4 py-3 bg-indigo-600/10 border border-indigo-500/20 text-indigo-300 rounded-xl">
      <Folder className="w-4 h-4 text-indigo-400" />
      <span className="text-xs font-bold">Raíz del Satélite</span>
    </div>
  </div>
);

export const ExplorerHeader = ({ currentPath, setCurrentPath, viewMode, setViewMode, onCreateFolder, onUploadClick, fileInputRef, onFileChange }) => (
  <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-white/5 font-mono">
    <div className="flex items-center gap-2 text-gray-400 text-xs">
      <span className="hover:text-white cursor-pointer px-1.5 py-0.5 rounded hover:bg-white/5" onClick={() => setCurrentPath('')}>root</span>
      {currentPath && currentPath.split('/').map((part, i, arr) => (
        <React.Fragment key={i}>
          <span className="text-gray-600">/</span>
          <span className="text-white hover:text-indigo-400 cursor-pointer px-1.5 py-0.5 rounded hover:bg-white/5" onClick={() => setCurrentPath(arr.slice(0, i + 1).join('/'))}>
            {part}
          </span>
        </React.Fragment>
      ))}
    </div>
    <div className="flex items-center gap-3">
      <button onClick={onCreateFolder} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10" title="Nueva Carpeta">
        <Folder className="w-3.5 h-3.5 text-indigo-400" /> Nueva Carpeta
      </button>
      <div className="h-4 w-px bg-white/10 mx-1"></div>
      <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
        <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded cursor-pointer ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}>
          <LayoutGrid className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => setViewMode('list')} className={`p-1.5 rounded cursor-pointer ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}>
          <List className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="h-4 w-px bg-white/10 mx-1"></div>
      <input type="file" ref={fileInputRef} className="hidden" onChange={onFileChange} />
      <button onClick={onUploadClick} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-lg shadow-indigo-900/20">
        <Upload className="w-3.5 h-3.5" /> Subir
      </button>
    </div>
  </div>
);

export const FileIcon = ({ file }) => {
  if (file.isDir) return <Folder className="w-6 h-6 text-indigo-400 fill-current opacity-80" />;
  const type = file.type;
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico'].includes(type)) return <ImageIcon className="w-6 h-6 text-pink-400" />;
  if (['pdf', 'doc', 'docx', 'txt', 'md', 'js', 'jsx', 'json', 'css', 'html'].includes(type)) return <FileText className="w-6 h-6 text-cyan-400" />;
  return <File className="w-6 h-6 text-gray-400" />;
};

export const ContextMenuUI = ({ contextMenu, onRename, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    style={{ top: contextMenu.y, left: contextMenu.x }}
    className="fixed z-[9999] bg-[#0a0f1d] border border-white/10 rounded-xl shadow-2xl py-1 min-w-[140px] font-mono text-xs"
  >
    <button onClick={() => onRename(contextMenu.file)} className="w-full px-3.5 py-2 text-left text-gray-300 hover:bg-white/10 flex items-center gap-2 cursor-pointer">
      <Edit3 className="w-3.5 h-3.5 text-indigo-400" /> Renombrar
    </button>
    <button onClick={() => onDelete(contextMenu.file)} className="w-full px-3.5 py-2 text-left text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer">
      <Trash2 className="w-3.5 h-3.5 text-rose-400" /> Eliminar
    </button>
  </motion.div>
);

export const FilePreviewUI = ({ file, content, previewUrl, onClose }) => {
  const isImage = Boolean(previewUrl) || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico'].includes(file?.type);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-4 z-20 bg-[#0a0f1d] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden font-mono"
    >
      <div className="h-12 bg-white/5 flex items-center justify-between px-5 border-b border-white/10">
        <span className="text-xs font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400" /> {file.name}
        </span>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/40">
        {isImage ? (
          <img src={previewUrl} alt={file.name} className="max-h-full max-w-full object-contain rounded-lg shadow-xl" />
        ) : (
          <pre className="w-full h-full text-xs font-mono text-gray-300 whitespace-pre-wrap select-text">{content}</pre>
        )}
      </div>
    </motion.div>
  );
};
