"use client";

import React from 'react';

interface CustomLogoProps {
    name: string;
    logoUrl?: string;
    primaryColor?: string;
}

export const CustomLogo = ({ name, logoUrl, primaryColor = "#FF2A2A" }: CustomLogoProps) => {
    if (logoUrl) {
        return (
            <img 
                src={logoUrl} 
                alt={name} 
                className="h-10 w-auto object-contain" 
            />
        );
    }

    // Fallback: Brutalist Text Logo
    return (
        <div className="flex flex-col">
            <span 
                className="text-2xl font-black uppercase tracking-tighter leading-none italic"
                style={{ color: primaryColor }}
            >
                {name.split(' ')[0]}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A] -mt-1">
                {name.split(' ').slice(1).join(' ') || 'Official Site'}
            </span>
        </div>
    );
};
