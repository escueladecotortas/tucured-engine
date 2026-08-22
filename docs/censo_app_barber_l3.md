<!-- Archivo: docs/censo_app_barber_l3.md -->
# 💈 CENSO TÉCNICO & MAPEADO ESTRUCTURAL: APP BARBERÍA L3
> **Origen Físico:** `C:\Users\leola\Downloads\la-fachada`  
> **Destino Aislado & Neutralizado:** `public/clients/barber-l3/`  
> **Autoría Swarm:** NEXUS (COO), CODI (Ingeniería), ELARA (Bóveda), ATENEA (Arte) y ARGUS (QA)  
> **Versión del Protocolo:** Nexus OS v11.1 (Local-First SSOT)

---

## 📋 1. RESUMEN DE IMPORTACIÓN & NEUTRALIZACIÓN

Se ha completado la importación física e íntegra del proyecto de Barbería desde su ubicación en disco hacia el ecosistema satélite de `tucured-engine`. Durante el proceso de ingesta se aplicó una **sanitización estricta de marcas**, reemplazando cualquier mención explícita por la identidad neutral de laboratorio: **`Nexus Barber L3` / `Barber Studio L3`**.

---

## 🌳 2. ÁRBOL ESTRUCTURAL DE ARCHIVOS IMPORTADOS

```
public/clients/barber-l3/
├── assets/                          # Assets estáticos directos para servidor local
│   ├── css/main.css                 # Bundle de estilos procesados (132 KB)
│   ├── images/                      # Fotos de cortes, salón, logos neutralizados
│   └── js/nexus-scheduler-bundle.js # Lógica JS empaquetada del agendador
├── src/                             # Código fuente Next.js / React
│   ├── app/                         # App Router (layout.jsx, page.jsx, globals.css)
│   ├── components/
│   │   ├── admin/                   # Vistas administrativas previas
│   │   ├── booking/                 # ServiceSelector.jsx y componentes de reserva
│   │   ├── layout/                  # Header, Footer, TopNavBar
│   │   ├── sections/                # Hero.jsx, ServiceGrid.jsx, ServiceCard.jsx, etc.
│   │   └── widgets/NexusScheduler/  # Suite completa del turnero React (9 submódulos)
│   │       ├── BookingSummary.jsx   # Resumen de cita
│   │       ├── ClientForm.jsx       # Formulario y validación de teléfono/nombre
│   │       ├── Confirmation.jsx     # Confirmación de reserva
│   │       ├── ElegantDatePicker.jsx# Calendario elegante
│   │       ├── ReminderModal.jsx    # Modal de recordatorios
│   │       ├── SlotGrid.jsx         # Grilla de turnos
│   │       ├── TicketView.jsx       # Comprobante ticket
│   │       ├── TimePicker.jsx       # Selector de horas y slots
│   │       └── index.jsx            # Controlador maestro del modal
│   ├── context/                     # Contextos globales de autenticación y estado
│   └── lib/                         # Clientes Firebase y utilidades
├── public/                          # Directorio de assets públicos original
│   ├── index.html                   # Entry point estático con Tailwind & NexusScheduler
│   ├── servicios-dev.html           # Vista standalone de desarrollo y testing
│   └── assets/                      # Espejo de imágenes y CSS
├── out/                             # Export estático optimizado (Next.js SSG)
├── package.json                     # Manifiesto de dependencias npm
├── next.config.mjs                  # Configuración de compilación Next.js
└── index.html                       # Entry point raíz para HTTP Server (:5005)
```

---

## 🛠️ 3. PILA TECNOLÓGICA DETECTADA

| Capa | Tecnología / Herramienta | Diagnóstico & Estado |
| :--- | :--- | :--- |
| **Framework Base** | Next.js 14/15 (App Router) + React 18/19 | Arquitectura modular con componentes cliente (`use client`) y Server Components. |
| **Diseño & Estilos** | Tailwind CSS + Google Fonts (`Geist`, `Hanken Grotesk`) | Paleta sofisticada `primary-container: #720E1C` (vino tinto/ámbar) con glassmorphism (`glass-panel`). |
| **Iconografía** | Material Symbols Outlined + Lucide Icons | Conjunto de glifos minimalistas de tijeras, navajas y calendario. |
| **Agendador Previo** | `NexusScheduler` (React) | Modal multicapa con selección de barbero, servicio, fecha y hora. |
| **Persistencia Original** | Firebase Firestore (SDK v11) | Acceso directo cliente-cloud con colección de turnos y especialistas. |

---

## 🔌 4. PUNTOS DE ACOPLE PARA EL MOTOR L3 (TUCURED ENGINE)

### A. Desacople de Dependencias Cloud $\rightarrow$ Soberanía Local-First
- La solución original dependía de credenciales Firebase client-side.
- **Evolución L3:** Se sustituye la llamada a Firestore por el almacenamiento local `tucu_l3_bookings` + sincronización asíncrona hacia el Microservicio Express / Baileys (`/api/wa/send-booking`).

### B. Inyección del Widget Universal (`booking_l3_turnero.html`)
- El contenedor `#nexus-scheduler-root` o la sección `#servicios-engine` en `index.html` sirve como punto de montaje nativo para el nuevo componente L3 sin requerir compilación compleja en runtime.

### C. Mapeo de Especialistas y Catálogo
- **Staff:** Mateo (Master Fade), Lucas (Clásico & Navaja) y opción comodín *"Cualquier Barbero"*.
- **Servicios:** 
  * Corte Clásico & Fade (30 min / 1 slot).
  * Ritual de Barba & Toalla (20 min / 1 slot).
  * Combo Total (50 min / 2 slots consecutivos).

---

## 🚀 5. PLAN DE INTEGRACIÓN INMEDIATO

1. **Servidor Local Activo:** `public/clients/barber-l3/index.html` ya se encuentra accesible en `http://localhost:5005/clients/barber-l3/index.html` con todos sus assets relativos resueltos (CSS, imágenes y scripts).
2. **Desarrollo del Widget L3:** Construir `backend/stitch/widgets/booking/booking_l3_turnero.html` aprovechando los patrones de diseño y UX rescatados de `NexusScheduler`.
3. **Validación Continua:** Garantizar paridad total con la Doctrina de Hierro y la Ley de 200 Líneas.
