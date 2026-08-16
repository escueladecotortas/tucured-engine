# Tucured Engine — Motor Soberano de Generacion de Sitios

Motor de generacion automatica de landing pages para clientes de Tucu Red.
Extraido de NEXUS-OS v7 y consolidado bajo la arquitectura Nexus OS v10.0.

## Stack
- Node.js (CommonJS) + Express 5
- Firebase Admin (Firestore)
- Apify SDK (Scrapers Maps/Instagram)
- Google Gemini / Groq / OpenAI
- Netlify SDK (Deploy automatico)
- Puppeteer / Sharp (Vision y optimizacion de fotos)

## Inicio Rapido
```bash
cp .env.example .env
# Completa las variables de entorno
npm install
npm start
```

## Arquitectura
- `backend/services/` - 50+ servicios especializados del motor
- `backend/routes/` - API REST endpoints
- `backend/stitch/` - Builder HTML y widgets
- `data/` - Base de datos y prompts de clientes reales
- `tools/nexus-brief-extension/` - Extension Chrome Nexus Brief
