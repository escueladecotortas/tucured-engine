'use client';

import React from 'react';
import { FileText, Download, Eye } from 'lucide-react';

/**
 * WIDGET: Sovereign PDF Reader
 * Enfoque: Visualización y descarga de documentos corporativos.
 */

export const ToolV4_PDFViewer = ({ data = {} }: { data?: any }) => {
    const fileName = data.fileName || 'Nexus Strategy 2026.pdf';
    const fileSize = data.fileSize || '4.5 MB';

    return (
        <div className="max-w-md mx-auto bg-slate-900/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 border-dashed relative group overflow-hidden">
            {/* Atmosferas Atenea */}
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-indigo-600/10 rounded-full blur-[60px]" />
            
            <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-slate-950 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-2xl group-hover:border-indigo-500/30 transition-all duration-500">
                    <FileText size={40} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                </div>
                
                <span className="text-[10px] font-black tracking-[0.4em] text-indigo-400 uppercase mb-2 block">Document Intelligence</span>
                <h4 className="text-lg font-bold text-white mb-2 tracking-tight italic">{fileName}</h4>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Format: PDF — Size: {fileSize}</p>
                
                <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300 transition-all border border-white/5">
                        <Eye size={14} /> Previsualizar
                    </button>
                    <button className="flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-lg shadow-indigo-600/20">
                        <Download size={14} /> Descargar
                    </button>
                </div>
            </div>
        </div>
    );
};
