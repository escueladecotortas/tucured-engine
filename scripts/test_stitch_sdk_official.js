// Archivo: scripts/test_stitch_sdk_official.js
import dotenv from 'dotenv';
dotenv.config();

// Asegurar que STITCH_API_KEY esté disponible en process.env para @google/stitch-sdk
process.env.STITCH_API_KEY = (process.env.STITCH_API_KEY || process.env.GOOGLE_STITCH_API_KEY || '').replace(/["']/g, '').trim();

import { stitch, StitchToolClient } from '@google/stitch-sdk';

async function testSdk() {
    console.log('Testing @google/stitch-sdk Official Client...');
    console.log('STITCH_API_KEY set:', !!process.env.STITCH_API_KEY);

    try {
        const client = new StitchToolClient({ apiKey: process.env.STITCH_API_KEY });
        const { tools } = await client.listTools();
        console.log(`✅ StitchToolClient conectado exitosamente. Herramientas disponibles: ${tools.length}`);
        tools.slice(0, 5).forEach(t => console.log(`   - ${t.name}: ${t.description.substring(0, 60)}...`));
        await client.close();

        console.log('\nProbando stitch.createProject...');
        const project = await stitch.createProject("Tucu Red Test Lab");
        console.log(`✅ Proyecto creado exitosamente en Stitch! ID: ${project.id || project.projectId}`);
        
        return { success: true, projectId: project.id || project.projectId };
    } catch (e) {
        console.error('❌ Error en Stitch SDK:', e.message, e);
        return { success: false, error: e.message };
    }
}

testSdk();
