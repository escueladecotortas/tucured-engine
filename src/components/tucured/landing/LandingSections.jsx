// Archivo: frontend/src/components/tucured/landing/LandingSections.jsx
import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Icon } from './LandingBasics';

export const TeamMemberCard = ({ name, role, desc, image, gradient, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className={`relative p-6 rounded-3xl border border-white/10 backdrop-blur-xl overflow-hidden bg-linear-to-br ${gradient}`}
    >
        <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/30 bg-black/30">
                <img src={image} alt={name} className="w-full h-full object-cover" />
            </div>
            <div>
                <h4 className="text-xl font-bold text-white">{name}</h4>
                <p className="text-sm text-white/70 uppercase tracking-wider">{role}</p>
            </div>
        </div>
        <p className="text-white/80 text-sm leading-relaxed">{desc}</p>
        <div className="absolute top-2 right-2 px-2 py-1 bg-white/10 rounded-full text-[10px] uppercase tracking-wider text-white/50 font-bold">
            ⚡ AI Agent
        </div>
    </motion.div>
);

export const ClientCard = ({ name, image, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay }}
        whileHover={{ scale: 1.05, y: -5 }}
        className="relative rounded-2xl overflow-hidden aspect-4/3 group cursor-pointer"
    >
        <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white font-bold text-lg">{name}</p>
            <p className="text-gray-300 text-xs uppercase tracking-wider">Tucu Red Cliente</p>
        </div>
    </motion.div>
);
