'use client';

import React from 'react';
import { Play } from 'lucide-react';

/**
 * WIDGET: TikTok Feed
 * Enfoque: Contenido Viral Vertical.
 */

interface TikTokVideo {
    id: string;
    thumbnail: string;
    views: string;
    link: string;
}

interface TikTokFeedProps {
    username?: string;
    videos?: TikTokVideo[];
}

export const SocialV3_TikTok = ({
    username = "@tucured",
    videos = [
        { id: '1', thumbnail: "https://source.unsplash.com/random/300x500/?dance", views: '1.2M', link: '#' },
        { id: '2', thumbnail: "https://source.unsplash.com/random/300x500/?funny", views: '850K', link: '#' },
        { id: '3', thumbnail: "https://source.unsplash.com/random/300x500/?trend", views: '2.5M', link: '#' },
        { id: '4', thumbnail: "https://source.unsplash.com/random/300x500/?viral", views: '500K', link: '#' }
    ]
}: TikTokFeedProps) => {

    return (
        <section className="py-12 bg-black text-white">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-black border border-gray-800 rounded-full flex items-center justify-center">
                         <span className="text-2xl">🎵</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-xl">TikTok Feed</h3>
                        <p className="text-gray-400 text-sm">{username}</p>
                    </div>
                    <a href={`https://tiktok.com/${username}`} target="_blank" className="ml-auto px-6 py-2 bg-[#FE2C55] text-white font-bold rounded-full hover:brightness-110 transition-all">
                        Seguir
                    </a>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar">
                    {videos.map((vid) => (
                        <a 
                            key={vid.id} 
                            href={vid.link} 
                            target="_blank"
                            className="snap-center shrink-0 w-[200px] h-[350px] relative rounded-xl overflow-hidden group border border-gray-800"
                        >
                            <img src={vid.thumbnail} alt="TikTok" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                                <div className="flex items-center gap-2">
                                    <Play size={14} fill="white" />
                                    <span className="text-sm font-bold">{vid.views}</span>
                                </div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                <Play size={48} fill="white" />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};
