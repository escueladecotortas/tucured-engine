// Archivo: src/app/admin/turnos/utils/formatters.js
import { formatPhoneForWhatsApp } from '@/lib/utils/whatsapp';

export const formatAppointmentDate = (dateStr, timeStr) => {
  if (!dateStr) return timeStr || 'N/A';
  const [y, m, d] = dateStr.split('-');
  const cleanTime = (timeStr || '--:--').replace(/\s*hs\s*$/i, '');
  return `${d}/${m} — ${cleanTime}`;
};

export const cleanWhatsAppForDisplay = (number) => {
  if (!number) return 'N/A';
  let cleaned = String(number).replace(/\D/g, '');
  if (cleaned.startsWith('549')) cleaned = cleaned.substring(3);
  else if (cleaned.startsWith('54')) cleaned = cleaned.substring(2);
  return cleaned;
};

export const getWhatsAppLink = (number) => {
  if (!number) return null;
  const fullNumber = formatPhoneForWhatsApp(number);
  return `https://wa.me/${fullNumber}`;
};
