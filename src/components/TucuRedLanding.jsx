'use client';
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TermsAndConditions from './TermsAndConditions';
import LandingFooter from './landing/LandingFooter';
import { createPreference } from '../services/paymentService';
import * as LucideIcons from 'lucide-react';
import { HeroBackground, VividButton, Icon } from './tucured/landing/LandingBasics';
import { StatBadge, PricingCard, BenefitItem } from './tucured/landing/LandingCards';
import { TeamMemberCard, ClientCard } from './tucured/landing/LandingSections';
import { useNexusBridge } from './tucured/landing/NexusBridge';

const TucuRedLanding = () => {
    const [siteData, setSiteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTerms, setShowTerms] = useState(false);
    const [isLoadingPayment, setIsLoadingPayment] = useState(false);

    useEffect(() => {
        fetch(`/nexus_archives/tucu-red/clients/tucu-red/client-assets.json?t=${new Date().getTime()}`)
            .then(res => res.json())
            .then(data => { setSiteData(data); setLoading(false); })
            .catch(err => { console.error("Failed to load site data", err); setLoading(false); });
    }, []);

    useNexusBridge(siteData, setSiteData);

    const handlePayment = async (planName, price) => {
        setIsLoadingPayment(true);
        const url = await createPreference(planName, price);
        setIsLoadingPayment(false);
        if (url) window.location.href = url;
        else alert("Error al iniciar el pago.");
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-orange-500">CARGANDO...</div>;
    if (!siteData) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500">ERROR: NO DATA</div>;
    if (showTerms) return <TermsAndConditions onBack={() => setShowTerms(false)} />;

    const { content } = siteData;

    return (
        <div className="min-h-screen font-outfit text-white overflow-x-hidden selection:bg-[#FF9900]">
            <HeroBackground image={content.hero.background_image} />
            
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-black/20 backdrop-blur-md border-b border-white/10">
                <img src={content.footer.logo} alt="Logo" className="h-16 w-auto" />
                <button onClick={() => window.open('https://wa.link/upsz5p', '_blank')} className="px-5 py-2.5 rounded-full bg-[#00F3FF]/10 text-[#00F3FF] border border-[#00F3FF]/30 text-xs font-bold">ÁREA PRIVADA</button>
            </nav>

            <header className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex flex-col justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="z-10">
                        <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-[0.9]" dangerouslySetInnerHTML={{ __html: content.hero.title }} />
                        <p className="text-xl md:text-2xl text-gray-200 mb-12" dangerouslySetInnerHTML={{ __html: content.hero.subtitle }} />
                        <div className="flex gap-6">
                            <VividButton primary onClick={() => document.getElementById('planes').scrollIntoView({ behavior: 'smooth' })}>{content.hero.cta_primary.label}</VividButton>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6 lg:items-end">
                        {content.hero.stats.map((stat, i) => <StatBadge key={i} {...stat} delay={i * 0.2} />)}
                    </div>
                </div>
            </header>

            <section className="py-20 px-6 relative z-10 bg-black/40">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                    {content.benefits.items.map((b, i) => <BenefitItem key={i} {...b} delay={i * 0.1} />)}
                </div>
            </section>

            <section id="planes" className="py-32 px-6 relative z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {content.pricing.plans.map((p, i) => <PricingCard key={i} {...p} onBuy={() => handlePayment(p.name, p.price)} isLoading={isLoadingPayment} />)}
                </div>
            </section>

            <LandingFooter content={content.footer} onShowTerms={() => setShowTerms(true)} />
        </div>
    );
};

export default TucuRedLanding;
