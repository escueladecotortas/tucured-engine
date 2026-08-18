// Archivo: backend/services/numerology/VibeDictionary.js
// Diccionario de Resonancia Vibracional y Paletas HSL/Hex

class VibeDictionary {
    static getBasePalettes() {
        return {
            1: { primaryColor: '#1e293b', secondaryColor: '#475569', accentColor: '#ef4444', vibe: '1 - Liderazgo & Pionero', description: 'Energía directa, audaz y pionera' },
            2: { primaryColor: '#0f172a', secondaryColor: '#334155', accentColor: '#38bdf8', vibe: '2 - Conexión & Armonía', description: 'Empatía, balance y relaciones humanas' },
            3: { primaryColor: '#18181b', secondaryColor: '#3f3f46', accentColor: '#f59e0b', vibe: '3 - Creatividad & Expresión', description: 'Optimismo, dinamismo y comunicación vibrante' },
            4: { primaryColor: '#172554', secondaryColor: '#1e3a8a', accentColor: '#10b981', vibe: '4 - Estabilidad & Estructura', description: 'Solidez, método, disciplina y confianza' },
            5: { primaryColor: '#09090b', secondaryColor: '#27272a', accentColor: '#8b5cf6', vibe: '5 - Libertad & Transformación', description: 'Aventura, versatilidad y evolución constante' },
            6: { primaryColor: '#1c1917', secondaryColor: '#44403c', accentColor: '#ec4899', vibe: '6 - Cuidado & Excelencia', description: 'Belleza, nutrición, familia y servicio premium' },
            7: { primaryColor: '#022c22', secondaryColor: '#064e3b', accentColor: '#14b8a6', vibe: '7 - Sabiduría & Mística', description: 'Análisis, profundidad intelectual y espiritualidad' },
            8: { primaryColor: '#111827', secondaryColor: '#1f2937', accentColor: '#eab308', vibe: '8 - Poder & Abundancia', description: 'Éxito material, autoridad ejecutiva y escala' },
            9: { primaryColor: '#1e1b4b', secondaryColor: '#312e81', accentColor: '#06b6d4', vibe: '9 - Humanitarismo & Trascendencia', description: 'Visión global, altruismo y arte noble' },
            11: { primaryColor: '#050510', secondaryColor: '#1e1b4b', accentColor: '#6366f1', vibe: '11 - Iluminación & Vanguardia', description: 'Maestría intuitiva y resonancia de alta frecuencia' },
            22: { primaryColor: '#0a0a0a', secondaryColor: '#1a1a1a', accentColor: '#C5A059', vibe: '22 - Arquitecto Maestro', description: 'Construcción a gran escala y materialización suprema' },
            33: { primaryColor: '#000000', secondaryColor: '#171717', accentColor: '#fb7185', vibe: '33 - Amor Universal & Guía', description: 'Protección absoluta y devoción a la comunidad' }
        };
    }

    static getCategoryOverrides() {
        return {
            'gastronomia': { vibeDescription: 'Sabor, hospitalidad y calidez' },
            'estetica': { vibeDescription: 'Elegancia, bienestar y cuidado personal' },
            'moda': { vibeDescription: 'Estilo vanguardista y presencia visual' },
            'tecnologia': { vibeDescription: 'Precisión, velocidad y arquitectura digital' },
            'salud': { vibeDescription: 'Vitalidad, empatía y rigor clínico' }
        };
    }
}

module.exports = VibeDictionary;
