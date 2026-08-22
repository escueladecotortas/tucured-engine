# MANUAL MAESTRO DE OPERACIONES — Nexus Barber L3
## Ecosistema Digital Soberano — Versión v11.96-PLATINUM

Este documento consolida el manual técnico e instructivo de operación para el ecosistema **Nexus Barber L3 Unisex**. Su enfoque es puramente operacional y técnico, describiendo con exactitud matemática el "cómo se hace" y el comportamiento real del sistema a partir de las fuentes de código de producción.

---

## ÍNDICE DE MÓDULOS

1. [EL TURNERO PÚBLICO (LANDING DE CARA AL CLIENTE)](#1-el-turnero-público-landing-de-cara-al-cliente)
2. [EL PANEL ADMINISTRATIVO (EL BÚNKER DE GESTIÓN DIARIA)](#2-el-panel-administrativo-el-búnker-de-gestión-diaria)
3. [ALTA MANUAL E INTELIGENCIA DE TURNOS](#3-alta-manual-e-inteligencia-de-turnos)
4. [WHATSAPP Y SANITIZACIÓN INTELIGENTE DE TELÉFONOS](#4-whatsapp-y-sanitización-inteligente-de-teléfonos)
5. [ADMINISTRACIÓN DE ACTIVOS (ABMS) Y CRM DE CLIENTES](#5-administración-de-activos-abms-y-crm-de-clientes)
6. [CONFIGURACIÓN DEL SISTEMA Y MOTOR DE SEGURIDAD](#6-configuración-del-sistema-y-motor-de-seguridad)

---

## 1. EL TURNERO PÚBLICO (LANDING DE CARA AL CLIENTE)

El motor de reserva público está orquestado por el componente `NexusScheduler` ([src/components/widgets/NexusScheduler/index.jsx](file:///c:/Users/leola/Downloads/barber-l3/src/components/widgets/NexusScheduler/index.jsx)). Su interfaz presenta un flujo guiado brutalista diseñado para la fricción cero del cliente final, eliminando por completo inputs redundantes.

### A. Flujo Secuencial de Reserva (3 Pasos + Confirmación)
El turnero público avanza a través de una máquina de estados controlada por la variable de estado `step`:

1. **Paso 1: Selección de Servicio y Profesional (`step === 1`):**
   * El cliente selecciona la Categoría de servicio (Barbería, Uñas, Cejas y Pestañas) y el Servicio específico a través de `ServiceSelector.jsx`.
   * En el mismo módulo, elige el Profesional (o selecciona "Cualquier Profesional" para mayor disponibilidad). Los especialistas se cargan dinámicamente desde Firestore usando hooks SWR con caché persistida en local (`localStorage.getItem('swr_cache_specialists')`).
2. **Paso 2: Selección de Fecha y Slot Horario (`step === 2`):**
   * Implementado en `TimePicker.jsx`. El cliente selecciona un día del calendario interactivo.
   * Al elegir la fecha, el sistema consulta en tiempo real a Firestore para calcular los slots horarios disponibles de forma reactiva (`SlotGrid.jsx`), excluyendo los slots ya reservados, las horas no laborables y las horas bloqueadas por servicio.
3. **Paso 3: Formulario de Datos Simplificado (`step === 3`):**
   * Operado por `ClientForm.jsx`. Se eliminó por completo el campo de fecha de nacimiento (`birthday`) del flujo del cliente para maximizar la conversión.
   * El formulario exige obligatoriamente: **Nombre**, **Apellido**, **Celular (WhatsApp)** y un campo de **Notas Opcional** donde el cliente puede detallar requerimientos especiales.
4. **Paso 4: Ticket de Confirmación de Éxito (`step === 4`):**
   * Tras procesar la reserva en la base de datos de Firestore, el turnero despliega la vista del ticket digital brutalista en `TicketView.jsx`.
   * **Sonido de Éxito:** Se dispara un efecto acústico de confirmación ("Bip Bip") reproduciendo el recurso web `https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3`.
   * El ticket muestra en un diseño de alto contraste el servicio agendado, el profesional a cargo, el precio real y la fecha/hora en formato legible.

### B. Validación de Feriados Nacionales en el Calendario
El motor de validación interviene directamente sobre el deshabilitador de fechas del calendario (`ElegantDatePicker`).
* Al pintar el calendario, el sistema contrasta cada fecha (`YYYY-MM-DD`) con el listado consolidado de feriados bloqueados activos en Firestore (`settings/holidays`).
* Si la fecha coincide con un feriado bloqueado (y no exceptuado para atención), el día aparece deshabilitado de forma absoluta en la grilla visual, impidiendo cualquier click o intento de selección por parte del cliente.

### C. Límite de Reservas Activas por Cliente
Para prevenir el abuso de turnos falsos o acaparamiento del calendario:
* Antes de confirmar la reserva, el backend del turnero realiza una consulta de conteo de turnos activos para el identificador único del cliente (`countActiveAppointments(clientId)`).
* Si el cliente cuenta con **2 o más turnos activos** en estado `pending` o `confirmed`, el flujo se bloquea inmediatamente y lanza una alerta restrictiva brutalista en pantalla con el siguiente texto:
  > **"LÍMITE DE TURNOS ALCANZADO. PODÉS TENER HASTA 2 TURNOS ACTIVOS. COMPLETÁ O CANCELÁ UNO PARA RESERVAR."**

---

## 2. EL PANEL ADMINISTRATIVO (EL BÚNKER DE GESTIÓN DIARIA)

El panel administrativo es la central táctica de control orquestada en `AdminLayout` ([src/app/admin/layout.jsx](file:///c:/Users/leola/Downloads/barber-l3/src/app/admin/layout.jsx)).

### A. Login Seguro mediante Ventana Emergente (Pop-up)
Para evitar los fallos de redirección e incompatibilidades con servidores locales y entornos de previsualización (como Netlify preview links):
* El login en `LoginForm.jsx` implementa de forma absoluta el método `signInWithPopup(auth, googleProvider)` sobre Google Auth.
* El proveedor de autenticación fuerza la selección manual de la cuenta de Google inyectando el parámetro:
  ```javascript
  googleProvider.setCustomParameters({ prompt: 'select_account' });
  ```
* Esto rompe el bucle de inicio automático no deseado. Si el usuario cierra la ventana de autenticación o se produce un rebote de red, la interfaz atrapa el código de error y despliega un cartel legible en lugar de colapsar la aplicación.

### B. AdminAuthGuard y Lista Blanca de Correos
El acceso a las rutas `/admin/*` está blindado por el componente `AdminAuthGuard`. Solo permite el ingreso y visualización de datos a los usuarios que se encuentren explitamente detallados en la lista blanca de correos autorizados:
* `leolariarg@gmail.com`
* `contacto@lafachadaunisex.ar`
* `darcyrigonat@gmail.com`

Cualquier otra cuenta de Google ajena a esta lista blanca será rebotada de inmediato hacia la página de login seguro con el mensaje correspondiente de falta de privilegios.

### C. Dashboard de Turnos en Tiempo Real
La pantalla central `/admin/turnos` ([src/app/admin/turnos/page.jsx](file:///c:/Users/leola/Downloads/barber-l3/src/app/admin/turnos/page.jsx)) carga dinámicamente toda la agenda del salón.
* Muestra la grilla de turnos históricos y del día, detallando cliente, servicio solicitado, profesional asignado, valor y estado de la reserva (`pending`, `confirmed`, `cancelled`).
* Muestra el precio cobrado real (`precioCobrado`) y la duración real (`duracionCobrada`) de cada reserva una vez completada, cruzando de forma exacta los números reales con la contabilidad.
* Cuenta con filtros avanzados por Servicio, Estado y Profesional para facilitar la navegación rápida.

### D. Sistema de Alertas Sonoras (Platinum Stream)
El panel cuenta con un vigía sonoro de alta eficiencia para alertar instantáneamente la llegada de un nuevo turno:
1. **Suscripción en Tiempo Real:** Al cargar la página, se inicia una conexión continua con Firestore (`onSnapshot`) sobre la colección `appointments`, filtrando en tiempo real por reservas con estado `pending`.
2. **Evitar Disparos Redundantes (LocalStorage Cache):** Para evitar que el sonido suene reiteradamente con turnos antiguos ya conocidos, el sistema compara el ID del último turno recibido con la clave guardada en `localStorage` bajo la etiqueta `nexus_last_notified_id`.
3. **Disparo de Alerta:** Si entra una nueva reserva cuyo ID es diferente al cacheado, el panel reproduce de forma inmediata el sonido clásico de alerta:
   `https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3`
   y despliega un Toast visual brutalista: `"NUEVO TURNO RECIBIDO"`.
4. **Manejo de Bloqueo de Autoplay del Navegador:** Dado que los navegadores modernos restringen la reproducción de audio hasta que el usuario haya hecho click sobre la web, el código atrapa el rechazo silenciosamente con un bloque `.catch()` para evitar lanzar excepciones en consola que entorpezcan la interfaz del panel.

### E. Monitor de Conectividad Viva (Badge Live/Offline)
El sidebar del administrador incluye un monitor continuo de conectividad para asegurar que la sincronización en tiempo real no se haya interrumpido:
* Escucha permanentemente los eventos nativos de red del navegador (`online` / `offline` de `window.navigator`).
* Si hay conexión normal de Internet, despliega en la zona inferior un badge con el texto **`LIVE`** en verde pulsante.
* Si el dispositivo pierde el acceso a la red, el badge cambia instantáneamente a **`OFFLINE`** en rojo sólido, advirtiendo al administrador que las modificaciones locales no se están guardando en la nube en ese momento.

---

## 3. ALTA MANUAL E INTELIGENCIA DE TURNOS

El alta manual de turnos en la administración se opera de manera reactiva e inteligente en [useAppointmentForm.js](file:///c:/Users/leola/Downloads/barber-l3/src/app/admin/turnos/hooks/useAppointmentForm.js) y sus modales asociados.

### A. Desacoplamiento de Especialista por Defecto
Para evitar que la disponibilidad semanal de turnos se asocie a la agenda del primer profesional por defecto (lo cual generaba que los feriados y días bloqueados aparecieran tachados antes de seleccionar un rubro):
* El motor del formulario inicializa `currentSpecialist` en `null` hasta que el administrador elija al menos un servicio del catálogo.
* Una vez seleccionado el servicio, el sistema calcula de forma dinámica cuál es el profesional asignado a dicho rubro y recupera en milisegundos su grilla específica de atención.

### B. Aplicación del Margen de Anticipación (Horas Previas)
Tanto en el alta manual como en la landing pública, el sistema respeta de manera estricta el campo "Horas Previas" de cada servicio:
* Al calcular los slots disponibles para el día en curso, el motor de disponibilidad resta la hora actual más el margen de horas configuradas como requerimiento mínimo.
* Si un slot horario cae dentro del margen prohibido de antelación, se marca automáticamente como `isOccupied: true` de forma silenciosa, impidiendo reservas fuera del marco de preparación establecido para el salón.

### C. Cálculo Automático de Costos y Duración
* Al agendar un turno manualmente, el sistema calcula automáticamente la suma total de los precios y la duración acumulada del lote de servicios seleccionados.
* Estos valores se graban directamente en las propiedades de la cita en Firestore (`price` y `totalDuration`) al momento de la creación, evitando que queden registros con valores en cero en las estadísticas del CRM y del Dashboard contable.

---

## 4. WHATSAPP Y SANITIZACIÓN INTELIGENTE DE TELÉFONOS

La comunicación por WhatsApp en Nexus Barber L3 se orquesta mediante un sistema de sanitización reactiva y envío manual controlado.

### A. El Modal de WhatsApp Manual (`WhatsAppManualModal.jsx`)
Al confirmar o cancelar un turno desde el Panel de Administración:
1. El sistema abre un modal de edición controlado por el componente `WhatsAppManualModal.jsx`.
2. El modal carga la plantilla de texto preestablecida en Firestore según la acción (`confirmation` o `cancellation`).
3. Traduce en tiempo real los comodines y permite al administrador editar de forma directa el mensaje final en un editor de texto plano dentro de la interfaz.
4. Al hacer click en "ENVIAR MENSAJE", el sistema genera un enlace directo a la API de WhatsApp Web (`wa.me`) y abre una nueva pestaña del navegador mediante `window.open()`, completando automáticamente el teléfono y el texto pre-redactado para que el administrador solo tenga que pulsar el botón de envío en WhatsApp.

### B. Algoritmo de Sanitización de Teléfono al Pegar (Clipboard & Input)
Para evitar que se guarden números en formatos inválidos o rotos, se inyectó una lógica de limpieza inteligente (`cleanInputPhone`) que se dispara de manera reactiva en el evento `onChange` de los inputs de celular (tanto en el alta manual de turnos como en la ficha del CRM de clientes):
1. **Remoción de caracteres no numéricos:** Filtra instantáneamente guiones, espacios, paréntesis y signos `+`.
2. **Sanitización de prefijos internacionales:**
   * Si el texto pegado empieza con el código de país e identificador móvil de Argentina `549` y excede los 10 dígitos (ej: `5491123456789`), recorta el prefijo y deja los 10 dígitos móviles: `1123456789`.
   * Si empieza con el código de país estándar `54` y excede los 10 dígitos (ej: `541123456789`), remueve el `54` dejando `1123456789`.
   * Si se pega un número local con el prefijo interurbano `0` (ej: `01123456789`), se elimina el `0` inicial de celular devolviendo los 10 dígitos limpios.
3. **Límite Estricto:** Recorta cualquier cadena resultante a un máximo de **10 dígitos** para asegurar consistencia perfecta en Firestore.

### C. Motor de Plantillas Dinámicas y Comodines Admitidos
El procesador de plantillas reemplaza de forma quirúrgica expresiones globales en formato `{{comodín}}` por los valores reales recuperados de Firestore:
* `{{cliente}}` $\rightarrow$ Nombre completo del cliente en mayúscula estética.
* `{{servicio}}` $\rightarrow$ Nombre del servicio contratado (forzado a MAYÚSCULAS según estética brutalista).
* `{{especialista}}` $\rightarrow$ Nombre del profesional a cargo (forzado a MAYÚSCULAS).
* `{{fecha}}` $\rightarrow$ Fecha del turno convertida de formato base `YYYY-MM-DD` a la nomenclatura tradicional argentina `DD/MM/YYYY`.
* `{{hora}}` $\rightarrow$ Hora asignada para el turno (ej: `17:30`).

---

## 5. ADMINISTRACIÓN DE ACTIVOS (ABMs) Y CRM DE CLIENTES

La gestión e historial de la clientela reside en la sección `/admin/configuracion/clientes` ([src/app/admin/configuracion/clientes/page.jsx](file:///c:/Users/leola/Downloads/barber-l3/src/app/admin/configuracion/clientes/page.jsx)).

### A. Capacidad Nactiva de Copiado (Clipboard Enable)
* Se eliminó de manera absoluta la clase de CSS de bloqueo visual `select-none` de todo el contendor administrativo.
* Esto permite al operador administrativo seleccionar texto, copiar teléfonos de contacto directamente de las tablas del CRM o turneros y pegarlos en cualquier aplicación externa de manera natural.

### B. Motor Reactivo de Estadísticas de CRM e Inversión Real
La grilla del CRM cruza las fichas de los clientes con el historial global de turnos de forma reactiva para calcular de forma transparente el valor real de cada perfil:
1. **`totalAppointments` (Visitas Totales):** Conteo acumulativo de todas las reservas en estado `completed` o `confirmed` asociadas al ID de ese cliente.
2. **`totalSpent` (Inversión Real Acumulada):** Suma monetaria real de lo que el cliente efectivamente ha pagado en base a los turnos no cancelados, calculándose sobre la variable contable real `precioCobrado` grabada en Firestore. Esto unifica al centavo las cifras del CRM de clientes con la facturación final del Dashboard administrativo de turnos.
3. **`lastVisit` (Última Visita Real):** Expone la fecha del turno más reciente en formato tradicional `DD/MM/YYYY`.

### C. Ficha Interna: Notas Privadas e Información Sensible
* Cada perfil de cliente en Firestore (`clients/[slug]`) dispone de un campo de **Notas Internas**.
* Estas notas son de uso exclusivo para los profesionales (ej. fórmulas de color aplicadas, cortes predilectos del cliente, alergias a tinturas). Se persisten de forma privada en Firestore y solo se renderizan en el panel administrativo del CRM, quedando totalmente invisibles para la interfaz pública del cliente.
* De igual forma, incluye el campo de **Cumpleaños** (`birthday`) en formato fecha para que la administración pueda organizar salutaciones o promociones especiales.

---

## 6. CONFIGURACIÓN DEL SISTEMA Y MOTOR DE SEGURIDAD

La sección de control global reside en `/admin/configuracion/sistema`.

### A. Bloqueo de Horarios y Días por Servicio (Inactividad Temporal)
El sistema cuenta con un nuevo módulo dinámico para suspender temporalmente la reserva de un servicio específico en una fecha y rango horario determinados (por ejemplo, suspender "Perfilado de cejas" el día 30/06/2026 de 12 a 16 hs).

1. **Gestión Administrativa (`ServiceBlocksManager.jsx`):**
   * Ubicado en la parte inferior de la sección de Configuración de Sistema.
   * Permite seleccionar cualquier servicio activo, fijar una fecha y definir el rango de inicio y fin del bloqueo.
   * Los registros se muestran en una tabla con la descripción del servicio, fecha formateada y rango horario, contando con un botón de eliminación segura (ícono de cesto de basura) con modal de confirmación nativo.
2. **Colección Firestore (`service_blocks`):**
   * Estructura del documento: `{ id, serviceId, serviceName, date, startTime, endTime, createdAt, updatedBy }`.
3. **Optimización de Consultas (JavaScript In-Memory Sorting):**
   * Para cumplir con el principio de **Fricción Cero**, la lectura de bloqueos en Firestore se realiza sin cláusulas `orderBy`.
   * El ordenamiento se realiza localmente en memoria utilizando JavaScript. Esto evita que la aplicación arroje errores fatales por falta de índices compuestos en Firestore y previene que el sistema colapse silenciosamente.
4. **Validación Cruzada en los Turneros:**
   * Tanto el turnero público (`TimePicker.jsx`) como el alta manual de turnos (`useAppointmentForm.js`) recuperan los bloqueos de servicios al cargar la grilla horaria.
   * Si un slot generado por el especialista colisiona total o parcialmente con el rango bloqueado del servicio seleccionado, dicho slot horario se marca automáticamente como ocupado (`isOccupied = true`), imposibilitando su reserva.

### B. Motor de Feriados Soberano 2026
Operado por `HolidaysManager.jsx`.
* **Sincronización en un Click:** Realiza consultas `fetch` a la API oficial de Argentina (`https://nolaborables.com.ar/api/v1/feriados/2026?incluir=opcional`).
* **Array Estático de Contingencia (`ARG_2026`):** En caso de caída de la red pública, el administrador cuenta con un fallback estático pre-programado de todos los feriados del año 2026 en el código fuente.
* **Excepciones Operativas (Alternancia Abierto / Cerrado):** El administrador puede marcar un feriado tradicional como operativo (`isException: true`). Al guardar, el sistema remueve esta fecha de la lista de `blockedDates` en Firestore, volviendo a habilitar el día en el calendario de clientes para permitir agendamiento en fechas de alta demanda.

---

### CONFIRMACIÓN DE COMPILACIÓN v11.96-PLATINUM
El ecosistema de producción ha sido compilado localmente con éxito:
* **Exit Code:** `0` (Cero fallos).
* **First Load JS:** `23.7 kB` (Optimización de chunks estáticos).
* **Compatibilidad de Estilos:** Integración total bajo Tailwind CSS v4.0 y Next.js v15 App Router.
* **Base de datos:** Firestore SSOT Única sincronizada.

*Manual redactado y firmado por el Consejo de Orquestación NEXUS.*
