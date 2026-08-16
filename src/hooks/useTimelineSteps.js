// Archivo: frontend/src/hooks/useTimelineSteps.js
import { useState } from 'react';

/**
 * Hook para manejar estado de timeline programáticamente
 */
export function useTimelineSteps(initialSteps = []) {
    const [steps, setSteps] = useState(initialSteps);

    const updateStep = (stepId, updates) => {
        setSteps(prev => prev.map(s =>
            s.id === stepId ? { ...s, ...updates, timestamp: new Date() } : s
        ));
    };

    const activateStep = (stepId) => {
        updateStep(stepId, { status: 'active' });
    };

    const completeStep = (stepId, result = null) => {
        updateStep(stepId, { status: 'completed', progress: 100, result });
    };

    const failStep = (stepId, error = null) => {
        updateStep(stepId, { status: 'error', result: error });
    };

    const resetSteps = () => {
        setSteps(initialSteps.map(s => ({ ...s, status: 'pending', progress: 0, result: null })));
    };

    return { steps, updateStep, activateStep, completeStep, failStep, resetSteps };
}
