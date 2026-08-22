<!-- Archivo: docs/informe_arquitectura_l3.md -->
# 💈 INFORME DE ARQUITECTURA TÉCNICA: EVOLUCIÓN NIVEL 3 (L3)
> **Satélite:** `tucured-engine` | **Base de Referencia:** Barbería La Fachada (`public/clients/la-fachada-l3/`)  
> **Autoría Swarm:** NEXUS (COO), CODI (Ingeniería), ATENEA (Arte), ELARA (Bóveda), ICARO (Conversión) y ARGUS (QA)  
> **Versión del Protocolo:** Nexus OS v11.1 (Local-First SSOT)

---

## 📋 1. RESUMEN EJECUTIVO

El presente documento establece la propuesta técnica y arquitectónica para la transición del sistema de turnos de **Nivel 2 (L2: Asíncrono Monousuario)** a **Nivel 3 (L3: Multi-Staff, Multi-Servicio & Automatizaciones Proactivas)**, tomando como base flagship el negocio de **La Fachada Barber Club** en San Miguel de Tucumán.

Mientras que L2 resolvió de forma estricta las colisiones monousuario, la persistencia en `localStorage`, la autogestión por token hash (`#TK-XXXX`) y la confirmación web nativa con despacho vía Baileys, **L3 expande el motor hacia operaciones complejas de múltiples profesionales en paralelo con duraciones variables por servicio y recordatorios automáticos programados**.

---

## 🔍 2. INVENTARIO & DIAGNÓSTICO DE COMPONENTES BASE

### A. Estructura de la Landing (`public/clients/la-fachada/` y `la-fachada-l3/`)
- **Framework & Estilos:** HTML5 semántico con Tailwind CSS v3/v4 embebido, tipografías modernas Google Fonts (`Outfit`, `Inter`, `JetBrains Mono`).
- **Paleta de Identidad:** `barbershop-dark` con acentos en ámbar (`#f59e0b`, `#fbbf24`) y fondos profundos zinc (`#09090b`, `#18181b`).
- **Secciones Clave:**
  1. `Header`: Identidad de marca, badge de estado y acceso rápido a reservas.
  2. `Hero Section`: Propuesta de valor, llamado a la acción y tarjeta de datos de contacto.
  3. `Staff Section` (L3): Grilla de profesionales con especialidad y foto/avatar.
  4. `Services Section`: Catálogo con precio y duración en minutos.
  5. `Booking Section`: Contenedor `#nexus-booking_turnero_l3_widget` con iframe o widget embebido.
  6. `Footer`: Enlaces legales y créditos del motor TucuRed.

### B. Manifiestos de Configuración
- `stitch-manifest.json`: Metadatos del negocio, categoría (`barberia`), tier (`L3`) y lista de widgets.
- `widget-manifest.json`: Parámetros de inyección del turnero (`turnero_l3`, `staffEnabled: true`, `servicesEnabled: true`).
- `client-assets.json`: Rutas relativas a logotipos, banners y galerías.

---

## 🚀 3. VECTORES DE EVOLUCIÓN L3

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                       CLIENT JOURNEY NIVEL 3 (L3)                              │
├────────────────────────────────────────────────────────────────────────────────┤
│  [Paso 1: Barbero]  ──►  [Paso 2: Servicio]  ──►  [Paso 3: Fecha/Hora]         │
│  (Mateo / Lucas / Any)   (Corte / Barba / Combo)  (Slots dinámicos s/ duración)│
│                                                                                │
│  ──►  [Paso 4: Contacto]  ──►  [Paso 5: Revisión]  ──►  [Paso 6: Éxito Web]   │
│       (Tel / Nombre)           (Resumen Total)          (TK-XXXX + ICS)        │
│                                                               │                │
│                                                               ▼                │
│                                                   [Despacho Automático Baileys]│
│                                                   [Cron Recordatorio T-2hs]    │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Vector 1: Multi-Staff / Barberos Independientes
- Selección explícita del profesional que atenderá al cliente (ej. *Mateo*, *Lucas*) o la opción comodín *"Cualquier Barbero (Primer Disponible)"*.
- Cada barbero cuenta con su propia matriz horaria, descansos y vacaciones aisladas.
- Al seleccionar *"Cualquier Barbero"*, el sistema evalúa la unión de disponibilidades y asigna al profesional libre con menor carga horaria en el día.

### Vector 2: Catálogo de Servicios con Duración Variable
- Cada servicio define una duración en minutos:
  * `Corte Clásico & Fade`: 30 minutos (1 slot).
  * `Ritual de Barba`: 20 minutos (1 slot).
  * `Combo La Fachada Total`: 50 minutos (2 slots consecutivos requeridos).
- **Cálculo Dinámico de Disponibilidad:** Un turno de 50 minutos requiere que existan 2 slots libres contiguos en la agenda del barbero seleccionado.

### Vector 3: Matriz de Concurrencia & Persistencia L3
- Estructura de persistencia `tucu_l3_bookings`:
  * Almacenamiento segregado por `staffId` y fecha ISO.
  * Soporte de concurrencia: 2 clientes pueden reservar a la misma hora exacta (ej. 16:00 hs) si eligen profesionales diferentes.

### Vector 4: Automatizaciones & Recordatorios Proactivos (Baileys)
- **Mensaje Inmediato:** Despacho del comprobante web con ID `#TK-XXXX` y enlace de autogestión (`/gestion_turno.html?token=TK-XXXX`).
- **Cron Job de Recordatorios (T-2hs):** Servicio en segundo plano que consulta los turnos del día y despacha automáticamente un mensaje 2 horas antes de la cita con botones de confirmación o cancelación rápida.

### Vector 5: Panel Operativo Multi-Rol en Admin L3
- Selector de vista por barbero:
  * **Vista General del Salón:** Línea de tiempo multi-columna (estilo calendario médico/barbería) con todos los sillones en simultáneo.
  * **Vista Individual:** Vista filtrada para que cada profesional consulte exclusivamente su agenda diaria en su dispositivo móvil.

---

## 💾 4. MODELO DE DATOS L3 (ESPECIFICACIÓN LOCAL-FIRST)

### A. Estructura del Turno (`tucu_l3_bookings`)
```json
{
  "id": "TK-94A2",
  "client": "Rodrigo Gómez",
  "phone": "3815987654",
  "staffId": "staff-1",
  "staffName": "Mateo",
  "serviceId": "srv-combo",
  "serviceName": "Combo La Fachada Total",
  "durationMinutes": 50,
  "slotsRequired": 2,
  "date": "2026-08-26",
  "time": "16:00",
  "endTime": "16:50",
  "price": 18000,
  "status": "CONFIRMED",
  "reminderSent": false,
  "createdAt": "2026-08-21T21:40:00.000Z"
}
```

### B. Estructura de Staff (`tucu_l3_staff`)
```json
[
  {
    "id": "staff-1",
    "name": "Mateo",
    "role": "Master Fade",
    "avatar": "🧔🏻‍♂️",
    "active": true,
    "schedule": {
      "1": { "enabled": true, "open": "10:00", "close": "20:00" },
      "2": { "enabled": true, "open": "10:00", "close": "20:00" }
    }
  },
  {
    "id": "staff-2",
    "name": "Lucas",
    "role": "Clásico & Navaja",
    "avatar": "👨🏽‍🦱",
    "active": true,
    "schedule": {
      "1": { "enabled": true, "open": "09:30", "close": "19:00" },
      "2": { "enabled": true, "open": "09:30", "close": "19:00" }
    }
  }
]
```

---

## 📅 5. PLAN DE FASES DE IMPLEMENTACIÓN

| Fase | Denominación | Entregables Principales |
| :--- | :--- | :--- |
| **Fase 1** | **Motor de Concurrencia & Catálogos L3** | Esquemas `tucu_l3_staff`, `tucu_l3_services` y cálculo de slots múltiples contiguos en `backend/stitch/widgets/booking/booking_l3_turnero.html`. |
| **Fase 2** | **Widget Cliente L3 & Wizard Extendido** | UI fluida con selector de barbero, selector de servicio, cálculo en tiempo real y tarjeta de éxito. |
| **Fase 3** | **Panel Administrador Multi-Sillón (`admin_l3.html`)** | Calendario de turnos multi-columna, gestión de staff, asignación manual y bloqueo individual por barbero. |
| **Fase 4** | **Automatización de Recordatorios Baileys** | Cron scheduler en NodeJS que audita turnos próximos y despacha recordatorios `T-120min`. |

---

## 🛡️ 6. CERTIFICACIÓN Y CUMPLIMIENTO DOCTRINA DE HIERRO
- **Soberanía Local-First:** Persistencia transparente en el navegador y sincronización asíncrona hacia Express / Baileys.
- **Protocolo PEAC:** Cero fragmentos; todos los módulos se modularizan en submódulos atómicos (< 180 líneas).
- **Cero Fricción en el Flujo:** Confirmación nativa en pantalla con fallback seguro de comunicación.
