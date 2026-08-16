import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Instagram, Linkedin, ExternalLink } from 'lucide-react';

const LandingFooter = ({ content, onShowTerms }) => {
    // Default content fallback if not provided
    const footerContent = content || {
        logo: '/branding/logo_tucu_red.png',
        links: [
            { label: 'Términos y Condiciones', link: '#' },
            { label: 'Instagram', link: '#' },
            { label: 'Contacto', link: '#' }
        ],
        copyright: '© 2026 Tucu Red. All rights reserved.'
    };

    return (
        <footer className="relative py-20 px-6 border-t border-white/10 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl z-0" />

            {/* Ambient Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[100px] bg-indigo-600/20 blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-10">
                {/* Logo with Hover Effect */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <img
                        src={footerContent.logo}
                        alt="Tucu Red"
                        className="h-24 w-auto invert opacity-90 hover:opacity-100 transition-opacity drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                        data-nexus-id="content.footer.logo"
                    />
                </motion.div>

                {/* Links Section */}
                <div className="flex flex-wrap justify-center gap-8 text-sm font-bold tracking-widest uppercase text-white/50">
                    <button
                        onClick={onShowTerms}
                        className="flex items-center gap-2 hover:text-[#FF9900] transition-colors group"
                    >
                        <span>{footerContent.links[0]?.label || "Terms"}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1" />
                    </button>

                    <span className="text-white/10">•</span>

                    <a
                        href={footerContent.links[1]?.link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 hover:text-[#E1306C] transition-colors group"
                    >
                        <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>{footerContent.links[1]?.label || "Instagram"}</span>
                    </a>

                    <span className="text-white/10">•</span>

                    <a
                        href={footerContent.links[2]?.link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 hover:text-[#00F3FF] transition-colors group"
                    >
                        <span>{footerContent.links[2]?.label || "Contact"}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1" />
                    </a>
                </div>

                {/* Copyright */}
                <div className="flex flex-col gap-2 opacity-40 hover:opacity-100 transition-opacity duration-500">
                    <div className="h-px w-16 bg-white/20 mx-auto" />
                    <p className="text-[10px] text-gray-400 font-mono mt-4 whitespace-pre-line tracking-wide" data-nexus-id="content.footer.copyright">
                        {footerContent.copyright}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
