// Archivo: frontend/src/components/tabs/BionicsTab.jsx
import React from 'react';
import { useBionics } from '../../hooks/useBionics';
import { BionicsHeader } from './bionics/BionicsHeader';
import { AuditKpiSection } from './bionics/AuditKpiSection';
import { AuditVisor } from './bionics/AuditVisor';
import { AuditIssuesList } from './bionics/AuditIssuesList';
import { BionicsEmptyState } from './bionics/BionicsEmptyState';

/**
 * BionicsTab - Vision AI Audit Interface
 * Vanguardia 2026: Refactored for Iron Doctrine compliance.
 */
export default function BionicsTab() {
    const {
        loading,
        auditData,
        selectedIssue,
        setSelectedIssue,
        runAudit,
        metrics
    } = useBionics();

    return (
        <div className="h-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header with Search/Action */}
            <BionicsHeader onRunAudit={runAudit} loading={loading} />

            {/* Audit Content Area */}
            <div className="flex-1 flex gap-6 min-h-0">
                {/* Left: Audit Visualization & KPIs */}
                <div className="flex-[2] flex flex-col gap-6 min-h-0">
                    <AuditKpiSection metrics={metrics} />
                    
                    {auditData ? (
                        <AuditVisor 
                            screenshot={auditData.screenshot} 
                            analysis={auditData.analysis}
                            selectedIssue={selectedIssue}
                        />
                    ) : (
                        <BionicsEmptyState loading={loading} />
                    )}
                </div>

                {/* Right: Issues List & Details */}
                <div className="flex-1 flex flex-col min-h-0">
                    <AuditIssuesList 
                        issues={auditData?.issues || []}
                        selectedIssue={selectedIssue}
                        onSelectIssue={setSelectedIssue}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
}
