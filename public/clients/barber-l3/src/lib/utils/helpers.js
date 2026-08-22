// Archivo: src/lib/utils/helpers.js

/**
 * Normaliza y mapea la categoría de servicios para el programador de turnos.
 * @param {string} rawCategory 
 * @returns {string}
 */
export const mapCategoryForScheduler = (rawCategory) => {
  if (!rawCategory) return "";
  const norm = rawCategory.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (norm.includes("barber")) return "Barbería";
  if (norm.includes("pestan") || norm.includes("ceja")) return "Cejas y Pestañas";
  if (norm.includes("una")) return "Uñas";
  return rawCategory;
};

/**
 * Agrupa y formatea las horas de atención de un especialista para su visualización.
 * @param {object} workingHours 
 * @returns {object}
 */
export const getGroupedHours = (workingHours) => {
  if (!workingHours) return { landing: "Atención con turno previo.", modal: "días y horarios de atención" };
  const dayLabels = { monday: 'Lunes', tuesday: 'Martes', wednesday: 'Miércoles', thursday: 'Jueves', friday: 'Viernes', saturday: 'Sábado' };
  const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const activeDays = dayOrder.filter(d => workingHours[d] && workingHours[d].active);
  if (activeDays.length === 0) return { landing: "Atención con turno previo.", modal: "días y horarios de atención" };

  const groups = [];
  activeDays.forEach(day => {
    const schedule = `${workingHours[day].start} a ${workingHours[day].end}hs`;
    if (groups.length > 0 && groups[groups.length - 1].schedule === schedule) {
      groups[groups.length - 1].days.push(day);
    } else {
      groups.push({ days: [day], schedule });
    }
  });

  const parts = groups.map(g => {
    let daysText = "";
    if (g.days.length > 2) {
      const isConsecutive = g.days.every((d, i) => dayOrder[dayOrder.indexOf(g.days[0]) + i] === d);
      daysText = isConsecutive 
        ? `${dayLabels[g.days[0]]} a ${dayLabels[g.days[g.days.length - 1]]}`
        : g.days.map(d => dayLabels[d]).slice(0, -1).join(', ') + ' y ' + dayLabels[g.days[g.days.length - 1]];
    } else if (g.days.length === 2) {
      daysText = `${dayLabels[g.days[0]]} y ${dayLabels[g.days[1]]}`;
    } else {
      daysText = dayLabels[g.days[0]];
    }
    return `${daysText} de ${g.schedule}`;
  });

  return { landing: parts.join('. ') + ".", modal: parts.join(' y ') };
};
