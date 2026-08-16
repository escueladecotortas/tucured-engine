// Archivo: frontend/src/components/tucured/landing/LandingBasics.jsx
import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

export const Icon = ({ name, className }) => {
    const LucideIcon = LucideIcons[name];
    if (!LucideIcon) return null;
    return <LucideIcon className={className} />;
};

export const VividButton = ({ children, primary = false, onClick, disabled = false }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            disabled={disabled}
            className={`
                px-8 py-4 rounded-full font-bold transition-all duration-300
                ${primary 
                    ? 'bg-linear-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
        >
            {children}
        </motion.button>
    );
};

export const HeroBackground = ({ image }) => (
    <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-[#02040A] z-10" />
        {image ? (
            <img src={image} className="w-full h-full object-cover opacity-40 scale-105" alt="Hero background" />
        ) : (
            <div className="w-full h-full bg-[#02040A]" />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent opacity-50" />
    </div>
);
