// Archivo: frontend/src/components/cinematic/VideoLayer.jsx
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * VideoLayer - Capa de video con manejo de timeout y fin de secuencia.
 */
export function VideoLayer({ src, onEnd, skipLabel = "SKIP VIDEO", timeout = 8000 }) {
    const videoRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            console.warn(`Cinematic: Video Timeout (${src}) - Force Skip`);
            onEnd();
        }, timeout);
        return () => clearTimeout(timer);
    }, [src, onEnd, timeout]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black"
        >
            <video
                ref={videoRef}
                src={src}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
                onEnded={onEnd}
                onError={(e) => {
                    console.error("Video error", e);
                    onEnd();
                }}
            />
            <button 
                onClick={onEnd} 
                className="absolute top-12 right-8 bg-black/40 border border-white/20 px-6 py-3 rounded-full text-white font-bold text-xs uppercase tracking-[0.2em] transition-all active:scale-95 z-50 backdrop-blur-md"
            >
                {skipLabel}
            </button>
        </motion.div>
    );
}
