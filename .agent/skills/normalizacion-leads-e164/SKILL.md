---
name: normalizacion-leads-e164
description: Regla de negocio y normalización de números telefónicos para Argentina (Tucumán) en formato internacional E.164 y Meta WhatsApp API.
---

# Normalización Telefónica E.164 y WhatsApp (Argentina / Tucumán)

## Propósito
Asegurar que los enlaces de contacto en los widgets del Arsenal Stitch (`wa.me`, `tel:`, docks flotantes y turneros) nunca fallen ni arrojen números inválidos ante la API de WhatsApp o la red de telefonía móvil.

## Reglas de Transformación
1. **Celulares Locales (Móviles)**:
   - **Regla Meta WhatsApp**: Exige el código de país `54` seguido obligatoriamente del prefijo móvil `9` + código de área sin el 15 + número local.
   - **Ejemplo**: `155 123456` o `381 5123456` ➔ **WhatsApp URL**: `https://wa.me/5493815123456`
   - **Formato Visual (E.164 Display)**: `+54 9 381 512-3456`

2. **Teléfonos Fijos (Líneas Fijas)**:
   - **Regla Nacional**: Código de país `54` + código de área (`381`) + número de 7 dígitos (SIN el prefijo 9).
   - **Expansión de 7 dígitos**: `4312590` ➔ `+54 381 431-2590` (WhatsApp fallback: `543814312590`)
   - **Enlace de Llamada**: `href="tel:+543814312590"`

3. **Pipeline de Ingesta (`PhoneNormalizerService.js`)**:
   - Todo teléfono extraído de Google Maps o Instagram debe pasar por `PhoneNormalizerService.normalize(rawPhone)` antes de persistirse en `client-assets.json` o Firestore.
   - El objeto resultante debe proveer siempre `{ raw, display, whatsapp, e164, isMobile }`.
