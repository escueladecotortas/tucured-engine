// Archivo: src/components/NexusConsole.jsx
'use client';
import React, { useState } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { projects } from '../data/projects';
import { ToastContainer, useToast } from './Toast';
import { DEFAULT_WORKSPACE } from '../config/nexus.workspaces';
import { getConsoleTabs } from '../config/console.tabs';
import { useConsoleData } from '../hooks/useConsoleData';
import { useConsoleUI } from '../hooks/useConsoleUI';

// Core Components
import HeaderIsland from './core/HeaderIsland';
import TabContent from './core/TabContent';
import SidebarPanel from './core/SidebarPanel';
import ModalManager from './core/ModalManager';
import CollapsibleSidebar from './core/CollapsibleSidebar';
import MobileVoiceController from './core/MobileVoiceController';
import MobileCommandCenter from './mobile/MobileCommandCenter';

export default function NexusConsole({ projectId: initialProjectId, initialTab, initialAgent, userOverride, mobileTranscript }) {
    const { currentUser: authUser, logout, userRole } = useAuth();
    const currentUser = userOverride || authUser;

    const { toggleLanguage } = useLanguage();
    const { addToast, removeToast, toasts } = useToast();

    // --- MOBILE SPECIFIC VIEW ---
    if (currentUser && currentUser.uid === 'mobile-architect') {
        return <MobileCommandCenter user={currentUser} onLogout={() => window.location.reload()} externalTranscript={mobileTranscript} />;
    }

    const [currentWorkspace, setCurrentWorkspace] = useState(initialProjectId || DEFAULT_WORKSPACE);
    const projectId = currentWorkspace;
    const staticProject = projects.find(p => p.id === projectId);
    
    const { activities, currentProject, loadingProject } = useConsoleData(projectId, staticProject);
    const ui = useConsoleUI(initialTab, initialAgent);

    // Handlers
    const handleTaskClick = async (task) => {
        if (task.status === 'completed') return ui.setSelectedMissionReport(task);
        if (task.status === 'in_progress') return;
        const tid = addToast(`Iniciando: ${task.title}...`, 'info');
        try {
            const res = await fetch('/api/nexus/ignite-mission', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: task.projectId || 'general', missionId: task.id, agentId: task.assignedTo || 'nexus' })
            });
            removeToast(tid);
            if (res.ok) addToast('Ignición exitosa', 'success');
        } catch (e) { addToast('Error de ignición', 'error'); }
    };

    const handleDeleteTask = async () => {
        try {
            await deleteDoc(doc(db, 'tasks', ui.showDeleteConfirm));
            addToast('Misión eliminada', 'success');
            ui.setShowDeleteConfirm(null);
        } catch (e) { addToast('Error al eliminar', 'error'); }
    };

    if (loadingProject) return <div className="min-h-screen bg-black flex items-center justify-center font-mono text-cyan-500 animate-pulse text-xs tracking-widest">LOADING NEURAL CONTEXT...</div>;
    if (!currentProject) return <div className="min-h-screen bg-black flex items-center justify-center font-mono text-red-500">ERROR: PROJECT NODE NOT FOUND [{projectId}]</div>;

    const tabs = getConsoleTabs(projectId);
    if (!currentUser) return null;

    return (
        <div className="min-h-screen bg-nexus-bg text-text-primary font-outfit relative overflow-hidden selection:bg-nexus-cyan/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,\u0076\u0061\u0072(--tw-gradient-stops))] from-nexus-cyan/5 via-transparent to-transparent opacity-50 pointer-events-none" />
            <div className="relative z-10 h-screen flex">
                <CollapsibleSidebar
                    isExpanded={ui.sidebarExpanded}
                    onToggle={() => ui.setSidebarExpanded(!ui.sidebarExpanded)}
                    currentWorkspace={currentWorkspace}
                    onWorkspaceChange={(newWsId) => { setCurrentWorkspace(newWsId); if (newWsId !== currentWorkspace) ui.setSelectedTab('overview'); }}
                    navItems={tabs} activeTab={ui.selectedTab} activeAgentId={ui.selectedAgent?.id} recentLogs={activities} onNavigate={ui.setSelectedTab}
                    onAgentClick={(agent) => { ui.setSelectedAgent(agent); ui.setSelectedTab('agents'); }}
                />

                <div className="flex-1 p-6 flex flex-col max-w-[1800px] mx-auto pb-16 overflow-visible">
                    <HeaderIsland 
                        project={currentProject} 
                        user={currentUser} 
                        userRole={userRole} 
                        onLogout={logout} 
                        onToggleLanguage={toggleLanguage} 
                    />
                    <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
                        <TabContent 
                            selectedTab={ui.selectedTab} 
                            currentProject={currentProject} 
                            projectId={projectId} 
                            activeWidgets={ui.activeWidgets} 
                            activities={activities} 
                            selectedAgent={ui.selectedAgent} 
                            onAgentClick={ui.setSelectedAgent}
                            onNavigate={ui.setSelectedTab}
                        />
                        <SidebarPanel activeWidgets={ui.activeWidgets} projectId={projectId} projectData={currentProject} />
                    </div>
                </div>

                <ModalManager
                    {...ui}
                    projectId={currentProject?.id || 'system'}
                    onCloseFileExplorer={() => ui.setShowFileExplorer(false)}
                    onCloseBrainViewer={() => ui.setShowBrainViewer(false)}
                    onCloseAgentLab={() => ui.setShowAgentLab(false)}
                    onCloseAdminPanel={() => ui.setShowAdminPanel(false)}
                    onCloseApprovals={() => ui.setShowApprovals(false)}
                    onCloseDeleteConfirm={() => ui.setShowDeleteConfirm(null)}
                    onConfirmDelete={handleDeleteTask}
                    onCloseMissionReport={() => ui.setSelectedMissionReport(null)}
                    onCloseFilePreview={() => ui.setPreviewFile(null)}
                    onPreviewFile={ui.setPreviewFile}
                />
                <ToastContainer toasts={toasts} removeToast={removeToast} />
                <MobileVoiceController 
                    agentId={ui.selectedAgent?.id || 'nexus'} 
                    agentName={ui.selectedAgent?.name || 'NEXUS'}
                    onMessageSent={async (text) => {
                        try {
                            await fetch('/api/nexus/command', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ agentId: ui.selectedAgent?.id || 'nexus', command: text, projectId: projectId || 'general' })
                            });
                            addToast(`Comando enviado: ${text.substring(0, 20)}...`, 'success');
                        } catch (e) {
                            addToast('Error al enviar voz', 'error');
                        }
                    }}
                />
            </div>
        </div>
    );
}
