// Archivo: frontend/src/components/tabs/identity/ColorPill.jsx
import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export function ColorPill({ color, name, onCopy }) {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(color);
        setCopied(true);
        onCopy?.(color);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div onClick={handleCopy} className="group cursor-pointer flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
            <div className="w-8 h-8 rounded-full shadow-lg border border-white/10 relative overflow-hidden shrink-0" style={{ backgroundColor: color }}>
                {copied && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><CheckCircle className="w-4 h-4 text-white" /></div>}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-500 font-mono leading-none mb-0.5">{color}</p>
                <p className="text-xs text-gray-300 font-medium truncate">{name}</p>
            </div>
        </div>
    );
}
