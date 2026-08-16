
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { HeroV5_Video } from '@/components/stitch/heroes/HeroV5_Video';

// ⚡ PERFORMANCE: Carga diferida de componentes pesados
const GridV5_Products = dynamic(() => import('@/components/stitch/grids/GridV5_Products').then(mod => mod.GridV5_Products), {
  loading: () => <div className="h-96 animate-pulse bg-white/5 rounded-xl my-12" />
});
const FooterV1_Map = dynamic(() => import('@/components/stitch/footers/FooterV1_Map').then(mod => mod.FooterV1_Map), {
  loading: () => <div className="h-96 animate-pulse bg-white/5 rounded-xl my-12" />
});

export default function Page() {
  return (
    <main className={`min-h-screen bg-[var(--background)] ${"theme-luxury"}`}>
      <div className={`fixed inset-0 pointer-events-none z-0 ${"bg-glass-deep"}`} />
      
      <div className="relative z-10 flex flex-col gap-0">
        
        {/* HERO: Prioridad de carga inmediata (LCP) */}
        <HeroV5_Video title="Imperio Digital" vibe="9" videoUrl="" />
        
        {/* CONTENIDO DIFERIDO */}
        <div className="flex flex-col gap-12">
            <Suspense fallback={<div className="h-96 animate-pulse bg-white/5" />}>
            <GridV5_Products items={[{"name":"Producto Alpha","price":"25000","description":"Calidad superior."},{"name":"Producto Beta","price":"18500","description":"Versatilidad pura."},{"name":"Servicio Gamma","price":"45000","description":"Consultoría integral."},{"name":"Pack Delta","price":"12000","description":"Edición limitada."}] as any} vibe="9" />
            <FooterV1_Map address="San Martín 600, Tucumán" vibe="9" />
            </Suspense>
        </div>

        {/* LEY DEL BOTÓN: El cierre de la página es el botón de contacto de la agencia */}
        <section className="py-24 text-center bg-black/50 backdrop-blur-lg border-t border-white/10 mt-12">
            <div className="container mx-auto px-4">
                <h3 className="text-2xl font-bold text-white mb-8">¿Listo para tu propia Boutique Digital?</h3>
                <a 
                    href="https://wa.me/+54 9 381 555-5555" 
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
