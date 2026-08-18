// Archivo: src/components/tabs/BionicsTab.jsx
import React, { useState } from 'react';
import { useBionics } from '../../hooks/useBionics';
import { BionicsHeader } from './bionics/BionicsHeader';
import { AuditKpiSection } from './bionics/AuditKpiSection';
import { AuditVisor } from './bionics/AuditVisor';
import { AuditIssuesList } from './bionics/AuditIssuesList';
import { BionicsEmptyState } from './bionics/BionicsEmptyState';
import { CommercialReportModal } from './bionics/CommercialReportModal';

export default function BionicsTab() {
    const {
        url,
        setUrl,
        loading,
        auditData,
        error,
        logs,
        handleCapture
    } = useBionics('tucu-red');

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    return (
        <div className="h-full flex flex-col gap-3.5 animate-in fade-in slide-in-from-bottom-3 duration-500 overflow-y-auto custom-scrollbar pr-1 font-mono">
            {/* Header with Search, Export & Live Trace */}
            <BionicsHeader 
                url={url} 
                onUrlChange={setUrl} 
                loading={loading} 
                onCapture={handleCapture}
                onExportReport={() => setIsReportModalOpen(true)}
                canExport={Boolean(auditData)}
                logs={logs || []} 
            />

            {/* Error Banner */}
            {error && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs shrink-0">
                    ⚠️ Error en Biónica Visual: {error}
                </div>
            )}

            {/* KPIs and Visual Results */}
            {auditData ? (
                <div className="flex-1 flex flex-col gap-3.5 min-h-0">
                    <AuditKpiSection auditData={auditData} />
                    <div className="flex-1 grid grid-cols-12 gap-3.5 min-h-[360px]">
                        <div className="col-span-12 lg:col-span-7 h-[360px] lg:h-full">
                            <AuditVisor url={url} screenshot={auditData.screenshot} />
                        </div>
                        <div className="col-span-12 lg:col-span-5 h-[360px] lg:h-full">
                            <AuditIssuesList issues={auditData.issues || []} logs={auditData.logs || []} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 min-h-[280px] flex">
                    <BionicsEmptyState loading={loading} />
                </div>
            )}

            {/* Ficha Comercial de Diagnóstico Modal */}
            <CommercialReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                auditData={auditData}
                url={url}
            />
        </div>
    );
}
