// Archivo: frontend/src/components/VisualEditor/BridgeSource.js
// Orquestador del Bridge: concatena los 3 segmentos atómicos en el string final.
// Refactorizado de 482 → 20 líneas. Ley de 200 Líneas cumplida.

import { BRIDGE_INIT } from './bridge-init';
import { BRIDGE_SELECT } from './bridge-select';
import { BRIDGE_MESSAGES } from './bridge-messages';

/**
 * BRIDGE_CODE — String de código JavaScript inyectado en el iframe del editor visual.
 * Los 3 segmentos forman un único IIFE funcional que se ejecuta en el contexto del cliente.
 */
export const BRIDGE_CODE = BRIDGE_INIT + BRIDGE_SELECT + BRIDGE_MESSAGES;
