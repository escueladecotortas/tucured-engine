// Archivo: backend/services/scraper/ProfileExtractor.js
import { AIService } from '../AIService.js';
import { InstagramExtractor } from './InstagramExtractor.js';
import { MapsExtractor } from './MapsExtractor.js';

/**
 * Servicio de Orquestación de Extracción (ProfileExtractor)
 * Encargado de despachar la extracción a los motores especializados
 * y consolidar los resultados para la Neural Factory.
 */
export class ProfileExtractor {
    constructor() {
        this.ai = new AIService();
        this.instagram = new InstagramExtractor();
        this.maps = new MapsExtractor();
    }

    /**
     * Extrae información completa de un perfil dado una URL o nombre
     */
    async extract(source) {
        console.log(`[ProfileExtractor] 🔍 Orquestando extracción para: ${source}`);
        
        try {
            if (this.isInstagram(source)) {
                return await this.instagram.extract(source);
            } else if (this.isGoogleMaps(source)) {
                return await this.maps.extract(source);
            } else {
                return await this.extractGeneric(source);
            }
        } catch (error) {
            console.error(`[ProfileExtractor] ❌ Error en orquestación: ${error.message}`);
            throw error;
        }
    }

    async extractGeneric(source) {
        console.log(`[ProfileExtractor] 🌐 Extracción genérica (AI fallback): ${source}`);
        // Lógica simplificada de extracción vía LLM/Scraping simple
        return { type: 'generic', data: 'AI Synthesized' };
    }

    isInstagram(s) { 
        return s.includes('instagram.com'); 
    }

    isGoogleMaps(s) { 
        return s.includes('google.com/maps') || s.includes('goo.gl/maps'); 
    }
}
