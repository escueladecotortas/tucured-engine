// Archivo: backend/services/NetlifyDeployService.js
// SERVICE: NetlifyDeployService v4.1 (SOP-DEPLOY-001 - Overwrite Priority)
// Maneja deployment automático de sitios a Netlify con persistencia en Firestore.

const fs = require('fs');
const path = require('path');
const { db } = require('../firebase-admin'); // SSOT Database
const ArgusGateService = require('./ArgusGateService');
const NetlifyApiClient = require('./deploy/NetlifyApiClient');
const DeployProcessHandler = require('./deploy/DeployProcessHandler');

class NetlifyDeployService {
  /**
   * Deploy un sitio a Netlify.
   * Modificado para forzar sobrescritura mediante búsqueda en Firestore y persistir nuevas creaciones.
   */
  static async deployToNetlify(sitePath, config = {}) {
    const { siteName, siteId: configSiteId, customDomain } = config;
    const authToken = process.env.NETLIFY_AUTH_TOKEN;
    if (!authToken) throw new Error('NETLIFY_AUTH_TOKEN not found');

    // 🛡️ ARGUS GATE: Auditoría Pre-Vuelo
    const mainFile = fs.existsSync(path.join(sitePath, 'page.tsx')) 
      ? path.join(sitePath, 'page.tsx') : path.join(sitePath, 'index.html');
    if (fs.existsSync(mainFile)) await ArgusGateService.auditFile(mainFile);

    if (config.dryRun) return { url: `https://${siteName}.netlify.app (DRY)`, deployId: 'dry_run', status: 'success' };

    let targetSiteId = configSiteId;

    // 🔍 RECUPERACIÓN SOBERANA (SOP-DEPLOY-001)
    if (!targetSiteId && customDomain && db) {
        try {
            console.log(`🔍 [Netlify/DB] Consultando siteId para dominio: "${customDomain}"`);
            const prospectSnapshot = await db.collection('prospects')
                .where('customDomain', '==', customDomain)
                .limit(1).get();

            if (!prospectSnapshot.empty) {
                targetSiteId = prospectSnapshot.docs[0].data().netlifySiteId;
                console.log(`🎯 Match en 'prospects': ${targetSiteId}`);
            }

            if (!targetSiteId) {
                const assetSnapshot = await db.collection('ClientAssets')
                    .where('customDomain', '==', customDomain)
                    .limit(1).get();
                if (!assetSnapshot.empty) {
                    const data = assetSnapshot.docs[0].data();
                    targetSiteId = data.siteId || data.netlifySiteId;
                    console.log(`🎯 Match en 'ClientAssets': ${targetSiteId}`);
                }
            }
        } catch (e) {
            console.warn(`⚠️ [Netlify/DB] Fallo en recuperación de siteId: ${e.message}`);
        }
    }

    // API: Crear o recuperar Site
    if (!targetSiteId) {
      console.log(`✨ [Netlify] Creando nuevo sitio: ${siteName}`);
      const siteData = await NetlifyApiClient.createSite(siteName, authToken);
      if (siteData) {
        targetSiteId = siteData.id;
        // 💾 Persistencia en Bóveda
        if (db) {
            try {
                console.log(`💾 [Netlify/DB] Persistiendo nuevo siteId en Firestore para ${siteName}...`);
                const q1 = await db.collection('prospects').where('slug', '==', siteName).limit(1).get();
                if (!q1.empty) await q1.docs[0].ref.update({ netlifySiteId: targetSiteId });

                const q2 = await db.collection('ClientAssets').where('slug', '==', siteName).limit(1).get();
                if (!q2.empty) await q2.docs[0].ref.update({ netlifySiteId: targetSiteId });
            } catch (e) {
                console.warn(`⚠️ [Netlify/DB] Error persistiendo siteId: ${e.message}`);
            }
        }
      }
    } else {
      console.log(`🔄 [Netlify] Forzando Update/Overwrite en: ${targetSiteId}`);
    }

    // API: Dominio personalizado
    if (targetSiteId && customDomain) {
      await NetlifyApiClient.assignCustomDomain(targetSiteId, customDomain, authToken);
    }

    // CLI: Ejecutar Deploy
    console.log(`🚀 [Netlify/CLI] Iniciando push para: ${siteName}`);
    const result = await DeployProcessHandler.run(sitePath, targetSiteId, authToken);
    
    const finalUrl = customDomain ? `https://${customDomain}` : result.url;
    console.log(`✅ [Netlify] Despliegue completado: ${finalUrl}`);
    
    return { ...result, url: finalUrl, netlifyUrl: result.url, status: 'success', siteId: targetSiteId };
  }

  static async isCliAvailable() {
    try {
      const { spawn } = require('child_process');
      return new Promise(res => {
        const proc = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['netlify', '--version'], { 
          shell: true,
          windowsHide: true
        });
        proc.on('close', code => res(code === 0));
        setTimeout(() => { proc.kill(); res(false); }, 5000);
      });
    } catch { return false; }
  }
}

module.exports = NetlifyDeployService;
