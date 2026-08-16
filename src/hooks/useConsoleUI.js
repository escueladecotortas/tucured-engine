import { useState, useEffect, useRef } from 'react';

/**
 * useConsoleUI - Hook para gestión de estados de interfaz
 */
export function useConsoleUI(initialTab, initialAgent) {
    // ---- TABS & NAVIGATION ----
    const [selectedTab, setSelectedTab] = useState(initialTab || 'overview');
    useEffect(() => {
        if (initialTab) setSelectedTab(initialTab);
    }, [initialTab]);

    // ---- MODAL STATES ----
    const [showFileExplorer, setShowFileExplorer] = useState(false);
    const [showBrainViewer, setShowBrainViewer] = useState(false);
    const [showAgentLab, setShowAgentLab] = useState(false);
    const [showAdminPanel, setShowAdminPanel] = useState(false);
    const [showApprovals, setShowApprovals] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [selectedMissionReport, setSelectedMissionReport] = useState(null);
    const [previewFile, setPreviewFile] = useState(null);
    const [previewContent, setPreviewContent] = useState('');

    // ---- TERMINAL / SOCKET ----
    const [terminalLogs, setTerminalLogs] = useState([]);
    const logsEndRef = useRef(null);

    // ---- WIDGETS ----
    const [activeWidgets, setActiveWidgets] = useState(() => {
        const saved = localStorage.getItem('nexus_active_widgets');
        return saved ? JSON.parse(saved) : { 'turnero-basic': true, 'smart-carousel': true, 'promo-popup': false };
    });

    // ---- SIDEBAR & AGENTS ----
    const [selectedAgent, setSelectedAgent] = useState(initialAgent ? { id: initialAgent } : null);
    const [sidebarExpanded, setSidebarExpanded] = useState(() => {
        const saved = localStorage.getItem('nexus_sidebar_expanded');
        return saved !== null ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem('nexus_sidebar_expanded', JSON.stringify(sidebarExpanded));
    }, [sidebarExpanded]);

    return {
        selectedTab, setSelectedTab,
        showFileExplorer, setShowFileExplorer,
        showBrainViewer, setShowBrainViewer,
        showAgentLab, setShowAgentLab,
        showAdminPanel, setShowAdminPanel,
        showApprovals, setShowApprovals,
        showDeleteConfirm, setShowDeleteConfirm,
        selectedMissionReport, setSelectedMissionReport,
        previewFile, setPreviewFile,
        previewContent, setPreviewContent,
        terminalLogs, setTerminalLogs,
        logsEndRef,
        activeWidgets, setActiveWidgets,
        selectedAgent, setSelectedAgent,
        sidebarExpanded, setSidebarExpanded
    };
}
