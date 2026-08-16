import React from 'react';
import phantomData from '@/config/phantom_data.json';
import { BoutiqueHeader } from "@/components/wizard/phantom/BoutiqueHeader";
import { HeroV2_Split } from "@/components/stitch/heroes/HeroV2_Split";
import { HeroV5_Form } from "@/components/stitch/heroes/HeroV5_Form";
import { HeroV4_Slider } from "@/components/stitch/heroes/HeroV4_Slider";
import { GridV1_Bento } from "@/components/stitch/grids/GridV1_Bento";
import { GalleryV1_Reel } from "@/components/stitch/galleries/GalleryV1_Reel";
import { BookingV1_Turnero } from "@/components/stitch/booking/BookingV1_Turnero";
import { TrustV2_Reviews } from "@/components/stitch/social/TrustV2_Reviews";
import { Action_V3 } from "@/components/wizard/phantom/Action_V3";
import { BarV1_Countdown } from "@/components/stitch/powerups/BarV1_Countdown";
import { CartV1_WhatsApp } from "@/components/stitch/powerups/CartV1_WhatsApp";
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    return Object.keys(phantomData.missions).map((slug) => ({
        slug: slug,
    }));
}

export default async function DemoPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const mission = (phantomData.missions as any)[slug];

    if (!mission) {
        notFound();
    }

    const { vibration } = mission;

    return (
        <main 
            className="w-full min-h-screen selection:bg-[#FF2A2A] selection:text-white"
            style={{ backgroundColor: mission.theme.background, color: mission.theme.text }}
        >
            {/* Header Común pero adaptable */}
            <BoutiqueHeader 
                name={mission.name}
                whatsappNumber={mission.whatsapp_number}
                primaryColor={mission.theme.primary}
            />
            
            {/* ARQUITECTURA VIBRACIONAL: RENDERIZADO DIFERENCIADO */}
            
            {/* BALI BEAUTY - V7 (LUJO / MINIMALISMO) */}
            {vibration === 'V7' && (
                <>
                    <HeroV2_Split 
                        titleLine1={mission.hero.title}
                        titleLine2={mission.tagline}
                        subtitle={mission.hero.subtitle}
                        heroImage={mission.images.hero}
                        primaryColor={mission.theme.primary}
                        secondaryColor="#111111"
                        locationText={mission.location}
                    />
                    <GalleryV1_Reel 
                        title="Galería Premium"
                        images={mission.images.grid}
                    />
                    <div className="py-20 bg-white">
                        <BookingV1_Turnero 
                            title="Reserva de Experiencia"
                            description="Selecciona profesional y tratamiento."
                            whatsappNumber={mission.whatsapp_number}
                            themeColor={mission.theme.primary}
                        />
                    </div>
                </>
            )}

            {/* SMART GARAGE - V4 (BRUTALISMO TÉCNICO) */}
            {vibration === 'V4' && (
                <>
                    <HeroV5_Form 
                        title={mission.hero.title}
                        benefits={mission.hero.benefits}
                        formTitle={mission.hero.formTitle}
                        formSubtitle={mission.hero.formSubtitle}
                        backgroundImage={mission.images.hero}
                        whatsappNumber={mission.whatsapp_number}
                        vibe="4" // Estilo Brutalista
                    />
                    <GridV1_Bento 
                        title="Capacidad Técnica"
                        items={mission.grid.items.map((item: any) => ({
                            ...item,
                            vibe: "4" 
                        }))}
                        vibe="4"
                    />
                </>
            )}

            {/* GRUPO DENTI - V6 (ARMONÍA / CONFIANZA) */}
            {vibration === 'V6' && (
                <>
                    <HeroV4_Slider 
                        items={[
                            {
                                id: '1',
                                title: mission.hero.title,
                                description: mission.hero.subtitle,
                                image: mission.images.hero,
                                cta: mission.hero.formCta
                            }
                        ]}
                    />
                    <TrustV2_Reviews 
                        title="Lo que dicen nuestros pacientes"
                        primaryColor={mission.theme.primary}
                    />
                    <BookingV1_Turnero 
                        title="Primera Consulta"
                        description="Vení a conocernos. Presupuesto sin cargo."
                        whatsappNumber={mission.whatsapp_number}
                        themeColor={mission.theme.primary}
                    />
                </>
            )}

            {/* CIERRE ESTRATÉGICO */}
            <Action_V3 data={mission} />

            {/* POWER-UPS */}
            <BarV1_Countdown 
                text={`🔥 OFERTA DE LANZAMIENTO PARA ${mission.name} 🔥`}
                ctaText="ACTIVAR AHORA"
                hoursDuration={24}
                startHidden={false}
            />

            <CartV1_WhatsApp 
                whatsappNumber={mission.whatsapp_number}
                data={{
                    products: [
                        { id: '1', name: 'Pack Semilla Tucu Red', price: 75000, qty: 1, image: mission.images.grid[0] }
                    ]
                }}
            />

        </main>
    );
}
