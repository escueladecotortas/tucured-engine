// Archivo: frontend/src/components/leads/ProspectFormUtils.js

export const TUCUMAN_CITIES = [
  "San Miguel de Tucumán", "Yerba Buena", "Tafí Viejo", "Banda del Río Salí",
  "Las Talitas", "Alderetes", "Concepción", "Tafí del Valle", "Aguilares",
  "Monteros", "Famaillá", "Simoca", "Lules", "El Manantial", "San Pablo"
];

export const MAPS_URL_REGEX = /^https?:\/\/(www\.)?(google\.(com|com\.ar)\/maps|maps\.app\.goo\.gl|goo\.gl\/maps)/i;

export const formatWhatsApp = (raw) => {
  let digits = raw.replace(/[^0-9]/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) digits = "549" + digits.slice(1);
  else if (digits.startsWith("15")) digits = "549" + digits.slice(2);
  else if (digits.startsWith("54") && !digits.startsWith("549")) digits = "549" + digits.slice(2);
  else if (digits.length === 10 && !digits.startsWith("54")) digits = "549" + digits;
  return "+" + digits;
};

export const getInputClass = (field, errors) => {
  const base = "w-full bg-black/40 border rounded-lg px-3 py-2.5 text-white focus:outline-none transition-colors text-sm";
  return errors[field] ? `${base} border-red-500/60 focus:border-red-400` : `${base} border-white/20 focus:border-purple-500`;
};
