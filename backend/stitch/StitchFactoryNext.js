/**
 * NEXUS STITCH ENGINE v3.0 (GENESIS)
 * Motor de Orquestación Atómica para Next.js 15.
 * PERFORMANCE EXPERT EDITION
 */
const fs = require('fs');
const path = require('path');

class StitchFactoryNext {
    constructor() {
        this.basePath = path.join(__dirname, '../../tucu-red/web/app/clients');
        console.log('⚡ [Stitch v3.0] Motor Genesis en modo Performance Expert.');
    }

    generateEntityCell(entitySlug, dna) {
        if (!entitySlug || !dna) throw new Error('Slug y ADN requeridos.');
        const cellPath = path.join(this.basePath, entitySlug);
        if (!fs.existsSync(cellPath)) {
            fs.mkdirSync(cellPath, { recursive: true });
        }
        
        const pageContent = this.constructPageContent(dna);
        fs.writeFileSync(path.join(cellPath, 'page.tsx'), pageContent);
        return path.join(cellPath, 'page.tsx');
    }

    constructPageContent(dna) {
        const title = this.sanitizeString(dna.meta?.title || 'Entidad');
        const vibe = dna.numerology?.vibe || '1';
        const atmosphere = this.getAtmosphereConfig(vibe);

        // REGLA DE ORO: El Footer y el Mapa se mueven ARRIBA del botón o se eliminan del final.
        // Se inyecta lógica de Performance: Server Components y carga optimizada.
        return `
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { HeroV5_Video } from '@/components/stitch/heroes/HeroV5_Video';

// ⚡ PERFORMANCE: Carga diferida de componentes pesados
const GridV5_Products = dynamic(() => import('@/components/stitch/grids/GridV5_Products'), {
  loading: () => <div className="h-96 animate-pulse bg-white/5 rounded-xl my-12" />
});
const FooterV1_Map = dynamic(() => import('@/components/stitch/footers/FooterV1_Map'), {
  loading: () => <div className="h-64 animate-pulse bg-neutral-900" />
});

export default function Page() {
  return (
    <main className={\`min-h-screen bg-[var(--background)] \${"${atmosphere.className}"}\`}>
      <div className={\`fixed inset-0 pointer-events-none z-0 \${"${atmosphere.textureClass}"}\`} />
      
      <div className="relative z-10 flex flex-col gap-0">
        
        {/* HERO: Prioridad de carga inmediata (LCP) */}
        <HeroV5_Video title="${title}" vibe="${vibe}" />
        
        {/* CONTENIDO DIFERIDO */}
        <div className="flex flex-col gap-12">
            <Suspense fallback={<div className="h-96 animate-pulse bg-white/5" />}>
            <GridV5_Products items={${JSON.stringify(dna.products || [])}} vibe="${vibe}" />
            <FooterV1_Map address="${this.sanitizeString(dna.contact?.address)}" vibe="${vibe}" />
            </Suspense>
        </div>

        {/* LEY DEL BOTÓN: El cierre de la página es el botón de contacto de la agencia */}
        <section className="py-24 text-center bg-black/50 backdrop-blur-lg border-t border-white/10 mt-12">
            <div className="container mx-auto px-4">
                <h3 className="text-2xl font-bold text-white mb-8">¿Listo para tu propia Boutique Digital?</h3>
                <a 
                    href="https://wa.me/${dna.contact?.phone}" 
                    className="inline-block py-4 px-12 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-black text-xl tracking-wider hover:scale-105 transition-transform shadow-xl shadow-yellow-500/20"
                >
                    CONTACTAR AHORA
                </a>
            </div>
        </section>
      </div>
    </main>
  );
}
`;
    }

    getAtmosphereConfig(vibe) {
        const map = {
            '1': { className: 'theme-power', textureClass: 'bg-noise-subtle' },
            '8': { className: 'theme-power', textureClass: 'bg-noise-subtle' },
            '2': { className: 'theme-bond', textureClass: 'bg-mesh-soft' },
            '6': { className: 'theme-bond', textureClass: 'bg-mesh-soft' },
            '9': { className: 'theme-luxury', textureClass: 'bg-glass-deep' },
            '7': { className: 'theme-luxury', textureClass: 'bg-glass-deep' },
            '3': { className: 'theme-disrupt', textureClass: 'bg-glitch-pattern' },
            '5': { className: 'theme-disrupt', textureClass: 'bg-glitch-pattern' },
            '4': { className: 'theme-structure', textureClass: 'bg-grid-slate' },
        };
        return map[vibe] || map['1'];
    }

    sanitizeString(str) {
        return str ? str.replace(/"/g, '\\"').replace(/`/g, '\\`') : '';
    }
}

module.exports = StitchFactoryNext;
