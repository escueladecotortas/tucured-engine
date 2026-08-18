// Archivo: src/components/FileManager.jsx
import React, { useState, useEffect } from 'react';
import { Folder, FileText, Image, Code, Download, ArrowLeft, Upload } from 'lucide-react';
import { useToast } from './Toast';

export default function FileManager({ projectId, rootPath = '' }) {
    const [files, setFiles] = useState([]);
    const [currentPath, setCurrentPath] = useState('');
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    const fetchFiles = (subfolder = '') => {
        setLoading(true);
        const queryParams = new URLSearchParams({ 
            projectId: projectId || 'tucu-red', 
            subfolder: subfolder || '' 
        });

        fetch(`/api/nexus/assets/list?${queryParams}`)
            .then(res => res.json())
            .then(data => {
                const list = Array.isArray(data) ? data : (data?.files || []);
                setFiles(list);
                setCurrentPath(subfolder);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load files", err);
                setFiles([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (projectId) fetchFiles(rootPath);
    }, [projectId, rootPath]);

    const handleNavigate = (folderName) => {
        const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
        fetchFiles(newPath);
    };

    const handleUp = () => {
        if (!currentPath) return;
        const parts = currentPath.split('/');
        parts.pop();
        fetchFiles(parts.join('/'));
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('projectPath', projectId);
        formData.append('subfolder', currentPath || 'assets');

        try {
            const res = await fetch('/api/nexus/upload_asset', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
                addToast("Archivo subido con éxito", "success");
                fetchFiles(currentPath);
            } else {
                addToast("Error de subida: " + data.error, "error");
            }
        } catch (error) {
            addToast("Fallo al subir archivo", "error");
        }
    };

    const getIcon = (file) => {
        if (file.type === 'folder') return <Folder className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300" />;
        if (file.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return <Image className="w-4 h-4 text-pink-400" />;
        if (file.name.match(/\.(js|jsx|ts|tsx|css|html|json)$/i)) return <Code className="w-4 h-4 text-blue-400" />;
        return <FileText className="w-4 h-4 text-gray-400" />;
    };

    const renderBreadcrumbs = () => {
        const parts = currentPath.split('/').filter(Boolean);
        return (
            <div className="flex items-center gap-1 text-xs font-mono text-gray-400 mb-4 overflow-hidden">
                <span className="cursor-pointer hover:text-white" onClick={() => fetchFiles('')}>ROOT</span>
                {parts.map((p, i) => (
                    <React.Fragment key={i}>
                        <span>/</span>
                        <span className="cursor-pointer hover:text-white" onClick={() => fetchFiles(parts.slice(0, i + 1).join('/'))}>{p}</span>
                    </React.Fragment>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-black/20 border border-white/5 rounded-xl p-6 h-full flex flex-col backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-3 uppercase tracking-widest">
                    <Folder className="w-4 h-4 text-cyan-400" />
                    Archivos del Sistema
                </h2>
                <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded text-xs font-bold transition-colors flex items-center gap-2">
                        <Upload className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Subir</span>
                        <input type="file" className="hidden" onChange={handleFileUpload} />
                    </label>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
                {currentPath && (
                    <button onClick={handleUp} className="p-1 hover:bg-white/10 rounded text-gray-400">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                )}
                {renderBreadcrumbs()}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/30 rounded-lg border border-white/5">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-500 gap-2">
                        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs font-mono">ESCANEANDO...</span>
                    </div>
                ) : files.length === 0 ? (
                    <div className="p-10 text-center text-gray-600 italic text-xs">Directorio Vacío</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-[#0a0a0a] z-10">
                            <tr className="text-[10px] text-gray-500 font-mono uppercase border-b border-white/10">
                                <th className="py-2 pl-3">Nombre</th>
                                <th className="py-2 w-20">Tamaño</th>
                                <th className="py-2 w-16 text-right pr-3">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs font-mono text-gray-300">
                            {files.map((file, idx) => (
                                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                                    onClick={() => file.type === 'folder' ? handleNavigate(file.name) : null}>
                                    <td className="py-2 pl-3 flex items-center gap-3">
                                        {getIcon(file)}
                                        <span className={`transition-colors truncate max-w-[200px] ${file.type === 'folder' ? 'text-indigo-200 group-hover:text-white font-bold' : 'group-hover:text-white'}`}>
                                            {file.name}
                                        </span>
                                    </td>
                                    <td className="py-2 text-gray-500 text-[10px]">
                                        {file.type === 'folder' ? '--' : (file.size / 1024).toFixed(1) + ' KB'}
                                    </td>
                                    <td className="py-2 text-right pr-3">
                                        <button onClick={(e) => { e.stopPropagation(); window.open(`/nexus_archives/${projectId}/${currentPath ? currentPath + '/' : ''}${file.name}`, '_blank'); }}
                                            className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors" title="Descargar/Abrir">
                                            <Download className="w-3 h-3" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="mt-3 flex justify-between items-center text-[10px] text-gray-500 font-mono">
                <span>{files.length} elementos</span>
                <span>{currentPath || '/'}</span>
            </div>
        </div>
    );
}
