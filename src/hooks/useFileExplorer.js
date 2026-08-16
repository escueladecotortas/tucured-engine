// Archivo: frontend/src/hooks/useFileExplorer.js
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export const useFileExplorer = (projectId) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPath, setCurrentPath] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewContent, setPreviewContent] = useState('');
  const fileInputRef = useRef(null);

  const fetchFiles = async (path = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/files?project=${projectId}&dir=${encodeURIComponent(path)}`);
      if (!res.ok) throw new Error("Failed to fetch files");
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
      console.error(error);
      toast.error("Could not load project files.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(currentPath);
    const socket = window.socket;
    if (socket) {
      const handleFileUpdate = () => fetchFiles(currentPath);
      socket.on('file:change', handleFileUpdate);
      return () => socket.off('file:change', handleFileUpdate);
    }
  }, [currentPath, projectId]);

  const handleUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project', projectId);
    formData.append('dir', currentPath);
    const toastId = toast.loading("Uploading...");
    try {
      const res = await fetch('/api/files/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error("Upload failed");
      toast.success("File uploaded!", { id: toastId });
      fetchFiles(currentPath);
    } catch (err) {
      toast.error("Upload failed.", { id: toastId });
    }
  };

  const handleDelete = async (file) => {
    if (!window.confirm(`Are you sure you want to delete ${file.name}?`)) return;
    const toastId = toast.loading("Deleting...");
    try {
      const relPath = currentPath ? `${currentPath}/${file.name}` : file.name;
      const res = await fetch('/api/files', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: projectId, path: relPath })
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Deleted!", { id: toastId });
      fetchFiles(currentPath);
    } catch (error) {
      toast.error("Failed to delete.", { id: toastId });
    }
  };

  const handleCreateFolder = async () => {
    const name = prompt("Folder Name:");
    if (!name) return;
    const toastId = toast.loading("Creating folder...");
    try {
      const relPath = currentPath ? `${currentPath}/${name}` : name;
      const res = await fetch('/api/files/mkdir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: projectId, path: relPath })
      });
      if (!res.ok) throw new Error("Mkdir failed");
      toast.success("Folder created!", { id: toastId });
      fetchFiles(currentPath);
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  const handleRename = async (file) => {
    const newName = prompt("New Name:", file.name);
    if (!newName || newName === file.name) return;
    const toastId = toast.loading("Renaming...");
    try {
      const oldPath = currentPath ? `${currentPath}/${file.name}` : file.name;
      const res = await fetch('/api/files/rename', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: projectId, oldPath, newName })
      });
      if (!res.ok) throw new Error("Rename failed");
      toast.success("Renamed!", { id: toastId });
      fetchFiles(currentPath);
    } catch (error) {
      toast.error("Failed to rename.", { id: toastId });
    }
  };

  const openPreview = async (file) => {
    setPreviewFile(file);
    setPreviewContent('Loading...');
    try {
      const relPath = currentPath ? `${currentPath}/${file.name}` : file.name;
      const res = await fetch(`/api/files/read?project=${projectId}&path=${encodeURIComponent(relPath)}`);
      if (res.ok) {
        const data = await res.json();
        setPreviewContent(data.content);
      } else {
        setPreviewContent("Error reading file.");
      }
    } catch (e) {
      setPreviewContent("Failed to load content.");
    }
  };

  return {
    files, loading, viewMode, setViewMode,
    currentPath, setCurrentPath,
    contextMenu, setContextMenu,
    previewFile, setPreviewFile, previewContent,
    fileInputRef,
    handleUpload, handleDelete, handleCreateFolder, handleRename, openPreview
  };
};
