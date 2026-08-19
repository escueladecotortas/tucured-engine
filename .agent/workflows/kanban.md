# Kanban Local — tucured-engine (Nexus OS v11.1)

## [IN_PROGRESS]

## 🧠 BANCO DE IDEAS & REFACTORINGS FUTUROS
- [ ] **[IDEA-001] Standby de Verificación en Vivo**: Realizar inspección visual en pantalla completa del preview local de 100 OPTICAS (`http://localhost:5005`) para corroborar el turnero clínico y la purga total de `[...]`.
- [ ] **[IDEA-003] Túnel Temporal de Assets Locales para Stitch**: Evaluar Cloudflare R2 o túnel público temporal para exponer las fotos cacheadas en disco si la CDN pública de Instagram caduca con firmas temporales (`_nc_ohc`).

## [DONE]
- [x] **[TASK-057]** Trazabilidad Extrema y Rechazo de Errores en Stitch MCP Client (Gate 2 - Forja) *(19/08/2026, 17:14:00)*
  - [x] **Fase 1 (Auditoría de Esquema y Sanitización de Argumentos)**: Revisado el inputSchema de `create_project` (`{ title: string }`), `generate_screen_from_text` (`{ projectId, prompt, deviceType, modelId }`), `edit_screens` (`{ projectId, selectedScreenIds, prompt, deviceType, modelId }`) y `get_screen` (`{ name, projectId, screenId }`), aplicando sanitización y trim estricto de identificadores y títulos.
  - [x] **Fase 2 (Trazabilidad Extrema - Zero Blind Spots)**: Implementada emisión previa del payload exacto JSON-RPC tanto en `StitchMcpClient.js` como en `StitchRpcHandler.js`.
  - [x] **Fase 3 (Error Handling y Rechazo de Promesas)**: `StitchRpcHandler.js` captura `isError: true` y errores RPC devueltos por Stitch MCP, rechazando inmediatamente la promesa con el mensaje textual exacto para telemetría.
  - [x] **Certificación QA & Kill & Reload**: Script de validación `scripts/test_stitch_mcp_client.cjs` (3/3 checks, 100%), live reload `test_dev_runner_sync.cjs`, suite de salud clínica `test_engine_full_health.js` (19/19 checks, 100%) y sincronización Kanban `test_kanban_sync.js`.

- [x] **[TASK-056]** Orquestador Resiliente, Sincronización SSOT de Bóveda y Mutex de Logo *(19/08/2026, 16:26:00)*
  - [x] **Fase 1 (Orquestador Dual Resiliente `scripts/dev_runner.js`)**: Implementada supervisión resiliente con auto-respawn tolerante a reinicios del Backend Express sin abortar el proceso hijo de Vite Frontend, manteniendo el proxy `:5005` sincronizado.
  - [x] **Fase 2 (SSOT y UX Unificada de Descarte en Bóveda)**: Eliminado el botón de tacho redundante en `GalleryModal.jsx` y `DatabaseView.jsx`. Descarte canalizado exclusivamente a través del dropdown de roles con purga física de archivo en disco (`reclassify.js`), retorno de conteo exacto y sincronización en tiempo real vía `onUpdateLead`.
  - [x] **Fase 3 (Mutex de Logo en Frontend y Backend)**: Exclusión mutua implementada en `GalleryModal.jsx` deshabilitando la opción `Logo Identidad` (`disabled={true}`) para todos los activos que no sean el logo actual, liberando el selector de inmediato al reasignar o descartar. En `reclassify.js`, garantizada exclusividad en `semantic_photos.logo`.
  - [x] **Certificación QA & Kill & Reload**: Script de validación `scripts/test_resilience_and_vault_mutex.cjs` (4/4 checks, 100%), suite de curaduría `test_curation_and_gates.cjs` (4/4 checks, 100%), suite clínica `test_engine_full_health.js` (19/19 checks, 100%), compilación Vite limpia en 13.77s y sincronización Kanban `test_kanban_sync.js`.

- [x] **[TASK-055]** Curaduría Semántica sin Duplicación Física, Extracción de Logo Real y Blindaje de Compuertas UI *(19/08/2026, 16:03:00)*
  - [x] **Fase 1 (Curaduría Semántica y Saneamiento de Bóveda)**: Refactorizado `PhotoCuratorService.js` erradicando `fs.copyFileSync` para roles, preservando nombres de archivo originales (`insta_...jpg`, `maps_...jpg`) y mapeando a `semantic_photos` en `client-assets.json`. Actualizados `EnricherService.js` y `list.js`.
  - [x] **Fase 2 (Extracción de Logo Real en `InstagramEnricher.js` & Sync Firestore en `reclassify.js`)**: `InstagramEnricher.js` extrae explícitamente `profilePicUrl` / `profilePicUrlHD` de la raíz del perfil y lo persiste como `logo.jpg`. En `reclassify.js`, añadidas rutas `/reclassify` y `/update` con persistencia dual en disco y sincronización en Firestore.
  - [x] **Fase 3 (Blindaje de Compuertas Lógicas en UI)**: En `TacticalActionsCell.jsx` y `ProspectsTable.jsx`, condicionado el atributo `disabled` de `[🌐 Ver Web]` y `[🚀 Desplegar a Netlify]` para activarse estrictamente solo cuando `status === 'generated'` o `status === 'deployed'`.
  - [x] **Certificación QA & Kill & Reload**: Script `scripts/test_curation_and_gates.cjs` (4/4 checks, 100% - demostrando 14 archivos exactos en disco para canzonieri y 0 duplicados), suite de salud clínica `test_engine_full_health.js` (19/19 checks, 100%), telemetría SSE `test_sse_terminal.cjs` (3/3 checks, 100%), compilación Vite en 16.13s y sincronización Kanban `test_kanban_sync.js`.

- [x] **[TASK-054]** Telemetría en Tiempo Real vía Server-Sent Events (SSE) y Erradicación de Mocks de Progreso *(19/08/2026, 15:23:00)*
  - [x] **Fase 1 (Emisor SSE Backend & `TerminalService.js`)**: Implementado `backend/services/telemetry/TerminalService.js` conectado a `/api/terminal/stream` en `backend/routes/terminal.js`, emitiendo payloads estructurados (`status`, `message`, `progress`, `agent`, `timestamp`) a lo largo del ciclo de vida de `StitchPipeline`, `NexusInjectorService` y `CloudDeployOrchestrator`.
  - [x] **Fase 2 (Receptor SSE Frontend & Modal de Forja)**: Erradicada la simulación `setInterval` estancada en 92% en `GenerationModal.jsx`. Conectado el flujo de telemetría a los eventos SSE en `useNeuralFactory.js` y `useNeuralActions.js` con cierre limpio (`eventSource.close()`) en desmontaje.
  - [x] **Certificación QA & Kill & Reload**: Script de validación SSE `scripts/test_sse_terminal.cjs` (3/3 checks, 100%), suite de terminal y misiones `test_terminal_missions.js` (8/8 checks, 100%), suite clínica `test_engine_full_health.js` (19/19 checks, 100%), compilación limpia Vite en 13.88s y live boot dual sincronizado `test_dev_runner_sync.cjs`.

- [x] **[TASK-053]** Cableado de Alta Tensión C.Y.B.O.R.G.: Inferencia Real Groq LPU y Enrutamiento a Builder Semántico *(19/08/2026, 15:12:00)*
  - [x] **Fase 1 (Erradicación de Mocks de IA en Backend)**: Refactorizado `GroqProvider.js` con Failover Pool activo (`openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `qwen/qwen3.6-27b`, `groq/compound`) y conectado a `aiService.js` para generar copys, tono y vibe reales en `AiEnricher.js`.
  - [x] **Fase 2 (Enrutamiento Semántico en `StitchPipeline.js`)**: Enrutado Paso 1 de `StitchPipeline.js` y `StitchPromptService.assembleSeed()` directamente a `StitchPromptBuilder.buildPrompt()`, activando la taxonomía de los 4 Arquetipos Semánticos con slots limpios `#nexus-<id>` y fotos CDN públicas.
  - [x] **Certificación QA & Kill & Reload**: Script `scripts/test_cyborg_brain.cjs` (3/3 checks, 100%), suite de salud clínica `test_engine_full_health.js` (19/19 checks, 100%), sincronización de arranque dual `test_dev_runner_sync.cjs` y `test_kanban_sync.js` (5/5 checks, 100%).

- [x] **[TASK-052]** Sincronización de Arranque Dual y Blindaje Anti-Race Condition en Proxy Vite *(19/08/2026, 14:45:00)*
  - [x] **Fase 1 (Orquestador Sincronizado `scripts/dev_runner.js`)**: Implementada espera activa TCP nativa (`waitForPort`) en puerto 5006 con socket `net.createConnection`, fail-fast en caídas y arranque estrictamente secuencial Backend Express -> Frontend Vite SPA.
  - [x] **Fase 2 (Blindaje Silencioso en `vite.config.js`)**: Configurado interceptor `handleProxyError` en `/api`, `/nexus_archives` y `/clients` capturando `ECONNREFUSED` y `ETIMEDOUT` con respuesta HTTP 503 JSON limpia y silenciosa.
  - [x] **Certificación QA & Kill & Reload**: Script `scripts/test_dev_runner_sync.cjs` certificando 0 errores de proxy, `npm run build` limpio en 26.06s, suite de salud clínica `test_engine_full_health.js` (19/19 checks, 100%) y sincronización Kanban `test_kanban_sync.js` (5/5 checks, 100%).

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
