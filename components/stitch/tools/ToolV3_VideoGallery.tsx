'use client';

import React from 'react';

export const ToolV3_VideoGallery = () => (
    <section className="py-12">
        <div className="container mx-auto px-4 text-center">
            <h3 className="font-bold text-2xl mb-8">Nuestros Videos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                    <div key={i} className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center text-white/20">
                        YouTube Placeholder
                    </div>
                ))}
            </div>
        </div>
    </section>
);
