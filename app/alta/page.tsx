'use client';

"use client";

import { useRef } from 'react';
import phantomData from '@/config/phantom_data.json';
import { Action_V3 } from "@/components/wizard/phantom/Action_V3";
import { HeroV5_Form } from "@/components/stitch/heroes/HeroV5_Form";
import { GridV1_Bento } from "@/components/stitch/grids/GridV1_Bento";
import { BookingV1_Turnero } from "@/components/stitch/booking/BookingV1_Turnero";
import { BarV1_Countdown } from "@/components/stitch/powerups/BarV1_Countdown";
import { CartV1_WhatsApp } from "@/components/stitch/powerups/CartV1_WhatsApp";

export default function AltaPage() {
    const gridRef = useRef<HTMLDivElement>(null);

    const scrollToGrid = () => {
        gridRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <main className="w-full min-h-screen bg-[#F5F5F0] selection:bg-[#FF2A2A] selection:text-white">
            
            {/* 1. HERO V5 (Form) */}
            <HeroV5_Form 
                title={phantomData.client.hero?.title || phantomData.client.name}
                benefits={phantomData.client.hero?.benefits}
                formTitle={phantomData.client.hero?.formTitle}
                formSubtitle={phantomData.client.hero?.formSubtitle}
                formCta={phantomData.client.hero?.formCta}
                backgroundImage={phantomData.client.images.hero}
                whatsappNumber={phantomData.client.whatsapp_number}
                vibe="9" // Lujo/Gold
            />

            {/* 2. GRID V1 (Bento) */}
            <div ref={gridRef}>
                <GridV1_Bento 
                    title={phantomData.client.grid?.title}
                    items={phantomData.client.grid?.items}
                    vibe="9"
                />
            </div>

             {/* 3. BOOKING V1 (Turnero) */}
            <BookingV1_Turnero 
                title={phantomData.client.hero?.formTitle} 
                description={phantomData.client.hero?.formSubtitle}
                ctaText={phantomData.client.hero?.formCta}
                whatsappNumber={phantomData.client.whatsapp_number}
                themeColor={phantomData.client.theme.primary}
            />

            {/* 4. THE CLOSE */}
            <Action_V3 data={phantomData.client} />

             {/* 5. POWER-UPS (Floating) */}
            <BarV1_Countdown 
                text="🔥 ¡LANZAMIENTO EXCLUSIVO! PRECIO CONGELADO POR 24HS 🔥"
                ctaText="ACTIVAR AHORA"
                hoursDuration={24}
                startHidden={false}
            />

            <CartV1_WhatsApp 
                whatsappNumber={phantomData.client.whatsapp_number}
                data={{
                    products: [
                        { id: '1', name: 'Pack Semilla (Lanzamiento)', price: 75000, qty: 1, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=200' }
                    ]
                }}
            />

        </main>
    );
}
