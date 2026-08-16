// Archivo: frontend/src/components/tabs/sop/SopFileList.jsx
import React from 'react';
import { Search, FileText } from 'lucide-react';

export function SopFileList({ 
    searchTerm, 
    onSearchChange, 
    loading, 
    filteredFiles, 
    selectedFile, 
    onSelectFile 
}) {
    return (
        <div className="w-72 border-r border-white/5 bg-black/10 flex flex-col">
            <div className="p-3 border-b border-white/5">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2 w-3 h-3 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Búsqueda Global..." 
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className={`w-full bg-black/40 border rounded-md py-1.5 pl-8 pr-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors ${searchTerm ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/10'}`}
                    />
                </div>
                {searchTerm && (
                    <div className="mt-2 text-[10px] text-indigo-400 font-mono text-center">
                        Buscando en todas las estanterías...
                    </div>
                )}
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {loading ? (
                    <div className="text-center py-4 text-[10px] text-gray-500 font-mono animate-pulse">INDEXANDO...</div>
                ) : filteredFiles.length === 0 ? (
                    <div className="text-center py-4 text-[10px] text-gray-600">No se encontraron manuales.</div>
                ) : (
                    filteredFiles.map(file => (
                        <button
                            key={`${file.categoryId}-${file.name}`}
                            onClick={() => onSelectFile(file)}
                            className={`w-full text-left px-3 py-2.5 rounded-md text-xs transition-colors flex flex-col gap-1 ${
                                selectedFile?.name === file.name && selectedFile?.categoryId === file.categoryId
                                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20'
                                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
                            }`}
                        >
                            <div className="flex items-center gap-2 w-full">
                                <FileText className="w-3.5 h-3.5 opacity-70 shrink-0" />
                                <span className="truncate flex-1 font-medium">{file.name}</span>
                            </div>
                            
                            {searchTerm && (
                                <div className="flex items-center gap-1.5 pl-5">
                                    <div className={`w-1.5 h-1.5 rounded-full ${file.categoryColor.replace('text-', 'bg-')}`}></div>
                                    <span className="text-[9px] opacity-60 uppercase tracking-wider">{file.categoryLabel}</span>
                                </div>
                            )}
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
