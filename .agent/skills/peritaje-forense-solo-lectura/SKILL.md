---
name: peritaje-forense-solo-lectura
description: Protocolo de investigación y diagnóstico de causa raíz mediante scripts de auditoría aislados y lectura de payloads crudos sin mutar código prematuramente.
---

# Protocolo de Peritaje Forense de Solo Lectura

## Principio Nuclear
**Freno de Mano Inmediato**: Prohibido aplicar parches o refactorizaciones intuitivas basadas en suposiciones. Toda intervención técnica debe fundamentarse en la observación de los datos crudos reales (SSOT).

## Pasos del Protocolo
1. **Paso 1: Aislamiento del Caso**:
   Crear un script temporal de peritaje en `scripts/audit_<caso>.cjs` para consultar el estado en disco o memoria sin alterar el backend de producción.
2. **Paso 2: Inspección de Payload Crudo**:
   Leer e imprimir en consola el objeto JSON exacto, los headers HTTP, el filesystem real y los logs crudos.
3. **Paso 3: Identificación de la Causa Raíz**:
   Contrastar la hipótesis con la evidencia documental (ej. error 404 por model ID desfasado, o fotos fantasma por falta de `fs.existsSync`).
4. **Paso 4: Certificación Pre y Post Fix**:
   Ejecutar el script de auditoría antes del fix para verificar el fallo, y ejecutarlo posterior a la solución para certificar el 100% de éxito con salida limpia.
