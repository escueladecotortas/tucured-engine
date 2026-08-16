// Archivo: frontend/src/components/FileExplorer.jsx
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder } from 'lucide-react';
import { useFileExplorer } from '../hooks/useFileExplorer';
import { 
  ExplorerSidebar, ExplorerHeader, FileIcon, 
  ContextMenuUI, FilePreviewUI 
} from './explorer/FileExplorerComponents';

export default function FileExplorer({ projectId, onClose, inline = false }) {
  const {
    files, loading, viewMode, setViewMode, currentPath, setCurrentPath,
    contextMenu, setContextMenu, previewFile, setPreviewFile, previewContent,
    fileInputRef, handleUpload, handleDelete, handleCreateFolder, handleRename, openPreview
  } = useFileExplorer(projectId);

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, [setContextMenu]);

  if (!inline) return null;

  return (
    <div className="w-full h-full bg-[#080c14] flex overflow-hidden" onContextMenu={(e) => e.preventDefault()}>
      <ExplorerSidebar />

      <div className="flex-1 flex flex-col bg-gradient-to-br from-[#080c14] to-[#111]">
        <ExplorerHeader 
          currentPath={currentPath} setCurrentPath={setCurrentPath}
          viewMode={viewMode} setViewMode={setViewMode}
          onCreateFolder={handleCreateFolder}
          onUploadClick={() => fileInputRef.current?.click()}
          fileInputRef={fileInputRef}
          onFileChange={(e) => handleUpload(e.target.files[0])}
        />

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">
          {ReactDOM.createPortal(
            <AnimatePresence>
              {contextMenu && <ContextMenuUI contextMenu={contextMenu} onRename={handleRename} onDelete={handleDelete} />}
            </AnimatePresence>,
            document.body
          )}

          <AnimatePresence>
            {previewFile && <FilePreviewUI file={previewFile} content={previewContent} onClose={() => setPreviewFile(null)} />}
          </AnimatePresence>

          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-500 font-mono animate-pulse">Scanning File System...</div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 border-2 border-dashed border-white/10 rounded-xl">
              <Folder className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-mono text-sm">FOLDER EMPTY</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" : "space-y-2"}>
              {files.map((file, idx) => (
                <motion.div
                  key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  className={`group relative bg-white/5 border border-white/5 hover:border-nexus-purple/50 rounded-xl transition-all overflow-hidden cursor-pointer ${viewMode === 'grid' ? 'aspect-square flex flex-col' : 'flex items-center p-3 gap-4 h-16'}`}
                  onClick={() => file.isDir ? setCurrentPath(currentPath ? `${currentPath}/${file.name}` : file.name) : openPreview(file)}
                  onContextMenu={(e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, file }); }}
                >
                  <div className={`${viewMode === 'grid' ? 'flex-1 flex items-center justify-center bg-black/20 overflow-hidden' : ''}`}>
                    <FileIcon file={file} />
                  </div>
                  <div className={`${viewMode === 'grid' ? 'p-3 bg-black/40' : 'flex-1 min-w-0'}`}>
                    <div className="text-xs text-white font-medium truncate" title={file.name}>{file.name}</div>
                    <div className="text-[10px] text-gray-500 uppercase">{file.type}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
