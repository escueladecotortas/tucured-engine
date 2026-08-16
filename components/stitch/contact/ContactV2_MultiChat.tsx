'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, Mail, X, MessageSquare } from 'lucide-react';

/**
 * WIDGET: All-in-One Chat
 * Enfoque: Centralizar canales de contacto (WhatsApp, Messenger, Email).
 */

interface ChatChannel {
    name: string;
    icon: React.ReactNode;
    color: string;
    action: () => void;
}

interface MultiChatProps {
    whatsappNumber?: string;
    email?: string;
    phone?: string;
    messengerId?: string;
    primaryColor?: string;
}

export const ContactV2_MultiChat = ({
    whatsappNumber = "549381000000",
    email = "contacto@marca.com",
    phone,
    messengerId
}: MultiChatProps) => {

    const [isOpen, setIsOpen] = useState(false);

    const channels: ChatChannel[] = [
        {
            name: 'WhatsApp',
            icon: <MessageCircle size={24}/>,
            color: '#25D366',
            action: () => window.open(`https://wa.me/${whatsappNumber}`, '_blank')
        },
        ...(email ? [{
            name: 'Email',
            icon: <Mail size={24}/>,
            color: '#EA4335',
            action: () => window.location.href = `mailto:${email}`
        }] : []),
        ...(phone ? [{
            name: 'Llamar',
            icon: <Phone size={24}/>,
            color: '#34A853',
            action: () => window.location.href = `tel:${phone}`
        }] : []),
         ...(messengerId ? [{
            name: 'Messenger',
            icon: <MessageSquare size={24}/>,
            color: '#0084FF',
            action: () => window.open(`https://m.me/${messengerId}`, '_blank')
        }] : [])
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="flex flex-col gap-3 mb-2"
                    >
                        {channels.map((channel, idx) => (
                            <motion.button
                                key={idx}
                                onClick={channel.action}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-center gap-3 bg-white p-3 pr-6 rounded-full shadow-lg hover:scale-105 transition-transform group"
                            >
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md" style={{ backgroundColor: channel.color }}>
                                    {channel.icon}
                                </div>
                                <span className="font-bold text-gray-700 group-hover:text-black">{channel.name}</span>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 ${isOpen ? 'rotate-45 bg-gray-800' : 'bg-[#2563EB] animate-pulse-slow hover:scale-110'}`}
            >
                {isOpen ? <X size={32} /> : <div className="relative"><MessageCircle size={32} /><span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#2563EB]"></span></div>}
            </button>

        </div>
    );
};
