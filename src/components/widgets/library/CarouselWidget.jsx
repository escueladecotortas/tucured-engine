import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CarouselWidget({ images = [], autoPlay = true, interval = 3000 }) {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent((curr) => (curr + 1) % images.length);
    const prev = () => setCurrent((curr) => (curr === 0 ? images.length - 1 : curr - 1));

    if (!images || images.length === 0) return <div className="p-10 text-gray-500 bg-gray-100 rounded-lg text-center">No Images</div>;

    return (
        <div className="relative w-full aspect-video overflow-hidden rounded-xl group">
            <div
                className="flex transition-transform duration-500 ease-out h-full"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {images.map((src, i) => (
                    <img key={i} src={src} className="w-full h-full object-cover flex-shrink-0" alt={`Slide ${i}`} />
                ))}
            </div>

            <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-colors ${current === i ? 'bg-white' : 'bg-white/50'}`} />
                ))}
            </div>
        </div>
    );
}

// CONFIG_SCHEMA:
// {
//   "images": "array<url>",
//   "autoPlay": "boolean",
//   "interval": "number (ms)"
// }
