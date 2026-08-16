"use client";

import React from 'react';
import { CustomLogo } from './CustomLogo';
import { Phone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface BoutiqueHeaderProps {
    name: string;
    logoUrl?: string;
    primaryColor?: string;
    whatsappNumber: string;
}

export const BoutiqueHeader = ({ name, logoUrl, primaryColor, whatsappNumber }: BoutiqueHeaderProps) => {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-20">
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                <CustomLogo name={name} logoUrl={logoUrl} primaryColor={primaryColor} />

                <div className="hidden md:flex items-center gap-8">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Contacto Directo</span>
                        <a 
                            href={`https://wa.me/${whatsappNumber}`} 
                            className="text-sm font-bold text-[#1A1A1A] hover:text-[#FF2A2A] transition-colors"
                        >
                           +{whatsappNumber}
                        </a>
                    </div>
                    
                    <motion.a
                        href={`https://wa.me/${whatsappNumber}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#111111] text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group"
                    >
                        Solicitar Info
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </motion.a>
                </div>

                <a 
                    href={`https://wa.me/${whatsappNumber}`}
                    className="md:hidden p-3 bg-gray-100 rounded-full"
                >
                    <Phone className="w-5 h-5 text-[#1A1A1A]" />
                </a>
            </div>
        </header>
    );
};
