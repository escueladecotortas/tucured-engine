// Archivo: backend/services/whatsapp/wa_node.cjs
// Micro-servicio WhatsApp Baileys Local-First (Ley de 200 líneas)
const path = require('path');
const fs = require('fs');
const pino = require('pino');
const qrcodeTerminal = require('qrcode-terminal');
const QRCode = require('qrcode');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const PhoneNormalizerService = require('../PhoneNormalizerService');

class WhatsAppNodeService {
  constructor() {
    this.authDir = path.join(__dirname, 'auth_info_baileys');
    this.sock = null;
    this.status = 'CLOSE'; // 'CLOSE' | 'CONNECTING' | 'QR_READY' | 'OPEN'
    this.lastQr = null;
    this.lastQrDataUrl = null;
    this.user = null;
    this.isInitializing = false;
    this.reconnectAttempts = 0;
  }

  async init(opts = {}) {
    if (this.sock && this.status === 'OPEN') return this;
    if (this.isInitializing) return this;
    this.isInitializing = true;
    this.status = 'CONNECTING';

    try {
      if (!fs.existsSync(this.authDir)) fs.mkdirSync(this.authDir, { recursive: true });
      const { state, saveCreds } = await useMultiFileAuthState(this.authDir);
      const { version } = await fetchLatestBaileysVersion().catch(() => ({ version: [2, 3000, 1015901307] }));

      this.sock = makeWASocket({
        version, auth: state, logger: pino({ level: 'silent' }),
        printQRInTerminal: false, browser: ['Nexus-OS', 'Chrome', '11.1.0'],
        connectTimeoutMs: 60000, defaultQueryTimeoutMs: 60000
      });

      this.sock.ev.on('creds.update', saveCreds);
      this.sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
          this.lastQr = qr; this.status = 'QR_READY';
          try { this.lastQrDataUrl = await QRCode.toDataURL(qr); } catch (e) { this.lastQrDataUrl = null; }
          if (!opts.silent) {
            console.log('\n📱 [WHATSAPP BAILEYS] Escanea este código QR con tu WhatsApp:');
            qrcodeTerminal.generate(qr, { small: true });
          }
        }
        if (connection === 'close') {
          const statusCode = lastDisconnect?.error?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
          this.status = 'CLOSE'; this.user = null; this.lastQr = null; this.lastQrDataUrl = null;
          console.log(`⚠️ [WHATSAPP BAILEYS] Conexión cerrada. Código: ${statusCode}. Reconectar: ${shouldReconnect}`);
          if (shouldReconnect && this.reconnectAttempts < 5) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * this.reconnectAttempts, 5000);
            setTimeout(() => { this.isInitializing = false; this.init(opts); }, delay);
          } else { this.isInitializing = false; }
        } else if (connection === 'open') {
          this.status = 'OPEN'; this.reconnectAttempts = 0; this.lastQr = null; this.lastQrDataUrl = null;
          this.user = this.sock?.user || { id: 'connected' }; this.isInitializing = false;
          console.log(`✅ [WHATSAPP BAILEYS] Sesión vinculada con éxito. Usuario: ${this.user.id || this.user.name}`);
        }
      });
      this.isInitializing = false;
      return this;
    } catch (err) {
      this.status = 'CLOSE'; this.isInitializing = false;
      console.error('❌ [WHATSAPP BAILEYS] Error inicializando socket:', err.message);
      throw err;
    }
  }

  getStatus() {
    return {
      status: this.status, isConnected: this.status === 'OPEN', hasQr: !!this.lastQr,
      qr: this.lastQr, qrDataUrl: this.lastQrDataUrl, user: this.user, authDir: this.authDir
    };
  }

  formatJid(rawPhone) {
    const normalized = PhoneNormalizerService.normalize(rawPhone);
    if (!normalized.whatsapp) return null;
    let cleanDigits = normalized.whatsapp.replace(/\D/g, '');
    if (cleanDigits.startsWith('54') && !cleanDigits.startsWith('549') && cleanDigits.length === 12) {
      cleanDigits = '549' + cleanDigits.slice(2);
    }
    return { jid: `${cleanDigits}@s.whatsapp.net`, normalized };
  }

  async checkPhone(rawPhone) {
    if (!rawPhone) return { exists: false, error: 'Número telefónico requerido', isValid: false };
    const formatted = this.formatJid(rawPhone);
    if (!formatted) return { exists: false, error: 'Formato de teléfono inválido', isValid: false };

    if (this.status !== 'OPEN' || !this.sock) {
      return {
        exists: false, status: this.status, phone: rawPhone, jid: formatted.jid,
        display: formatted.normalized.display, isMobile: formatted.normalized.isMobile,
        warning: 'Sesión de WhatsApp no conectada (modo offline/pre-verificación)', isValid: formatted.normalized.isValid
      };
    }
    try {
      const results = await this.sock.onWhatsApp(formatted.jid);
      const match = Array.isArray(results) ? results.find(r => r.exists) : null;
      return {
        exists: !!match, jid: match?.jid || formatted.jid, phone: rawPhone,
        display: formatted.normalized.display, isMobile: formatted.normalized.isMobile,
        status: this.status, isValid: true
      };
    } catch (err) {
      return { exists: false, error: err.message, phone: rawPhone, jid: formatted.jid, status: this.status };
    }
  }

  async sendTestMessage(rawPhone, message = '¡Hola! Este es un mensaje de prueba desde Tucured Engine Baileys PoC.') {
    if (this.status !== 'OPEN' || !this.sock) throw new Error(`No se puede enviar mensaje: sesión en estado ${this.status}`);
    if (!rawPhone) throw new Error('Número de teléfono requerido');
    const formatted = this.formatJid(rawPhone);
    if (!formatted) throw new Error('Número de teléfono inválido');

    const result = await this.sock.sendMessage(formatted.jid, { text: message });
    return {
      success: true, messageId: result?.key?.id || 'unknown', to: formatted.jid,
      display: formatted.normalized.display, timestamp: new Date().toISOString()
    };
  }

  async logout() {
    if (this.sock) {
      try { await this.sock.logout(); } catch (e) {}
      try { this.sock.end(undefined); } catch (e) {}
      this.sock = null;
    }
    try { if (fs.existsSync(this.authDir)) fs.rmSync(this.authDir, { recursive: true, force: true }); } catch (e) {}
    this.status = 'CLOSE'; this.user = null; this.lastQr = null; this.lastQrDataUrl = null; this.isInitializing = false;
  }

  async stop() {
    if (this.sock) {
      try { this.sock.end(undefined); } catch (e) {}
      this.sock = null;
    }
    this.status = 'CLOSE';
    this.isInitializing = false;
  }
}

const instance = new WhatsAppNodeService();
module.exports = instance;
