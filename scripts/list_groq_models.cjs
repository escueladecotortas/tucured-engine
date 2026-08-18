// Archivo: scripts/list_groq_models.cjs
const https = require('https');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

async function listModels() {
  const key = (process.env.GROQ_API_KEY || '').trim();
  console.log('Consultando modelos disponibles en Groq...');

  const options = {
    hostname: 'api.groq.com',
    path: '/openai/v1/models',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${key}`
    }
  };

  const req = https.request(options, res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
      console.log(`HTTP Status: ${res.statusCode}`);
      if (res.statusCode === 200) {
        const data = JSON.parse(body);
        console.log('Modelos disponibles en Groq:');
        data.data.forEach(m => console.log(` - ${m.id} (owned_by: ${m.owned_by}, active: ${m.active})`));
      } else {
        console.log(`Error: ${body}`);
      }
    });
  });
  req.on('error', e => console.error(e));
  req.end();
}

listModels();
