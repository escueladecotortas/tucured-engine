// Archivo: src/lib/utils/time.js

/**
 * Convierte una cadena de tiempo "HH:MM" a minutos totales desde el inicio del día.
 * @param {string} timeStr 
 * @returns {number}
 */
export function parseTime(timeStr) {
  const [hrs, mins] = timeStr.split(':').map(Number);
  return hrs * 60 + mins;
}

/**
 * Convierte minutos totales a una cadena de tiempo "HH:MM".
 * @param {number} totalMins 
 * @returns {string}
 */
export function formatTime(totalMins) {
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Suma minutos a un tiempo base.
 */
export function addMinutes(totalMins, minutes) { 
  return totalMins + minutes; 
}

/**
 * Resta minutos a un tiempo base.
 */
export function subtractMinutes(totalMins, minutes) { 
  return totalMins - minutes; 
}
