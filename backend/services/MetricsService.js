const { admin, db } = require('../config/db');

// Service dedicated to telemetry and observability data
class MetricsService {
    constructor() {
        this.db = db;
        // The path to the global metrics document
        this.globalMetricsRef = this.db ? this.db.collection('nexus_metrics').doc('global_usage') : null;
    }

    /**
     * Log LLM token usage
     * @param {string} provider - 'groq' | 'gemini' | 'openai'
     * @param {number} inputTokens 
     * @param {number} outputTokens 
     */
    async logTokenUsage(provider, inputTokens = 0, outputTokens = 0) {
        if (!inputTokens && !outputTokens) return;
        if (!this.globalMetricsRef) {
            console.log(`[MetricsService] Offline - Skipping token log for ${provider}`);
            return;
        }
        
        try {
            const totalTokens = inputTokens + outputTokens;
            
            // Build the update payload to increment using Firestore atomic operators
            const updatePayload = {
                [`${provider}.usedTokens`]: admin.firestore.FieldValue.increment(totalTokens),
                [`${provider}.inputTokens`]: admin.firestore.FieldValue.increment(inputTokens),
                [`${provider}.outputTokens`]: admin.firestore.FieldValue.increment(outputTokens),
                [`${provider}.lastUpdate`]: admin.firestore.FieldValue.serverTimestamp()
            };

            await this.globalMetricsRef.set(updatePayload, { merge: true });
            
            console.log(`[MetricsService] Logged ${totalTokens} tokens for ${provider}`);
        } catch (error) {
            console.error(`[MetricsService] Failed to log token usage for ${provider}:`, error);
        }
    }

    /**
     * Log external API costs (Apify, etc)
     * @param {string} service - 'apify' | 'other'
     * @param {number} costInDollars 
     */
    async logServiceCost(service, costInDollars = 0) {
        if (!costInDollars) return;
        if (!this.globalMetricsRef) {
            console.log(`[MetricsService] Offline - Skipping cost log for ${service}`);
            return;
        }

        try {
            const updatePayload = {
                [`${service}.usedCost`]: admin.firestore.FieldValue.increment(costInDollars),
                [`${service}.lastUpdate`]: admin.firestore.FieldValue.serverTimestamp()
            };

            await this.globalMetricsRef.set(updatePayload, { merge: true });

            console.log(`[MetricsService] Logged $${costInDollars} cost for ${service}`);
        } catch (error) {
            console.error(`[MetricsService] Failed to log service cost for ${service}:`, error);
        }
    }

    /**
     * Fetch the current metrics state
     */
    async getMetrics() {
        if (!this.globalMetricsRef) {
            return {
                groq: { usedTokens: 0 },
                gemini: { usedTokens: 0 },
                apify: { usedCost: 0 }
            };
        }
        try {
            const doc = await this.globalMetricsRef.get();
            if (doc.exists) {
                return doc.data();
            }
            
            // Return an empty template if the document is not initialized yet
            return {
                groq: { usedTokens: 0 },
                gemini: { usedTokens: 0 },
                apify: { usedCost: 0 }
            };
        } catch (error) {
            console.error('[MetricsService] Failed to fetch metrics:', error);
            throw new Error('Failed to fetch metrics from Firestore');
        }
    }
}

module.exports = new MetricsService();
