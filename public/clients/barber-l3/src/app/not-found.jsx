// Archivo: src/app/not-found.jsx
// v11.90-ELEGANT — 404 Not Found fallback view for elegant router compliance
"use client";
import React from "react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#FAF9F6] text-neutral-800 p-6 font-mono text-center">
      <h1 className="text-4xl font-bold text-[#800000] mb-4">404</h1>
      <p className="text-sm uppercase tracking-widest text-neutral-500 mb-6">PÁGINA NO ENCONTRADA</p>
      <a 
        href="/"
        className="px-4 py-2 border border-[#800000] text-[#800000] hover:bg-[#800000] hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
      >
        Volver al Inicio
      </a>
    </main>
  );
}
