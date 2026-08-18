// Archivo: backend/services/VisualBionicsService.js
// Servicio Soberano de Auditoría Biónica Visual y Análisis Heurístico Real

const http = require('http');
const https = require('https');

class VisualBionicsService {
    async capture(url, projectId = 'general') {
        const startTime = Date.now();
        let targetUrl = url;
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            targetUrl = `http://${targetUrl}`;
        }

        let statusCode = 200;
        let responseTime = 50;
        let htmlContent = '';

        try {
            const client = targetUrl.startsWith('https://') ? https : http;
            await new Promise((resolve) => {
                const req = client.get(targetUrl, { timeout: 4000 }, (res) => {
                    statusCode = res.statusCode || 200;
                    res.on('data', chunk => { if (htmlContent.length < 100000) htmlContent += chunk; });
                    res.on('end', () => {
                        responseTime = Math.max(5, Date.now() - startTime);
                        resolve();
                    });
                });
                req.on('error', (err) => {
                    statusCode = 500;
                    responseTime = Math.max(10, Date.now() - startTime);
                    resolve();
                });
                req.on('timeout', () => { req.destroy(); statusCode = 408; responseTime = 4000; resolve(); });
            });
        } catch (e) {
            statusCode = 500;
        }

        // Extracción heurística profunda
        const isHttps = targetUrl.startsWith('https://');
        const titleMatch = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : '';
        const hasDesc = /<meta[^>]+name=["']description["'][^>]*>/i.test(htmlContent) || /<meta[^>]+content=["'][^"']+["'][^>]+name=["']description["']/i.test(htmlContent);
        const hasViewport = /<meta[^>]+name=["']viewport["'][^>]*>/i.test(htmlContent);
        const hasOg = /<meta[^>]+property=["']og:title["']/i.test(htmlContent) || /<meta[^>]+property=["']og:image["']/i.test(htmlContent);

        const h1Matches = htmlContent.match(/<h1\b[^>]*>/gi) || [];
        const h1Count = h1Matches.length;
        const imgMatches = htmlContent.match(/<img\b[^>]*>/gi) || [];
        const imgTags = imgMatches.length;
        const imgWithAlt = imgMatches.filter(tag => /\balt=["'][^"']*["']/i.test(tag)).length;
        const imgWithoutAlt = imgTags - imgWithAlt;
        const linksCount = (htmlContent.match(/<a\b/gi) || []).length;
        const scriptsCount = (htmlContent.match(/<script\b/gi) || []).length;
        const domNodes = Math.max(1, htmlContent.split('<').length - 1);
        const htmlSizeKb = Math.round(Buffer.byteLength(htmlContent, 'utf8') / 1024);

        // Cálculo matemático del score
        let score = 100;
        const issues = [];

        // 1. SSL
        if (!isHttps) {
            score -= 15;
            issues.push({ id: 'sec_ssl', severity: 'warning', title: 'Conexión No Cifrada (HTTP)', desc: 'El sitio no utiliza HTTPS, lo que penaliza la seguridad y SEO.' });
        } else {
            issues.push({ id: 'sec_ssl', severity: 'optimal', title: 'Cifrado SSL/TLS Activo', desc: 'Protocolo seguro HTTPS verificado.' });
        }

        // 2. Title
        if (!title) {
            score -= 15;
            issues.push({ id: 'seo_title', severity: 'critical', title: 'Etiqueta <title> Ausente', desc: 'Documento sin título para indexación en buscadores.' });
        } else if (title.length < 10 || title.length > 70) {
            score -= 5;
            issues.push({ id: 'seo_title', severity: 'warning', title: `Longitud de Title Subóptima (${title.length} chars)`, desc: `Título: "${title.slice(0, 35)}...". Recomendado: 30 a 60 chars.` });
        } else {
            issues.push({ id: 'seo_title', severity: 'optimal', title: `Título SEO Calibrado (${title.length} chars)`, desc: `"${title.slice(0, 35)}..."` });
        }

        // 3. Meta Description
        if (!hasDesc) {
            score -= 10;
            issues.push({ id: 'seo_desc', severity: 'warning', title: 'Meta Description Ausente', desc: 'Falta <meta name="description"> para el snippet de búsqueda.' });
        } else {
            issues.push({ id: 'seo_desc', severity: 'optimal', title: 'Meta Description Configurada', desc: 'Snippet descriptivo detectado correctamente.' });
        }

        // 4. Viewport
        if (!hasViewport) {
            score -= 20;
            issues.push({ id: 'seo_viewport', severity: 'critical', title: 'Meta Viewport Ausente', desc: 'El sitio no especifica viewport para pantallas móviles.' });
        } else {
            issues.push({ id: 'seo_viewport', severity: 'optimal', title: 'Viewport Móvil Responsivo', desc: 'Diseño adaptable a dispositivos certificado.' });
        }

        // 5. H1
        if (h1Count === 0) {
            score -= 10;
            issues.push({ id: 'seo_h1', severity: 'warning', title: 'Encabezado <h1> No Detectado', desc: 'Se recomienda incluir un único <h1> como título de página.' });
        } else if (h1Count > 1) {
            score -= 5;
            issues.push({ id: 'seo_h1', severity: 'warning', title: `Múltiples Encabezados <h1> (${h1Count})`, desc: 'Se detectaron varios <h1>. Se aconseja unificar en un solo título.' });
        } else {
            issues.push({ id: 'seo_h1', severity: 'optimal', title: 'Jerarquía <h1> Única y Válida', desc: 'Estructura semántica de encabezado principal correcta.' });
        }

        // 6. Accesibilidad Imágenes
        if (imgWithoutAlt > 0) {
            score -= Math.min(15, imgWithoutAlt * 3);
            issues.push({ id: 'a11y_alt', severity: 'warning', title: `Imágenes sin Atributo Alt (${imgWithoutAlt}/${imgTags})`, desc: 'Imágenes sin texto alternativo para lectores de pantalla WCAG.' });
        } else if (imgTags > 0) {
            issues.push({ id: 'a11y_alt', severity: 'optimal', title: `Accesibilidad de Imágenes (${imgTags} con Alt)`, desc: '100% de imágenes con atributo descriptivo.' });
        }

        // 7. Latencia
        if (responseTime > 800) {
            score -= 10;
            issues.push({ id: 'perf_latency', severity: 'warning', title: `Latencia TTFB Elevada (${responseTime}ms)`, desc: 'El servidor demoró más de 800ms en responder.' });
        } else {
            issues.push({ id: 'perf_latency', severity: 'optimal', title: `Latencia TTFB Excelente (${responseTime}ms)`, desc: 'Tiempo de respuesta del servidor rápido.' });
        }

        score = Math.max(15, Math.min(100, score));
        const health = score >= 90 ? 'OPTIMAL' : (score >= 70 ? 'WARNING' : 'CRITICAL');

        const metrics = {
            loadTime: responseTime,
            ttfb: responseTime,
            domNodes,
            htmlSizeKb,
            h1Count,
            imgTags,
            linksCount,
            scriptsCount,
            hasOpenGraph: hasOg,
            accessibilityScore: score,
            isHttps
        };

        const logs = [
            { type: 'info', message: `Conexión HTTP ${statusCode} establecida en ${responseTime}ms` },
            { type: 'info', message: `DOM procesado: ${domNodes} nodos | Peso HTML: ${htmlSizeKb} KB` },
            { type: 'success', message: `Auditoría Biónica completada. Score: ${score}/100 [${health}]` }
        ];

        const svgMockup = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="420" viewBox="0 0 800 420">
            <rect width="800" height="420" fill="#0b0f19"/>
            <rect x="20" y="20" width="760" height="380" rx="12" fill="#111827" stroke="#374151" stroke-width="1.5"/>
            <circle cx="45" cy="45" r="5" fill="#ef4444"/><circle cx="62" cy="45" r="5" fill="#f59e0b"/><circle cx="79" cy="45" r="5" fill="#10b981"/>
            <rect x="100" y="37" width="600" height="16" rx="6" fill="#1f2937"/>
            <text x="115" y="49" fill="#9ca3af" font-family="monospace" font-size="10">${targetUrl}</text>
            <rect x="45" y="75" width="710" height="305" rx="8" fill="#070b14" stroke="#1e293b"/>
            <text x="400" y="160" fill="#38bdf8" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="middle">NEXUS BIONIC AUDIT // ${projectId.toUpperCase()}</text>
            <text x="400" y="200" fill="${score >= 85 ? '#10b981' : '#f59e0b'}" font-family="monospace" font-size="28" font-weight="bold" text-anchor="middle">SCORE: ${score}/100</text>
            <text x="400" y="240" fill="#94a3b8" font-family="monospace" font-size="12" text-anchor="middle">ESTADO: ${health} • TTFB: ${responseTime}ms • DOM: ${domNodes} NODOS • SSL: ${isHttps ? 'SI' : 'NO'}</text>
            <text x="400" y="275" fill="#64748b" font-family="monospace" font-size="11" text-anchor="middle">${title ? `"${title.slice(0, 45)}"` : 'DOCUMENTO SIN TITLE'}</text>
        </svg>`;

        return {
            success: true,
            screenshot: `data:image/svg+xml;base64,${Buffer.from(svgMockup).toString('base64')}`,
            audit: { score, health, metrics, logs, issues, auditedUrl: targetUrl, timestamp: new Date().toISOString() }
        };
    }
}

module.exports = new VisualBionicsService();
