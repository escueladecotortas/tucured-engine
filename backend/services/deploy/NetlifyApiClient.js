// Archivo: backend/services/deploy/NetlifyApiClient.js

/**
 * Especialista en la API REST de Netlify.
 * Extraído para cumplimiento de la Ley de 200 líneas.
 */
class NetlifyApiClient {
  static async createSite(siteName, authToken, attempt = 1) {
    const baseName = `${siteName}--tucured`;
    const desiredName = attempt === 1 
      ? baseName 
      : `${siteName}-${Math.random().toString(36).substring(2, 8)}--tucured`;
      
    console.log(`🌐 [Netlify/API] Intentando acceso a sitio: ${desiredName}`);
    
    // Antes de crear, si es el primer intento, buscamos si ya existe uno parecido en nuestra cuenta
    if (attempt === 1) {
      const existing = await NetlifyApiClient.getSiteByName(baseName, authToken);
      if (existing) {
        console.log(`✅ [Netlify/API] Sitio base encontrado: ${existing.id}`);
        return existing;
      }
      
      // Búsqueda por prefijo (Fuzzy Search) para recuperar sitios con sufijos previos
      const sites = await NetlifyApiClient.getAllSites(authToken);
      const fuzzyMatch = sites.find(s => s.name.startsWith(`${siteName}-`) && s.name.endsWith('--tucured'));
      if (fuzzyMatch) {
        console.log(`✅ [Netlify/API] Sitio previo detectado (Fuzzy): ${fuzzyMatch.name} [${fuzzyMatch.id}]`);
        return fuzzyMatch;
      }
    }

    try {
      const res = await fetch('https://api.netlify.com/api/v1/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ name: desiredName })
      });
      if (!res.ok) {
          if (res.status === 422) {
              console.log(`⚠️ [Netlify/API] Colisión global o de cuenta. Reintentando...`);
              if (attempt < 3) return await NetlifyApiClient.createSite(siteName, authToken, attempt + 1);
          }
          throw new Error(`Status ${res.status}: ${await res.text()}`);
      }
      return await res.json();
    } catch (e) {
      console.error(`⚠️ [Netlify/API] Error en creación/recuperación: ${e.message}`);
      return null;
    }
  }

  static async getAllSites(authToken) {
    try {
      const res = await fetch(`https://api.netlify.com/api/v1/sites`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(`⚠️ [Netlify/API] getAllSites error: ${e.message}`);
    }
    return [];
  }

  static async getSiteByName(desiredName, authToken) {
    try {
      // Netlify API ignora el query `?name=`, por tanto traemos el listado. 
      // Si la cuenta superase a futuro 100 sitios, se implementaría paginación.
      const res = await fetch(`https://api.netlify.com/api/v1/sites`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        const sites = await res.json();
        const site = sites.find(s => s.name === desiredName);
        return site || null;
      }
    } catch (e) {
      console.error(`⚠️ [Netlify/API] getSiteByName error: ${e.message}`);
    }
    return null;
  }

  static async assignCustomDomain(siteId, customDomain, authToken) {
    console.log(`🔗 [Netlify/API] Assigning domain: ${customDomain}`);
    try {
      const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ custom_domain: customDomain })
      });
      return res.ok;
    } catch (e) {
      console.error(`⚠️ [Netlify/API] Domain assignment error: ${e.message}`);
      return false;
    }
  }
}

module.exports = NetlifyApiClient;
