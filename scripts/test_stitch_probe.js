// Archivo: scripts/test_stitch_probe.js
import https from 'https';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = (process.env.STITCH_API_KEY || process.env.GOOGLE_STITCH_API_KEY || '').replace(/["']/g, '').trim();
console.log('Testing X-Goog-Api-Key with key:', apiKey ? apiKey.substring(0, 10) + '...' : 'NONE');

const data = JSON.stringify({
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list',
  params: {}
});

const req = https.request({
  hostname: 'stitch.googleapis.com',
  port: 443,
  path: '/mcp',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Goog-Api-Key': apiKey,
    'Content-Length': Buffer.byteLength(data)
  }
}, res => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    console.log('Stitch Response Code:', res.statusCode);
    console.log('Stitch Response Body:', body.substring(0, 400));
  });
});

req.on('error', err => console.error('Error:', err.message));
req.write(data);
req.end();
