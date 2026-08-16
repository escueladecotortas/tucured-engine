'use client';

import React from 'react';
import { Instagram, Heart } from 'lucide-react';

/**
 * WIDGET: Instagram Feed
 * Enfoque: Visual Engagement, "Sitio Vivo".
 */

interface InstaPost {
    id: string;
    image: string;
    likes: number;
    link: string;
}

interface InstaFeedProps {
    username?: string;
    posts?: InstaPost[];
}

export const SocialV2_InstaFeed = ({
    username = "@tucured",
    posts = [
        { id: '1', image: "https://source.unsplash.com/random/400x400/?fashion", likes: 120, link: '#' },
        { id: '2', image: "https://source.unsplash.com/random/400x400/?style", likes: 85, link: '#' },
        { id: '3', image: "https://source.unsplash.com/random/400x400/?model", likes: 230, link: '#' },
        { id: '4', image: "https://source.unsplash.com/random/400x400/?makeup", likes: 95, link: '#' }
    ]
}: InstaFeedProps) => {

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
                
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2 text-xl font-bold bg-gradient-to-tr from-yellow-400 to-purple-600 bg-clip-text text-transparent">
                        <Instagram className="text-purple-600" />
                        <span>Síguenos en Instagram</span>
                    </div>
                    <a href={`https://instagram.com/${username.replace('@','')}`} target="_blank" className="px-4 py-2 bg-gray-100 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-200 transition-colors">
                        {username}
                    </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {posts.map((post) => (
                        <a 
                            key={post.id} 
                            href={post.link} 
                            target="_blank"
                            className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 block"
                        >
                            <img src={post.image} alt="Insta Post" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="flex items-center gap-2 text-white font-bold">
                                    <Heart fill="white" size={20} />
                                    <span>{post.likes}</span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

            </div>
        </section>
    );
};
