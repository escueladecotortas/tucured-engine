// Archivo: backend/services/PhoneNormalizerService.js
// Servicio Modular de Normalización Telefónica (E.164 & Meta WhatsApp) — Ley de 200 líneas

class PhoneNormalizerService {
  /**
   * Normaliza cualquier número argentino/tucumano a formato E.164 y WhatsApp
   * @param {string|number} rawInput Número crudo (ej: "4312590", "155123456", "3814312590", "+5493815123456")
   * @param {string} defaultAreaCode Código de área por defecto (default: "381" para Tucumán)
   * @returns {Object} { raw, clean, e164, whatsapp, display, isMobile }
   */
  static normalize(rawInput, defaultAreaCode = '381') {
    if (!rawInput) {
      return { raw: '', clean: '', e164: '', whatsapp: '', display: '', isMobile: false, isValid: false };
    }

    const raw = String(rawInput).trim();
    let digits = raw.replace(/\D/g, '');

    if (!digits || digits.length < 6) {
      return { raw, clean: digits, e164: raw, whatsapp: digits, display: raw, isMobile: false, isValid: false };
    }

    // Quitar prefijo internacional si ya lo tiene
    if (digits.startsWith('549')) {
      digits = digits.slice(3);
    } else if (digits.startsWith('54')) {
      digits = digits.slice(2);
    }

    // Quitar prefijo 0 nacional (ej: 0381 -> 381)
    if (digits.startsWith('0')) {
      digits = digits.slice(1);
    }

    let areaCode = defaultAreaCode;
    let localNumber = '';
    let isMobile = false;

    if (digits.startsWith('15') && (digits.length === 9 || digits.length === 8)) {
      // Prefijo 15 celular local (ej: 155123456 o 15512345)
      areaCode = defaultAreaCode;
      localNumber = digits.slice(2);
      isMobile = true;
    } else if (digits.length === 7) {
      // 7 DÍGITOS: Teléfono local (ej: 4312590 -> Fijo; 5123456 -> Móvil si empieza con 5 o 6)
      areaCode = defaultAreaCode;
      localNumber = digits;
      isMobile = digits.startsWith('5') || digits.startsWith('6');
    } else if (digits.length === 10) {
      // 10 DÍGITOS con código de área (ej: 3814312590 o 3815123456)
      areaCode = digits.slice(0, 3);
      localNumber = digits.slice(3);
      if (areaCode === '381') {
        isMobile = localNumber.startsWith('5') || localNumber.startsWith('6') || localNumber.startsWith('3');
      } else {
        isMobile = true;
      }
    } else if (digits.length > 10) {
      if (digits.startsWith(defaultAreaCode)) {
        areaCode = defaultAreaCode;
        localNumber = digits.slice(defaultAreaCode.length);
        if (localNumber.startsWith('15')) {
          localNumber = localNumber.slice(2);
          isMobile = true;
        } else {
          isMobile = localNumber.startsWith('5') || localNumber.startsWith('6');
        }
      } else {
        localNumber = digits;
        isMobile = true;
      }
    } else {
      localNumber = digits;
    }

    const waPrefix = isMobile ? `549${areaCode}` : `54${areaCode}`;
    const whatsapp = `${waPrefix}${localNumber}`;
    const e164 = `+${whatsapp}`;
    
    const formattedLocal = localNumber.length === 7 
      ? `${localNumber.slice(0, 3)}-${localNumber.slice(3)}`
      : localNumber;
    const display = isMobile 
      ? `+54 9 ${areaCode} ${formattedLocal}`
      : `+54 ${areaCode} ${formattedLocal}`;

    return {
      raw,
      clean: `${areaCode}${localNumber}`,
      e164,
      whatsapp,
      display,
      isMobile,
      isValid: localNumber.length >= 6
    };
  }
}

module.exports = PhoneNormalizerService;
