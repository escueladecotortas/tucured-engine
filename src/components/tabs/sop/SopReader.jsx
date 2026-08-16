// Archivo: frontend/src/components/tabs/sop/SopReader.jsx
import React from 'react';
import { Book } from 'lucide-react';
import { SopMarkdown } from './SopMarkdown';

export function SopReader({ selectedFile, reading, fileContent }) {
    if (!selectedFile) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
                <Book className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-sm font-medium">Selecciona un documento para leer</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 prose prose-invert prose-indigo max-w-none">
            <div className="mb-6 pb-4 border-b border-white/10">
                <h1 className="text-2xl font-bold text-white mb-2">{selectedFile.name}</h1>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                    <span className={`${selectedFile.categoryColor}`}>{selectedFile.categoryLabel}</span>
                    <span>•</span>
                    <span>{selectedFile.categoryPath}</span>
                </div>
            </div>
            
            {reading ? (
                <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-white/10 rounded w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded w-full"></div>
                    <div className="h-4 bg-white/10 rounded w-5/6"></div>
                </div>
            ) : (
                <SopMarkdown content={fileContent} />
            )}
        </div>
    );
}
