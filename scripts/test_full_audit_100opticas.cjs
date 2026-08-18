// Archivo: scripts/test_full_audit_100opticas.cjs
// Certificación Integral E2E para 100 OPTICAS (TASK-045) — Ley de 200 líneas

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

let passed = 0;
let failed = 0;

const ok = (msg) => { console.log(`   ✅ ${msg}`); passed++; };
const err = (msg) => { console.error(`   ❌ ${msg}`); failed++; };

function runFullAudit100Opticas() {
  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log('🔬 ARGUS QA — TASK-045: AUDITORÍA E2E 100 ÓPTICAS & BLINDAJE 3 GATES');
  console.log('══════════════════════════════════════════════════════════════════\n');

  const slug = '100-opticas';
  const htmlPath = path.resolve(process.cwd(), `nexus_archives/tucu-red/clients/${slug}/index.html`);

  if (!fs.existsSync(htmlPath)) {
    console.error(`❌ Archivo HTML no encontrado: ${htmlPath}`);
    process.exit(1);
  }

  const html = fs.readFileSync(htmlPath, 'utf8');
  const $ = cheerio.load(html);

  // ── CHECK 1: Cero Placeholders de Texto Huérfanos [...] ─────────────────
  console.log('🔍 [CHECK 1] Inspección de Placeholders de Texto Huérfanos...');
  const placeholderRegex = /\[(?:nexus-)?(?:gallery_v[12]_[\w]+|contact_v2_action_dock|social_v2_marquee_reviews|trust_v2_live_badge|booking_v1_turnero|footer_v1_map|slot-[\w]+)\]/gi;
  const matches = html.match(placeholderRegex) || [];

  if (matches.length === 0) {
    ok('Cero texto plano huérfano [...] detectado en el DOM de 100 Ópticas');
  } else {
    err(`Se encontraron ${matches.length} placeholders sin inyectar: ${matches.join(', ')}`);
  }

  // ── CHECK 2: Contextualización del Turnero (Cero Spanglish Gastronómico) 
  console.log('\n🔍 [CHECK 2] Verificación Semántica del Turnero Clínico...');
  const turneroHtml = $('#booking').html() || html;
  const hasGastronomica = /gastron[oó]mica|mesa/i.test(turneroHtml);
  const hasClinicalTokens = /Solicit[aá] tu Consulta|Control y Graduaci[oó]n|Armazones y Cristales|atenci[oó]n personalizada/i.test(turneroHtml);

  if (!hasGastronomica && hasClinicalTokens) {
    ok('Turnero 100% clínico: Contiene "Solicitá tu Consulta", opciones de graduación y CERO referencias a "mesa/gastronomía"');
  } else {
    err(`Fallo en turnero clínico (ContieneGastronómica: ${hasGastronomica}, ContieneTokensClínicos: ${hasClinicalTokens})`);
  }

  // ── CHECK 3: Sanitización del Navbar (Cero Enlaces Huérfanos) ───────────
  console.log('\n🔍 [CHECK 3] Sanitización del Navbar...');
  const nav = $('nav');
  const orphanLinks = nav.find('a[href^="#menu"], a[href^="#reservas"], a[href^="#galeria"], a[href^="#productos"], a[href^="#servicios"]');
  const whatsappCta = nav.find('a[href*="wa.me"], a[href*="whatsapp"]');

  if (orphanLinks.length === 0 && whatsappCta.length > 0) {
    ok(`Navbar limpio: 0 enlaces huérfanos y Botón CTA WhatsApp presente ("${whatsappCta.text().trim()}")`);
  } else {
    err(`Fallo en navbar (EnlacesHuérfanos: ${orphanLinks.length}, CTAWhatsApp: ${whatsappCta.length})`);
  }

  // ── CHECK 4: Blindaje de Gate 2 y Gate 3 en CloudDeployOrchestrator ────
  console.log('\n🔍 [CHECK 4] Verificación de Blindaje de Gate 3 (Cero Auto-Deploy)...');
  const orchestratorCode = fs.readFileSync(path.resolve(process.cwd(), 'backend/services/CloudDeployOrchestrator.js'), 'utf8');
  const hasDirectDeployInPipeline = orchestratorCode.includes('executeCloudPipeline') && orchestratorCode.includes('NetlifyDeployService.deployToNetlify(') && orchestratorCode.indexOf('NetlifyDeployService.deployToNetlify(') < orchestratorCode.indexOf('deployToNetlifyCloud');

  if (!hasDirectDeployInPipeline) {
    ok('Gate 2 blindado: executeCloudPipeline compila localmente y NO dispara auto-deploy a Netlify');
  } else {
    err('Violación de Gate 3 detectada: executeCloudPipeline aún contiene invocación automática a Netlify');
  }

  // ── CHECK 5: Botón [🌐 Ver Web] en ProspectsTable.jsx ──────────────────
  console.log('\n🔍 [CHECK 5] Presencia del Botón [🌐 Ver Web] en Tactical Actions...');
  const tableCode = fs.readFileSync(path.resolve(process.cwd(), 'src/components/database/ProspectsTable.jsx'), 'utf8');
  const hasWebButton = tableCode.includes('Ver Web') && tableCode.includes('<Globe');

  if (hasWebButton) {
    ok('Botón [🌐 Ver Web / Preview Local] presente y activo en la botonera de Tactical Actions');
  } else {
    err('Botón [🌐 Ver Web] no encontrado en ProspectsTable.jsx');
  }

  // ── RESUMEN FINAL ─────────────────────────────────────────────────────
  const total = passed + failed;
  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log(`📊 RESULTADO: ${passed}/${total} checks pasados`);
  if (failed === 0) {
    console.log('🏆 TASK-045 CERTIFIED — Auditoría E2E 100 Ópticas y Blindaje 3 Gates APROBADO.');
  } else {
    console.log(`⚠️ ${failed} check(s) fallados.`);
  }
  console.log('══════════════════════════════════════════════════════════════════\n');

  process.exit(failed === 0 ? 0 : 1);
}

runFullAudit100Opticas();
