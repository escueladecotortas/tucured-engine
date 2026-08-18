// Archivo: backend/routes/files.js
// Gestor Soberano de Archivos, Protocolos SOP y Bóveda Documental

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const uploadDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir });
const repoRoot = path.resolve(__dirname, '../..');

function isPathInside(child, parent) {
    const rel = path.relative(parent.toLowerCase(), child.toLowerCase());
    return !rel.startsWith('..') && !path.isAbsolute(rel);
}

function resolveBasePath(pId) {
    if (pId === 'root' || !pId) return repoRoot;
    const clientDir = path.join(repoRoot, 'public/clients', pId);
    if (fs.existsSync(clientDir)) return clientDir;
    const archDir = path.join(repoRoot, 'nexus_archives', pId);
    if (fs.existsSync(archDir)) return archDir;
    return repoRoot;
}

// GET /api/files/artifact - Leer artefacto específico
router.get('/artifact', (req, res) => {
    const fPath = req.query.path;
    if (!fPath) return res.status(400).json({ error: "Ruta requerida" });
    const abs = path.resolve(repoRoot, path.normalize(fPath).replace(/^(\.\.[\/\\])+/, ''));
    if (fs.existsSync(abs)) {
        res.json({ content: fs.readFileSync(abs, 'utf8'), path: abs });
    } else {
        res.status(404).json({ error: "No encontrado" });
    }
});

// GET /api/files - Listar directorio
router.get('/', (req, res) => {
    try {
        const pRoot = resolveBasePath(req.query.project);
        let tDir = pRoot;
        if (req.query.dir) {
            tDir = path.resolve(pRoot, path.normalize(req.query.dir).replace(/^(\.\.[\/\\])+/, ''));
            if (!isPathInside(tDir, pRoot) && tDir.toLowerCase() !== pRoot.toLowerCase()) tDir = pRoot;
        }
        if (!fs.existsSync(tDir)) return res.json([]);

        const items = fs.readdirSync(tDir, { withFileTypes: true })
            .filter(i => !i.name.startsWith('.git') && i.name !== 'node_modules' && i.name !== 'dist')
            .map(i => ({
                name: i.name,
                type: i.isDirectory() ? 'folder' : 'file',
                path: path.relative(pRoot, path.join(tDir, i.name)).replace(/\\/g, '/')
            }));
        res.json(items);
    } catch (e) {
        res.json([]);
    }
});

// GET /api/files/raw - Servir archivo crudo (imágenes sin freeze)
router.get('/raw', (req, res) => {
    try {
        const fPath = path.resolve(resolveBasePath(req.query.project), path.normalize(req.query.path || '').replace(/^(\.\.[\\/\\\\])+/, ''));
        if (!isPathInside(fPath, repoRoot) && fPath.toLowerCase() !== repoRoot.toLowerCase()) return res.status(403).json({ error: "Denegado" });
        if (!fs.existsSync(fPath)) return res.status(404).json({ error: "No encontrado" });
        res.sendFile(fPath);
    } catch (e) {
        res.status(500).json({ error: "Error de lectura" });
    }
});

// GET /api/files/read - Leer texto
router.get('/read', (req, res) => {
    try {
        const fPath = path.resolve(resolveBasePath(req.query.project), path.normalize(req.query.path || '').replace(/^(\.\.[\\/\\\\])+/, ''));
        if (!isPathInside(fPath, repoRoot) && fPath.toLowerCase() !== repoRoot.toLowerCase()) return res.status(403).json({ error: "Denegado" });
        if (!fs.existsSync(fPath)) return res.status(404).json({ error: "No encontrado" });
        res.json({ success: true, content: fs.readFileSync(fPath, 'utf8') });
    } catch (e) {
        res.status(500).json({ error: "Error de lectura" });
    }
});

// POST /api/files/mkdir - Crear carpeta
router.post('/mkdir', (req, res) => {
    try {
        const tDir = path.resolve(resolveBasePath(req.body.project), path.normalize(req.body.path || '').replace(/^(\.\.[\/\\])+/, ''));
        if (!isPathInside(tDir, repoRoot) && tDir.toLowerCase() !== repoRoot.toLowerCase()) throw new Error("Inválido");
        if (!fs.existsSync(tDir)) fs.mkdirSync(tDir, { recursive: true });
        res.json({ success: true, path: tDir });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// PUT /api/files/rename - Renombrar
router.put('/rename', (req, res) => {
    try {
        const pRoot = resolveBasePath(req.body.project);
        const oldP = path.resolve(pRoot, path.normalize(req.body.oldPath || '').replace(/^(\.\.[\/\\])+/, ''));
        const newP = path.join(path.dirname(oldP), path.basename(req.body.newName || ''));
        if (!isPathInside(oldP, repoRoot) || !fs.existsSync(oldP) || !isPathInside(newP, repoRoot)) return res.status(403).json({ error: "Denegado" });
        fs.renameSync(oldP, newP);
        res.json({ success: true, path: newP });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// POST /api/files/upload
router.post('/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file" });
        const tDir = path.resolve(resolveBasePath(req.body.project), path.normalize(req.body.dir || '').replace(/^(\.\.[\/\\])+/, ''));
        if (!isPathInside(tDir, repoRoot) && tDir.toLowerCase() !== repoRoot.toLowerCase()) throw new Error("Inválido");
        if (!fs.existsSync(tDir)) fs.mkdirSync(tDir, { recursive: true });
        const fPath = path.join(tDir, req.file.originalname);
        fs.renameSync(req.file.path, fPath);
        res.json({ success: true, path: fPath });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// DELETE /api/files
router.delete('/', (req, res) => {
    try {
        const fPath = path.resolve(resolveBasePath(req.body.project), path.normalize(req.body.path || '').replace(/^(\.\.[\/\\])+/, ''));
        if (!isPathInside(fPath, repoRoot) || !fs.existsSync(fPath)) return res.status(403).json({ error: "Denegado" });
        const stats = fs.statSync(fPath);
        if (stats.isDirectory()) fs.rmSync(fPath, { recursive: true, force: true });
        else fs.unlinkSync(fPath);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
