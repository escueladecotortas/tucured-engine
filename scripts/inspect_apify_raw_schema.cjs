// Archivo: scripts/inspect_apify_raw_schema.cjs
// Inspección del schema real devuelto por compass/crawler-google-places y apify/instagram-profile-scraper

const { ApifyClient } = require('apify-client');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

async function inspectSchema() {
  const token = (process.env.APIFY_TOKEN || '').replace(/[><"']/g, '').trim();
  if (!token) {
    console.log('No token');
    return;
  }
  const client = new ApifyClient({ token });

  console.log('🔍 Consultando últimas ejecuciones en Apify para analizar payload crudo...');
  try {
    const runs = await client.runs().list({ limit: 10, desc: true });
    for (const run of runs.items) {
      console.log(`\n📦 Actor: ${run.actId} | Status: ${run.status} | Run ID: ${run.id}`);
      if (run.defaultDatasetId && run.status === 'SUCCEEDED') {
        const items = await client.dataset(run.defaultDatasetId).listItems({ limit: 1 });
        if (items.items.length > 0) {
          const first = items.items[0];
          console.log('   Keys disponibles en item:', Object.keys(first).join(', '));
          if (first.additionalInfo) {
            console.log('   📌 additionalInfo sample:', JSON.stringify(first.additionalInfo, null, 2));
          }
          if (first.categories) {
            console.log('   📌 categories sample:', JSON.stringify(first.categories));
          }
          if (first.reviews) {
            console.log(`   📌 reviews count in dataset: ${first.reviews.length}`);
            if (first.reviews.length > 0) console.log('   📌 first review:', JSON.stringify(first.reviews[0]));
          }
        }
      }
    }
  } catch (err) {
    console.error('Error inspeccionando runs:', err.message);
  }
}

inspectSchema();
