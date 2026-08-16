// Archivo: frontend/src/components/tabs/bionics/AuditVisor.jsx
import React from 'react';
import { Maximize2, Download } from 'lucide-react';

export function AuditVisor({ screenshot }) {
    return (
        <div className="col-span-12 lg:col-span-8 bg-black/80 rounded-3xl border border-white/10 overflow-hidden shadow-2xl h-[500px]">
            <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex justify-between items-center">
                <span className="text-[10px] font-mono text-gray-400">visual_audit_render.png</span>
                <div className="flex gap-2">
                     <button className="text-gray-500 hover:text-white transition-colors"><Maximize2 size={14} /></button>
                     <button className="text-gray-500 hover:text-white transition-colors"><Download size={14} /></button>
                </div>
            </div>
            <div className="h-full overflow-y-auto custom-scrollbar p-1">
                <img 
                    src={`data:image/png;base64,${screenshot}`} 
                    alt="Audit Result" 
                    className="w-full"
                />
            </div>
        </div>
    );
}
