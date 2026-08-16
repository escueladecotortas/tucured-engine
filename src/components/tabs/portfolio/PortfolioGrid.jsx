// Archivo: frontend/src/components/tabs/portfolio/PortfolioGrid.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';
import SuperCard from '../../core/SuperCard';

export function PortfolioGrid({ clients, viewMode, onClientClick, onDeleteClick }) {
    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar pt-6 pb-20 pr-2">
            <AnimatePresence mode='popLayout'>
                <motion.div
                    layout
                    className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}
                >
                    {clients.map((client) => (
                        <SuperCard
                            key={client.id}
                            client={client}
                            viewMode={viewMode}
                            onClick={() => onClientClick(client)}
                            onDelete={client.source === 'db' ? (e) => onDeleteClick(e, client) : null}
                        />
                    ))}
                </motion.div>
            </AnimatePresence>

            {clients.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-600">
                    <Terminal className="w-12 h-12 mb-4 opacity-20" />
                    <p className="font-mono text-sm">NO ACTIVE SIGNALS FOUND</p>
                </div>
            )}
        </div>
    );
}
