// Archivo: backend/routes/leads/core.js
// Rutas Nucleares de Leads: Ingesta, Consulta, Enriquecimiento y Borrado Atómico (Ley de 200 líneas)

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { db } = require('../../firebase-admin');
const EnricherService = require('../../services/EnricherService');

const LOCAL_DUMP_PATH = path.resolve(process.cwd(), 'data/db_dump.json');
const CLIENTS_ARCHIVE_DIR = path.resolve(process.cwd(), 'nexus_archives/tucu-red/clients');

function enrichWithLocalClientAssets(prospect) {
    if (!prospect) return prospect;
    const slug = prospect.slug || prospect.clientId || (prospect.name ? prospect.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : null);
    if (!slug) return prospect;

    const assetsJsonPath = path.join(CLIENTS_ARCHIVE_DIR, slug, 'client-assets.json');
    if (fs.existsSync(assetsJsonPath)) {
        try {
            const data = JSON.parse(fs.readFileSync(assetsJsonPath, 'utf8'));
            return {
                ...prospect,
                slug,
                photos: Array.isArray(data.photos) && data.photos.length > 0 ? data.photos : prospect.photos,
                semantic_photos: data.semantic_photos || prospect.semantic_photos,
                logoUrl: data.logo_url || prospect.logoUrl || prospect.logo,
                topReviews: Array.isArray(data.topReviews) && data.topReviews.length > 0 ? data.topReviews : prospect.topReviews,
                about: data.about || prospect.about
            };
        } catch (e) {}
    }
    return { ...prospect, slug: slug || prospect.slug };
}

function getLocalProspects() {
    try {
        if (!fs.existsSync(LOCAL_DUMP_PATH)) return [];
        const dump = JSON.parse(fs.readFileSync(LOCAL_DUMP_PATH, 'utf-8'));
        let list = [];
        if (Array.isArray(dump.prospects)) list = dump.prospects;
        else if (dump.prospects && typeof dump.prospects === 'object') {
            list = Object.entries(dump.prospects).map(([k, v]) => ({ id: v.id || k, ...v }));
        }
        return list.map(enrichWithLocalClientAssets);
    } catch (e) { return []; }
}

function syncLocalDump(leadId, data, isDelete = false) {
    if (!fs.existsSync(LOCAL_DUMP_PATH)) return;
    try {
        const dump = JSON.parse(fs.readFileSync(LOCAL_DUMP_PATH, 'utf8'));
        dump.prospects = dump.prospects || {};
        if (isDelete) {
            if (Array.isArray(dump.prospects)) {
                dump.prospects = dump.prospects.filter(p => p.id !== leadId && p.slug !== leadId);
            } else {
                delete dump.prospects[leadId];
                for (const [k, v] of Object.entries(dump.prospects)) {
                    if (v.id === leadId || v.slug === leadId) delete dump.prospects[k];
                }
            }
        } else {
            dump.prospects[leadId] = { ...data, id: leadId };
        }
        fs.writeFileSync(LOCAL_DUMP_PATH, JSON.stringify(dump, null, 2));
    } catch (e) {}
}

// 1. LISTAR PROSPECTOS CON HIDRATACIÓN REAL
async function listProspectsHandler(req, res) {
    try {
        if (db) {
            const snap = await db.collection('prospects').get();
            if (!snap.empty) {
                const list = snap.docs.map(d => enrichWithLocalClientAssets({ id: d.id, ...d.data() }));
                return res.json({ success: true, prospects: list });
            }
        }
        res.json({ success: true, prospects: getLocalProspects() });
    } catch (e) {
        res.json({ success: true, prospects: getLocalProspects() });
    }
}

// 2. GUARDAR PROSPECTO (Batch & Manual)
async function saveLeadHandler(req, res) {
    try {
        const raw = (req.body.prospects && req.body.prospects[0]) ? req.body.prospects[0] : req.body;
        const name = (raw.name || raw.businessName || raw.title || '').trim();
        if (!name) return res.status(400).json({ error: "El nombre del negocio es requerido" });

        const phone = (raw.phone || raw.whatsapp || '').trim();
        const slug = raw.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const leadId = raw.id || `lead_${Date.now()}`;
        
        const leadData = {
            id: leadId, name, slug, phone, whatsapp: (raw.whatsapp || phone).trim(),
            email: (raw.email || '').trim(), instagram: (raw.instagram || raw.igHandle || '').trim().replace('@', ''),
            mapsUrl: (raw.mapsUrl || raw.googleMapsUrl || '').trim(), address: (raw.address || '').trim(),
            city: (raw.city || 'San Miguel de Tucumán').trim(), context: raw.context || raw.aiContext || '',
            category: raw.category || raw.rubro || 'general', subcategory: raw.subcategory || '',
            goal: raw.goal || 'leads', audience: raw.audience || 'local', vibe: String(raw.vibe || '2'),
            usp: raw.usp || '', source: raw.source || 'cyborg_injection', status: raw.status || 'new',
            leadScore: Number(raw.leadScore) || 8, createdAt: raw.createdAt || new Date().toISOString()
        };

        if (db) await db.collection('prospects').doc(leadId).set(leadData, { merge: true });
        syncLocalDump(leadId, leadData, false);
        res.json({ success: true, id: leadId, slug, lead: leadData });
    } catch (error) { res.status(500).json({ error: "Fallo al guardar lead", details: error.message }); }
}

// 3. ENRIQUECER PROSPECTO (Re-extracción CYBORG)
async function enrichLeadHandler(req, res) {
    try {
        const { leadId, lead } = req.body;
        let leadData = lead || null;

        if (!leadData && leadId) {
            if (db) {
                try {
                    const doc = await db.collection('prospects').doc(leadId).get();
                    if (doc.exists) leadData = { id: doc.id, ...doc.data() };
                } catch (e) {}
            }
            if (!leadData) leadData = getLocalProspects().find(p => p.id === leadId || p.slug === leadId);
        } else if (!leadData && req.body.name) {
            leadData = req.body;
        }

        if (!leadData || !leadData.name) {
            return res.status(400).json({ error: "leadId o lead con nombre requerido" });
        }

        const enrichedData = await EnricherService.enrich(leadData);
        const finalId = leadData.id || enrichedData.slug || `lead_${Date.now()}`;
        enrichedData.id = finalId;
        enrichedData.status = 'stitch_ready';

        if (db) {
            try { await db.collection('prospects').doc(finalId).set(enrichedData, { merge: true }); } catch (e) {}
        }
        syncLocalDump(finalId, enrichedData, false);

        res.json({
            success: true,
            lead: enrichedData,
            status: 'stitch_ready',
            kpis: {
                reviewsValidas: (enrichedData.topReviews || []).length,
                fotosIndexadas: (enrichedData.photos || []).length,
                featuresDetectados: (enrichedData.features || []).length
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Error en enriquecimiento", details: error.message });
    }
}

// 4. BORRADO ATÓMICO (Firestore + db_dump.json + Filesystem)
async function deleteLeadHandler(req, res) {
    try {
        const pId = req.params.id;
        if (!pId) return res.status(400).json({ error: "ID requerido" });
        let targetSlug = pId;

        if (db) {
            try {
                const doc = await db.collection('prospects').doc(pId).get();
                if (doc.exists) { targetSlug = doc.data().slug || targetSlug; await db.collection('prospects').doc(pId).delete(); }
            } catch (e) {}
        }
        syncLocalDump(pId, null, true);

        [path.resolve(process.cwd(), `public/clients/${targetSlug}`), path.resolve(process.cwd(), `nexus_archives/tucu-red/clients/${targetSlug}`)].forEach(dir => {
            if (fs.existsSync(dir)) { try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) {} }
        });
        res.json({ success: true, id: pId, slug: targetSlug });
    } catch (error) { res.status(500).json({ error: "Fallo al eliminar lead", details: error.message }); }
}

router.get('/', listProspectsHandler);
router.get('/prospects', listProspectsHandler);
router.post('/', saveLeadHandler);
router.post('/leads', saveLeadHandler);
router.post('/prospects', saveLeadHandler);
router.post('/enrich', enrichLeadHandler);
router.post('/leads/enrich', enrichLeadHandler);
router.post('/cyborg', enrichLeadHandler);
router.delete('/:id', deleteLeadHandler);
router.delete('/prospects/:id', deleteLeadHandler);
router.delete('/leads/:id', deleteLeadHandler);

module.exports = router;
module.exports.listProspectsHandler = listProspectsHandler;
module.exports.saveLeadHandler = saveLeadHandler;
module.exports.enrichLeadHandler = enrichLeadHandler;
module.exports.deleteLeadHandler = deleteLeadHandler;
