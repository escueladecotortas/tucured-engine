// Archivo: frontend/src/components/tabs/BlueprintTab.jsx
import React from 'react';
import { useBlueprint } from '../../hooks/useBlueprint';
import { BlueprintHeader } from './blueprint/BlueprintHeader';
import { StrategyCore } from './blueprint/StrategyCore';
import { StructuralBlueprint } from './blueprint/StructuralBlueprint';

/**
 * BlueprintTab - Digital Strategy & Architecture
 * Vanguardia 2026: Refactored for Iron Doctrine compliance.
 */
export default function BlueprintTab({ projectId }) {
    const {
        blueprint,
        loading,
        saving,
        handleSave,
        toggleSection,
        setArchetype,
        updateStrategy
    } = useBlueprint(projectId);

    if (loading) {
        return (
            <div className="p-10 flex items-center justify-center text-indigo-400 animate-pulse font-mono text-xs">
                LOADING ARCHITECTURE...
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col p-6 overflow-hidden">
            <BlueprintHeader 
                projectId={projectId} 
                onSave={handleSave} 
                saving={saving} 
            />

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden min-h-0">
                <StrategyCore 
                    blueprint={blueprint}
                    setArchetype={setArchetype}
                    updateStrategy={updateStrategy}
                />

                <StructuralBlueprint 
                    sections={blueprint.sections}
                    onToggleSection={toggleSection}
                />
            </div>
        </div>
    );
}
