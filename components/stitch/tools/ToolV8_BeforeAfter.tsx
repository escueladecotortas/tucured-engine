'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

/**
 * WIDGET: Before / After Slider
 * Enfoque: Comparación visual directa (Estética, Obras, Dentistas).
 */

interface BeforeAfterProps {
    beforeImage: string;
    afterImage: string;
    beforeLabel?: string;
    afterLabel?: string;
    width?: string;
    height?: string;
}

export const ToolV8_BeforeAfter = ({
    beforeImage = "https://source.unsplash.com/random/800x600/?old,house",
    afterImage = "https://source.unsplash.com/random/800x600/?modern,house",
    beforeLabel = "ANTES",
    afterLabel = "DESPUÉS",
    width = "100%",
    height = "500px"
}: BeforeAfterProps) => {

    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (event: React.MouseEvent | React.TouchEvent) => {
        if (!containerRef.current) return;
        
        const { left, width } = containerRef.current.getBoundingClientRect();
        const pageX = 'touches' in event ? event.touches[0].pageX : (event as React.MouseEvent).pageX;
        
        const position = ((pageX - left) / width) * 100;
        const clamped = Math.min(Math.max(position, 0), 100);
        
        setSliderPosition(clamped);
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    useEffect(() => {
        const handleEnd = () => setIsDragging(false);
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchend', handleEnd);
        return () => {
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchend', handleEnd);
        };
    }, []);

    return (
        <section className="py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div 
                    ref={containerRef}
                    className="relative w-full overflow-hidden rounded-2xl shadow-2xl cursor-col-resize select-none border-4 border-white ring-1 ring-gray-200"
                    style={{ height, touchAction: 'none' }}
                    onMouseMove={(e) => isDragging && handleMove(e)}
                    onTouchMove={(e) => handleMove(e)}
                    onMouseDown={handleMove} // Click jumps to position
                >
                    {/* After Image (Background) */}
                    <img 
                        src={afterImage} 
                        alt="After" 
                        className="absolute inset-0 w-full h-full object-cover"
                        draggable={false}
                    />
                    <span className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-xs font-bold backdrop-blur-sm z-10">
                        {afterLabel}
                    </span>

                    {/* Before Image (Clipped) */}
                    <div 
                        className="absolute inset-0 w-full h-full overflow-hidden border-r-2 border-white"
                        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                    >
                        <img 
                            src={beforeImage} 
                            alt="Before" 
                            className="absolute inset-0 w-full h-full object-cover"
                            draggable={false}
                        />
                        <span className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-xs font-bold backdrop-blur-sm">
                            {beforeLabel}
                        </span>
                    </div>

                    {/* Slider Handle */}
                    <div 
                        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 flex items-center justify-center"
                        style={{ left: `${sliderPosition}%` }}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleMouseDown}
                    >
                        <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 -ml-[1px]">
                            <ChevronsLeftRight size={20} />
                        </div>
                    </div>
                </div>
                
                <p className="text-center text-gray-400 text-sm mt-4 italic">
                    Deslizá para ver el cambio
                </p>
            </div>
        </section>
    );
};
