const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Automation Handlers
const HANDLERS = {
    
    // Automation: Create Client Folder Structure (Onboarding)
    'onboarding': async (projectId) => {
        const archivesRoot = path.resolve(__dirname, '../../nexus_archives');
        const clientRoot = path.join(archivesRoot, 'tucu_red', 'clients', projectId);
        
        const dirs = [
            'raw_inputs',
            'versions',
            'assets'
        ];

        const logs = [];

        // 1. Create Directories
        dirs.forEach(dir => {
            const dirPath = path.join(clientRoot, dir);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
                logs.push(`Created directory: ${dir}`);
            } else {
                logs.push(`Directory exists: ${dir}`);
            }
        });

        // 2. Create Template Brief
        const briefPath = path.join(clientRoot, 'brief.md');
        if (!fs.existsSync(briefPath)) {
            const template = `# BRIEF: ${projectId}\n\n## 1. Vibración\n- \n\n## 2. Necesidades\n- \n`;
            fs.writeFileSync(briefPath, template);
            logs.push(`Created brief.md template.`);
        }

        return { success: true, logs };
    },

    // Automation: Verify Deployment (Pilot)
    'pilot-verification': async (projectId) => {
        const clientsRoot = path.resolve(__dirname, '../../nexus_archives/tucu-red/clients');
        const sitePath = path.join(clientsRoot, projectId, 'index.html');
        
        if (fs.existsSync(sitePath)) {
            return { 
                success: true, 
                logs: [`Site verification passed: ${projectId}`, `Index found at: ${sitePath}`] 
            };
        } else {
             return { 
                success: false, 
                logs: [`Site verification failed. Index not found for ${projectId}`] 
            };
        }
    },

    // Automation: Neural Factory V4 (Generate Site)
    'neural-factory': async (projectId, data) => {
        const AutoSiteGenerator = require('../services/AutoSiteGenerator');
        
        // Data usually comes from the frontend request body (prospectData)
        // If not provided, we try to reconstruct it or fail.
        if (!data || !data.name) {
             return { success: false, error: "Missing prospect data (name, instagram) for generation." };
        }

        try {
            const result = await AutoSiteGenerator.generateSite(data, { 
                forceRegenerate: true,
                dryRun: false // Production Mode by default for Automation
            });

            return {
                success: true,
                logs: [
                    `Neural Factory V4 Activated for: ${data.name}`,
                    `Scraping & AI Analysis Complete.`,
                    `Site Generated at: ${result.path}`,
                    `Preview URL: ${result.previewUrl}`
                ],
                meta: result
            };
        } catch (error) {
            return { success: false, error: error.message, logs: [`Generation Failed: ${error.message}`] };
        }
    }
};

// Main Runner Endpoint
router.post('/run', async (req, res) => {
    const { type, projectId, data } = req.body;

    console.log(`🤖 [AUTO] Running automation: ${type} for ${projectId}`);

    try {
        const handler = HANDLERS[type];
        if (!handler) {
            return res.status(400).json({ error: `Unknown automation type: ${type}` });
        }

        const result = await handler(projectId, data);
        res.json(result);

    } catch (error) {
        console.error("Automation Error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
