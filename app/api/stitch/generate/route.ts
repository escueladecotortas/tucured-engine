import { NextResponse } from 'next/server';
import { StitchFactory } from '@/lib/stitch/factory';

// POST /api/stitch/generate
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const clientData = body.clientData;

        // DIAGNOSTIC START
        const cwd = process.cwd();
        console.log("🔍 DIAGNOSTIC: CWD is", cwd);
        try {
            const fs = require('fs');
            const path = require('path');
            const libPath = path.join(cwd, 'lib/stitch/widgets');
            if (fs.existsSync(libPath)) {
                console.log("✅ Widgets Dir exists:", libPath);
                console.log("📂 Contents:", fs.readdirSync(libPath));
            } else {
                console.error("❌ Widgets Dir NOT FOUND at:", libPath);
            }
        } catch (e) {
            console.error("❌ Diagnostic FS check failed:", e);
        }
        // DIAGNOSTIC END

        if (!clientData) {
            return NextResponse.json({ error: 'Missing clientData' }, { status: 400 });
        }

        const factory = new StitchFactory();
        await factory.init(); // Load widgets

        const html = factory.stitchSite(clientData);

        // In a real scenario, we would save this HTML to a file or DB and return the URL.
        // For now, we return the HTML directly so the frontend can preview it.
        
        return NextResponse.json({ 
            success: true, 
            html: html,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("❌ Stitch API Error:", error);
        return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
    }
}
