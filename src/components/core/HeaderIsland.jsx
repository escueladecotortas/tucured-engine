// Archivo: src/components/core/HeaderIsland.jsx
import React from 'react';
import { motion } from 'framer-motion';
import HeaderProjectInfo from './header/HeaderProjectInfo';
import HeaderUserActions from './header/HeaderUserActions';

export default function HeaderIsland({
    project,
    user,
    userRole,
    onLogout,
    onToggleLanguage
}) {
    return (
        <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative flex justify-between items-center mb-6"
        >
            <HeaderProjectInfo project={project} />

            <HeaderUserActions 
                project={project} 
                user={user} 
                userRole={userRole} 
                onLogout={onLogout} 
                onToggleLanguage={onToggleLanguage} 
            />
        </motion.div>
    );
}
