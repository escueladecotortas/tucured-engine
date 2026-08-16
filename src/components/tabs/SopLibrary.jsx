// Archivo: frontend/src/components/tabs/SopLibrary.jsx
'use client';
import React from 'react';
import { Library } from 'lucide-react';
import { useSopLibrary } from '../../hooks/useSopLibrary';
import { SopSidebar } from './sop/SopSidebar';
import { SopFileList } from './sop/SopFileList';
import { SopReader } from './sop/SopReader';

export default function SopLibrary() {
    const {
        activeCategory,
        setActiveCategory,
        searchTerm,
        setSearchTerm,
        selectedFile,
        setSelectedFile,
        fileContent,
        loading,
        reading,
        filteredFiles,
        libraries
    } = useSopLibrary();

    return (
        <div className="h-full flex flex-col bg-[#050510] relative overflow-hidden">
            {/* Header */}
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0A0A1A] relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                        <Library className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-widest uppercase">
                            BIBLIOTECA NEXUS
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-gray-500">SISTEMA DE CONOCIMIENTO UNIFICADO</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative z-10">
                <SopSidebar 
                    libraries={libraries} 
                    activeCategory={activeCategory} 
                    searchTerm={searchTerm} 
                    onSelectCategory={(id) => {
                        setActiveCategory(id);
                        setSearchTerm('');
                    }} 
                />

                <SopFileList 
                    searchTerm={searchTerm} 
                    onSearchChange={setSearchTerm} 
                    loading={loading} 
                    filteredFiles={filteredFiles} 
                    selectedFile={selectedFile} 
                    onSelectFile={setSelectedFile} 
                />

                <div className="flex-1 bg-[#0f0f15] relative flex flex-col">
                    <SopReader 
                        selectedFile={selectedFile} 
                        reading={reading} 
                        fileContent={fileContent} 
                    />
                </div>
            </div>
        </div>
    );
}
