'use client';

import React from 'react';
import * as Stitch from '@/components/stitch';

/**
 * ENGINE: STITCH FACTORY V2
 * Objetivo: Interpretar instrucciones de los Agentes (JSON Strings) y renderizar el componente React correspondiente.
 * 
 * Uso: <StitchFactory component="HeroV5_Form" data={props} />
 */

interface StitchFactoryProps {
    component: string;
    data?: any;
    vibe?: string;
}

export const StitchFactory = ({ component, data = {}, vibe = '1' }: StitchFactoryProps) => {
    
    // 1. Normalizar nombre del componente (Manejo de errores simple)
    console.log(`[StitchFactory] Rendering ${component}`, { data, vibe });
    const Component = (Stitch as any)[component];

    // 2. Si no existe, devolver null o un fallback discreto (Soft Fail)
    if (!Component) {
        console.warn(`[StitchFactory] Weapon not found: ${component}`);
        return null;
        // Opcional: <div className="p-4 bg-red-100 text-red-500">Widget {component} no encontrado</div>
    }

    // 3. Inyectar Vibe si el componente lo acepta
    const finalProps = { ...data, vibe };

    // 4. Renderizar
    return <Component {...finalProps} />;
};

/**
 * CATÁLOGO DE REFERENCIA PARA AGENTES (Do not remove)
 * ---------------------------------------------------
 * Heroes: HeroV2_Split, HeroV3_Minimal, HeroV4_Slider, HeroV5_Form, HeroV5_Video
 * Grids: GridV1_Bento, GridV2_Cards, GridV3_ZigZag, GridV4_List, GridV6_Pricing
 * Social: GalleryV1_Reel, SocialV2_InstaFeed, SocialV3_TikTok, SocialV4_Icons, SocialV5_Pinterest, TrustV1_Google, TrustV2_Reviews
 * Sales: CartV1_WhatsApp, BarV1_Countdown, CalcV1_Simple, BookingV1, PowerUpV2_Notification, PowerUpV3_Timer
 * Contact: ContactV2_MultiChat, ContactV3_Messenger, FormV2_Builder, FormV3_Survey, ContentV1_FAQ
 * Tools: ToolV1_Calendar, ToolV2_Audio, ToolV3_VideoGallery, ToolV4_PDFViewer, ToolV5_AgeGate, ToolV6_QRCode, ToolV7_FileDownload, ToolV8_BeforeAfter
 * Enterprise: ProV1_DataGrid, ProV2_Kanban, ProV3_Analytics
 */
