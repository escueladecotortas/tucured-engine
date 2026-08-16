'use client';

import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';

/**
 * WIDGET: Google Reviews Trust (Sovereign Edition)
 * Enfoque: Prueba Social de alta fidelidad con estética Dark Pro.
 */

interface Review {
    author: string;
    avatar: string;
    rating: number;
    text: string;
    date: string;
}

interface TrustV1Props {
    data?: any;
    title?: string;
    rating?: number;
    totalReviews?: number;
    reviews?: Review[];
}

export const TrustV1_Google = ({
    data = {},
    title = "Opiniones de Clientes",
    rating = 4.9,
    totalReviews = 128,
    reviews = []
}: TrustV1Props) => {

    const displayReviews = data.reviews || reviews || [
        { author: "Maria G.", avatar: "https://i.pravatar.cc/100?img=5", rating: 5, text: "Excelente servicio, muy profesionales.", date: "Hace 2 días" },
        { author: "Carlos D.", avatar: "https://i.pravatar.cc/100?img=3", rating: 5, text: "Superó mis expectativas. Recomendado.", date: "Hace 1 semana" },
        { author: "Ana L.", avatar: "https://i.pravatar.cc/100?img=9", rating: 4, text: "Muy buena atención, aunque demoraron un poco.", date: "Hace 3 semanas" }
    ];

    const displayRating = data.rating || rating;
    const displayCount = data.count || totalReviews;

    return (
        <section className="py-20 bg-slate-950 relative overflow-hidden">
            {/* Atmosferas Atenea */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                
                {/* Header Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner group transition-transform hover:scale-105">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-8 h-8"/>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-black text-white text-xl tracking-tighter italic uppercase">Google Reviews</h3>
                                <ShieldCheck size={18} className="text-indigo-400" />
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-black text-2xl text-white tracking-tighter">{displayRating}</span>
                                <div className="flex text-amber-400 gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                                    ))}
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none border-l border-white/10 pl-3">
                                    Basado en {displayCount} reseñas
                                </span>
                            </div>
                        </div>
                    </div>
                    <button className="mt-6 md:mt-0 px-10 py-4 bg-white text-black font-black rounded-full text-[10px] hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest shadow-xl shadow-white/5">
                        Escribir Reseña
                    </button>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {displayReviews.map((review: any, idx: number) => (
                        <div key={idx} className="bg-slate-900/40 backdrop-blur-md p-8 rounded-4xl border border-white/5 hover:border-indigo-500/30 transition-all duration-500 group flex flex-col">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative">
                                    <img src={review.avatar} alt={review.author} className="w-12 h-12 rounded-2xl bg-slate-800 object-cover border border-white/10" />
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-slate-950 p-1">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" className="w-full h-full"/>
                                    </div>
                                </div>
                                <div>
                                    <p className="font-black text-sm text-white tracking-tight italic">{review.author}</p>
                                    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{review.date}</p>
                                </div>
                            </div>
                            <div className="flex text-amber-400 gap-0.5 mb-5">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        size={12} 
                                        fill={i < review.rating ? "currentColor" : "none"} 
                                        stroke="currentColor" 
                                        strokeWidth={i < review.rating ? 0 : 2} 
                                    />
                                ))}
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed font-medium italic">"{review.text}"</p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};
