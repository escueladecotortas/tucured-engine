'use client';

import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Share2 } from 'lucide-react';

/**
 * WIDGET: Mega Social Bar / Icons
 * Enfoque: Conexión rápida a perfiles con estética Soberana.
 */

interface SocialIconsProps {
    data?: any;
    layout?: 'floating' | 'inline';
}

export const SocialV4_Icons = ({
    data = {},
    layout = 'inline'
}: SocialIconsProps) => {

    const socialLinks = data.links || [
        { platform: 'instagram', url: '#', color: '#E4405F' },
        { platform: 'facebook', url: '#', color: '#1877F2' },
        { platform: 'twitter', url: '#', color: '#1DA1F2' },
        { platform: 'linkedin', url: '#', color: '#0A66C2' },
        { platform: 'youtube', url: '#', color: '#FF0000' }
    ];

    const getIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'instagram': return <Instagram size={20} />;
            case 'facebook': return <Facebook size={20} />;
            case 'twitter': return <Twitter size={20} />;
            case 'linkedin': return <Linkedin size={20} />;
            case 'youtube': return <Youtube size={20} />;
            default: return <Share2 size={20} />;
        }
    };

    const isFloating = layout === 'floating' || data.layout === 'floating';

    const containerClass = isFloating 
        ? "fixed right-0 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-[10001] bg-slate-900/60 backdrop-blur-xl border-y border-l border-white/10 rounded-l-[2rem] p-3 shadow-2xl overflow-hidden" 
        : "flex flex-wrap gap-5 p-4";

    const itemClass = isFloating
        ? "w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 hover:bg-white/10 group cursor-pointer"
        : "w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5 bg-slate-900/40 hover:border-indigo-500/30 transition-all hover:-translate-y-1 shadow-lg cursor-pointer group";

    return (
        <div className={containerClass}>
            {isFloating && <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-600/10 rounded-full blur-[30px] pointer-events-none" />}
            
            {socialLinks.map((item: any, idx: number) => (
                <a 
                    key={idx} 
                    href={item.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className={itemClass}
                    style={{ color: item.color || 'white' }}
                >
                    <div className="group-hover:scale-110 transition-transform">
                        {getIcon(item.platform)}
                    </div>
                </a>
            ))}
        </div>
    );
};
