---
name: presets-multi-rubro-l3
description: Metodología de abstracción universal de turneros y paneles administrativos mediante esquemas de presets desacoplados (rubros_presets.json) con mutación de etiquetas y campos condicionales.
---

# Skill: Presets Multi-Rubro L3 (Nexus OS v11.1)

## 📌 Contexto & Propósito
Evita la proliferación de widgets y paneles redundantes por cada sector de actividad (barbería, estética, consultorio médico, estudio profesional). En su lugar, un único motor reactivo de Nivel 3 (L3) se parametriza mediante un archivo JSON maestro (`rubros_presets.json`).

## 🛠️ Estructura del Preset
1. **Semántica Dinámica (`labels`)**:
   - `staffSingular`: "Barbero" | "Estilista" | "Profesional" | "Consultor"
   - `staffPlural`: "Barberos" | "Estilistas" | "Profesionales Médicos" | "Socios"
   - `placeSingular`: "Sillón" | "Puesto" | "Consultorio" | "Sala"
2. **Flags de Comportamiento (`config`)**:
   - `slotIntervalMinutes`: Intervalo base (20m, 30m, 60m).
   - `bufferGapMinutes`: Tiempo de preparación/limpieza entre citas.
   - `requireInsuranceField`: `true` en salud (solicita Obra Social), `false` en otros.
   - `allowAnyStaff`: Permite o deshabilita la opción comodín "Primer Disponible".
3. **Catálogo Semilla (`servicesSeed`)**:
   - Servicios con duración específica en minutos y cálculo dinámico de slots contiguos requeridos.

## ⚖️ Doctrina de Uso
- **Cero Hardcoding**: Ningún componente de frontend debe asumir términos como "barbero" o "sillón"; todas las cadenas se resuelven en runtime desde el preset activo.
