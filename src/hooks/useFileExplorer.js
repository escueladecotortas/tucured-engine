// Archivo: src/hooks/useFileExplorer.js
// Hook Soberano de Exploración de Archivos (Sin window.prompt / Zero Freeze)

import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export const useFileExplorer = (projectId = 'root') => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPath, setCurrentPath] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewContent, setPreviewContent] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [renameModalFile, setRenameModalFile] = useState(null);
  const fileInputRef = useRef(null);

  const fetchFiles = async (path = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/files?project=${projectId}&dir=${encodeURIComponent(path)}`);
      if (!res.ok) throw new Error("Fallo al listar archivos");
      const data = await res.json();
      const uiFiles = data.map(f => ({
        name: f.name,
        fullPath: f.path,
        type: f.type === 'folder' ? 'folder' : f.name.split('.').pop().toLowerCase(),
        isDir: f.type === 'folder',
        url: null
      }));
      setFiles(uiFiles);
    } catch (error) {
      console.error('[useFileExplorer]', error);
      toast.error("No se pudo cargar el directorio.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(currentPath);
  }, [currentPath, projectId]);

  const handleUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project', projectId);
    formData.append('dir', currentPath);
    const toastId = toast.loading("Subiendo archivo...");
    try {
      const res = await fetch('/api/files/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error("Fallo en subida");
      toast.success("Archivo subido con éxito", { id: toastId });
      fetchFiles(currentPath);
    } catch (err) {
      toast.error("Error al subir archivo", { id: toastId });
    }
  };

  const handleDelete = async (file) => {
    const toastId = toast.loading("Eliminando...");
    try {
      const relPath = currentPath ? `${currentPath}/${file.name}` : file.name;
      const res = await fetch('/api/files', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: projectId, path: relPath })
      });
      if (!res.ok) throw new Error("Fallo al eliminar");
      toast.success("Eliminado correctamente", { id: toastId });
      fetchFiles(currentPath);
    } catch (error) {
      toast.error("Error al eliminar", { id: toastId });
    }
  };

  const handleCreateFolder = async (folderName) => {
    if (!folderName) return;
    const toastId = toast.loading("Creando carpeta...");
    try {
      const relPath = currentPath ? `${currentPath}/${folderName}` : folderName;
      const res = await fetch('/api/files/mkdir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: projectId, path: relPath })
      });
      if (!res.ok) throw new Error("Fallo al crear carpeta");
      toast.success("Carpeta creada", { id: toastId });
      fetchFiles(currentPath);
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  const handleRename = async (newName) => {
    if (!renameModalFile || !newName || newName === renameModalFile.name) return;
    const toastId = toast.loading("Renombrando...");
    try {
      const oldPath = currentPath ? `${currentPath}/${renameModalFile.name}` : renameModalFile.name;
      const res = await fetch('/api/files/rename', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: projectId, oldPath, newName })
      });
      if (!res.ok) throw new Error("Fallo al renombrar");
      toast.success("Renombrado con éxito", { id: toastId });
      setRenameModalFile(null);
      fetchFiles(currentPath);
    } catch (error) {
      toast.error("Error al renombrar", { id: toastId });
    }
  };

  const openPreview = async (file) => {
    setPreviewFile(file);
    const relPath = currentPath ? `${currentPath}/${file.name}` : file.name;
    const isImage = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif', 'ico'].includes(file.type);
    
    if (isImage) {
      setPreviewContent('');
      setPreviewUrl(`/api/files/raw?project=${projectId}&path=${encodeURIComponent(relPath)}`);
      return;
    }

    setPreviewUrl('');
    setPreviewContent('Cargando contenido...');
    try {
      const res = await fetch(`/api/files/read?project=${projectId}&path=${encodeURIComponent(relPath)}`);
      if (res.ok) {
        const data = await res.json();
        setPreviewContent(data.content || '');
      } else {
        setPreviewContent("Error al leer el archivo.");
      }
    } catch (e) {
      setPreviewContent("Fallo de conexión al leer.");
    }
  };

  return {
    files, loading, viewMode, setViewMode,
    currentPath, setCurrentPath,
    contextMenu, setContextMenu,
    previewFile, setPreviewFile, previewContent, previewUrl,
    fileInputRef,
    isFolderModalOpen, setIsFolderModalOpen,
    renameModalFile, setRenameModalFile,
    handleUpload, handleDelete, handleCreateFolder, handleRename, openPreview
  };
};
