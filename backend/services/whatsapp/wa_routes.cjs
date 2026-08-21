// Archivo: backend/services/whatsapp/wa_routes.cjs
// Router Express para Micro-API WhatsApp Baileys (Ley de 200 líneas)
const express = require('express');
const router = express.Router();
const waService = require('./wa_node.cjs');

router.get('/status', (req, res) => {
  const status = waService.getStatus();
  res.json({ success: true, ...status });
});

router.post('/init', async (req, res) => {
  try {
    const silent = req.body?.silent !== false;
    await waService.init({ silent });
    res.json({ success: true, message: 'Servicio WhatsApp inicializado', status: waService.getStatus() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/logout', async (req, res) => {
  try {
    await waService.logout();
    res.json({ success: true, message: 'Sesión desconectada y credenciales purgadas', status: waService.getStatus() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/qr', (req, res) => {
  const status = waService.getStatus();
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WhatsApp Node QR - Tucured Engine</title>
  <script src="https://cdn.tailwindcss.com"></script>
  ${status.status !== 'OPEN' ? '<meta http-equiv="refresh" content="5">' : ''}
</head>
<body class="bg-zinc-950 text-zinc-100 flex items-center justify-center min-h-screen p-4 font-sans">
  <div class="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-center">
    <div class="flex items-center justify-center gap-2 mb-4">
      <span class="w-3 h-3 rounded-full ${status.status === 'OPEN' ? 'bg-emerald-500 animate-pulse' : (status.status === 'QR_READY' ? 'bg-amber-500 animate-ping' : 'bg-blue-500')}"></span>
      <h1 class="text-xl font-bold">WhatsApp Baileys PoC</h1>
    </div>
    <p class="text-xs text-zinc-400 mb-6">Estado: <span class="font-mono font-bold text-zinc-200">${status.status}</span></p>
    ${status.status === 'OPEN' ? `
      <div class="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-6 text-emerald-300">
        <p class="text-3xl mb-2">✅</p>
        <p class="font-bold text-base">Sesión Vinculada</p>
        <p class="text-xs text-emerald-400/80 mt-1 font-mono">${status.user?.id || 'Usuario Activo'}</p>
      </div>
    ` : (status.qrDataUrl ? `
      <div class="bg-white p-4 rounded-2xl inline-block shadow-lg mb-4">
        <img src="${status.qrDataUrl}" alt="WhatsApp QR" class="w-64 h-64 object-contain mx-auto">
      </div>
      <p class="text-xs text-zinc-400">Abre WhatsApp en tu teléfono ➔ Dispositivos vinculados ➔ Vincular dispositivo</p>
      <p class="text-[10px] text-zinc-500 mt-2">Esta página se actualiza automáticamente cada 5 segundos.</p>
    ` : `
      <div class="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 text-zinc-400">
        <p class="text-2xl mb-2">⏳</p>
        <p class="text-sm">Iniciando socket o esperando código QR...</p>
      </div>
    `)}
  </div>
</body>
</html>`;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

router.post('/check-phone', async (req, res) => {
  try {
    const { phone } = req.body || {};
    if (!phone) return res.status(400).json({ success: false, error: 'Parámetro phone requerido' });
    const result = await waService.checkPhone(phone);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/send-test', async (req, res) => {
  try {
    const { phone, message } = req.body || {};
    if (!phone) return res.status(400).json({ success: false, error: 'Parámetro phone requerido' });
    const result = await waService.sendTestMessage(phone, message);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
