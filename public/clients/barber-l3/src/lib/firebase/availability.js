// Archivo: src/lib/firebase/availability.js
// v11.91-ELEGANT — Mass query appointments engine & synchronous slot generator with 0ms latency & sovereign holiday blocking
import { collection, getDocs, query, where, Timestamp, doc, getDoc } from 'firebase/firestore';
import { db } from './config';
import { getSpecialists } from './specialists';
import { parseTime, formatTime, addMinutes } from '../utils/time';

/**
 * Obtiene todas las citas activas de un especialista en un rango de fechas en la zona de Buenos Aires.
 */
export async function getAppointmentsRange(specialistId, startDateStr, daysCount = 14) {
  try {
    const appointmentsCol = collection(db, 'appointments');
    const [year, month, day] = startDateStr.split('-').map(Number);
    
    // Sincronización con Buenos Aires (UTC-3): 00:00 del primer día local = 03:00 UTC
    const startRange = new Date(Date.UTC(year, month - 1, day, 3, 0, 0));
    
    // Sincronización con Buenos Aires: 23:59:59 del día final local = 02:59:59 UTC del día siguiente
    const endRange = new Date(Date.UTC(year, month - 1, day + daysCount, 2, 59, 59));

    const q = query(
      appointmentsCol, 
      where('specialistId', '==', String(specialistId)),
      where('appointmentDate', '>=', Timestamp.fromDate(startRange)),
      where('appointmentDate', '<=', Timestamp.fromDate(endRange)),
      where('status', 'in', ['confirmed', 'pending'])
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(d => {
      const dateObj = d.data().appointmentDate.toDate();
      const baDateStr = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Argentina/Buenos_Aires',
        year: 'numeric', month: '2-digit', day: '2-digit'
      }).format(dateObj); // YYYY-MM-DD

      const baTimeStr = new Intl.DateTimeFormat('es-AR', {
        hour: '2-digit', minute: '2-digit', hour12: false,
        timeZone: 'America/Argentina/Buenos_Aires'
      }).format(dateObj); // HH:MM

      return { dateStr: baDateStr, timeStr: baTimeStr };
    });
  } catch (e) {
    console.error('[DB] Error precargando citas del rango:', e);
    return [];
  }
}

/**
 * Retorna los minutos desde una época arbitraria para hacer comparaciones cruzadas de fechas.
 */
function getMinutesFromEpoch(dateStr, timeStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  return Math.floor(Date.UTC(year, month - 1, day, hours, minutes) / 60000);
}

/**
 * Computa sincrónicamente los slots de disponibilidad para un día a partir de una lista precargada de citas.
 */
export function computeSlotsFromAppointments(specialist, dateString, appointmentsList, todayBAStr, advanceHoursRequired = 0, serviceBlocks = []) {
  if (!specialist) return [];

  const date = new Date(`${dateString}T12:00:00`);
  const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'America/Argentina/Buenos_Aires' });
  const dayName = formatter.format(date).toLowerCase();

  const workingConfig = specialist.workingHours?.[dayName] || specialist.availability?.weekly?.[dayName];
  if (!workingConfig || !workingConfig.active) return [];

  const slots = [];
  const isBarberia = specialist.category === 'BARBERIA' || specialist.name?.toLowerCase() === 'enzo' || specialist.firstName?.toLowerCase() === 'enzo';
  const slotDuration = isBarberia ? 30 : (specialist.availability?.config?.defaultSlotDuration || 30);

  // Filtrar citas ocupadas para este día específico
  const occupiedSlots = appointmentsList
    .filter(app => app.dateStr === dateString)
    .map(app => app.timeStr);

  let shifts = workingConfig.shifts || [{ start: workingConfig.start || '09:00', end: workingConfig.end || '20:00' }];

  if (isBarberia && shifts.length > 0) {
    const firstStart = shifts[0].start;
    const lastEnd = shifts[shifts.length - 1].end;
    shifts = [{ start: firstStart, end: lastEnd }];
  }

  const now = new Date();
  const baDateFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric', month: '2-digit', day: '2-digit'
  });
  const currentBAStr = baDateFormatter.format(now);
  
  const baTimeFormatter = new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    hour: '2-digit', minute: '2-digit', hour12: false
  });
  const currentTimeBAStr = baTimeFormatter.format(now);
  
  const nowMinutes = getMinutesFromEpoch(currentBAStr, currentTimeBAStr);
  const requiredAdvance = (Number(advanceHoursRequired) || 0) * 60;
  const buffer = Math.max(15, requiredAdvance); // Mínimo 15 min de gracia

  shifts.forEach(shift => {
    let currentTime = parseTime(shift.start);
    const endTime = parseTime(shift.end);

    while (addMinutes(currentTime, slotDuration) <= endTime) {
      const timeString = formatTime(currentTime);
      const slotMinutes = getMinutesFromEpoch(dateString, timeString);
      const isPast = slotMinutes <= (nowMinutes + buffer);

      // Verificar colisión con bloqueos de servicio específicos para este día y rango
      const isServiceBlocked = serviceBlocks.some(block => {
        if (block.date !== dateString) return false;
        const bStart = parseTime(block.startTime);
        const bEnd = parseTime(block.endTime);
        const sStart = currentTime;
        const sEnd = currentTime + slotDuration;
        return sStart < bEnd && bStart < sEnd;
      });

      slots.push({
        time: timeString,
        isOccupied: occupiedSlots.includes(timeString) || isPast || isServiceBlocked
      });

      currentTime = addMinutes(currentTime, slotDuration);
    }
  });

  return slots.sort((a, b) => a.time.localeCompare(b.time));
}

/**
 * Obtiene la disponibilidad diaria clásica consultando Firestore y aplicando bloqueo de feriados.
 */
export async function getAvailableSlots(specialistId, dateString, advanceHoursRequired = 0, serviceBlocks = []) {
  try {
    const holidays = await getHolidays();
    if (holidays.includes(dateString)) {
      return []; // Día tachado/deshabilitado por completo (sin slots)
    }
  } catch (err) {
    console.error('[AVAILABILITY] Error verificando feriados:', err);
  }

  const specialists = await getSpecialists();
  const specialist = specialists.find(s => s.id === specialistId);
  if (!specialist) return [];
  
  const todayBA = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date());

  const appointments = await getAppointmentsRange(specialistId, dateString, 1);
  return computeSlotsFromAppointments(specialist, dateString, appointments, todayBA, advanceHoursRequired, serviceBlocks);
}


/**
 * Verifica si un especialista atiende en un día específico (Buenos Aires Timezone)
 */
export function isDayEnabled(specialist, dateString) {
  if (!specialist || !dateString) return false;
  const date = new Date(`${dateString}T12:00:00`);
  const formatter = new Intl.DateTimeFormat('en-US', { 
    weekday: 'long', 
    timeZone: 'America/Argentina/Buenos_Aires' 
  });
  const dayName = formatter.format(date).toLowerCase();
  
  const workingConfig = specialist.workingHours?.[dayName] || specialist.availability?.weekly?.[dayName];
  return !!(workingConfig && workingConfig.active);
}

/**
 * Obtiene los feriados y días bloqueados desde la configuración del sistema.
 * Retorna un array de strings en formato 'YYYY-MM-DD'.
 */
export async function getHolidays() {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'holidays_cache'));
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.holidays && Array.isArray(data.holidays)) {
        return data.holidays
          .filter(h => !h.isException)
          .map(h => h.date);
      }
    }
    // Fallback: settings/booking_parameters
    const paramSnap = await getDoc(doc(db, 'settings', 'booking_parameters'));
    if (paramSnap.exists()) {
      const data = paramSnap.data();
      if (data.holidays && Array.isArray(data.holidays)) {
        return data.holidays
          .filter(h => !h.isException)
          .map(h => h.date);
      }
    }
    return [];
  } catch (e) {
    console.error('[DB] Error cargando feriados:', e);
    return [];
  }
}
