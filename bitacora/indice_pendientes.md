# Índice de Pendientes & Bitácora - 21/08/2026

## Logros de la Sesión (Nexus OS v11.1)
- **[TASK-058]**: Bifurcación de Turneros L1/L2, Alto Contraste y Encapsulamiento de UI.
- **[TASK-059]**: Reingeniería Parametrizada de Turnero L1 y Showroom Split-Screen en Vivo (`showroom_l1.html`).
- **[TASK-060]**: Portabilidad de Configuración Avanzada L3 hacia Showroom L1 (Días laborables, Feriados y Plantilla WhatsApp con Tokens).
- **[TASK-061]**: Salteo Dinámico de Días Inactivos, Chat Preview WA, Persistencia Local y Excepciones de Feriados.
- **[TASK-062]**: Horario Partido (Corte de Siesta), Saneamiento Visual y Admin Drawer Mobile-First.
- **[TASK-063]**: Optimización de Inputs Táctiles, Formato de Nombres y Ajuste Visual Paso 3 en Turnero L1.
- **[TASK-064]**: Proof of Concept (PoC) Micro-Servicio WhatsApp Local-First con `@whiskeysockets/baileys` (`wa_node.cjs` y `wa_routes.cjs`).
- **[TASK-065]**: Integración Visual de Vinculación QR Baileys en Panel Admin Showroom L1.
- **[TASK-066]**: Wizard Onboarding Seguro en 3 Pasos, Erradicación de Alerts Nativos y Auto-Inyección en Identidad.
- **[TASK-067]**: Horarios Independientes por Día de la Semana en Admin y Turnero L1 con generador de slots diferenciado.
- **[TASK-068]**: Horario Corrido por Defecto (`isSplit: false`), Desahogo Visual de WhatsApp (cero scroll interno) y Censo Exhaustivo de Variables vs Mocks.
- **[TASK-069]**: Saneamiento de Nombres por Defecto ("Nexus Studio Demo") y Purga de Layout Split-Screen.
- **[TASK-070]**: Módulo de Vacaciones y Cierres por Rango en L1 y L2 con bloqueo dinámico de fechas.
- **[TASK-071]**: Arquitectura Multi-Vista en Admin L2 (Calendario de Turnos + Directorio CRM de Clientes + Configuración).
- **[TASK-072]**: Refactorización de Nomenclatura a "Cronograma" e Iconografía Moderna de Gestión Temporal.
- **[TASK-073]**: Desacople Estructural L2 en Pantallas Dedicadas (`admin_l2.html` vs. `demo_l2_cliente.html`).
- **[TASK-074]**: Aislamiento Físico L2 y Purga de Capas Flotantes Superpuestas en Mobile.
- **[TASK-075]**: Unificación Arquitectónica (Admin Puro / Cliente Puro L1 y L2) y Nuevo Showroom de Catálogo.
- **[TASK-076]**: Erradicación de Bucle de Iframes & Mockup de Smartphone Premium en `public/tucu_widgets.html`.
- **[TASK-077]**: Lógica Profunda Turnero L2 (Colisiones en vivo, Token Hash `#TK-XXXX`, Portal `gestion_turno.html` y Carga Manual).
- **[TASK-078]**: Restauración Crítica del Renderizado Completo e Interactivo en `admin_l2.html` (Matriz 7 días, Feriados, Wizard Baileys y Dropzone).
- **[TASK-079]**: Reingeniería del Client Journey L2 con Confirmación 100% Web Nativa y Despacho Automático vía Baileys API.
- **[TASK-080]**: Scaffolding L3 Basado en La Fachada e Informe de Arquitectura Técnica (`docs/informe_arquitectura_l3.md`).
- **[TASK-081]**: Importación de App Real desde Disco (`C:\Users\leola\Downloads\la-fachada` a `public/clients/barber-l3/`), Neutralización y Censo Estructural.
- **[TASK-082]**: Rescate del Admin Original de la App Base y Especificación del Motor L3 Multi-Rubro con Presets Parametrizados (`rubros_presets.json`).
- **[TASK-083]**: Configuración de Despliegue Cloud $0 (Render.com `render.yaml` + Keep-Alive `/health` en UptimeRobot).

## Pendientes Futuros & Banco de Ideas
- **[IDEA-001]**: Inspección visual en pantalla completa del preview local de 100 ÓPTICAS (`http://localhost:5005`) para corroborar el turnero clínico.
- **[IDEA-003]**: Evaluar Cloudflare R2 o túnel temporal de assets para fotos cacheadas en disco si la CDN de Instagram caduca firmas `_nc_ohc`.
- **[IDEA-004]**: Implementación del widget universal `booking_l3_turnero.html` con consumo reactivo de `rubros_presets.json`.
- **[IDEA-005]**: Ensamblado de `admin_l3.html` unificando la vista multi-columna de staff y el selector dinámico de rubro.
- **[IDEA-006]**: Automatización de cron job para recordatorios programados por WhatsApp (T-2hs).
- **[IDEA-007]**: Conexión del repositorio en Render.com y activación de monitor HTTP cada 5 minutos en UptimeRobot.
