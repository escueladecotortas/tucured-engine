# 🕵️‍♂️ Audit_Canzonieri_Mix.md - Auditoría Forense y Propuesta Estratégica (LOREM & ARGUS)

## 1. ¿Qué calidad de data está entrando realmente? (Evaluación ARGUS)
Tras auditar el archivo `client-assets.json`, comprobamos que la data en crudo ("ingredientes") es **EXCELENTE**.
*   **Reputación Sólida:** 4.5 ⭐ y 386 reseñas verificadas.
*   **Vocabulario Real:** Las reseñas proveen frases auténticas y llenas de calidez como: `"El mejor de los salones, la atención de los mozos/as, el servicio de catering, TODO IMPECABLE"`, `"Estuvo muy bueno me gustó mucho gracias lucas"`.
*   **Activos Visuales Ricos:** El sistema logró inyectar exitosamente las rutas relativas procesadas localmente (`semantic_photos`) tanto para el showcase como para la atmósfera (fotos del salón y de eventos).
*   **Identidad Clara:** Está claro que es un Salón de Eventos con servicio de Catering y Boutique, que goza de gran confianza en su ubicación en San Miguel de Tucumán.

## 2. ¿Qué le estamos pidiendo exactamente a Stitch? (Evaluación ARGUS)
Al inspeccionar `StitchPromptBuilder.js`, notamos un problema clave en nuestro _Prompting_: **Estamos coartando su creatividad estructural.**
*   **Forzamos Slots Vacíos y Rígidos:** Le decimos explícitamente: "Integrá de forma armónica dentro del flujo visual los siguientes contenedores HTML vacíos (SIN texto plano tipo '[widget]')".
*   **Efecto Indeseado:** Stitch interpreta que *NO DEBE* diseñar esos componentes. Deja grandes huecos (`<div id="nexus-booking..."></div>`) y se limita a crear un Hero básico, una sección de "Servicios" plana y listo.
*   **Pérdida de Diseño Generativo:** Stitch podría estar maquetando una galería hermosísima con Tailwind en CSS plano (Grid, Masonry) inspirada en el contexto, pero en vez de eso, le obligamos a dejar un div vacío para que nosotros luego peguemos nuestro Widget prefabricado con JS (`WidgetInjector`).

## 3. ¿Cómo está respondiendo Stitch? (Análisis del `index.html`)
El HTML resultante refleja esta rigidez:
*   **Hero Section:** Pasable, pero genérico.
*   **Servicios:** Estructura clásica en 3 columnas (Catering, Detalles Únicos, Atención de Primera) que carece de personalidad o de un storytelling visual.
*   **Zonas Muertas:** El HTML tiene huecos masivos donde irán nuestros widgets. Stitch no aporta valor estético ahí. Cuando nuestro inyector coloca el widget (ej. el Marquee de Reviews o el Stories Grid), se produce una "desconexión visual" porque el widget tiene su propio vibe (definido estáticamente en `gallery_v2_stories_grid.html`) que puede no cuadrar con la identidad general que Stitch había ideado.

---

## 4. PROPUESTA ESTRATÉGICA LOREM: "Dejar volar al Genio"

**El Paradigma de la Inyección Invasiva vs. Inyección Reemplazante**
Actualmente usamos **Inyección Invasiva** (pedir que deje un hueco, y meter nuestro HTML ahí).
Debemos transicionar a una **Inyección Reemplazante (Swap)**: Que Stitch diseñe TODO, y nosotros solo le "robemos" la estructura o le inyectemos los datos (o usemos un `id` para montar un componente React, etc).

### Propuesta de Reesctructuración del Prompt (`StitchPromptBuilder.js`):

1.  **Libertad Estructural Total:** Le pediremos a Stitch que diseñe la landing COMPLETA, incluyendo galerías de fotos impresionantes, muros de opiniones de clientes con tarjetas de vidrio esmerilado, etc.
2.  **Tokens Semánticos en vez de Divs Vacíos:** En lugar de decirle "Dejá un `<div id="...">`", le diremos: *"Cuando diseñes la galería de fotos, asegúrate de que el contenedor principal o la sección tenga el `id="slot-gallery"`. Diseña la galería entera como tú quieras."*
3.  **Nuestro WidgetInjector evolucionado:** En vez de reemplazar el div vacío con el nuestro, podemos hacer dos cosas:
    *   **Opción A (Reemplazo Elegante):** Buscamos el `slot-gallery` que Stitch diseñó maravillosamente. Extraemos su diseño y tal vez lo convertimos en un widget interactivo inyectando JS.
    *   **Opción B (Híbrida):** Dejamos que el inyector busque los IDs y reemplace el contenedor *solo si* nuestro widget interactivo (ej. Turnero) requiere lógica compleja. Si es solo una galería, dejamos la galería HTML pura que diseñó Stitch y solo reemplazamos los `<img src>` con nuestras `semantic_photos`.

**Ejemplo de Nuevo Prompting para Stitch:**
```text
═══ SECCIONES REQUERIDAS (DISEÑO LIBRE) ═══
Diseña una landing page espectacular y completa. Tienes total libertad creativa para la estructura y el uso de Tailwind CSS (grids, glassmorphism, overlays).
Sin embargo, te pido que las siguientes secciones tengan un 'id' específico en su etiqueta contenedora (ej: <section id="nexus-reviews">) para que nuestro motor pueda encontrarlas:

1. 'nexus-booking': Una sección de reservas/turnos. Diséñala como un bloque de contacto hermoso.
2. 'nexus-gallery': Una galería visual inmersiva. Crea un layout moderno (masonry o asimétrico).
3. 'nexus-reviews': Un muro de testimonios de clientes.
4. 'nexus-footer': Un footer corporativo con información de contacto y ubicación.

Importante: NO dejes los divs vacíos. Diseña e implementa el código HTML/Tailwind completo para estas secciones con texto e imágenes de prueba, basándote en la marca "Canzonieri".
```

Al hacer esto, Stitch entregará un sitio *WOW*, y el PostProcesador simplemente hidratará las imágenes y los textos, manteniendo el diseño vanguardista original.
