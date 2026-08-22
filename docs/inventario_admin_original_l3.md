<!-- Archivo: docs/inventario_admin_original_l3.md -->
# 🏛️ INVENTARIO FORENSE: ADMIN ORIGINAL DE APP BARBERÍA
> **Ubicación Base:** `public/clients/barber-l3/src/app/admin/` y `src/components/admin/`  
> **Autoría Swarm:** CODI (Ingeniería), ATENEA (Arte), ELARA (Bóveda) y ARGUS (QA)  
> **Versión del Protocolo:** Nexus OS v11.1 (Local-First SSOT)

---

## 📋 1. RESUMEN EJECUTIVO DE AUDITORÍA

La aplicación importada cuenta con una **suite administrativa completa en Next.js (App Router)** estructurada bajo `src/app/admin/`. Esta suite comprende módulos de **Gestión de Turnos**, **Configuración de Personal/Especialistas**, **Catálogo de Servicios**, **Directorio de Clientes**, **Parámetros del Sistema** y **Carga Manual de Turnos con Notificación por WhatsApp**.

A continuación se detalla el censo componente por componente, evaluando su lógica interna, dependencias y plan de rescate/adaptación hacia nuestra arquitectura soberana `public/admin_l3.html`.

---

## 🔍 2. INVENTARIO DETALLADO DE VISTAS Y COMPONENTES

### A. Módulo de Turnos (`src/app/admin/turnos/`)
- **`page.jsx`**: Panel principal con selector de fecha, filtros de estado (`CONFIRMADO`, `CANCELADO`, `COMPLETADO`), switch de vista y métricas reactivas.
- **`components/DesktopTable.jsx`**: Grilla tabular para monitores desktop con columnas de Horario, Cliente, Teléfono, Servicio, Especialista, Estado y Acciones rápidas (WhatsApp, Cancelar, Reagendar).
- **`components/MobileCardList.jsx`**: Vista de tarjetas adaptativas para vista en teléfonos móviles con swipe actions y botones de contacto directo.
- **`components/WhatsAppManualModal.jsx`**: Modal interactivo para despacho manual de mensajes de WhatsApp con previsualización en vivo de burbuja y reemplazo de variables.
- **`components/FormModals.jsx`**: Modales de edición de datos del turno y confirmación de cancelación.
- **`components/ServicesSelector.jsx`**: Selector interactivo de servicios con cálculo dinámico de precio total.

### B. Módulo de Personal / Staff (`src/app/admin/configuracion/personal/`)
- **`page.jsx`**: Directorio de profesionales activos con tarjetas de perfil.
- **`components/GridDisplay.jsx`**: Visualizador de especialistas con avatar, rol, estado (Activo/Inactivo) y métricas de turnos atendidos.
- **`components/AvailabilityColumn.jsx`**: Editor de disponibilidad horaria por día de la semana y descansos individuales por profesional.
- **`components/FormModals.jsx`**: Modal de alta y edición de staff (nombre, foto, teléfono, servicios habilitados).

### C. Módulo de Servicios (`src/app/admin/configuracion/servicios/`)
- **`page.jsx`**: Gestor de catálogo con agrupación por categorías.
- **`components/TableList.jsx`**: Tabla interactiva de servicios con duración (minutos), precio ($ ARS), categoría y switch de visibilidad.
- **`components/FormModals.jsx`**: Modal para crear o modificar servicios con selector de duración en bloques de tiempo.

### D. Módulo de Sistema & Parámetros (`src/app/admin/configuracion/sistema/`)
- **`components/BookingParamsManager.jsx`**: Configuración de intervalos de slots (15, 20, 30, 45, 60 min), días de anticipación máxima y horarios de apertura/cierre general.
- **`components/HolidaysManager.jsx` & `HolidaysTable.jsx`**: Gestor de feriados y cierres especiales con carga por rango.
- **`components/ServiceBlocksManager.jsx`**: Definición de bloques de tiempo y gap buffers entre citas.
- **`components/UsersManager.jsx`**: Control de acceso de administradores y roles.

### E. Componentes Base de UI (`src/components/admin/`)
- **`DarkDatePicker.jsx`**: Selector de fechas con estética oscura, highlighting de fines de semana y feriados.
- **`LoginForm.jsx`**: Pantalla de autenticación con feedback de errores y soporte para credenciales maestras.

---

## 🔄 3. PLAN DE MIGRACIÓN & DESACOPLE HACIA `admin_l3.html`

```
┌──────────────────────────────────────────────┐       ┌──────────────────────────────────────────────┐
│          ADMIN REACT ORIGINAL                │       │            NEXUS ADMIN L3 SOBERANO           │
├──────────────────────────────────────────────┤       ├──────────────────────────────────────────────┤
│ • Next.js App Router (Client/Server)         │  ──►  │ • Vanilla JS + Tailwind CSS (Zero Runtime)    │
│ • Firestore SDK (getDocs, addDoc, onSnapshot)│  ──►  │ • LocalStorage SSOT (tucu_l3_bookings)       │
│ • Acoplado a modelo rígido de Barbería       │  ──►  │ • Abstracción Multi-Rubro por Presets JSON   │
│ • Despacho WhatsApp vía wa.me manual         │  ──►  │ • Despacho Automático Asíncrono Baileys API  │
└──────────────────────────────────────────────┘       └──────────────────────────────────────────────┘
```

1. **Purga de Dependencias Cloud:** Reemplazar todas las funciones de `firebase/firestore` por el adaptador soberano `local_first_db.js` / `localStorage`.
2. **Reutilización de Layouts & UX:** Adoptar los componentes visuales probados (`DesktopTable`, `AvailabilityColumn`, `BookingParamsManager`, `WhatsAppManualModal`) portándolos a la arquitectura estándar de archivo único estructurado `public/admin_l3.html` (< 200 líneas por submódulo).
3. **Parametrización por Rubro:** Conectar la interfaz con `rubros_presets.json` para que los textos, campos y catálogos muten dinámicamente según el rubro seleccionado.
