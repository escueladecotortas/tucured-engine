import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin (Singleton Pattern)
if (!admin.apps.length) {
    try {
        const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        // Only initialize if we have the key (Run time)
        if (serviceAccountJson) {
            const serviceAccount = JSON.parse(serviceAccountJson);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log("🔥 [Serverless Firebase] Inicializado.");
        } else {
            console.warn("⚠️ [Serverless Firebase] Skipping init: No credentials found (Build time?)");
        }
    } catch (e) {
        console.error("❌ [Serverless Firebase] Fallo al inicializar:", e);
    }
}

// Export a function to get DB safely
const getDb = () => {
    if (!admin.apps.length) throw new Error("Firebase not initialized");
    return admin.firestore();
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { brandName, slug, personalData, category, catalog } = body;

        if (!brandName || !slug || !personalData?.name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        console.log(`💾 [Serverless DB] Guardando cliente: ${brandName}`);

        const db = getDb();
        const clientRef = db.collection('clients').doc(slug);

        const clientData = {
            name: brandName,
            category: category || 'General',
            owner: {
                name: personalData.name,
                whatsapp: personalData.whatsapp,
                email: personalData.email || ''
            },
            catalog: catalog || [],
            status: 'active',
            plan: 'semilla',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            source: 'onboarding_serverless_v1'
        };

        await clientRef.set(clientData, { merge: true });

        return NextResponse.json({ success: true, clientId: slug });

    } catch (error: any) {
        console.error("❌ [Serverless DB] Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
