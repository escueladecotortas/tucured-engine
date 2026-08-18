// Archivo: scripts/test_menu_endpoints.js
// Suite de Certificación Integral de los 18 Ítems del Menú Lateral y Endpoints Críticos

import http from 'http';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { app } = require('../backend/server');

const TEST_PORT = 5055;

async function runTestSuite() {
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('🩺 INICIANDO CERTIFICACIÓN DE ENDPOINTS DEL MENÚ LATERAL');
    console.log('════════════════════════════════════════════════════════════════════\n');

    const testServer = http.createServer(app);
    await new Promise((resolve) => testServer.listen(TEST_PORT, '127.0.0.1', resolve));

    let passed = 0;
    let failed = 0;

    const request = (path, method = 'GET', body = null) => {
        return new Promise((resolve, reject) => {
            const req = http.request({
                hostname: '127.0.0.1',
                port: TEST_PORT,
                path,
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...(body ? { 'Content-Length': Buffer.byteLength(JSON.stringify(body)) } : {})
                }
            }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
            });
            req.on('error', reject);
            if (body) req.write(JSON.stringify(body));
            req.end();
        });
    };

    const checks = [
        {
            name: 'Panel de Control / Salud General (/api/health)',
            fn: async () => {
                const res = await request('/api/health');
                const json = JSON.parse(res.body);
                return res.status === 200 && json.status === 'HEALTHY';
            }
        },
        {
            name: 'Catálogo de 51 Servicios (/api/services)',
            fn: async () => {
                const res = await request('/api/services');
                const json = JSON.parse(res.body);
                return res.status === 200 && json.total >= 28;
            }
        },
        {
            name: 'Simulador Dry-Run (/api/dry-run)',
            fn: async () => {
                const res = await request('/api/dry-run', 'POST', { profile: 'grazia' });
                const json = JSON.parse(res.body);
                return res.status === 200 && json.deployStatus === 'DRY_RUN_READY';
            }
        },
        {
            name: 'Biblioteca SOP - Protocolos (/api/files?project=root&dir=.agent/workflows)',
            fn: async () => {
                const res = await request('/api/files?project=root&dir=.agent/workflows');
                const json = JSON.parse(res.body);
                return res.status === 200 && Array.isArray(json) && json.some(f => f.name === 'kanban.md');
            }
        },
        {
            name: 'Biblioteca SOP - Documentación (/api/files?project=root&dir=documents)',
            fn: async () => {
                const res = await request('/api/files?project=root&dir=documents');
                const json = JSON.parse(res.body);
                return res.status === 200 && Array.isArray(json);
            }
        },
        {
            name: 'Biblioteca SOP - Manuales (/api/files?project=root&dir=system_core/manuals)',
            fn: async () => {
                const res = await request('/api/files?project=root&dir=system_core/manuals');
                const json = JSON.parse(res.body);
                return res.status === 200 && Array.isArray(json);
            }
        },
        {
            name: 'Biblioteca SOP - Lectura de Archivo (/api/files/read)',
            fn: async () => {
                const res = await request('/api/files/read?project=root&path=.agent/workflows/kanban.md');
                const json = JSON.parse(res.body);
                return res.status === 200 && json.success === true && json.content.length > 0;
            }
        },
        {
            name: 'Arsenal Stitch - Catálogo de Componentes (/api/stitch/components)',
            fn: async () => {
                const res = await request('/api/stitch/components');
                const json = JSON.parse(res.body);
                return res.status === 200 && json.success === true && json.total >= 7;
            }
        },
        {
            name: 'Arsenal Stitch - Renderizado Simulado (/api/stitch/render)',
            fn: async () => {
                const res = await request('/api/stitch/render', 'POST', { componentId: 'heroes_nexus-hero_html' });
                const json = JSON.parse(res.body);
                return res.status === 200 && json.success === true;
            }
        },
        {
            name: 'Biónica Visual - Captura y Auditoría Heurística (/api/vision/capture)',
            fn: async () => {
                const res = await request('/api/vision/capture', 'POST', { url: 'https://tucured.ar', projectId: 'tucu-red' });
                const json = JSON.parse(res.body);
                return res.status === 200 && json.success === true && typeof json.audit.score === 'number' && json.audit.score > 0;
            }
        },
        {
            name: 'Terminal Core - Ejecución de Comandos (/api/terminal/execute)',
            fn: async () => {
                const res = await request('/api/terminal/execute', 'POST', { command: 'status', agent: 'USER' });
                const json = JSON.parse(res.body);
                return res.status === 200 && json.success === true;
            }
        },
        {
            name: 'Terminal Core - Enlace SSE Stream (/api/terminal/stream)',
            fn: async () => {
                return new Promise((resolve) => {
                    const req = http.get(`http://127.0.0.1:${TEST_PORT}/api/terminal/stream`, (res) => {
                        const isSse = res.headers['content-type']?.includes('text/event-stream');
                        res.destroy();
                        resolve(res.statusCode === 200 && isSse);
                    });
                    req.on('error', () => resolve(false));
                });
            }
        },
        {
            name: 'Fábrica Leads - Listado de Prospectos (/api/prospects)',
            fn: async () => {
                const res = await request('/api/prospects');
                const json = JSON.parse(res.body);
                return res.status === 200 && Array.isArray(json.prospects);
            }
        },
        {
            name: 'Fábrica Leads - Validación de Dirección (/api/validate-address)',
            fn: async () => {
                const res = await request('/api/validate-address', 'POST', { address: 'Av. Aconquija 1200', city: 'Yerba Buena' });
                const json = JSON.parse(res.body);
                return res.status === 200 && json.success === true;
            }
        },
        {
            name: 'Escudo - Snapshots del Proyecto (/api/shield/snapshots/tucu-red)',
            fn: async () => {
                const res = await request('/api/shield/snapshots/tucu-red');
                const json = JSON.parse(res.body);
                return res.status === 200 && json.success === true;
            }
        },
        {
            name: 'Logros - Logros de Negocio (/api/shield/achievements/tucu-red)',
            fn: async () => {
                const res = await request('/api/shield/achievements/tucu-red');
                const json = JSON.parse(res.body);
                return res.status === 200 && json.success === true;
            }
        },
        {
            name: 'Estudio Widgets - Patching HTML (/api/nexus/apply-html-patch)',
            fn: async () => {
                const res = await request('/api/nexus/apply-html-patch', 'POST', { projectId: 'tucu-red', targetPath: 'index.html', patchData: [] });
                const json = JSON.parse(res.body);
                return res.status === 200 && json.success === true;
            }
        },
        {
            name: 'Observabilidad de Tokens (/api/nexus/metrics)',
            fn: async () => {
                const res = await request('/api/nexus/metrics');
                const json = JSON.parse(res.body);
                return res.status === 200 && json.memory !== undefined;
            }
        },
        {
            name: 'S-Base - Estadísticas de Base de Datos (/api/tucu/stats)',
            fn: async () => {
                const res = await request('/api/tucu/stats');
                const json = JSON.parse(res.body);
                return res.status === 200 && json.success === true && json.database.status === 'NOMINAL';
            }
        },
        {
            name: 'Vitalis Doctor - Escaneo Clínico (/api/vitalis/scan)',
            fn: async () => {
                const res = await request('/api/vitalis/scan');
                const json = JSON.parse(res.body);
                return res.status === 200 && json.success === true && json.data.status === 'HEALTHY';
            }
        }
    ];

    for (const check of checks) {
        try {
            const ok = await check.fn();
            if (ok) {
                console.log(`✅ [PASS] ${check.name}`);
                passed++;
            } else {
                console.error(`❌ [FAIL] ${check.name}`);
                failed++;
            }
        } catch (e) {
            console.error(`❌ [ERROR] ${check.name}:`, e.message);
            failed++;
        }
    }

    testServer.close();

    console.log('\n════════════════════════════════════════════════════════════════════');
    console.log(`🎯 RESULTADO FINAL: ${passed}/${checks.length} CHECKS CERTIFICADOS (${Math.round((passed / checks.length) * 100)}%)`);
    console.log('════════════════════════════════════════════════════════════════════\n');

    process.exit(failed > 0 ? 1 : 0);
}

runTestSuite();
