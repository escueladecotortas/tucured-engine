// Archivo: src/components/core/tabcontent/TabMapping.jsx
import React from 'react';

// Lazy imports para tabs (Compartidos con TabContent)
const SitePreview = React.lazy(() => import('../../SitePreview'));
const NeuralFactory = React.lazy(() => import('../../tabs/NeuralFactory'));
const OverviewV2 = React.lazy(() => import('../../tabs/OverviewV2'));
const MissionsTab = React.lazy(() => import('../../tabs/MissionsTab'));
const IdentityTab = React.lazy(() => import('../../tabs/IdentityTab'));
const StatusTab = React.lazy(() => import('../../tabs/StatusTab'));
const NeuralTeam = React.lazy(() => import('../../tabs/NeuralTeam'));
const AgentTerminal = React.lazy(() => import('../../AgentTerminal'));
const TheVault = React.lazy(() => import('../../tabs/TheVault'));
const IntelligenceMonitor = React.lazy(() => import('../../dashboard/IntelligenceMonitor'));
const BlueprintTab = React.lazy(() => import('../../tabs/BlueprintTab'));
const ClientPortfolio = React.lazy(() => import('../../tabs/ClientPortfolio'));
const AssetVault = React.lazy(() => import('../../AssetVault'));
const DatabaseStats = React.lazy(() => import('../../tabs/DatabaseStats'));
const StitchShowroom = React.lazy(() => import('../../tabs/StitchShowroom'));
const SopLibrary = React.lazy(() => import('../../tabs/SopLibrary'));
const BionicsTab = React.lazy(() => import('../../tabs/BionicsTab'));
const ShieldTab = React.lazy(() => import('../../tabs/ShieldTab'));
const AchievementsTab = React.lazy(() => import('../../tabs/AchievementsTab'));
const WidgetStudio = React.lazy(() => import('../../WidgetStudio'));

export const getTabComponent = (tab, props) => {
    const { projectId, currentProject, activities, selectedAgent, onAgentClick, onNavigate } = props;

    switch (tab) {
        case 'overview':
            return <OverviewV2 projectId={projectId} projectData={currentProject} activities={activities} onNavigate={onNavigate} />;
        case 'agents':
            return <NeuralTeam activeAgent={selectedAgent} projectId={projectId} activities={activities} onAgentClick={onAgentClick} />;
        case 'terminal':
            return <div className="h-full p-4"><AgentTerminal /></div>;
        case 'briefing':
            return <div className="h-full p-4"><IntelligenceMonitor projectId={projectId} assets={{}} /></div>;
        case 'vault':
            return <TheVault projectId={projectId} rootPath="root" />;
        case 'leads':
            return <NeuralFactory />;
        case 'missions':
            return <MissionsTab projectId={projectId} />;
        case 'identity':
            return <IdentityTab projectId={projectId} projectData={currentProject} />;
        case 'status':
            return <StatusTab projectId={projectId} />;
        case 'assets':
            return <AssetVault projectId={projectId} assetsPath={currentProject?.assetsPath} />;
        case 'widgets':
            return <WidgetStudio projectId={projectId} />;
        case 'blueprint':
            return <BlueprintTab projectId={projectId} />;
        case 'clients':
        case 'portfolio':
            return <ClientPortfolio onOpenClient={(id) => onNavigate ? onNavigate('portfolio') : (window.location.pathname = `/project/${id}`)} />;
        case 'database':
            return <DatabaseStats />;
        case 'showroom':
            return <StitchShowroom />;
        case 'library':
            return <SopLibrary />;
        case 'vision':
            return <BionicsTab projectId={projectId} />;
        case 'shield':
            return <ShieldTab projectId={projectId} />;
        case 'achievements':
            return <AchievementsTab projectId={projectId} />;
        default:
            return null;
    }
};
