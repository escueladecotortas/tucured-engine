// Archivo: scripts/test_groq_llama_variants.cjs
const https = require('https');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

async function testVariants() {
  const key = (process.env.GROQ_API_KEY || '').trim();
  const candidates = [
    'llama-3.3-70b-versatile',
    'llama-3.3-70b-instruct',
    'meta-llama/llama-3.3-70b-instruct',
    'llama3-70b-8192',
    'llama3-8b-8192',
    'groq/compound',
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
    'qwen/qwen3.6-27b'
  ];

  for (const model of candidates) {
    const payload = JSON.stringify({
      messages: [{ role: 'user', content: 'ping' }],
      model,
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
          if (res.statusCode === 200) {
            console.log(`✅ [${res.statusCode}] ${model} -> FUNCIONA`);
          } else {
            console.log(`❌ [${res.statusCode}] ${model} -> ${body.slice(0, 80)}...`);
          }
          resolve();
        });
      });
      req.on('error', e => resolve());
      req.write(payload);
      req.end();
    });
  }
}

testVariants();
