// Archivo: src/lib/utils/whatsapp.js
// v11.90-GOLD — Utilidad Sovereign de WhatsApp Pipeline Core (NEXUS-OS)

/**
 * Normaliza y formatea un número de teléfono forzando el prefijo de Argentina (549).
 * Limpia caracteres no numéricos y maneja casos comunes de entrada.
 * 
 * @param {string|number} phone 
 * @returns {string} Número limpio apto para WhatsApp API/Web
 */
export const formatPhoneForWhatsApp = (phone) => {
  if (!phone) return '';
  let cleaned = String(phone).replace(/\D/g, '');
  
  if (cleaned.startsWith('54')) {
    // Si ya empieza con 54, aseguramos que tenga el 9 de móvil si tiene el largo estándar de 12 dígitos
    if (!cleaned.startsWith('549') && cleaned.length === 12) {
      cleaned = '549' + cleaned.substring(2);
    }
  } else {
    // Si no empieza con 54:
    // Si tiene 10 dígitos (ej: 1155555555), agregamos 549
    if (cleaned.length === 10) {
      cleaned = '549' + cleaned;
    } 
    // Si tiene 12 dígitos y empieza con 15 (ej: 151155555555)
    else if (cleaned.startsWith('15') && cleaned.length === 12) {
      cleaned = '549' + cleaned.substring(2);
    }
    // Si tiene 11 dígitos y empieza con 9 (ej: 91155555555), agregamos 54
    else if (cleaned.startsWith('9') && cleaned.length === 11) {
      cleaned = '54' + cleaned;
    }
    // Si tiene más de 10 dígitos (ej: prefijo extranjero), asumimos que ya tiene prefijo y no agregamos 549
    else if (cleaned.length > 10) {
      // Dejar tal cual
    }
    // Si es más corto, agregamos 549 por defecto
    else {
      cleaned = '549' + cleaned;
    }
  }
  return cleaned;
};

/**
 * Procesa una plantilla de texto de WhatsApp reemplazando quirúrgicamente los comodines admitidos.
 * 
 * @param {string} template Plantilla de texto configurada por Darcy
 * @param {object} params Variables de reemplazo { cliente, servicio, especialista, fecha, hora }
 * @returns {string} Mensaje final procesado
 */
export const parseWhatsAppTemplate = (template, { clientName, serviceName, specialistName, date, time }) => {
  if (!template) return '';
  
  let parsed = template;
  
  // Normalizar variables a mayúsculas/texto final según estética
  const cName = clientName || 'Cliente';
  const sName = serviceName ? String(serviceName).toUpperCase() : 'SERVICIO';
  const spName = specialistName ? String(specialistName).toUpperCase() : 'PROFESIONAL';
  
  // Formatear fecha
  let dateFormatted = date || '';
  if (dateFormatted && dateFormatted.includes('-')) {
    const [y, m, d] = dateFormatted.split('-');
    dateFormatted = `${d}/${m}/${y}`;
  }

  // Reemplazo robusto de comodines globales
  parsed = parsed
    .replace(/\{\{cliente\}\}/g, cName)
    .replace(/\{\{servicio\}\}/g, sName)
    .replace(/\{\{especialista\}\}/g, spName)
    .replace(/\{\{fecha\}\}/g, dateFormatted)
    .replace(/\{\{hora\}\}/g, time || '');

  return parsed;
};

/**
 * Genera una URL de redirección universal de WhatsApp (wa.me) con mensaje precargado.
 * 
 * @param {string} phone Teléfono del destinatario
 * @param {string} message Mensaje de texto a enviar
 * @returns {string} Enlace wa.me codificado de forma segura
 */
export const generateWhatsAppUrl = (phone, message) => {
  const cleanPhone = formatPhoneForWhatsApp(phone);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};
