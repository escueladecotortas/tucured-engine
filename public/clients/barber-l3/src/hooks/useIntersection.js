import { useState, useEffect, useRef } from 'react';

/**
 * HOOK: USE INTERSECTION (H-015-FIX)
 * Soporta lógica no binaria y detección de umbral dinámico para Mobile.
 */
export default function useIntersection(options = {}) {
  const [isIntersecting, setIntersecting] = useState(false);
  const [intersectionRatio, setIntersectionRatio] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    // Detección de Mobile para umbral adaptativo (H-015-FIX)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const threshold = isMobile ? (options.mobileThreshold || 0.6) : (options.threshold || 0.1);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersectionRatio(entry.intersectionRatio);
        
        if (entry.isIntersecting) {
          setIntersecting(true);
          // Si es de un solo uso, desconectamos el observer
          if (options.once !== false && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (options.once === false) {
          setIntersecting(false);
        }
      },
      { ...options, threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options.threshold, options.mobileThreshold, options.once]);

  return [ref, isIntersecting, intersectionRatio];
}
