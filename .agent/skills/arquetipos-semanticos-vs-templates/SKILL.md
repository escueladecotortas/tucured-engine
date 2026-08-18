---
name: arquetipos-semanticos-vs-templates
description: Metodología de ensamblado de prompts de IA generativa de diseño basada en briefs narrativos auténticos y arquetipos de negocio en lugar de plantillas fijas.
---

# Arquetipos Semánticos vs Templates Clónicos

## Propósito
Evitar que los motores de generación de diseño (Google Stitch MCP / Gemini Pro) produzcan landings monótonas de 4 bloques rígidos ("Especialidades", "Sobre Nosotros", etc.).

## Metodología
1. **Clasificación por Arquetipo Semántico**:
   Clasificar el negocio en categorías maestras:
   - *Gastronomía / Bares*: Foco en experiencia sensorial, platos insignia de reseñas, coctelería y vibe nocturno.
   - *Salud / Ópticas / Clínicas*: Foco en rigor científico, equipamiento de precisión, confianza y turnos online.
   - *Servicios Profesionales / Talleres*: Foco en velocidad de respuesta, garantía técnica y diagnósticos.
   - *Retail / Comercio*: Foco en catálogo visual, promociones y atención inmediata.
2. **Brief Narrativo en Lenguaje Natural**:
   Alimentar al modelo con la historia real del comercio extrayendo citas de reseñas destacadas (`topReviews`) y vocabulario autóctono.
3. **Libertad de Composición**:
   Eliminar listas numeradas de secciones ("1. Navbar, 2. Hero...") y dar libertad al modelo para disponer la jerarquía visual óptima.
