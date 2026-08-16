// Archivo: frontend/src/components/tabs/NeuralTeam.jsx
import React from 'react';
import { AGENTS, CORE_TEAM, PROJECT_MANAGERS, getAgentsForProject } from './NeuralTeamData';
import AgentDetailView from './AgentDetailView';
import AgentGridView from './AgentGridView';

/**
 * NeuralTeam Orchestrator - Manages team views and filtering
 * Complies with 200-line limit by delegating to specialized components
 */
export default function NeuralTeam({ activeAgent, projectId, activities = [], onAgentClick }) {
    
    // Determine Manager
    const managerId = PROJECT_MANAGERS[projectId] || null;

    // Filter and Sort Agents
    const filteredAgents = getAgentsForProject(projectId);
    const sortedAgents = [...filteredAgents].sort((a, b) => {
        if (managerId) {
            if (a.id === managerId) return -1;
            if (b.id === managerId) return 1;
        }
        const aCore = CORE_TEAM.includes(a.id);
        const bCore = CORE_TEAM.includes(b.id);
        if (aCore && !bCore) return -1;
        if (!aCore && bCore) return 1;
        return 0;
    });

    // Determine focusing agent from data
    const focusAgentData = activeAgent ? AGENTS.find(a => a.id === activeAgent.id) : null;

    // Mode switching
    if (focusAgentData) {
        return (
            <AgentDetailView 
                agent={focusAgentData} 
                activities={activities} 
                onBack={() => onAgentClick && onAgentClick(null)} 
            />
        );
    }

    return (
        <AgentGridView 
            agents={sortedAgents} 
            managerId={managerId} 
            projectId={projectId} 
            onAgentClick={onAgentClick} 
        />
    );
}
