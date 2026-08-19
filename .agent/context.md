# 🧭 Contexto Maestro y Operativo — tucured-engine (Nexus OS v11.1)

> **Manifiesto de Inyección Rápida:** Resumen de arquitectura, puertos, SSOT y directivas críticas del Satélite Tucu Red.

---

## 1. 🌐 Arquitectura de Red y Puertos
- **Frontend (Vite SPA):** `http://localhost:5005` (Proxy reverso `/api` hacia `:5006`).
- **Backend (Node/Express):** `http://localhost:5006` (`BACKEND_PORT=5006`).
- **Comando de Arranque Dual:** `npm run dev` (ejecuta `scripts/dev_runner.js` con pre-flight kill de puertos).

---

## 2. 🗄️ Modelo de Persistencia Local-First (SSOT)
- **Modo:** `LOCAL_FIRST_STORAGE=true` (Soberanía de datos local).
- **Fuente Única de Verdad (SSOT):** `data/db_dump.json`.
- **Sincronización Dual:** Mutaciones en `/api/leads` sincronizan en caliente tanto `data/db_dump.json` como Cloud Firestore (`nexus-v2-native`).
- **Bóveda Visual y Clientes:** `nexus_archives/tucu-red/clients/<slug>/` y `public/clients/<slug>/`.

---

## 3. 🛡️ Arquitectura de 3 Compuertas (QA Gates)
1. **Gate 1 (Ingesta & Extracción CYBORG):**
   - Extracción paralela vía **Apify Fast-Track** (`profile.latestPosts` en ~3.5s). Prohibido Puppeteer legacy.
   - Normalización E.164 de teléfonos para WhatsApp (`549381...`) y llamadas (`+54 381...`).
   - Generación de `client-assets.json` validando archivos existentes en disco con `fs.existsSync()`.
2. **Gate 2 (Forja Local Stitch MCP):**
   - Ensamblado narrativo por ADN de marca (`StitchPromptBuilder.js`) y slots de widgets limpios (`#nexus-<id>`).
   - Compilación y guardado local en `nexus_archives` y `public/clients`. **CERO AUTO-DEPLOY**.
3. **Gate 3 (Despliegue Manual a Netlify Cloud):**
   - Aislado exclusivamente en `POST /api/forge/deploy`. Solo se ejecuta bajo orden táctica explícita.

---

## 4. 🧩 Arsenal de Widgets e Inyección
- **Inyección Regex Bidireccional:** Búsqueda por ID `#nexus-<widget>` y purga de placeholders `[...]`.
- **Catálogo Activo:** `booking_v1_turnero`, `gallery_v2_stories_grid`, `gallery_v1_reel`, `social_v2_marquee_reviews`, `trust_v2_live_badge`, `contact_v2_action_dock`, `footer_v1_map`.
- **Regla de 200 Líneas:** Modularización atómica obligatoria para cualquier archivo nuevo o refactorizado.
