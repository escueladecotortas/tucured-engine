// Archivo: scripts/calibrate_blueprint_launcher.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BLUEPRINT_DIR = path.resolve(__dirname, '../../blueprint-nexus');

// 1. project_launcher.js (Definición de PROJECT_SPECS y checkPortListening para evitar circularidad)
const launcherCode = `// Archivo: system_core/dashboard/project_launcher.js
const fs = require('fs');
const path = require('path');
const net = require('net');

const PROJECT_SPECS = {
    'blueprint-nexus': { purpose: 'Núcleo Soberano — Nexus OS v10.0. Dashboard de control, telemetría SSE, bóveda, kanban y orquestación de flota.', stack: 'Node.js, Express, React, Tailwind CSS v4, Firebase Admin, SSE', localPort: 3000, prodUrl: 'http://localhost:3000/nexus-admin', githubUrl: 'https://github.com/escueladecotortas/blueprint-nexus', category: 'Core OS', serviceType: 'CORE', serviceLabel: 'Core Master Hub' },
    'tucured-engine':  { purpose: 'Plataforma Inmersiva de Nexus OS y Tucu Red (Cinemática Edificio, Ascensor Interactivo, Dashboard con Menú Lateral de Agentes, Visual Editor y 51 servicios backend).', stack: 'React 19, Vite 7, Tailwind CSS v4, Framer Motion, Firebase, Apify, 51 Backend Services', localPort: 5005, prodUrl: null, githubUrl: 'https://github.com/escueladecotortas/tucured-engine', category: 'Plataforma Inmersiva & Web App', serviceType: 'FRONTEND', serviceLabel: 'Nexus Inmersivo & Tucu Red', testEndpoints: ['GET / (Cinemática Edificio & Ascensor)', 'GET /#start=lobby (Panel Directorio)', 'GET /#/project/tucu-red (Dashboard Tucu Red)', 'GET /#/visual-editor (Editor Visual)'] },
    'tucured-landing': { purpose: 'Portal Web público de Tucu Red. Landing informativa y punto de contacto para nuevos clientes locales.', stack: 'React 18, Vite 5, Tailwind CSS', localPort: 5174, prodUrl: 'https://tucuredlanding.netlify.app', githubUrl: 'https://github.com/escueladecotortas/tucured-landing', category: 'Satélite Web', serviceType: 'FRONTEND', serviceLabel: 'Web App' },
    'delicias-huerta': { purpose: 'Tienda Online de Delicias de la Huerta. Catálogo de productos orgánicos, carrito de compras y checkout integrado.', stack: 'Next.js 15, Tailwind CSS v4, Firebase', localPort: 3001, prodUrl: null, githubUrl: 'https://github.com/escueladecotortas/delicias-huerta', category: 'Satélite Web', serviceType: 'FRONTEND', serviceLabel: 'Web App' },
    'la-fachada':      { purpose: 'Sitio institucional y catálogo de La Fachada. Presencia digital y galería de servicios.', stack: 'Next.js 15, Tailwind CSS', localPort: 3002, prodUrl: null, githubUrl: 'https://github.com/escueladecotortas/la-fachada', category: 'Satélite Web', serviceType: 'FRONTEND', serviceLabel: 'Web App' },
    'nodo-mundial-v1': { purpose: 'Plataforma de gestión y frontend landing visual para operaciones y simulación de agentes.', stack: 'Next.js 16 (Turbopack), Tailwind CSS, Node.js', localPort: 3003, prodUrl: null, githubUrl: 'https://github.com/escueladecotortas/nodo-mundial-v1', category: 'Satélite Web', serviceType: 'FRONTEND', serviceLabel: 'Web App (Simulador)' },
    'cumple-oli':      { purpose: 'App de gestión de fiesta de cumpleaños. Sistema de confirmación de asistentes, lista de invitados y tablero del evento.', stack: 'Next.js 15, Firebase Firestore, Tailwind CSS', localPort: 3004, prodUrl: null, githubUrl: 'https://github.com/escueladecotortas/cumple-oli', category: 'Satélite Web', serviceType: 'FRONTEND', serviceLabel: 'Web App' },
    'Saula':           { purpose: 'Sistema de Rifa Solidaria Saula. Administración de tickets, sorteos y sponsors. Proyecto solidario con impacto social.', stack: 'Next.js 15, Firebase Admin, Tailwind CSS', localPort: 3005, prodUrl: null, githubUrl: 'https://github.com/escueladecotortas/Saula', category: 'Satélite Web', serviceType: 'FRONTEND', serviceLabel: 'Web App' },
};

function checkPortListening(port, timeoutMs = 600) {
    return new Promise(resolve => {
        const socket = new net.Socket();
        socket.setTimeout(timeoutMs);
        socket.on('connect', () => { socket.destroy(); resolve(true); });
        socket.on('timeout', () => { socket.destroy(); resolve(false); });
        socket.on('error', () => { socket.destroy(); resolve(false); });
        socket.connect(port, '127.0.0.1');
    });
}

function getProjectSpecs(baseDir, projectId) {
    const parentDir = path.resolve(baseDir, '../');
    const projPath = projectId === 'blueprint-nexus' ? path.resolve(baseDir) : path.resolve(parentDir, projectId);
    const spec = PROJECT_SPECS[projectId] || {};
    const hasPkg = fs.existsSync(path.join(projPath, 'package.json')), hasEnv = fs.existsSync(path.join(projPath, '.env'));
    let startScript = null;
    if (hasPkg) {
        try {
            const pkg = JSON.parse(fs.readFileSync(path.join(projPath, 'package.json'), 'utf-8'));
            startScript = pkg.scripts?.dev || pkg.scripts?.start || null;
        } catch (e) {}
    }
    return {
        success: true, projectId, name: projectId,
        purpose: spec.purpose || 'Sin descripción disponible.',
        stack: spec.stack || 'Desconocido', category: spec.category || 'Satélite',
        serviceType: spec.serviceType || 'FRONTEND', serviceLabel: spec.serviceLabel || 'Web App',
        testEndpoints: spec.testEndpoints || [],
        localPort: spec.localPort || null, localUrl: spec.localPort ? \`http://localhost:\${spec.localPort}\` : null,
        prodUrl: spec.prodUrl || null, githubUrl: spec.githubUrl || null,
        startScript, hasPackageJson: hasPkg, hasEnv, path: projPath
    };
}

async function launchProject(baseDir, projectId, cb) {
    const { startProjectProcess } = require('./fleet_manager');
    return startProjectProcess(baseDir, projectId, cb);
}

module.exports = { PROJECT_SPECS, getProjectSpecs, launchProject, checkPortListening };
`;

fs.writeFileSync(path.join(BLUEPRINT_DIR, 'system_core/dashboard/project_launcher.js'), launcherCode, 'utf-8');
console.log('✅ project_launcher.js actualizado.');
