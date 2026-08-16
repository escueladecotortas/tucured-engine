'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

/**
 * WIDGET: Facebook Chat (Messenger)
 * Enfoque: Soporte directo en plataforma familiar.
 */

export const ContactV3_Messenger = () => {
    return (
        <a 
            href="https://m.me/tucured" 
            target="_blank"
            className="fixed bottom-6 right-24 z-40 bg-[#0084FF] text-white p-3 rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition-transform font-bold pr-5"
        >
            <MessageCircle fill="white" size={24} />
            <span className="hidden md:inline">Chat en Messenger</span>
        </a>
    );
};
