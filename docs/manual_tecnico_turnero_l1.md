<!-- Archivo: docs/manual_tecnico_turnero_l1.md -->
# 🛠️ Manual Técnico: Turnero L1 Mobile-First (Nexus OS v11.1)

> **Documento de Arquitectura, Especificación de Parámetros e Integración de Micro-Servicios**  
> *Destinado a Desarrolladores, Arquitectos de Software y Agentes Especialistas*

---

## 📐 1. Especificación del Componente DOM (`booking_l1_turnero.html`)

El Turnero L1 es un Web Component desacoplado, autónomo y ejecutable en el cliente (Zero Runtime Server Dependency para renderizado).

### Atributos `data-*` de Configuración:

| Atributo | Tipo | Descripción / Formato | Ejemplo |
| :--- | :---: | :--- | :--- |
| `data-widget-id` | `string` | ID único para aislar instancias en el DOM | `data-widget-id="canzonieri"` |
| `data-biz-name` | `string` | Razón social del comercio | `data-biz-name="Canzonieri"` |
| `data-wa` | `string` | Teléfono en formato internacional E.164 (dígitos) | `data-wa="543814301640"` |
| `data-schedule` | `JSON` | Objeto serializado con configuración de 7 días (0=Dom a 6=Sáb) | `data-schedule='{"1":{"enabled":true,"open":"09:00","close":"18:00","isSplit":false}}'` |
| `data-interval` | `number` | Duración del turno en minutos (paso del algoritmo) | `data-interval="30"` |
| `data-days` | `number` | Límite de días operativos a desplegar en carrusel | `data-days="14"` |
| `data-block-holidays` | `boolean` | Flag para omitir feriados del calendario nacional | `data-block-holidays="true"` |
| `data-template` | `string` | Plantilla del mensaje WhatsApp con tokens dinámicos | `data-template="¡Hola! Reserva para {{cliente}}..."` |

### Estructura de `data-schedule`:
```json
{
  "1": { "enabled": true, "open": "09:00", "close": "18:00", "isSplit": false, "open2": "17:00", "close2": "21:00" },
  "2": { "enabled": true, "open": "09:00", "close": "18:00", "isSplit": false, "open2": "17:00", "close2": "21:00" },
  "3": { "enabled": true, "open": "09:00", "close": "18:00", "isSplit": false, "open2": "17:00", "close2": "21:00" },
  "4": { "enabled": true, "open": "09:00", "close": "18:00", "isSplit": false, "open2": "17:00", "close2": "21:00" },
  "5": { "enabled": true, "open": "09:00", "close": "18:00", "isSplit": false, "open2": "17:00", "close2":"21:00" },
  "6": { "enabled": true, "open": "09:00", "close": "13:00", "isSplit": false, "open2": "17:00", "close2": "21:00" },
  "0": { "enabled": false, "open": "09:00", "close": "13:00", "isSplit": false, "open2": "17:00", "close2": "21:00" }
}
```

---

## ⚙️ 2. Arquitectura Client-Side y Ciclo de Vida

### Máquina de Estados Finita (3 Pasos):
* **Estado 1 (`step: 1`):** Selección de fecha y franja horaria.
  - `getAllDays()`: Itera desde `today` hasta completar `maxDays` días hábiles reales (`isWorkday && !isHol`), salteando días cerrados.
  - `generateTimeSlots(dayData)`: Genera el array de horarios calculando franja simple (`open`..`close`) o doble franja si `isSplit: true`.
  - `filterPastSlots`: Para el día de Hoy (`isToday === true`), compara `(sh * 60 + sm) <= currentMins` y marca los slots pasados como deshabilitados y tachados (`line-through cursor-not-allowed`).
* **Estado 2 (`step: 2`):** Captura y sanitización de identidad.
  - `sanitizePhone(v)`: Regex `replace(/\D/g, '').replace(/^549?/, '').replace(/^0/, '').replace(/^(\d{2,4})15/, '$1')`.
  - `toTitleCase(s)`: Capitalización automática para Nombre y Apellido.
  - `hasBadWords(s)`: Filtro antiprofanidad y prevención de inyecciones HTML/XSS.
* **Estado 3 (`step: 3`):** Resumen y despacho.
  - Sustitución de variables en plantilla (`{{cliente}}`, `{{fecha}}`, `{{hora}}`, `{{comercio}}`, `{{telefono}}`).
  - Persistencia de perfil de usuario en `localStorage.setItem('tucu_turnero_profile', ...)` para auto-llenado en visitas futuras.
  - Deep link execution vía `window.open('https://wa.me/...', '_blank')`.

---

## 💉 3. Inyección en Landings de Stitch (`WidgetInjector.js`)

El servicio `WidgetInjector.js` (174 líneas, conforme a la Ley de 200 líneas) inyecta de forma bidireccional el componente:

### Algoritmo de Coincidencia de Slots:
1. Selector primario: `[data-nexus-slot="booking_v1_turnero"]` o `[data-nexus-slot="booking_l1_turnero"]`.
2. Selector secundario / legacy: `#nexus-booking_v1_turnero`, `#booking`, `section[id="booking"]`.
3. Reemplazo por coincidencia en texto plano: `/[nexus-booking_v1_turnero]/gi`.
4. Fallback: Inserción previa a `<footer>` si Stitch omitió el slot.

---

## 📡 4. Micro-Servicio WhatsApp Baileys (`/api/wa/*`)

El micro-servicio backend reside en `backend/services/whatsapp/` y expone los siguientes endpoints HTTP canónicos:

### 1. `GET /api/wa/status`
* **Retorno:** `{ success: true, status: "OPEN" | "CONNECTING" | "QR_READY" | "CLOSE", user: { id: "5493814301640:12@s.whatsapp.net", name: "Óptica 100" } }`

### 2. `GET /api/wa/qr`
* **Retorno:** `{ success: true, qr: "data:image/png;base64,..." }` (Código QR renderizado en DataURL para visualización instantánea en modal).

### 3. `POST /api/wa/check-phone`
* **Payload:** `{ phone: "3814301640" }`
* **Retorno:** `{ success: true, exists: true, jid: "5493814301640@s.whatsapp.net", formatted: "+54 9 381 430-1640" }`

### 4. `POST /api/wa/send-test`
* **Payload:** `{ phone: "3814301640", message: "Mensaje de prueba" }`
* **Retorno:** `{ success: true, messageId: "BAE5...", timestamp: 1770951703 }`

### 5. `POST /api/wa/logout`
* **Acción:** Cierra el socket, purga físicamente `auth_info_baileys/` y reinicia el ciclo de autenticación en modo Local-First.
