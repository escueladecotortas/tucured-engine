<!-- Archivo: docs/especificacion_multi_rubro_l3.md -->
# ⚙️ ESPECIFICACIÓN TÉCNICA: MOTOR L3 MULTI-RUBRO UNIVERSAL
> **Satélite:** `tucured-engine` | **Archivo Maestro:** `backend/stitch/widgets/booking/rubros_presets.json`  
> **Autoría Swarm:** CODI (Ingeniería), ATENEA (Arte), ELARA (Bóveda) y ARGUS (QA)  
> **Versión del Protocolo:** Nexus OS v11.1 (Local-First SSOT)

---

## 📋 1. RESUMEN EJECUTIVO

El **Motor Nivel 3 (L3)** de TucuRed Engine se diseña bajo un principio de **abstracción universal desacoplada**. En lugar de construir soluciones rígidas para cada sector de actividad, el sistema opera a través de una **Capa de Presets Parametrizados** (`rubros_presets.json`) que define la semántica, etiquetas, intervalos temporales, flags de campos obligatorios y catálogo inicial para cualquier negocio de servicios.

---

## 🎭 2. MATRIZ DE PRESETS DE RUBRO SOPORTADOS

| Rubro ID | Nombre Comercial | Entidad Profesional (`labelStaff`) | Entidad Espacial (`labelPlace`) | Intervalo Base | Campo Cobertura (`requireInsuranceField`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`barberia`** | Barbería Tradicional & Estudio | *Barbero* / *Barberos* | *Sillón* | 30 min | `false` |
| **`peluqueria_estetica`** | Peluquería & Centro de Estética | *Estilista* / *Estilistas* | *Puesto* | 30 min | `false` |
| **`salud_consultorio`** | Consultorio Médico & Salud | *Profesional* / *Médicos* | *Consultorio* | 20 min | `true` (Obra Social) |
| **`profesional_servicios`** | Estudio Jurídico / Contable | *Consultor* / *Socios* | *Sala de Reunión* | 60 min | `false` |

---

## 🧩 3. ESQUEMA DEL PRESET CONFIGURABLE (`rubros_presets.json`)

```json
{
  "id": "salud_consultorio",
  "name": "Consultorio Médico & Salud Integral",
  "icon": "🩺",
  "themeColor": "#0284c7",
  "labels": {
    "staffSingular": "Profesional",
    "staffPlural": "Profesionales Médicos",
    "staffSelectorTitle": "Selecciona el Especialista",
    "staffAnyLabel": "Primer Turno Disponible",
    "serviceSingular": "Consulta / Estudio",
    "servicePlural": "Consultas & Prácticas",
    "serviceSelectorTitle": "Tipo de Consulta Médica",
    "placeSingular": "Consultorio",
    "placePlural": "Consultorios"
  },
  "config": {
    "slotIntervalMinutes": 20,
    "bufferGapMinutes": 5,
    "allowAnyStaff": false,
    "requireInsuranceField": true,
    "showStaffPhotos": true,
    "maxAdvanceBookingDays": 30,
    "cancellationDeadlineHours": 12
  },
  "servicesSeed": [
    { "id": "srv-consulta", "name": "Consulta Clínica General", "duration": 20, "price": 20000, "icon": "🩺" },
    { "id": "srv-control", "name": "Control de Rutina", "duration": 20, "price": 15000, "icon": "📋" }
  ]
}
```

---

## 🔄 4. ARQUITECTURA DE ENLACE DINÁMICO (WIDGET & ADMIN L3)

```
                       ┌──────────────────────────────┐
                       │     rubros_presets.json      │
                       └──────────────┬───────────────┘
                                      │
              ┌───────────────────────┴───────────────────────┐
              ▼                                               ▼
┌───────────────────────────┐                   ┌───────────────────────────┐
│ booking_l3_turnero.html   │                   │      admin_l3.html        │
├───────────────────────────┤                   ├───────────────────────────┤
│ • Muta títulos y badges   │                   │ • Selector de Rubro Activo│
│ • Activa campo Obra Social│                   │ • Grilla Staff personalizada│
│ • Calcula slots contiguos │                   │ • Métricas según tipo     │
│ • Despacho WhatsApp L3    │                   │ • Exportación .CSV/.ICS   │
└───────────────────────────┘                   └───────────────────────────┘
```

### A. Comportamiento en `booking_l3_turnero.html` (Vista Cliente)
1. Lee `data-rubro="barberia"` o el valor en `stitch-manifest.json`.
2. Si `requireInsuranceField === true`, inyecta en el Paso 4 el input: `[ Obra Social / Cobertura Médica (Opcional/Obligatorio) ]`.
3. Calcula el bloqueo de slots según la `duration` del servicio elegido (ej. 40 min = 2 slots de 20 min).
4. Asigna automáticamente el profesional o valida contra la agenda individual de `staffId`.

### B. Comportamiento en `admin_l3.html` (Panel Operativo)
1. **Selector de Rubro en Configuración:** Permite cambiar el rubro del negocio con un clic, reescribiendo títulos y sugerencias de catálogo sin recargar la base de datos.
2. **Línea de Tiempo Multi-Sillón:** Renderiza tantas columnas como profesionales activos existan en `tucu_l3_staff`.
3. **Persistencia Local-First SSOT:** Todo cambio se guarda en `localStorage` (`tucu_l3_config`, `tucu_l3_staff`, `tucu_l3_services`, `tucu_l3_bookings`).

---

## 🛡️ 5. CERTIFICACIÓN DE CALIDAD & RENDIMIENTO
- **Cero Hardcoding:** Cero cadenas de texto rígidas en el motor; todas provienen de `labels`.
- **Ley de 200 Líneas:** El parser de presets y el cargador de componentes se dividen en módulos atómicos.
- **Soberanía y Fricción Cero:** Compatible 100% con Baileys y el portal de autogestión `gestion_turno.html`.
