// Archivo: frontend/src/components/tucured/ClientGrid.jsx
import React from 'react';
import SuperCard from './SuperCard';

const ClientGrid = ({ clients, viewMode, onOpenClient }) => {
    return (
        <div className={`grid gap-6 relative z-10 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {clients.map(client => (
                <SuperCard
                    key={client.id}
                    client={client}
                    viewMode={viewMode}
                    onClick={() => {
                        if (client.isGenerated && client.deployUrl) window.open(client.deployUrl, '_blank');
                        else if (client.id) onOpenClient(client.id);
                    }}
                />
            ))}
        </div>
    );
};

export default ClientGrid;
