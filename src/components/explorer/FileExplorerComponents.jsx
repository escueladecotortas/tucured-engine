// Archivo: frontend/src/components/explorer/FileExplorerComponents.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Folder, File, ImageIcon, FileText, HardDrive, LayoutGrid, List, Upload, X, Trash2 } from 'lucide-react';

export const ExplorerSidebar = () => (
  <div className="w-64 bg-white/5 border-r border-white/10 p-4 flex flex-col gap-2 hidden md:flex">
    <div className="px-4 py-3 mb-4">
      <h2 className="text-xl font-bold text-white tracking-widest flex items-center gap-2">
        <HardDrive className="w-5 h-5 text-nexus-purple" />
        ARCHIVIST
      </h2>
      <p className="text-[10px] text-gray-500 font-mono mt-1">LOCAL SHARED DRIVE</p>
    </div>
    <button className="flex items-center gap-3 px-4 py-3 bg-nexus-purple/10 border border-nexus-purple/20 text-nexus-purple rounded-lg hover:bg-nexus-purple/20 transition-all">
      <Folder className="w-4 h-4" />
      <span className="text-sm font-bold">Project Root</span>
    </button>
  </div>
);

export const ExplorerHeader = ({ currentPath, setCurrentPath, viewMode, setViewMode, onCreateFolder, onUploadClick, fileInputRef, onFileChange }) => (
  <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-white/5">
    <div className="flex items-center gap-4 text-gray-400 text-sm font-mono">
      <span className="hover:text-white cursor-pointer" onClick={() => setCurrentPath('')}>root</span>
      {currentPath && currentPath.split('/').map((part, i, arr) => (
        <React.Fragment key={i}>
          <span>/</span>
          <span className="text-white hover:text-nexus-purple cursor-pointer" onClick={() => setCurrentPath(arr.slice(0, i + 1).join('/'))}>
            {part}
          </span>
        </React.Fragment>
      ))}
    </div>
    <div className="flex items-center gap-3">
      <button onClick={onCreateFolder} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="New Folder">
        <Folder className="w-5 h-5" />
      </button>
      <div className="h-4 w-px bg-white/10 mx-2"></div>
      <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
        <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}>
          <LayoutGrid className="w-4 h-4" />
        </button>
        <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}>
          <List className="w-4 h-4" />
        </button>
      </div>
      <div className="h-4 w-px bg-white/10 mx-2"></div>
      <input type="file" ref={fileInputRef} className="hidden" onChange={onFileChange} />
      <button onClick={onUploadClick} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all">
        <Upload className="w-3 h-3" /> Upload
      </button>
    </div>
  </div>
);

export const FileIcon = ({ file }) => {
  if (file.isDir) return <Folder className="w-6 h-6 text-nexus-purple fill-current" />;
  const type = file.type;
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(type)) return <ImageIcon className="w-6 h-6 text-emerald-400" />;
  if (['pdf', 'doc', 'docx', 'txt', 'md', 'js', 'json', 'css', 'html'].includes(type)) return <FileText className="w-6 h-6 text-cyan-400" />;
  return <File className="w-6 h-6 text-gray-400" />;
};

export const ContextMenuUI = ({ contextMenu, onRename, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    style={{ top: contextMenu.y, left: contextMenu.x }}
    className="fixed z-[9999] bg-[#1e1e2e] border border-white/10 rounded-lg shadow-xl py-1 min-w-[150px]"
  >
    <button onClick={() => onRename(contextMenu.file)} className="w-full px-4 py-2 text-left text-xs text-gray-300 hover:bg-white/5 flex items-center gap-2">
      <FileText className="w-3 h-3" /> Rename
    </button>
    <button onClick={() => onDelete(contextMenu.file)} className="w-full px-4 py-2 text-left text-xs text-red-400 hover:bg-white/5 flex items-center gap-2">
      <Trash2 className="w-3 h-3" /> Delete
    </button>
  </motion.div>
);

export const FilePreviewUI = ({ file, content, onClose }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="absolute inset-4 z-20 bg-[#1e1e2e] border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden"
  >
    <div className="h-10 bg-white/5 flex items-center justify-between px-4 border-b border-white/10">
      <span className="text-sm font-mono text-gray-300">{file.name}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
    </div>
    <div className="flex-1 overflow-auto p-4">
      <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap">{content}</pre>
    </div>
  </motion.div>
);
