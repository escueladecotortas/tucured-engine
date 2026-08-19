// Archivo: scripts/test_stitch_live_call.cjs
const https = require('https');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const apiKey = (process.env.STITCH_API_KEY || process.env.GOOGLE_STITCH_API_KEY || '').replace(/["']/g, '').trim();

function callRpc(method, toolName, params = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method: method,
      params: { name: toolName, arguments: params }
    });

    console.log(`\n📤 ENVIANDO PAYLOAD A STITCH MCP (${toolName}):`);
    console.log(data);

    const options = {
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
    };

    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, data: JSON.parse(raw) });
        } catch (e) {
          resolve({ statusCode: res.statusCode, raw });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function testCalls() {
  console.log('--- TEST 1: { title: "Tucu Red Test Lab" } ---');
  const res1 = await callRpc('tools/call', 'create_project', { title: "Tucu Red Test Lab" });
  console.log('📥 RESPUESTA 1:', JSON.stringify(res1, null, 2));

  console.log('\n--- TEST 2: { title: "100 Ópticas - Tucumán" } ---');
  const res2 = await callRpc('tools/call', 'create_project', { title: "100 Ópticas - Tucumán" });
  console.log('📥 RESPUESTA 2:', JSON.stringify(res2, null, 2));

  console.log('\n--- TEST 3: { title: "" } ---');
  const res3 = await callRpc('tools/call', 'create_project', { title: "" });
  console.log('📥 RESPUESTA 3:', JSON.stringify(res3, null, 2));

  console.log('\n--- TEST 4: {} (sin title) ---');
  const res4 = await callRpc('tools/call', 'create_project', {});
  console.log('📥 RESPUESTA 4:', JSON.stringify(res4, null, 2));
}

testCalls().catch(console.error);
