<!-- Archivo: docs/manual_usuario_turnero_l1.md -->
# 📖 Manual de Usuario: Turnero L1 Mobile-First (Nexus OS v11.1)

> **Guía Oficial para Comerciantes, Administradores y Equipos de Atención al Cliente**  
> *Solución Soberana, Local-First y Sin Fricción para Gestión de Turnos y Reservas por WhatsApp*

---

## 🌟 1. ¿Qué es el Turnero L1?

El **Turnero L1 Mobile-First** es un sistema inteligente de agendamiento y reservas diseñado para operar directamente en el navegador del cliente sin requerir descargas, registros engorrosos ni aplicaciones intermedias.

### Beneficios Principales:
* **Cero Fricción para el Cliente:** Flujo ultra-rápido en 3 pasos optimizado para pantallas táctiles de celulares (iOS y Android).
* **Confirmación Directa por WhatsApp:** La reserva se despacha como un mensaje estructurado y listo para confirmar en el chat oficial de su negocio.
* **Soberanía y Privacidad Total:** Sus datos y la agenda se gestionan en su propio entorno local sin comisiones por turno.

---

## 🔑 2. Vinculación de WhatsApp: La Doble Llave Soberana

Para que el sistema reconozca su número verificado y permita pruebas en vivo, cuenta con el asistente de vinculación segura por código QR.

### Paso a Paso para Vincular su Cuenta:
1. Abra el panel de administración (**Showroom L1** o panel de su sitio).
2. Diríjase a la pestaña **💬 WhatsApp**.
3. Haga clic en el botón **Vincular WhatsApp / Escanear QR**.
4. En su teléfono móvil:
   * Abra **WhatsApp**.
   * Toque **Ajustes / Configuración** (o los tres puntos verticales en Android).
   * Seleccione **Dispositivos vinculados** -> **Vincular un dispositivo**.
5. Apunte la cámara de su teléfono al código QR desplegado en la pantalla.
6. El sistema detectará la conexión automáticamente y mostrará la insignia verde:  
   `🟢 Conectado (Sesión Soberana Activa)` y en la pestaña de Identidad se auto-inyectará la verificación `✓ Verificado vía QR`.

> [!TIP]
> **Desconexión Segura:** Si desea desvincular el dispositivo, haga clic en **Desconectar Sesión**. Se abrirá un modal de seguridad nativo para confirmar la purga limpia de credenciales sin riesgos.

---

## ⏰ 3. Configuración de Agenda y Horarios Semanales

El Turnero L1 le permite definir horarios independientes para cada día de la semana (Lunes a Domingo), adaptándose a comercios con horario corrido o negocios con corte de siesta.

### Opciones por Cada Día:
* **Habilitar / Deshabilitar Día:** Active o desactive el switch del día. Los días desactivados (ej. Domingos) se omiten automáticamente del carrusel del cliente.
* **Horario Corrido (Por Defecto):**
  * Define una franja continua (ej. Apertura: `09:00`, Cierre: `18:00`).
  * El sistema generará turnos continuos cada 30 minutos (incluyendo horas del mediodía y siesta).
* **Horario Partido / Corte de Siesta:**
  * Active la casilla **Horario partido (corte siesta)**.
  * Configure el **Turno Mañana** (ej. `09:00` a `13:00`) y el **Turno Tarde** (ej. `17:00` a `21:00`).
  * El sistema bloqueará automáticamente el bache de siesta (`13:30` a `16:30`).
* **Botón Rápido "Copiar Lun a días hábiles":**
  * Configure el Lunes a su gusto y presione este botón para clonar exactamente el mismo horario de Martes a Viernes en un solo clic.

---

## 🇦🇷 4. Gestión de Feriados y Excepciones Especiales

El motor incluye el catálogo oficial de feriados nacionales de Argentina (2026-2027) pre-cargado.

### Comportamiento Automático:
* Con la opción **Bloquear Feriados Nacionales** activa, los días feriados no mostrarán turnos disponibles en el calendario.
* **Atención Especial en Feriados:** En la tarjeta de *Próximos Feriados*, usted puede conmutar el switch **Habilitar Atención** para un feriado puntual (ej. 25 de Mayo) y definir un horario especial de atención reducida (ej. `10:00` a `14:00`).

---

## 💬 5. Personalización del Mensaje de Reserva

Usted tiene el control total sobre cómo llega el mensaje a su WhatsApp cuando el cliente completa la reserva.

### Tokens Dinámicos Disponibles:
Al redactar su plantilla puede insertar cualquiera de estos comodines:
* `{{cliente}}` → Nombre y Apellido completos del cliente.
* `{{fecha}}` → Día seleccionado (ej. *Lunes 24 de Agosto*).
* `{{hora}}` → Franja horaria elegida (ej. *10:30*).
* `{{comercio}}` → Nombre de su negocio.
* `{{telefono}}` → Teléfono del cliente.

### Ejemplo de Plantilla Recomendada:
```text
¡Hola! Quiero confirmar mi reserva en {{comercio}}:
- 👤 Nombre: {{cliente}}
- 📅 Día: {{fecha}}
- ⏰ Hora: {{hora}}
- 📞 Tel: {{telefono}}
¿Me confirman disponibilidad?
```

> [!NOTE]
> **Previsualización en Tiempo Real:** A la derecha del editor verá la **Burbuja Real de WhatsApp** con el fondo `#005c4b`, hora reactiva y doble tilde azul, mostrándole exactamente cómo leerá el mensaje al recibirlo.

---

## 📱 6. La Experiencia del Cliente en 3 Pasos

1. **Paso 1 (Fecha y Hora):** El cliente navega por las pastillas del calendario y elige un horario disponible. Si consulta "Hoy", los horarios que ya pasaron aparecen tachados.
2. **Paso 2 (Sus Datos):** El cliente ingresa su número de teléfono (se despliega el teclado numérico automáticamente) y su Nombre y Apellido (con auto-capitalización).
3. **Paso 3 (Confirmación Instantánea):** Revisa el resumen claro de su cita y presiona el botón verde **Confirmar WA**, abriéndose WhatsApp con el mensaje listo para enviar.
