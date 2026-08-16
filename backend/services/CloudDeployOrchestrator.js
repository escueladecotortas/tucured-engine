// Archivo: backend/services/CloudDeployOrchestrator.js
// SERVICE: CloudDeployOrchestrator v1.0 (Cloud-Native Pipeline)
// Orquesta Stitch MCP -> Inyección en Memoria / Tmp -> Netlify -> Limpieza

const path = require('path');
const fs = require('fs');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const StitchMcpClient = require('./StitchMcpClient');
const NetlifyDeployService = require('./NetlifyDeployService');
const TerminalService = require('./TerminalService');
const StitchPipeline = require('./stitch/StitchPipeline');
const StitchRpcHandler = require('./stitch/StitchRpcHandler');
const StitchIndexer = require('./stitch/StitchIndexer');
const StitchContractValidator = require('./StitchContractValidator');
const PostDeployVerifier = require('./PostDeployVerifier');

class CloudDeployOrchestrator {
    /**
     * Ejecuta el pipeline completo Cloud-to-Cloud
     * @param {Object} prospectData - Datos del cliente desde Apify/Groq
     * @param {String} prospectId - ID o Slug limpio
     */
    static async executeCloudPipeline(prospectData, prospectId) {
        const slugify = require('../utils/slugify');
        const slug = slugify(prospectId); // Asegurar coincidencia con carpetas de la Bóveda
        const customDomain = `${slug}.tucured.ar`;
        const tmpDir = path.join(os.tmpdir(), `nexus_deploy_${uuidv4()}`);
        
        try {
            console.log(`\n[Cloud Deploy] ☁️ Iniciando Pipeline Cloud (F1) para: ${slug}`);
            TerminalService.broadcast(`☁️ Pipeline Cloud-to-Cloud iniciado para ${slug}`, 'info');
            
            // 0. Validar Token Netlify ANTES de empezar (Fail Fast)
            const netlifyToken = process.env.NETLIFY_AUTH_TOKEN;
            const tokenOk = await PostDeployVerifier.validateNetlifyToken(netlifyToken);
            if (!tokenOk) {
                throw new Error('NETLIFY_AUTH_TOKEN inválido o ausente. Verificá el .env antes de continuar.');
            }

            // 1. Preparar Entorno Temporal
            fs.mkdirSync(tmpDir, { recursive: true });
            console.log(`[Cloud Deploy] 📁 Directorio efímero creado en: ${tmpDir}`);


            // 2. Parchear temporalmente StitchPipeline para redirigir el Guardado
            // (Ideal sería inyectar el destPath vía parámetro en processHtml, pero lo wrappeamos aquí)
            const originalProcessHtml = StitchPipeline.processHtml;
            let finalHtmlContent = null;
            let finalManifest = null;

            StitchPipeline.processHtml = async function(downloadUrl, clientId, data, projectId, manifest) {
                // Ejecutamos la lógica original pero redirigimos la escritura de archivos 
                // para evitar colapsar la Bóveda Local (nexus_archives)
                const NexusInjectorService = require('./NexusInjectorService');
                const AutoHealerService = require('./AutoHealerService');
                
                await StitchIndexer.forceIndexation(downloadUrl);
                const rawHtml = await StitchRpcHandler.downloadHtml(downloadUrl);

                // --- CONTRATO DE STITCH (F1 QA — Portero de HTML) ---
                const validatedHtml = StitchContractValidator.validate(rawHtml, data);

                const finalHtml = NexusInjectorService.process(validatedHtml, data, manifest);
                
                // --- MOTOR DE AUTO SANACION (F1 QA — Cirugía Final) ---
                const healedHtml = AutoHealerService.heal(finalHtml, data);
                
                finalHtmlContent = healedHtml;
                finalManifest = manifest;
                
                // Guardar en TMP en lugar de archivo local persistente
                fs.writeFileSync(path.join(tmpDir, "index.html"), healedHtml);
                fs.writeFileSync(path.join(tmpDir, "widget-manifest.json"), JSON.stringify(manifest, null, 2));

                return { success: true, projectId, widgetManifest: manifest };
            };

            // 3. Ejecutar Stitch Generation
            const title = prospectData.name || slug;
            // Para el mega prompt, forzamos Edge Cases en prosa
            const enhancedPrompt = `
Genera un landing page para ${title}. 
REGLAS ESTRICTAS DE RESILIENCIA (EDGE CASES):
1. Trunca cualquier título excesivamente largo usando estilos elípticos.
2. Si no hay reviews, el contenedor social proof debe mantener su estructura como un Empty State elegante (sin colapsar la grilla).
3. Utiliza asimetría brutalista y radios dispares según manifiesto visual Tucu Red.
            `;
            
            console.log(`[Cloud Deploy] 🤖 Invocando Google Stitch MCP...`);
            const stitchRes = await StitchMcpClient.generate(title, enhancedPrompt, slug, prospectData);
            
            // Restaurar método original
            StitchPipeline.processHtml = originalProcessHtml;

            if (!stitchRes || !stitchRes.success) {
                throw new Error("Fallo en la generación vía Stitch.");
            }

            // 4. Desplegar a Netlify desde Temp Dir
            console.log(`[Cloud Deploy] 🚀 Subiendo AST / Render a Netlify API...`);
            TerminalService.broadcast(`🚀 Desplegando en la nube (Netlify API)...`, 'info');
            
            // --- CERO ALMACENAMIENTO LOCAL: Mover assets a tmpDir ---
            const localClientPath = path.resolve(__dirname, `../../../nexus_archives/tucu-red/clients/${prospectId}`);
            const localAssetsPath = path.join(localClientPath, 'assets');
            const tmpAssetsPath = path.join(tmpDir, 'assets');
            
            if (fs.existsSync(localAssetsPath)) {
                TerminalService.broadcast(`📦 Copiando resoluciones de imagen a espacio efímero...`, 'info');
                fs.cpSync(localAssetsPath, tmpAssetsPath, { recursive: true });
            }
            
            const deployResult = await NetlifyDeployService.deployToNetlify(tmpDir, {
                siteName: slug,
                customDomain: customDomain,
                siteId: prospectData.netlifySiteId
            });

            console.log(`[Cloud Deploy] ✅ Despliegue Exitoso: ${deployResult.url}`);
            TerminalService.broadcast(`✅ Sitio en vivo: ${deployResult.url}`, 'success');

            // 5. QA Post-Deploy (No bloqueante — se ejecuta en background)
            const siteUrlNative = deployResult.netlifyUrl || deployResult.url; 
            PostDeployVerifier.verify(siteUrlNative, prospectData).then((qaResult) => {
                if (!qaResult.passed) {
                    TerminalService.broadcast(`⚠️ QA Post-Deploy con observaciones: ${qaResult.warnings.length} warnings`, 'warning');
                }
            }).catch((e) => console.warn('[PostDeployVerifier] Error en QA asíncrono:', e.message));

            // 6. Limpieza Estratégica (DEBUG: Mantenemos tmpDir para auditoría)
            console.log(`[Cloud Deploy] 🛡️ DEBUG MODE: Keeping tmpDir at: ${tmpDir}`);
            TerminalService.broadcast(`🛡️ Directorio de auditoría reservado: ${path.basename(tmpDir)}`, 'info');

            // Solo limpiamos la Bóveda Local si se copió con éxito
            if (fs.existsSync(localClientPath)) {
                // fs.rmSync(localClientPath, { recursive: true, force: true });
                console.log(`[Cloud Deploy] 🧹 Mantenemos rastro local para validación.`);
            }
            
            console.log(`[Cloud Deploy] ✅ PIPELINE COMPLETADO EXITOSAMENTE.`);
            TerminalService.broadcast(`🧪 Auditoría F1: HTML final medido en ${finalHtmlContent?.length || 0} bytes`, 'info');
            TerminalService.emitCompletion(`¡Sitio generado y desplegado con éxito!`);

            return {
                status: 'success',
                url: deployResult.url,
                domain: customDomain,
                manifest: finalManifest,
                netlifyUrl: deployResult.netlifyUrl || deployResult.url,
                siteId: deployResult.siteId
            };

        } catch (error) {
            console.error(`[Cloud Deploy] ❌ Error Crítico:`, error);
            TerminalService.broadcast(`❌ Fallo en Pipeline Cloud: ${error.message}`, 'error');
            
            // Cleanup on error
            if (fs.existsSync(tmpDir)) {
                fs.rmSync(tmpDir, { recursive: true, force: true });
            }
            throw error;
        }
    }
}

module.exports = CloudDeployOrchestrator;
