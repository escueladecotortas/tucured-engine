# Kanban Local — tucured-engine (Nexus OS v11.1)

## [IN_PROGRESS]

## 🧠 BANCO DE IDEAS & REFACTORINGS FUTUROS
- [ ] **[IDEA-001] Standby de Verificación en Vivo**: Realizar inspección visual en pantalla completa del preview local de 100 OPTICAS (`http://localhost:5005`) para corroborar el turnero clínico y la purga total de `[...]`.
- [ ] **[IDEA-002] Telemetría Real en Modal de Forja (Eliminar Simulación 92%)**: Implementar Server-Sent Events (SSE) o WebSockets en `/api/forge/stitch` para que la barra de progreso y los agentes (Atenea, Codi, Argus) reflejen pasos y tiempos reales en lugar de un setInterval simulado.
- [ ] **[IDEA-003] Túnel Temporal de Assets Locales para Stitch**: Evaluar Cloudflare R2 o túnel público temporal para exponer las fotos cacheadas en disco si la CDN pública de Instagram caduca con firmas temporales (`_nc_ohc`).

## [DONE]
- [x] **[TASK-051]** Purga Quirúrgica de Scripts Fósiles y Actualización Maestra de Doctrina PEAC v11.1 *(18/08/2026, 16:25:00)*
  - [x] **Fase 1 (La Guillotina de Scripts Fósiles)**: Eliminados físicamente 29 scripts residuales (parches `apply_*`, audits temporales y purgas previas), dejando `scripts/` en exactamente **45 scripts limpios** (43 tests + 2 herramientas operativas).
  - [x] **Fase 2 (Reescritura de Doctrina PEAC v11.1)**: Reescribido `system_core/manuals/protocolo_peac.md` con las 5 directivas de hierro (Preservación de Archivos Completos, Ley de 200 Líneas, Validación Empírica, Soberanía Local-First 3 Gates y Kill & Reload).
  - [x] **Certificación QA & Live Boot**: Suite clínica `test_engine_full_health.js` (19/19 checks, 100%), sincronización Kanban `test_kanban_sync.js` (5/5 checks, 100%) y live boot `test_backend_live_boot.cjs` (6/6 rutas HTTP 200 OK).

- [x] **[TASK-050]** Purga Total de Clientes Zombis y Demos, Saneamiento de DB y Actualización de SOP v11.1 *(18/08/2026, 16:13:00)*
  - [x] **Fase 1 (La Guillotina Física)**: Eliminadas 8 carpetas huérfanas en `nexus_archives` y `public/clients` (`bar-irlanda-test`, `caf-de-la-plaza`, `caf-martinez`, `pizzeria-la-imperial`, `adore-tu-esencia`, `amora-nails`) liberando **2.28 MB y 40 archivos**.
  - [x] **Fase 2 (Cirugía en Base de Datos)**: Purgadas de forma atómica las claves demo (`adore-esencia`, `adore-tu-esencia`, `amora-nails`) en `data/db_dump.json` con validación estricta de integridad JSON.
  - [x] **Fase 3 (Reescritura de Documentación SOP v11.1)**: Reescribidos bajo regla PEAC `documents/arquitectura_motor.md` (3 Gates + Local-First) y `documents/catalogo_servicios.md` (Catálogo de servicios activos del backend).
  - [x] **Certificación QA & Live Boot**: Suite clínica `test_engine_full_health.js` (19/19 checks, 100%), sincronización Kanban `test_kanban_sync.js` (5/5 checks, 100%) y live boot `test_backend_live_boot.cjs` (6/6 rutas HTTP 200 OK).

- [x] **[TASK-049]** Purga de Bitácora Fósil y Archivos TXT con Blindaje SSOT de Base de Datos *(18/08/2026, 15:52:00)*
  - [x] **Fase 1 (Purga de Bitácora Redundante)**: Eliminado `bitacora/indice_pendientes.md` y erradicado el directorio `bitacora/` al quedar vacío.
  - [x] **Fase 2 (Purga de TXT Prompts V1 Legacy)**: Eliminados `data/grazia-centro-de-estetica_stitch_prompt.txt`, `data/nickly_stitch_prompt.txt` y `data/postre-pasteleria_stitch_prompt.txt`.
  - [x] **Fase 3 (Blindaje SSOT & Certificación)**: Verificada integridad 1:1 de `data/db_dump.json` (824.67 KB / 844,459 bytes exactos). Suite de salud clínica `test_engine_full_health.js` (19/19 checks, 100%) y sincronización Kanban `test_kanban_sync.js` (5/5 checks, 100%).

- [x] **[TASK-048]** Purga Quirúrgica de Código Legacy en Backend y Extirpación Total de Puppeteer *(18/08/2026, 15:32:00)*
  - [x] **Fase 1 (La Guillotina de Kael)**: Eliminados físicamente 34 archivos y 5 directorios residuales: 4 subcarpetas anidadas clonadas (`config/config`, `leads/leads`, `nexus/nexus`, `prompts/prompts`), 3 servicios huérfanos (`AutoHealerService`, `SafeWriteService`, `VectorStore`) y la carpeta completa `backend/scripts/` (15 scripts).
  - [x] **Fase 2 (Extirpación de Puppeteer en StitchIndexer y MapsScraper)**: Refactorizado `StitchIndexer.js` a HTTP nativo no-bloqueante con `fetch` y timeout; limpiado `MapsScraperService.js` eliminando el require de Puppeteer; saneado `backend/package.json`.
  - [x] **Fase 3 (Certificación QA & Live Boot)**: Suite clínica `test_engine_full_health.js` (19/19 checks, 100%), sincronización Kanban `test_kanban_sync.js` (5/5 checks, 100%) y test de arranque en vivo `test_backend_live_boot.cjs` (6/6 rutas HTTP 200 OK).

- [x] **[TASK-047]** Reestructuración de Inteligencia y Purga de Tokens: Rotación de Histórico, Contexto Maestro y Skill E.164 *(18/08/2026, 14:58:00)*
  - [x] **Fase 1 (Rotación y Archivo Histórico)**: Creado `archive/kanban_history_v1.md` albergando tareas TASK-INIT a TASK-040 (43.6 KB / 270 LOC). Podado `kanban.md` a 9.1 KB / 63 LOC logrando -83% de huella de tokens.
  - [x] **Fase 2 (Matriz de Contexto Maestro)**: Creado `.agent/context.md` (39 LOC) definiendo puertos (5005/5006), modo Local-First (SSOT `data/db_dump.json`) y arquitectura 3 Gates.
  - [x] **Fase 3 (Cristalización de Skills)**: Creada `.agent/skills/normalizacion-leads-e164/SKILL.md` documentando el estándar telefónico argentino (Meta WA 549381 vs Fijo 54381).
  - [x] **Certificación QA**: Test suite `scripts/test_kanban_sync.js` (5/5 checks, 100%) y `test_engine_full_health.js` (19/19 checks, 100%).

- [x] **[TASK-046]** Saneamiento Integral de Código: Purga Quirúrgica de Residuos, Modularización Estricta de 200 Líneas y Despresurización Preventiva *(18/08/2026, 14:23:00)*
  - [x] **Fase 1 (Purga Quirúrgica de Huérfanos & Directorios Anidados)**: Eliminados físicamente 5 subdirectorios residuales (`enrichment/enrichment`, `scraper/scraper`, `backend/templates`, `deploy/deploy`, `stitch/stitch`) y 31 módulos huérfanos sin dependencias. Limpiado `console.error` de depuración en `forge/stitch.js`.
  - [x] **Fase 2 (Cirugía de Modularización Crítica > 200 LOC)**:
    - `backend/routes/nexus/assets.js` refactorizado a 18 LOC subdividido en subrutas atómicas (`assets/list.js`, `assets/reclassify.js`, `assets/manifest.js`).
    - `backend/services/TheDirector.js` refactorizado a 158 LOC desacoplando `director/PromptArchitect.js`.
    - `src/components/tabs/identity/IdentityAssetSection.jsx` refactorizado a 98 LOC extrayendo `ColorPaletteGrid.jsx`, `TypographyCard.jsx` e `IdentityDocModal.jsx`.
    - `backend/routes/leads/core.js` refactorizado a 157 LOC extrayendo `leads/enrich.js`.
  - [x] **Fase 3 (Despresurización Preventiva 180-200 LOC)**:
    - `src/components/database/ProspectsTable.jsx` reducido a 173 LOC extrayendo `TacticalActionsCell.jsx`.
    - `src/components/modals/ApiHealthModal.jsx` reducido a 117 LOC extrayendo `ApiProbeCard.jsx`.
  - [x] **Certificación QA & Build**: Suite clínica `test_engine_full_health.js` con **19/19 checks pasados (100%)**, carga exitosa de backend y compilación de producción de Vite limpia (`npm run build` en 21.85s).

- [x] **[TASK-045]** Auditoría E2E: Saneamiento de Timeouts, Purga de Placeholders, Blindaje de Gates y Contextualización de Widgets *(18/08/2026, 13:18:00)*
  - [x] **Blindaje Estricto de 3 Gates (Cero Auto-Deploy)**: En `CloudDeployOrchestrator.js` y `backend/routes/forge/stitch.js`, Gate 2 compila localmente en `nexus_archives` y `public/clients` sin invocar Netlify. El deploy (Gate 3) queda aislado exclusivamente en `POST /api/forge/deploy`.
  - [x] **Purga Radical Bidireccional de Placeholders (`WidgetInjector.js` & `StitchPostProcessor.js`)**: Reemplazo dual (por ID de DOM y por coincidencia de texto plano `[...]`) erradicando completamente cualquier texto residual en el DOM.
  - [x] **Contextualización de Turnero Clínico (`booking_v1_turnero.html`)**: Erradicado todo texto gastronómico hardcodeado ("Mesa", "experiencia gastronómica"). 100 Ópticas renderiza "Solicitá tu Consulta", opciones de graduación y turno por WhatsApp.
  - [x] **Restauración del Botón [🌐 Ver Web] (`ProspectsTable.jsx`)**: Botón permanente y accesible en la botonera de Tactical Actions para cualquier sitio forjado o desplegado.
  - [x] **Timeouts y Proxy**: Configurados timeouts de 15 minutos en `vite.config.js` y `backend/server.js`.
  - [x] **Certificación QA & Build**: Script `scripts/test_full_audit_100opticas.cjs` verificado con **5/5 checks pasados** y build de producción limpio (`npm run build` en 31.86s).

- [x] **[TASK-044]** Generador Narrativo por ADN de Negocio, Composición Libre en Stitch y Selección Inteligente de Widgets *(18/08/2026, 03:12:00)*
  - [x] **Generador Narrativo Auténtico (`StitchPromptBuilder.js`)**: Erradicadas las listas numeradas rígidas de layout. Implementado Brief Creativo por ADN de marca extrayendo conceptos auténticos de `topReviews` (platos, show, ambiente), `features` de Maps y URLs CDN públicas.
  - [x] **Matriz Inteligente de Widgets por Rubro (`WidgetPools.js` & `WidgetInjector.js`)**: Desacoplada la inyección universal forzosa. Gastronomía activa Stories Grid + Reserva de Mesa + Marquee (6 widgets); Salud/Óptica prioriza Turnero Clínico + Trust Badge + Mapa (5 widgets).
  - [x] **Sincronización con Bóveda Visual (`PhotoCuratorService.js`)**: Incorporado método `getPersistedPhotos` que enlaza las reasignaciones de roles en la Bóveda con los servicios de inyección y prompt en tiempo real.
  - [x] **Certificación QA & Build**: Script `scripts/test_narrative_prompt_and_dynamic_widgets.cjs` verificado con **3/3 checks pasados** y build de producción limpio (`npm run build` en 14.14s).

- [x] **[TASK-043]** Saneamiento de Navbar, Erradicación de Placeholders de Carrusel y Sincronización de Pipeline Stitch *(18/08/2026, 02:53:00)*
  - [x] **Sanitización Quirúrgica de Navbar (`StitchPostProcessor.js`)**: Inyectado contenedor de branding limpio (Logo Real + Nombre) a la izquierda, erradicada la barra de enlaces intermedios huérfanos (`#menu`, `#reservas`, etc.) y colocado botón CTA de WhatsApp funcional a la derecha.
  - [x] **Erradicación de Imágenes Rotas en Carrusel (`WidgetInjector.js`)**: Mapeadas e hidratadas de forma cíclica las fotos reales en `{{IMG_1}}` a `{{IMG_7}}` en `gallery_v1_reel`, reduciendo los placeholders `{{IMG_...}}` e imágenes rotas a **0**.
  - [x] **Estrategia CDN de Fotos Públicas (`StitchPromptBuilder.js`)**: Incorporada sección explícita con URLs públicas de Google Maps e Instagram en el prompt de Stitch, y normalización a archivos locales en post-procesamiento.
  - [x] **Selector de Pantalla en Pipeline (`StitchPipeline.js`)**: Optimizada la selección de pantalla y descarga resiliente en Paso 3.
  - [x] **Certificación QA & Build**: Script `scripts/audit_stitch_screen_selection.cjs` verificado con **0 imágenes rotas y 29 fotos reales locales normalizadas** y build de producción limpio (`npm run build` en 15.18s).

- [x] **[TASK-042]** Ensamblador Dinámico de Prompts por Arquetipo, Post-Procesador de Logo Real y Reclasificación en Bóveda *(18/08/2026, 02:35:00)*
  - [x] **Ensamblador Dinámico por Arquetipos (`StitchPromptBuilder.js`)**: Creado generador de prompts adaptativos clasificados por 4 arquetipos semánticos (`gastronomia`, `salud_optica`, `servicios_talleres`, `retail_comercio`) con libertad creativa de layout y slots limpios como contenedores `<div id="nexus-<widget_id>"></div>` sin texto plano.
  - [x] **Pipeline Post-Procesador & Sustitución de Logo Real (`StitchPostProcessor.js`)**: Implementada inyección quirúrgica de `<img src="/nexus_archives/tucu-red/clients/<slug>/assets/logo.jpg">` en el navbar/branding y purga estricta de cualquier placeholder residual `[...]`.
  - [x] **Reclasificación Interactiva en Bóveda Visual (`GalleryModal.jsx` y `PATCH /api/nexus/assets/reclassify`)**: Dropdown interactivo en cada card de foto con opciones `Hero Banner`, `Showcase (Producto)`, `Atmosphere (Local)`, `Logo Identidad` y `Descartar`, persistiendo en tiempo real en `client-assets.json`.
  - [x] **Botón Táctico de Deploy a Netlify (`ProspectsTable.jsx`)**: Incorporado botón `[🚀 Desplegar a Netlify]` en la columna Tactical Actions para disparar `POST /api/forge/deploy` con feedback inmediato vía Toast.
  - [x] **Certificación QA & Build**: Script `scripts/test_archetype_prompt_and_postprocessor.cjs` verificado con **3/3 checks pasados** y build de producción limpio (`npm run build` en 25.80s).

- [x] **[TASK-041]** Saneamiento Universal de Servidor Estático y Resolución 1:1 de Bóveda Visual *(18/08/2026, 01:41:00)*
  - [x] **Exposición Estática & Fallback Inteligente (Dual Path)**: En `backend/server.js`, expuestas las rutas absolutas de `nexus_archives` y `public/clients` con middleware inteligente que resuelve imágenes desde cualquiera de las dos ubicaciones físicas sin arrojar 404.
  - [x] **Configuración Proxy Vite (:5005 -> :5006)**: En `vite.config.js`, configurado proxy explícito con `changeOrigin: true` para `/nexus_archives` y `/clients`.
  - [x] **Endpoint de Inspección de Activos (`/api/nexus/assets/list`)**: Creados endpoints `GET /api/nexus/assets/list?slug=...` y `GET /api/nexus/assets/client-assets?slug=...` en `backend/routes/nexus/assets.js` para inspeccionar y devolver exclusivamente archivos físicos existentes (>0 bytes).
  - [x] **Hidratación en Bóveda Visual (`GalleryModal.jsx`)**: El modal sincroniza en vivo los activos reales desde `/api/nexus/assets/list`, erradicando miniaturas rotas y placeholders en "100 ÓPTICAS", "La Sirio Barrio Norte" y "Bar Irlanda".
  - [x] **Certificación QA & Build**: Script `scripts/test_asset_serving_all_clients.cjs` verificado con **15/15 checks pasados** y build de producción limpio (`npm run build` en 14.54s).

> 📦 **Historial Anterior:** Tareas anteriores (TASK-INIT a TASK-040) archivadas en [archive/kanban_history_v1.md](archive/kanban_history_v1.md).
