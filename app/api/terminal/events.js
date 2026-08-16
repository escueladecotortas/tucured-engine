import { EventEmitter } from 'events';

// Evitamos que se cree más de una instancia en desarrollo
if (!global.terminalEmitter) {
  global.terminalEmitter = new EventEmitter();
}

export const terminalEmitter = global.terminalEmitter;