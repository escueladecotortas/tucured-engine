'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

/**
 * WIDGET: Hero V2 (Split Modern)
 * Enfoque: Profesional, Corporativo, Confianza.
 */

interface HeroV2Props {
    titleLine1?: string;
    titleLine2?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    trustText?: string;
    locationText?: string;
    heroImage?: string;
    primaryColor?: string;
    secondaryColor?: string;
}

export const HeroV2_Split = ({
    titleLine1 = "Soluciones que",
    titleLine2 = "Impulsan tu Negocio",
    subtitle = "Estrategias digitales diseñadas para maximizar tu retorno de inversión y posicionar tu marca líder en el mercado.",
    ctaText = "Comenzar Ahora",
    ctaLink = "#contact",
    trustText = "Más de 200 empresas confían en nosotros",
    locationText = "Tucumán, Argentina",
    heroImage = "https://source.unsplash.com/random/800x800/?office,meeting",
    primaryColor = "#2563EB", // Blue-600
    secondaryColor = "#9333EA" // Purple-600
}: HeroV2Props) => {

    return (
        <section className="relative min-h-[90vh] bg-linear-to-br from-gray-50 to-gray-200 flex items-center overflow-hidden">
            {/* Decorative Blob */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" style={{ backgroundColor: secondaryColor }}></div>

            <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
                
                {/* Text Column */}
                <div className="text-left order-2 lg:order-1">
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight"
                        style={{ color: primaryColor }}
                    >
                        {titleLine1} <br/>
                        <span className="text-transparent bg-clip-text bg-linear-to-r" style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>
                            {titleLine2}
                        </span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed"
                    >
                        {subtitle}
                    </motion.p>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
                    >
                        <a 
                            href={ctaLink} 
                            className="px-8 py-4 text-white rounded-tr-2xl rounded-bl-2xl hover:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-bold"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {ctaText}
                        </a>
                        
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-3">
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200" style={{ backgroundImage: 'url(https://i.pravatar.cc/100?img=1)', backgroundSize: 'cover' }}></div>
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200" style={{ backgroundImage: 'url(https://i.pravatar.cc/100?img=2)', backgroundSize: 'cover' }}></div>
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200" style={{ backgroundImage: 'url(https://i.pravatar.cc/100?img=3)', backgroundSize: 'cover' }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-500 max-w-[150px] leading-tight">{trustText}</span>
                        </div>
                    </motion.div>
                </div>

                {/* Image Column */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative order-1 lg:order-2"
                >
                    {/* Organic Mask Image */}
                    <div className="relative w-full aspect-square rounded-[2rem] lg:rounded-tl-[10rem] lg:rounded-br-[5rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500 ring-8 ring-white/50 backdrop-blur-xl">
                        <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
                    </div>
                    
                    {/* Floating Data Card */}
                    <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/40 hidden md:block"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">Ubicación</p>
                                <p className="text-sm font-bold" style={{ color: primaryColor }}>{locationText}</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
};
