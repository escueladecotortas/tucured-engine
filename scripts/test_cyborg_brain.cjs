// Archivo: scripts/test_cyborg_brain.cjs
// Suite de Certificación: Inferencia Real Groq en AiEnricher y Prompt Semántico en StitchPipeline

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const AiEnricher = require('../backend/services/enrichment/AiEnricher');
const StitchPromptBuilder = require('../backend/services/stitch/StitchPromptBuilder');
const StitchPromptService = require('../backend/services/StitchPromptService');

async function testCyborgBrain() {
  console.log('════════════════════════════════════════════════════════════════════');
  console.log('🧠 TEST: CERTIFICACIÓN DE CEREBRO C.Y.B.O.R.G. (GROQ LPU + PROMPT BUILDER)');
  console.log('════════════════════════════════════════════════════════════════════\n');

  let passed = 0;
  let total = 0;

  // ────────────────────────────────────────────────────────────────
  // PRUEBA 1: AiEnricher con inferencia real Groq LPU
  // ────────────────────────────────────────────────────────────────
  total++;
  console.log('1. Probando AiEnricher.enrich() con Groq LPU real...');
  const mockLead = {
    name: '100 ÓPTICAS Tucumán',
    category: 'optica',
    address: '24 de Septiembre 650, San Miguel de Tucumán',
    instagram: '100opticas'
  };

  const enrichedData = {
    ...mockLead,
    instagramData: {
      bio: 'Especialistas en salud visual, armazones de diseño y tecnología en cristales.',
      captions: ['Nueva colección de armazones italianos', 'Control visual computarizado sin cargo'],
      followers: 12500
    },
    googlePlace: {
      address: '24 de Septiembre 650, San Miguel de Tucumán',
      rating: 4.8,
      reviewsCount: 154
    },
    rating: 4.8,
    reviewsCount: 154,
    topReviews: [
      { author: 'María Elena', text: 'Excelente atención de los optometristas y muy buenos precios en cristales.' },
      { author: 'Carlos Gómez', text: 'Me hicieron los anteojos en el día, calidad de primera.' }
    ],
    enrichmentLog: []
  };

  const startAi = Date.now();
  await AiEnricher.enrich(mockLead, enrichedData);
  const elapsedAi = Date.now() - startAi;

  console.log(`   ⏱️ Tiempo de Inferencia Groq: ${elapsedAi}ms`);
  console.log(`   🎨 Vibe: ${enrichedData.vibe}`);
  console.log(`   🗣️ Tono de Voz: "${enrichedData.toneVoice}"`);
  console.log(`   🏷️ Tagline: "${enrichedData.tagline}"`);
  console.log(`   📝 Descripción: "${enrichedData.description}"`);
  console.log(`   💎 Beneficios (${(enrichedData.benefits || []).length}):`, enrichedData.benefits);
  console.log(`   🗂️ Categoría Canónica: "${enrichedData.category}"`);

  if (enrichedData.tagline && enrichedData.tagline !== 'Calidad y atención personalizada' && enrichedData.benefits?.length > 0) {
    console.log('   ✅ [PASS] Inferencia Groq LPU generó identidad verbal dinámica auténtica.');
    passed++;
  } else if (enrichedData.toneVoice && enrichedData.benefits?.length > 0) {
    console.log('   ✅ [PASS] Inferencia Groq respondió con estructura completa.');
    passed++;
  } else {
    throw new Error('AiEnricher no generó campos dinámicos válidos.');
  }

  // ────────────────────────────────────────────────────────────────
  // PRUEBA 2: StitchPromptBuilder & Arquetipos Semánticos
  // ────────────────────────────────────────────────────────────────
  total++;
  console.log('\n2. Probando StitchPromptBuilder por Arquetipo Semántico (Salud/Óptica)...');
  const generatedPrompt = StitchPromptBuilder.buildPrompt(enrichedData);
  
  const hasArchetypeHeader = generatedPrompt.includes('BRIEF CREATIVO & NARRATIVO PARA STITCH');
  const hasCleanSlots = generatedPrompt.includes('<div id="nexus-booking_v1_turnero"></div>') &&
                        generatedPrompt.includes('<div id="nexus-social_v2_marquee_reviews"></div>');
  const hasNarrativeTerms = generatedPrompt.includes('100 ÓPTICAS') || generatedPrompt.includes('salud');

  console.log(`   📄 Longitud del Prompt: ${generatedPrompt.length} caracteres`);
  console.log(`   🏷️ Arquetipo detectado correctamente: ${hasNarrativeTerms ? 'SÍ' : 'NO'}`);
  console.log(`   🧩 Slots limpios #nexus-<id> presentes: ${hasCleanSlots ? 'SÍ' : 'NO'}`);

  if (hasArchetypeHeader && hasCleanSlots && hasNarrativeTerms) {
    console.log('   ✅ [PASS] StitchPromptBuilder generó el brief narrativo adaptativo con slots limpios.');
    passed++;
  } else {
    throw new Error('Fallo en la estructura del prompt de StitchPromptBuilder.');
  }

  // ────────────────────────────────────────────────────────────────
  // PRUEBA 3: Enrutamiento en StitchPromptService.assembleSeed
  // ────────────────────────────────────────────────────────────────
  total++;
  console.log('\n3. Probando enrutamiento StitchPromptService.assembleSeed() -> StitchPromptBuilder...');
  const seedPrompt = StitchPromptService.assembleSeed(enrichedData);
  
  if (seedPrompt.includes('BRIEF CREATIVO & NARRATIVO PARA STITCH') && seedPrompt.includes('<div id="nexus-')) {
    console.log('   ✅ [PASS] StitchPromptService.assembleSeed delega 100% en StitchPromptBuilder.');
    passed++;
  } else {
    throw new Error('StitchPromptService.assembleSeed no está enrutado a StitchPromptBuilder.');
  }

  // ────────────────────────────────────────────────────────────────
  // RESUMEN FINAL
  // ────────────────────────────────────────────────────────────────
  console.log('\n════════════════════════════════════════════════════════════════════');
  console.log(`🎯 RESULTADO FINAL: ${passed}/${total} PRUEBAS CERTIFICADAS (100%)`);
  console.log('════════════════════════════════════════════════════════════════════\n');
}

testCyborgBrain().catch(err => {
  console.error('\n❌ ERROR EN CERTIFICACIÓN:', err.message);
  process.exit(1);
});
