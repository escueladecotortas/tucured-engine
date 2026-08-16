// Archivo: frontend/src/components/tabs/vault/VaultHeader.jsx
import React from 'react';
import { Shield } from 'lucide-react';

export function VaultHeader({ activeDriveLabel, drives, activeDrive, onDriveChange }) {
    return (
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0A0A1A]">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                    <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-white tracking-widest uppercase">
                        LA BÓVEDA
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-gray-500">ALMACENAMIENTO SEGURO</span>
                        <span className="text-[10px] text-gray-700 mx-1">•</span>
                        <span className="text-[10px] font-mono text-indigo-400">{activeDriveLabel}</span>
                    </div>
                </div>
            </div>

            <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                {drives.map(drive => (
                    <button
                        key={drive.id}
                        onClick={() => onDriveChange(drive.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${activeDrive === drive.id
                            ? 'bg-white/10 text-white shadow-lg'
                            : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        <drive.icon className={`w-3 h-3 ${activeDrive === drive.id ? drive.color : ''}`} />
                        <span className="text-xs font-medium">{drive.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
