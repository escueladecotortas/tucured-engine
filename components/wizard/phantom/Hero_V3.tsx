"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Image from "next/image";

interface HeroProps {
  data: {
    name: string;
    tagline: string;
    images: { hero: string };
  };
  onScroll: () => void;
}

export const Hero_V3 = ({ data, onScroll }: HeroProps) => {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-between bg-[#F5F5F0] overflow-hidden pt-24 pb-12 px-6">
      
      {/* BRANDING */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 text-center uppercase tracking-tighter"
      >
        <h2 className="text-[#FF2A2A] text-sm font-bold tracking-[0.2em] mb-2">TUCU RED PRESENTA</h2>
        <h1 className="text-[#1A1A1A] text-6xl md:text-9xl font-black leading-[0.85]">{data.name}</h1>
        <p className="mt-4 text-[#1A1A1A]/60 font-medium text-lg md:text-xl tracking-normal normal-case">{data.tagline}</p>
      </motion.div>

      {/* PHOTO CARD */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="relative w-full max-w-4xl aspect-video md:aspect-[21/9] mt-8 mb-auto grayscale contrast-125 hover:grayscale-0 transition-all duration-700 ease-in-out shadow-2xl"
      >
        <Image 
          src={data.images.hero} 
          alt={data.name} 
          fill 
          className="object-cover"
        />
        {/* WATERMARK */}
        <div className="absolute inset-0 border-[1px] border-white/20 m-4 pointer-events-none" />
      </motion.div>

      {/* CTA */}
      <motion.button
        onClick={onScroll}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="z-10 bg-[#FF2A2A] text-white px-8 py-4 text-sm font-bold tracking-widest uppercase flex items-center gap-2"
      >
        Ver Propuesta <ArrowDown className="w-4 h-4" />
      </motion.button>

      {/* BG GRAIN */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply" />
    </section>
  );
};
