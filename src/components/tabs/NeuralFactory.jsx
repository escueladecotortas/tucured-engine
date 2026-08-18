// Archivo: frontend/src/components/tabs/NeuralFactory.jsx
// Orquestador de Operaciones Tácticas: Radar + Search + Cyborg — Ley de 200 Líneas 2026.
import React from 'react';
import { Target, Zap, TrendingUp } from 'lucide-react';
import CyborgOps from '../CyborgOps';
import { OutreachModal, GenerationModal } from '../leads';
import { useToast } from '../Toast';
import { useNeuralFactory } from './useNeuralFactory';
import NeuralFactoryHeader from './NeuralFactoryHeader';
import RadarTab from './RadarTab';
import SearchTab from './SearchTab';

export default function NeuralFactory() {
    const factory = useNeuralFactory();
    const { addToast } = useToast();

    const tabs = [
        { id: 'search', icon: TrendingUp, label: 'Buscador / Base' },
        { id: 'radar', icon: Target, label: 'R.A.D.A.R.' },
        { id: 'cyborg', icon: Zap, label: 'C.Y.B.O.R.G.' },
    ];

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <NeuralFactoryHeader activeTab={factory.activeTab} setActiveTab={factory.setActiveTab} tabs={tabs} />

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-2">
                {factory.activeTab === 'radar' && (
                    <RadarTab prospects={factory.prospects} onSelect={factory.handleRadarSelect} />
                )}

                {factory.activeTab === 'search' && (
                    <SearchTab
                        searchMethod={factory.searchMethod} setSearchMethod={factory.setSearchMethod}
                        onImport={factory.handleBatchImport} formData={factory.formData}
                        setFormData={factory.setFormData} onManualAdd={factory.handleManualAdd}
                        onValidateAddress={factory.handleValidateAddress}
                        isValidatingAddress={factory.isValidatingAddress}
                        isExtracting={factory.isExtracting} extractionStatus={factory.extractionStatus}
                        prospects={factory.prospects} onDelete={factory.handleDelete}
                        onGenerate={factory.handleGenerateSite} addToast={addToast}
                        setTargetProspect={factory.setTargetProspect}
                        setOutreachModalOpen={factory.setOutreachModalOpen}
                        onUpdateLead={factory.handleUpdateLead}
                    />
                )}

                {factory.activeTab === 'cyborg' && <CyborgOps />}
            </div>

            <OutreachModal
                isOpen={factory.outreachModalOpen}
                prospect={factory.targetProspect}
                onClose={() => factory.setOutreachModalOpen(false)}
                onSend={(msg) => factory.handleSendWhatsApp(factory.targetProspect, msg)}
            />

            <GenerationModal
                isOpen={factory.showGenerationModal}
                prospect={factory.currentGeneration}
                logs={factory.generationLogs}
                activeAgents={factory.activeAgents}
                onClose={() => factory.setShowGenerationModal(false)}
                onStartGeneration={factory.executeGeneration}
            />
        </div>
    );
}
