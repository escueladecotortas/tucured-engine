const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Asset List
router.get('/list', (req, res) => {
    const { projectId, subfolder } = req.query;
    if (!projectId) return res.status(400).json({ error: "Project ID is required" });

    try {
        let basePath = path.join(__dirname, '../../../nexus_archives', projectId);
        if (!fs.existsSync(basePath)) {
            const fallbackPath = path.join(__dirname, '../../../nexus_archives/tucu-red/clients', projectId);
            if (fs.existsSync(fallbackPath)) basePath = fallbackPath;
            else return res.json([]);
        }

        let targetPath = subfolder ? path.join(basePath, subfolder) : basePath;
        if (!fs.existsSync(targetPath)) return res.json([]);

        const assets = fs.readdirSync(targetPath).map(file => {
            try {
                const stats = fs.statSync(path.join(targetPath, file));
                return {
                    name: file, type: stats.isDirectory() ? 'folder' : 'file', size: stats.size,
                    url: `/nexus_archives/${projectId}/${subfolder ? subfolder + '/' : ''}${file}`
                };
            } catch (e) { return null; }
        }).filter(Boolean);
        res.json(assets);
    } catch (error) { res.status(500).json({ error: "Failed to list assets" }); }
});

// Asset Upload
const assetStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dPath = path.join(__dirname, '../../../nexus_archives', req.body.projectPath || 'tucu-red', req.body.subfolder || 'assets');
        if (!fs.existsSync(dPath)) fs.mkdirSync(dPath, { recursive: true });
        cb(null, dPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}${ext}`);
    }
});
const upload = multer({ storage: assetStorage });

router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const relPath = req.file.path.split('nexus_archives')[1].replace(/\\/g, '/');
    res.json({ success: true, url: `/nexus_archives${relPath}`, filename: req.file.filename });
});

module.exports = router;
