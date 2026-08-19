# Arquitectura del Motor Tucu Red (v11.1)

El satélite autónomo **Tucu Red Engine** es el núcleo de inteligencia y forja automatizada de sitios web comerciales de alta conversión para el ecosistema Tucu Red.

---

## 1. 🏛️ Soberanía de Datos y Persistencia Local-First
- **Fuente Única de Verdad (SSOT):** La base de datos primaria reside localmente en `data/db_dump.json` bajo la directiva `LOCAL_FIRST_STORAGE=true`.
- **Sincronización Dual:** Cada mutación en caliente se persiste en disco local y se sincroniza en paralelo con Cloud Firestore (`nexus-v2-native`).
- **Bóveda Visual de Clientes:** Activos físicos organizados por slug en `nexus_archives/tucu-red/clients/<slug>/` con fallback estático en `public/clients/<slug>/`.

---

## 2. 🛡️ Arquitectura de 3 Compuertas (QA Gates)

El motor opera bajo un pipeline estricto de 3 compuertas desacopladas que garantizan cero fricción y cero auto-deploys accidentales:

```
[ Gate 1: Ingesta CYBORG ] ➔ [ Gate 2: Forja Local Stitch ] ➔ [ Gate 3: Deploy Manual Netlify ]
```

### Compuerta 1: Ingesta y Extracción Profunda CYBORG
- **Apify Fast-Track:** Extracción ultrarrápida en ~3.5s consumiendo directamente `profile.latestPosts` y `Google Places additionalInfo`.
- **Estandarización E.164:** Normalización telefónica para Argentina/Tucumán (inyección forzosa del prefijo `549` para celulares y `54` para fijos).
- **Integridad Física:** Mapeo de fotos y logos en `client-assets.json` validando existencia física con `fs.existsSync()` para erradicar imágenes rotas.

### Compuerta 2: Forja Local Stitch MCP (Google Gemini Pro)
- **Arquetipos Semánticos:** Ensamblado de prompts adaptativos según el rubro (`gastronomia`, `salud_optica`, `servicios_talleres`, `retail_comercio`).
- **Composición Libre & ADN de Marca:** Inyección de citas auténticas de reseñas (`topReviews`) y eliminación de templates rígidos de 5 bloques.
- **Inyección Regex Bidireccional:** Sustitución de slots `#nexus-<widget_id>` y purga total de corchetes residuales `[...]`.
- **Compilación Local:** Guardado inmediato en disco (`nexus_archives`) sin llamadas a la nube.

### Compuerta 3: Despliegue Manual a Netlify Cloud
- Aislado exclusivamente en `POST /api/forge/deploy`. Solo se ejecuta bajo orden táctica explícita del operador desde la tabla de prospectos.

---

## 3. 🌐 Arquitectura de Red y Puertos
- **Frontend SPA (Vite):** `http://localhost:5005` (Proxy reverso hacia backend).
- **Backend Core (Express):** `http://localhost:5006` (`BACKEND_PORT=5006`).
- **Orquestador Dual:** `npm run dev` (`scripts/dev_runner.js`) con liberación automática de puertos.
