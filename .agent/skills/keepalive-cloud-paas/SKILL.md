---
name: keepalive-cloud-paas
description: Patrón de resiliencia y costo $0 para servicios Node.js en PaaS gratuitos (Render.com) usando endpoints ultralivianos /health y pings periódicos externos (UptimeRobot).
---

# Skill: Keep-Alive Cloud PaaS $0 (Nexus OS v11.1)

## 📌 Contexto & Propósito
Los Web Services en tiers gratuitos de proveedores como Render.com se suspenden automáticamente tras 15 minutos sin tráfico HTTP entrante, provocando demoras de 50+ segundos en el arranque (cold start).

## 🛠️ Implementación del Patrón
1. **Endpoint Ultraliviano (`GET /health`)**:
   - Responde inmediatamente con `HTTP 200 OK` y un JSON mínimo con métricas de uptime y estado del proceso.
   - Cero consultas a base de datos pesadas o I/O bloqueante.
2. **Infraestructura como Código (`render.yaml`)**:
   - Declara el blueprint del servicio (`plan: free`, `startCommand`, `healthCheckPath: /health`).
3. **Monitor Externo (UptimeRobot / Cron Ping)**:
   - Configurar un monitor HTTP hacia `https://<tu-app>.onrender.com/health` con intervalo de **5 minutos**.
   - Garantiza que la instancia permanezca despierta 24/7 sin incurrir en costos.

## ⚖️ Doctrina de Uso
- Nunca bloquear el endpoint `/health` con autenticación pesada ni sockets no inicializados.
- Utilizar siempre retorno con fallback defensivo.
