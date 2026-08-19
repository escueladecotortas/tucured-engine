// Archivo: scripts/inspect_stitch_tools.cjs
const https = require('https');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const apiKey = (process.env.STITCH_API_KEY || process.env.GOOGLE_STITCH_API_KEY || '').replace(/["']/g, '').trim();

function callRpc(method, params = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method: method,
      params: params
    });

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
          resolve(JSON.parse(raw));
        } catch (e) {
          resolve({ raw });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function inspect() {
  const toolsRes = await callRpc('tools/list', {});
  const tools = toolsRes?.result?.tools || [];
  const createTool = tools.find(t => t.name === 'create_project');
  console.log(`Tool: "${createTool?.name}"`);
  console.log(`Description: ${createTool?.description}`);
  console.log(`Input Schema:`, JSON.stringify(createTool?.inputSchema, null, 2));
}

inspect().catch(console.error);
