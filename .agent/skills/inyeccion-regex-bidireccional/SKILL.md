---
name: inyeccion-regex-bidireccional
description: Técnica infalible de inyección y purga de widgets modulares combinando selectores DOM y coincidencia de texto plano.
---

# Inyección Regex Bidireccional (DOM + String)

## Propósito
Garantizar que los widgets modulares (turneros, carruseles, docks de contacto, mapas) se inyecten de forma robusta, independientemente de si el motor de diseño (ej. Stitch, Gemini) generó etiquetas HTML válidas (`#nexus-widget`) o si renderizó texto plano entre corchetes (`[widget_name]`).

## Flujo de Ejecución
1. **Paso 1: Búsqueda en DOM**:
   Buscar selectores `#nexus-<widget>`, `#slot-<widget>`, `[data-nexus-widget="<widget>"]`. Si existen, reemplazar nodo completo con `slot.replaceWith(html)`.
2. **Paso 2: Búsqueda de Texto Plano**:
   Si el DOM no tiene el ID, escanear nodos de texto con regex `new RegExp('\\[(?:nexus-)?' + widgetName + '\\]', 'gi')` y sustituir el elemento contenedor.
3. **Paso 3: Fallback Semántico**:
   Si no se localiza ninguna coincidencia, insertar antes de `<footer>` o al final del `<body>`.
4. **Paso 4: Purga Residual Estricta**:
   Ejecutar barrido regex final sobre el string HTML completo para erradicar cualquier corchete huérfano tipo `\[(?:nexus-)?[\w_-]+\]`.
