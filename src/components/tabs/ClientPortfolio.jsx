// Archivo: frontend/src/components/tabs/ClientPortfolio.jsx
import React from 'react';
import { useClientPortfolio } from '../../hooks/useClientPortfolio';
import { PortfolioHeader } from './portfolio/PortfolioHeader';
import { PortfolioGrid } from './portfolio/PortfolioGrid';
import { DeleteModal } from './portfolio/DeleteModal';
import { AnimatePresence } from 'framer-motion';

/**
 * ClientPortfolio - Centralized Node Management
 * Vanguardia 2026: Refactored for Iron Doctrine compliance.
 */
export default function ClientPortfolio({ onOpenClient }) {
    const {
        allClients,
        viewMode,
        setViewMode,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        clientToDelete,
        setClientToDelete,
        confirmDelete
    } = useClientPortfolio();

    const handleClientClick = (client) => {
        const targetUrl = client.previewUrl || client.deployUrl;
        if (client.isGenerated && targetUrl) window.open(targetUrl, '_blank');
        else if (client.id) window.location.hash = `#/project/${client.id}?tab=overview`;
    };

    const requestDelete = (e, client) => {
        e.stopPropagation();
        setClientToDelete(client);
    };

    return (
        <div className="h-full flex flex-col relative">
            <PortfolioHeader 
                filter={filter}
                setFilter={setFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            <PortfolioGrid 
                clients={allClients}
                viewMode={viewMode}
                onClientClick={handleClientClick}
                onDeleteClick={requestDelete}
            />

            <AnimatePresence>
                {clientToDelete && (
                    <DeleteModal 
                        client={clientToDelete}
                        onConfirm={confirmDelete}
                        onCancel={() => setClientToDelete(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
