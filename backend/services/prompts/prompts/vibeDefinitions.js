// Archivo: backend/services/prompts/vibeDefinitions.js

/**
 * Mapa de Vibraciones NEXUS → Estética completa y Voz del Negocio
 * Basado en la Matriz Vibracional (1-9).
 * Refactorizado v5.3: Alineación MAS (Lorem/Argus) y Purga Semántica Total.
 * Prohibidos: Santuario, Mágico, Laboratorio, Sueño, Inolvidable.
 */
const VIBES = {
  1: {
    style: "Alta Costura / Autoridad",
    keywords: "Bold, Exclusive, Timeless, Architecture, Legacy",
    shapes: "Sharp edges, vertical hierarchy",
    tone: "Directiva de alto nivel. Conciso, premium, imperativo. Evitar adjetivos innecesarios. Enfoque en el legado y la solidez de la marca.",
  },
  2: {
    style: "Orgánico / Confianza",
    keywords: "Warm, Human, Inviting, Sustainable, Community",
    shapes: "Rounded corners, soft curves",
    tone: "Narrativa cercana y empática. Tono de anfitrión profesional. Enfoque en la experiencia humana, la calidez del servicio y la sostenibilidad.",
  },
  3: {
    style: "Neo-Pop / Disruptivo",
    keywords: "Playful, Vibrant, Unexpected, Kinetic, Urban",
    shapes: "Asymmetric, overlapping elements",
    tone: "Energético y provocador. Romper moldes gramaticales con intención. Dinamismo urbano, ritmo rápido y giros inesperados en el copy.",
  },
  4: {
    style: "Industrial / Brutalista",
    keywords: "Raw, Grid-heavy, Monospace, Structural, Functional",
    shapes: "Square, solid borders, exposed grids",
    tone: "Técnico y honesto. Sin adornos ni artificios. Enfoque en la funcionalidad, la procedencia de los materiales y la precisión del proceso.",
  },
  5: {
    style: "Cyber / Glitch",
    keywords: "Neon, Kinetic, Digital, Hyper-connectivity, Future-proof",
    shapes: "Sharp, angular, layered depth",
    tone: "Vanguardia digital. Lenguaje tecnológico y optimizado. Enfoque en la velocidad, la innovación constante y el pulso de la ciudad inteligente.",
  },
  6: {
    style: "Minimal / Armonía",
    keywords: "Balanced, Essential, Breathable, Quiet luxury",
    shapes: "Rounded, soft shadows, ample white space",
    tone: "Serenidad y equilibrio. Menos es más. Enfoque en la esencia del producto y la eliminación de ruidos visuales o narrativos.",
  },
  7: {
    style: "Zen Focus / Exclusividad Silenciosa",
    keywords: "Refugio de marca, Atmósfera curada, Museum-grade, Professional Precision, Serene",
    shapes: "Invisible geometry, negative space > 70%",
    tone: "Sofisticación de autor. Pocas palabras de alto impacto. Enfoque en la atmósfera curada, el silencio como lujo y la precisión técnica del servicio.",
  },
  8: {
    style: "Dark Mode / Premium Stealth",
    keywords: "Sleek, Mysterious, High-contrast, Nocturnal, Elite",
    shapes: "Sharp, dark backgrounds, minimal strokes",
    tone: "Elegancia nocturna. Misterio controlado y autoridad. Enfoque en la exclusividad de acceso y el contraste entre luz y oscuridad.",
  },
  9: {
    style: "Glassmorphism / Vanguardia Etérea",
    keywords: "Translucent, Fluid, Refugio digital, Precision, Innovation",
    shapes: "Glass panels, blur, floating elements",
    tone: "Aspiracional y fluido. Enfoque en la transparencia, la innovación etérea y el refugio de marca digital. Narrativa sobre el futuro presente.",
  },
};

module.exports = VIBES;
