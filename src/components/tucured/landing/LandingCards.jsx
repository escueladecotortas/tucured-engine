// Archivo: frontend/src/components/tucured/landing/LandingCards.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Star } from 'lucide-react';
import { VividButton, Icon } from './LandingBasics';

export const StatBadge = ({ icon, label, value, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm"
    >
        <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400`}>
            {icon}
        </div>
        <div>
            <div className={`text-2xl font-bold text-white font-mono`}>{value}</div>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</div>
        </div>
    </motion.div>
);

export const PricingCard = ({ name, price, features, popular, onBuy, isLoading, gradient, icon, currency }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className={`relative p-8 rounded-3xl border ${popular ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/10 bg-white/5'} backdrop-blur-xl flex flex-col`}
    >
        {popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-500 rounded-full text-[10px] font-bold text-white">
                MÁS POPULAR
            </div>
        )}
        <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
            <div className="flex items-baseline gap-1">
                <span className="text-gray-400 text-sm">{currency || '$'}</span>
                <span className="text-4xl font-bold text-white font-mono">{price}</span>
            </div>
        </div>
        <div className="space-y-4 mb-8 flex-1">
            {features.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm leading-relaxed">{f}</span>
                </div>
            ))}
        </div>
        <VividButton primary={popular} onClick={onBuy} disabled={isLoading}>
            {isLoading ? 'PROCESANDO...' : 'EMPEZAR AHORA'}
        </VividButton>
    </motion.div>
);

export const BenefitItem = ({ icon, title, desc, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className="flex gap-4 group"
    >
        <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 text-white transition-all group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30`}>
            <Icon name={icon} className="w-6 h-6" />
        </div>
        <div>
            <h4 className="font-bold text-white mb-1">{title}</h4>
            <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
        </div>
    </motion.div>
);
