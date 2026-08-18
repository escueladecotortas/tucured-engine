// Archivo: scripts/test_groq_active_models.cjs
const https = require('https');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

async function testActive() {
  const key = (process.env.GROQ_API_KEY || '').trim();
  const models = [
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
    'qwen/qwen3.6-27b',
    'groq/compound',
    'groq/compound-mini'
  ];

  for (const m of models) {
    console.log(`\n🧪 Probando chat completion con: "${m}"...`);
    const payload = JSON.stringify({
      messages: [{ role: 'user', content: 'ping' }],
      model: m,
      max_tokens: 15
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
            console.log(`   ✅ RESPUESTA: ${data.choices?.[0]?.message?.content?.trim()}`);
          } else {
            console.log(`   ❌ ERROR: ${body}`);
          }
          resolve();
        });
      });
      req.on('error', e => {
        console.log(`   ❌ ERROR RED: ${e.message}`);
        resolve();
      });
      req.write(payload);
      req.end();
    });
  }
}

testActive();
