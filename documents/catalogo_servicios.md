# Catálogo de Servicios Core del Motor (v11.1)

El motor **Tucu Red Engine** opera mediante una red modular de servicios atómicos especializados, cumpliendo estrictamente la **Ley de 200 líneas**:

---

## 1. 📥 Ingesta y Enriquecimiento de Datos (Gate 1)

- **`ApifyService.js`**: Cliente optimizado para scraping Fast-Track de Instagram (`apify/instagram-profile-scraper` con posts directos) y Google Maps (`compass/crawler-google-places` con hasta 20 reseñas y features).
- **`PhoneNormalizerService.js`**: Motor de estandarización telefónica para Argentina/Tucumán. Genera números válidos E.164, links directos a WhatsApp Meta API (`https://wa.me/549381...`) y enlaces `tel:` para líneas fijas.
- **`PhotoCuratorService.js`**: Curador de activos visuales. Asigna roles semánticos (`hero`, `showcase`, `atmosphere`, `logo`), verifica la existencia física en disco con `fs.existsSync()` y sincroniza con la Bóveda Visual.
- **`EnricherService.js`**: Orquestador central de enriquecimiento multicanal. Combina ingesta de redes, análisis de sentimiento de reseñas y persistencia en `client-assets.json`.
- **`MapsEnricher.js` / `InstagramEnricher.js`**: Extractores específicos de atributos comerciales, horarios de atención, coordenadas geográficas y fotos.

---

## 2. ⚡ Forja, Generación y Post-Procesamiento (Gate 2)

- **`StitchPromptBuilder.js`**: Diseñador narrativo de prompts adaptativos para Stitch MCP / Gemini Pro. Clasifica por arquetipo de negocio, inyecta conceptos auténticos de reseñas y reserva slots limpios `#nexus-<id>`.
- **`StitchPipeline.js`**: Orquestador de llamadas JSON-RPC al servidor de Google Stitch. Gestiona la selección de pantallas, descarga y precalentamiento HTTP.
- **`StitchPostProcessor.js`**: Cirujano DOM post-forja. Inyecta el logo real del cliente en el navbar, normaliza URLs locales y ejecuta purga de corchetes residuales.
- **`WidgetInjector.js`**: Hidratador dinámico de componentes modulares. Inyecta widgets del Arsenal (`booking_v1_turnero`, `gallery_v2_stories_grid`, `trust_v2_live_badge`, `contact_v2_action_dock`, `footer_v1_map`) contextualizados por rubro.
- **`WidgetPools.js`**: Matriz de afinidad de widgets que determina qué componentes activar según el rubro comercial (Gastronomía vs Salud vs Talleres).

---

## 3. 🚀 Despliegue, Infraestructura y Seguridad (Gate 3)

- **`CloudDeployOrchestrator.js`**: Puente de despliegue a Netlify. Aislado para invocación manual exclusiva desde la interfaz de control.
- **`ProjectShield.js`**: Guardián de integridad del sistema. Gestiona snapshots de seguridad y protección contra mutaciones destructivas.
- **`GroqService.js`**: Conector con pool canónico dinámico de inferencia ultrarrápida (`openai/gpt-oss-120b`, `qwen/qwen3.6-27b`, etc.) para tareas de copy y estructuración.
- **`TheDirector.js`**: Coordinador general del flujo soberano de ejecución y generación asistida por IA.
