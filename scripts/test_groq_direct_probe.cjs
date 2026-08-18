// Archivo: scripts/test_groq_direct_probe.cjs
const https = require('https');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

async function testGroq() {
  const key = (process.env.GROQ_API_KEY || '').trim();
  console.log('GROQ_API_KEY:', key ? `Presente (${key.slice(0, 10)}...)` : 'FALTANTE');

  const modelsToTest = [
    'llama-3.3-70b-versatile',
    'llama-3.1-70b-versatile',
    'llama-3.1-8b-instant',
    'mixtral-8x7b-32768'
  ];

  for (const model of modelsToTest) {
    console.log(`\n🧪 Probando modelo: "${model}"...`);
    const payload = JSON.stringify({
      messages: [{ role: 'user', content: 'ping' }],
      model: model,
      max_tokens: 10
    });

    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    await new Promise(resolve => {
      const req = https.request(options, res => {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => {
          console.log(`   HTTP Status: ${res.statusCode}`);
          if (res.statusCode === 200) {
            const data = JSON.parse(body);
            console.log(`   ✅ ÉXITO: ${data.choices?.[0]?.message?.content?.trim()}`);
          } else {
            console.log(`   ❌ ERROR: ${body}`);
          }
          resolve();
        });
      });
      req.on('error', e => {
        console.log(`   ❌ NETWORK ERROR: ${e.message}`);
        resolve();
      });
      req.write(payload);
      req.end();
    });
  }
}

testGroq();
