const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * DurableSessionService.js
 * NEXUS-OS Mission Control & Crash Resilience.
 * Persists Agent Workflows into Firestore 'durable_sessions'.
 */
class DurableSessionService {
    constructor() {
        this.db = admin.apps.length ? admin.firestore() : null;
        this.collectionName = 'durable_sessions';
    }

    /**
     * Inicia o recupera una sesión de trabajo para un proyecto.
     */
    async getOrCreateSession(projectId, taskName) {
        if (!this.db) return null;

        const sessionRef = this.db.collection(this.collectionName).doc(projectId);
        const doc = await sessionRef.get();

        if (doc.exists) {
            console.log(`🧠 [DurableSession] Resuming session for ${projectId}...`);
            return doc.data();
        }

        const newSession = {
            projectId,
            taskName,
            status: 'ignited',
            step: 0,
            history: [],
            checkpoints: {},
            startedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        await sessionRef.set(newSession);
        console.log(`🚀 [DurableSession] New session ignited for ${projectId}`);
        return newSession;
    }

    /**
     * Guarda un hito (checkpoint) en la sesión.
     */
    async setCheckpoint(projectId, stepName, data = {}) {
        if (!this.db) return;

        const sessionRef = this.db.collection(this.collectionName).doc(projectId);
        await sessionRef.update({
            [`checkpoints.${stepName}`]: {
                data,
                timestamp: new Date().toISOString()
            },
            status: 'in_progress',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`📍 [DurableSession] Checkpoint reached: ${stepName}`);
    }

    /**
     * Marca la misión como completada.
     */
    async completeSession(projectId) {
        if (!this.db) return;
        await this.db.collection(this.collectionName).doc(projectId).update({
            status: 'concluded',
            completedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`🏁 [DurableSession] Mission concluded for ${projectId}`);
    }
}

module.exports = new DurableSessionService();
