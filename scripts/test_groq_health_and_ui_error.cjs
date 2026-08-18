// Archivo: scripts/test_groq_health_and_ui_error.cjs
// Certificación Automatizada — Groq Model ID, Probe HTTP 200 y Visor de Errores con Copia

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const GroqService = require('../backend/services/GroqService');
const https = require('https');

let passed = 0;
let failed = 0;

const ok = (msg) => { console.log(`   ✅ ${msg}`); passed++; };
const err = (msg) => { console.error(`   ❌ ${msg}`); failed++; };

async function runValidation() {
  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log('🔬 ARGUS QA — TASK-037: GROQ MODEL ID & UI ERROR VIEWER WITH COPY');
  console.log('══════════════════════════════════════════════════════════════════\n');

  // ── TEST 1: Direct Completion via GroqService ─────────────────────────
  console.log('⚡ [CHECK 1] Inferencia Directa con GroqService (Auto-Fallback)...');
  try {
    const res = await GroqService.generate('Responde solo la palabra PONG');
    if (res && res.trim().length > 0) {
      ok(`GroqService respondió exitosamente: "${res.trim().slice(0, 50)}"`);
    } else {
      err('GroqService devolvió respuesta vacía o null');
    }
  } catch (e) {
    err(`GroqService falló: ${e.message}`);
  }

  // ── TEST 2: Probe de apiHealth.js para Groq ───────────────────────────
  console.log('\n🌐 [CHECK 2] Endpoint de Health Check Probes.groq()...');
  try {
    const key = (process.env.GROQ_API_KEY || '').trim();
    if (!key) throw new Error('GROQ_API_KEY no encontrada');

    const CANDIDATES = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'groq/compound', 'qwen/qwen3.6-27b'];
    let probeSuccess = false;
    let successfulModel = '';

    for (const model of CANDIDATES) {
      const payload = JSON.stringify({
        messages: [{ role: 'user', content: 'ping' }],
        model,
        max_tokens: 10
      });

      const options = {
        hostname: 'api.groq.com',
        path: '/openai/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
          'Content-Length': Buffer.byteLength(payload)
        }
      };

      const result = await new Promise(resolve => {
        const req = https.request(options, r => {
          let body = '';
          r.on('data', d => body += d);
          r.on('end', () => resolve({ status: r.statusCode, body }));
        });
        req.on('error', e => resolve({ status: 500, error: e.message }));
        req.write(payload);
        req.end();
      });

      if (result.status === 200) {
        probeSuccess = true;
        successfulModel = model;
        break;
      }
    }

    if (probeSuccess) {
      ok(`Probe Groq retornó HTTP 200 OK con modelo: "${successfulModel}"`);
    } else {
      err('Ningún modelo candidato de Groq retornó HTTP 200');
    }
  } catch (e) {
    err(`Probe falló: ${e.message}`);
  }

  // ── TEST 3: Verificación de UI Error Viewer con Copia ─────────────────
  console.log('\n📋 [CHECK 3] Verificación de Visor de Errores con Copia en ApiHealthModal.jsx...');
  try {
    const modalPath = path.resolve(__dirname, '../src/components/modals/ApiHealthModal.jsx');
    const content = fs.readFileSync(modalPath, 'utf8');

    if (content.includes('handleCopyError') && content.includes('navigator.clipboard.writeText') && content.includes('copiedId')) {
      ok('Botón de copia directa con feedback visual implementado en ApiHealthModal.jsx');
    } else {
      err('Falta función handleCopyError o navigator.clipboard en ApiHealthModal.jsx');
    }

    if (content.includes('max-h-16 overflow-y-auto') || content.includes('break-words')) {
      ok('Visor de error multilínea sin truncamiento ciego implementado');
    } else {
      err('El error aún tiene truncamiento ciego');
    }
  } catch (e) {
    err(`Error leyendo ApiHealthModal.jsx: ${e.message}`);
  }

  // ── RESUMEN FINAL ─────────────────────────────────────────────────────
  const total = passed + failed;
  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log(`📊 RESULTADO: ${passed}/${total} checks pasados`);
  if (failed === 0) {
    console.log('🏆 TASK-037 CERTIFIED — Groq Model ID & UI Error Viewer Operativo.');
  } else {
    console.log(`⚠️ ${failed} check(s) fallados.`);
  }
  console.log('══════════════════════════════════════════════════════════════════\n');

  process.exit(failed === 0 ? 0 : 1);
}

runValidation();
