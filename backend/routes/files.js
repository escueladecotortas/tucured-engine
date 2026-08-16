const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const archivesRoot = path.resolve(__dirname, '../../nexus_archives');
const repoRoot = path.resolve(__dirname, '../..');

router.get('/artifact', (req, res) => {
    const { path: fPath } = req.query;
    if (!fPath) return res.status(400).json({ error: "No path" });
    const safe = path.normalize(fPath).replace(/^(\.\.[\/\\])+/, '');
    let abs = path.resolve(repoRoot, safe);
    if (!fs.existsSync(abs)) abs = fPath; // Try absolute
    if (fs.existsSync(abs)) {
        fs.readFile(abs, 'utf8', (err, data) => {
            if (err) return res.status(500).json({ error: "Read failed" });
            res.json({ content: data, path: abs });
        });
    } else res.status(404).json({ error: "Not found" });
});

router.get('/', (req, res) => {
    const pId = req.query.project || 'system';
    const pRoot = pId === 'root' ? repoRoot : path.join(archivesRoot, pId);
    if (!fs.existsSync(pRoot)) fs.mkdirSync(pRoot, { recursive: true });

    let tDir = pRoot;
    if (req.query.dir) {
        const sDir = path.normalize(req.query.dir).replace(/^(\.\.[\/\\])+/, '');
        tDir = path.resolve(pRoot, sDir);
        if (!tDir.startsWith(pRoot)) tDir = pRoot;
    }

    try {
        const items = fs.readdirSync(tDir, { withFileTypes: true }).map(i => ({
            name: i.name, type: i.isDirectory() ? 'folder' : 'file', path: path.relative(pRoot, path.join(tDir, i.name)).replace(/\\/g, '/')
        }));
        res.json(items);
    } catch (e) { res.json([]); }
});

router.get('/read', (req, res) => {
    let rPath = req.query.path;
    if (!rPath) return res.status(400).json({ error: "Path required" });
    rPath = rPath.replace(/^[\\\/]*nexus_archives[\\\/]/, '');

    const pId = req.query.project;
    const bRoot = pId === 'root' ? repoRoot : (pId ? path.join(archivesRoot, pId) : archivesRoot);
    const fPath = path.resolve(bRoot, path.normalize(rPath).replace(/^(\.\.[\\/\\\\])+/, ''));

    if (!fPath.startsWith(pId === 'root' ? repoRoot : archivesRoot)) return res.status(403).json({ error: "Denied" });
    if (!fs.existsSync(fPath)) return res.status(404).json({ error: "Not found" });

    res.json({ success: true, content: fs.readFileSync(fPath, 'utf8') });
});

router.post('/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file" });
        const pRoot = path.join(archivesRoot, req.body.project || 'system');
        const tDir = path.resolve(pRoot, path.normalize(req.body.dir || '').replace(/^(\.\.[\/\\])+/, ''));
        if (!tDir.startsWith(pRoot)) throw new Error("Invalid dir");
        if (!fs.existsSync(tDir)) fs.mkdirSync(tDir, { recursive: true });
        const fPath = path.join(tDir, req.file.originalname);
        fs.renameSync(req.file.path, fPath);
        res.json({ success: true, path: fPath });
    } catch (e) { res.status(500).json({ error: "Failed" }); }
});

router.delete('/', (req, res) => {
    try {
        const pRoot = path.join(archivesRoot, req.body.project || 'system');
        const fPath = path.resolve(pRoot, path.normalize(req.body.path || '').replace(/^(\.\.[\/\\])+/, ''));
        if (!fPath.startsWith(pRoot) || !fs.existsSync(fPath)) return res.status(403).json({ error: "Denied" });
        const stats = fs.statSync(fPath);
        if (stats.isDirectory()) fs.rmSync(fPath, { recursive: true, force: true });
        else fs.unlinkSync(fPath);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: "Failed" }); }
});

module.exports = router;
