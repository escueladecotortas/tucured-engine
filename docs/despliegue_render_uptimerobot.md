<!-- Archivo: docs/despliegue_render_uptimerobot.md -->
# 🚀 GUÍA OPERATIVA: DESPLIEGUE CLOUD $0 (RENDER + UPTIMEROBOT)
> **Satélite:** `tucured-engine` | **Blueprint:** `render.yaml` | **Keep-Alive:** `/health`  
> **Autoría Swarm:** KAEL (DevOps), CODI (Ingeniería), ELARA (Bóveda) y ARGUS (QA)  
> **Versión del Protocolo:** Nexus OS v11.1 (Local-First SSOT)

---

## 🎯 1. OBJETIVO DEL DESPLIEGUE
Tener el backend Node.js / Express de **TucuRed Engine** (con API REST, Baileys WhatsApp y despacho de reservas) corriendo 24/7 en la nube con **costo $0 USD**, utilizando la capa gratuita de Render y un monitor de Keep-Alive en UptimeRobot para evitar el apagado de la instancia por inactividad.

---

## 🛠️ 2. PASO A PASO: DESPLIEGUE EN RENDER.COM

```
┌───────────────────────────┐       ┌───────────────────────────┐       ┌───────────────────────────┐
│     Repositorio GitHub    │  ──►  │    Render.com Blueprint   │  ──►  │   UptimeRobot Monitor     │
│ (escueladecotortas/tucu..)│       │ (render.yaml Free Tier)   │       │ (Ping /health cada 5 min) │
└───────────────────────────┘       └───────────────────────────┘       └───────────────────────────┘
```

### Paso 1: Importar Repositorio en Render
1. Ingresa a [https://dashboard.render.com/](https://dashboard.render.com/) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en el botón superior **`New +`** y selecciona **`Blueprint`**.
3. Conecta el repositorio **`tucured-engine`** (o `escueladecotortas/tucured-engine`).
4. Render detectará automáticamente el archivo `render.yaml` ubicado en la raíz del proyecto.
5. Haz clic en **`Apply`**.

### Paso 2: Configuración Automática Aplicada por `render.yaml`
- **Plan:** Free ($0/mes).
- **Runtime:** Node.js.
- **Build Command:** `npm install`
- **Start Command:** `node backend/server.js`
- **Health Check Path:** `/health`
- **Variables de Entorno:** `NODE_ENV=production`, `PORT=10000`, `LOCAL_FIRST_STORAGE=true`.

*Render generará una URL pública segura con HTTPS, por ejemplo:*  
`https://tucured-engine-backend.onrender.com`

---

## ⏱️ 3. PASO A PASO: MONITOR KEEP-ALIVE EN UPTIMEROBOT

Render apaga los Web Services gratuitos tras **15 minutos de inactividad**. Al enviar una solicitud HTTP cada **5 minutos**, UptimeRobot mantiene el servidor despierto de forma indefinida sin costo.

1. Ingresa a [https://uptimerobot.com/](https://uptimerobot.com/) y accede a tu panel.
2. Haz clic en **`+ Add New Monitor`**.
3. Completa los siguientes campos:
   * **Monitor Type:** `HTTP(s)`
   * **Friendly Name:** `TucuRed Backend Keep-Alive`
   * **URL (or IP):** `https://tucured-engine-backend.onrender.com/health` *(reemplazar por tu subdominio de Render)*
   * **Monitoring Interval:** `Every 5 minutes`
   * **Monitor Timeout:** `30 seconds`
4. Haz clic en **`Create Monitor`**.

---

## 🔍 4. VALIDACIÓN DE ENDPOINTS DE SALUD

Una vez desplegado y monitoreado, los siguientes endpoints certifican el estado en vivo:

### A. Root Health Check (`GET /health`)
```http
GET https://tucured-engine-backend.onrender.com/health
```
**Respuesta esperada (HTTP 200 OK):**
```json
{
  "status": "online",
  "uptime": 1420,
  "timestamp": "2026-08-21T22:50:00.000Z",
  "baileysState": "OPEN",
  "service": "tucured-engine-backend"
}
```

### B. Estado Baileys WhatsApp (`GET /api/wa/status`)
```http
GET https://tucured-engine-backend.onrender.com/api/wa/status
```
**Respuesta esperada:**
```json
{
  "status": "OPEN",
  "isConnected": true,
  "hasQr": false
}
```

---

## 🛡️ 5. RESILIENCIA Y PERSISTENCIA CLOUD
- **Local-First Resiliente:** Los datos de configuración y reservas operan sobre `localStorage` en el cliente y sincronización asíncrona hacia el microservicio Express.
- **Auto-Recuperación:** Ante reinicios del contenedor, el servidor recrea automáticamente los directorios necesarios (`data/`, `auth_info_baileys/`) con tolerancia a fallas.
