/**
 * STITCH PROMPT ASSEMBLER v1.0
 * 
 * Este script implementa la lógica de "Estrategia de Prompt Unificado" definida en
 * documents/STITCH_PROMPT_STRATEGY.md.
 * 
 * USO:
 * node backend/scripts/assemble_stitch_prompt.js [slug]
 */

const fs = require('fs');
const path = require('path');

// --- DATOS MOCK DE PRUEBA (Para "Nickly Petshop" si no hay argumento) ---
const MOCK_DATA = {
    slug: 'nickly-petshop',
    businessName: 'Nickly Petshop',
    category: 'Pet Shop',
    tier: 'Commercial', // Commercial, Luxury, Professional
    goal: 'Generate WhatsApp Leads', // WhatsApp Leads, Online Sales
    audience: 'Families / Local', // Families, Gen Z, Corporate
    
    // Extracted Data (Instagram/Maps)
    colors: {
        primary: '#FF6B35',   // Naranja
        secondary: '#FFF0E5', // Crema
        accent: '#2EC4B6'     // Turquesa
    },
    vibe: {
        number: 2, // Vibe 2: Warm, Organic, Trustworthy
        keywords: ['Warm', 'Organic', 'Trustworthy', 'Modern']
    },
    usp: 'Alimentos balanceados y accesorios para tu compañero de cuatro patas.',
    contact: {
        phone: '5493816202789',
        city: 'Tucumán'
    },
    content: {
        heroTitle: 'Tu tienda de mascotas favorita',
        ctaText: 'Visita nuestra tienda',
        services: ['Alimentos', 'Accesorios', 'Juguetes']
    }
};

// --- LOGIC: ATENEA & LOREM ---

function getRoleDefinition(industry) {
    const map = {
        'Pet Shop': 'Conversion Rate Expert',
        'Jewelry': 'High-End Boutique Designer',
        'Lawyer': 'Trustworthy Service Architect',
        'Factory': 'Industrial UI Specialist'
    };
    return map[industry] || 'Professional Landing Page Designer';
}

function getAestheticDirection(vibeNumber) {
    const map = {
        1: 'High-Fashion, High Contrast, Sharp Edges, Metallic accents.',
        8: 'High-Fashion, High Contrast, Sharp Edges, Metallic accents.',
        2: 'Organic, Soft curves (Rounded-2xl), Analogous harmony, Warm lighting.',
        6: 'Organic, Soft curves (Rounded-2xl), Analogous harmony, Warm lighting.',
        3: 'Neo-Pop, Glitch effects, Asymmetric layouts, Acid accents.',
        5: 'Neo-Pop, Glitch effects, Asymmetric layouts, Acid accents.',
        4: 'Brutalist, Visible grids, Monospace fonts, Solid borders.',
        7: 'Minimalist Zen, Glassmorphism, Maximum negative space, Serif fonts.',
        9: 'Minimalist Zen, Glassmorphism, Maximum negative space, Serif fonts.'
    };
    return map[vibeNumber] || 'Clean and Professional';
}

function getToneVoice(vibeNumber) {
    const map = {
        1: 'Imperative, Brief, Hierarchical.',
        8: 'Imperative, Brief, Hierarchical.',
        2: 'Empathetic, Narrative, Warm.',
        6: 'Empathetic, Narrative, Warm.',
        3: 'Provocative, Fast-paced, Slang allowed.',
        4: 'Technical, Precise, Data-driven.',
        7: 'Silent, Exclusive, Ethereal.',
        9: 'Silent, Exclusive, Ethereal.'
    };
    return map[vibeNumber] || 'Professional and Clear';
}

// --- MAIN ASSEMBLER ---

function assemblePrompt(data) {
    const role = getRoleDefinition(data.category);
    const aesthetic = getAestheticDirection(data.vibe.number);
    const tone = getToneVoice(data.vibe.number);

    return `
[ROLE_DEFINITION]: You are a ${role} designing for '${data.businessName}' (${data.slug}).
[CONTEXT]: Category: ${data.category} (${data.tier}). Target Audience: ${data.audience}. Goal: ${data.goal}.
[USP]: ${data.usp}

[COLOR_ENGINEERING]:
1. Seed Color: Extracted from Industry/Brand.
2. Palette: Primary ${data.colors.primary}, Secondary ${data.colors.secondary}, Accent ${data.colors.accent}.
3. Extracted Constraint: These colors are MANDATORY based on brand identity.

[AESTHETIC_DIRECTION]:
- Style: ${aesthetic}
- Vibe keywords: ${data.vibe.keywords.join(', ')}.
- Shapes: ${data.vibe.number === 2 ? 'Rounded (Organic)' : 'Sharp'}.

[CONTENT_STRATEGY]:
- Tone: ${tone}
- Key Message: "${data.content.heroTitle}"
- CTA: "${data.content.ctaText}"
- Structure:
  1. Hero Section: Split or Centered with high-quality imagery.
  2. Features Grid: 3-column layout for ${data.content.services.join(', ')}.
  3. Social Proof: Testimonials with avatars.
  4. Footer: Contact info (Phone: ${data.contact.phone}, City: ${data.contact.city}).

[CONSTRAINTS]:
- Do NOT use generic text like "Lorem Ipsum".
- Do NOT deviate from the provided hex palette.
- Output MUST be responsive HTML with Tailwind CSS classes.
`;
}

// --- EXECUTION ---

const prompt = assemblePrompt(MOCK_DATA);

console.log('--- STITCH MASTER PROMPT ---');
console.log(prompt);
console.log('----------------------------');
console.log('\n✅ Prompt Assembled. Copy the text above to use in Stitch Console or MCP.');
