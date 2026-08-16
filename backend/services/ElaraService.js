const { db, admin } = require('../config/firebase');

/**
 * ElaraService.js (Tier 3: Data Engine)
 * Responsable de la indexación semántica y persistencia atómica en la Bóveda.
 * Implementa la generación de IDs Secuenciales Humanos (TUCU-YYYY-XXX).
 */
class ElaraService {
    constructor() {
        this.missionCol = 'missions';
        this.insightCol = 'stress_insights';
        this.counterDoc = 'counters/mission_counter';
    }

    /**
     * Genera un ID de Misión secuencial atómico usando transacciones de Firestore.
     */
    async _generateSequentialId() {
        const year = new Date().getFullYear();
        const counterRef = db.doc(this.counterDoc);

        return await db.runTransaction(async (transaction) => {
            const counterDoc = await transaction.get(counterRef);
            let nextCount = 1;

            if (counterDoc.exists) {
                nextCount = counterDoc.data().count + 1;
            }

            transaction.set(counterRef, { count: nextCount, last_updated: admin.firestore.FieldValue.serverTimestamp() });
            
            const paddedCount = nextCount.toString().padStart(3, '0');
            return `TUCU-${year}-${paddedCount}`;
        });
    }

    /**
     * Anonimización básica de datos sensibles (PII).
     */
    _anonymize(text) {
        if (!text) return text;
        // Regex simple para emails y teléfonos
        return text
            .replace(/[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-z]{2,3}/g, "[EMAIL_REDACTED]")
            .replace(/\+?\d{10,15}/g, "[PHONE_REDACTED]");
    }

    /**
     * Indexa una nueva misión confirmada desde el Triaje Jano.
     */
    async indexMission(payload) {
        try {
            const missionId = await this._generateSequentialId();
            const document = {
                mission_id: missionId,
                created_at: admin.firestore.FieldValue.serverTimestamp(),
                source: payload.source || 'JANO_V1',
                client_input: this._anonymize(payload.client_input),
                triage: {
                    label: payload.label,
                    score: payload.score,
                    specialist: payload.specialist,
                    is_bypass: payload.is_bypass || false
                },
                status: 'OPEN',
                priority: (payload.specialist === 'VITALIS' || payload.is_bypass) ? 'HIGH' : 'NORMAL'
            };

            await db.collection(this.missionCol).doc(missionId).set(document);
            console.log(`🧠 [Elara] Misión Indexada con éxito: ${missionId}`);
            
            return { success: true, mission_id: missionId };
        } catch (error) {
            console.error("❌ [Elara] Error indexando misión:", error);
            throw new Error(`FALLO_INDEXACION_MEMORY: ${error.message}`);
        }
    }

    /**
     * Ingiere telemetría de estrés y ruido para refinamiento futuro.
     */
    async indexStressInsight(payload) {
        try {
            const insightDoc = {
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                raw_input: this._anonymize(payload.raw_input),
                score: payload.score || 0,
                gap: payload.gap || 0,
                issue_type: payload.issue_type || 'LOW_CONFIDENCE'
            };

            await db.collection(this.insightCol).add(insightDoc);
            return { success: true };
        } catch (error) {
            console.error("❌ [Elara] Error indexando insight:", error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = new ElaraService();
