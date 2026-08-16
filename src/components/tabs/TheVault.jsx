// Archivo: frontend/src/components/tabs/TheVault.jsx
'use client';
import React, { useState } from 'react';
import { HardDrive, Image as ImageIcon, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVaultBackup } from '../../hooks/useVaultBackup';
import { VaultHeader } from './vault/VaultHeader';
import { DataCoreBackup } from './vault/DataCoreBackup';

// Carga perezosa de componentes pesados
const FileExplorer = React.lazy(() => import('../FileExplorer'));
const AssetVault = React.lazy(() => import('../AssetVault'));

export default function TheVault({ projectId, rootPath }) {
    const fsPath = rootPath || projectId;
    const [activeDrive, setActiveDrive] = useState('system');
    const { isBackingUp, backupStatus, handleBackup } = useVaultBackup(projectId);

    const drives = [
        { id: 'system', label: 'Sistema de Archivos', icon: HardDrive, color: 'text-indigo-400', desc: 'Código Fuente' },
        { id: 'assets', label: 'Activos de Marca', icon: ImageIcon, color: 'text-pink-400', desc: 'Medios' },
        { id: 'database', label: 'Núcleo de Datos', icon: Database, color: 'text-emerald-400', desc: 'Firestore' },
    ];

    const activeDriveLabel = drives.find(d => d.id === activeDrive)?.label;

    return (
        <div className="h-full flex flex-col bg-[#050510]">
            <VaultHeader 
                activeDriveLabel={activeDriveLabel} 
                drives={drives} 
                activeDrive={activeDrive} 
                onDriveChange={setActiveDrive} 
            />

            <div className="flex-1 overflow-hidden relative flex">
                <div className="flex-1 relative">
                    <React.Suspense fallback={<div className="p-10 text-center text-gray-500 animate-pulse font-mono">DESENCRIPTANDO SECTOR...</div>}>
                        <AnimatePresence mode="wait">
                            {activeDrive === 'system' && (
                                <motion.div
                                    key="system"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="h-full"
                                >
                                    <FileExplorer projectId={fsPath} inline={true} />
                                </motion.div>
                            )}

                            {activeDrive === 'assets' && (
                                <motion.div
                                    key="assets"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="h-full"
                                >
                                    <AssetVault projectId={fsPath} assetsPath="assets" />
                                </motion.div>
                            )}

                            {activeDrive === 'database' && (
                                <DataCoreBackup 
                                    isBackingUp={isBackingUp} 
                                    backupStatus={backupStatus} 
                                    onBackup={handleBackup} 
                                />
                            )}
                        </AnimatePresence>
                    </React.Suspense>
                </div>
            </div>
        </div>
    );
}
