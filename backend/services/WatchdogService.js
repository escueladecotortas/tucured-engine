const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
const terminalService = require('./TerminalService');

/**
 * WatchdogService.js
 * Passive filesystem observer.
 * Detects changes and emits "Whispers" to the console if it sees suspicious things.
 */
class WatchdogService {
    constructor() {
        this.watcher = null;
        this.projectRoot = null;
    }

    start(projectRoot) {
        this.projectRoot = projectRoot;
        console.log("🐕 [Watchdog] Sentinel active on:", projectRoot);

        // Watch Source Code AND Archives
        const pathsToWatch = [
            path.join(projectRoot, 'frontend/src/**/*.js'),
            path.join(projectRoot, 'frontend/src/**/*.jsx'),
            path.join(projectRoot, 'backend/**/*.js'),
            path.join(projectRoot, 'nexus_archives/**/*') // Watch Archives
        ];

        this.watcher = chokidar.watch(pathsToWatch, {
            ignored: /(^|[\/\\])\../, // ignore dotfiles
            persistent: true,
            ignoreInitial: true
        });

        this.watcher
            .on('add', path => this.handleFileChange(path, 'add'))
            .on('change', path => this.handleFileChange(path, 'change'))
            .on('unlink', path => this.handleFileChange(path, 'unlink'));

        terminalService.broadcast("🐕 [Watchdog] Sentinel Active.", 'system');
    }

    handleFileChange(filePath, type) {
        // console.log(`🐕 [Watchdog] File ${type}: ${path.basename(filePath)}`);

        // Emit general refresh event
        if (this.io) {
            this.io.emit('file:change', {
                path: filePath,
                type: type,
                name: path.basename(filePath)
            });
        }

        // Run lint/check only for code files
        if (filePath && (filePath.endsWith('.js') || filePath.endsWith('.jsx'))) {
            this.debouncedCheck(filePath);
        }
    }

    debouncedCheck(filePath) {
        // Only care about JS/JSX/TS
        if (!filePath.match(/\.(js|jsx|ts|tsx)$/)) return;

        const fileName = path.basename(filePath);

        try {
            const content = fs.readFileSync(filePath, 'utf8');

            // 1. Simple Syntax Heuristic: Check for conflict markers
            if (content.includes('<<<<<<< HEAD')) {
                terminalService.broadcast(`⚠️ [Watchdog] Merge conflict detected in ${fileName}!`, 'error');
                return;
            }

            // 2. Reserved Keyword Check (e.g. TODOs)
            if (content.includes('// TODO:')) {
                terminalService.broadcast(`ℹ️ [Watchdog] You left a TODO in ${fileName}. Can I help?`, 'info');
            }

            // 3. Console Log Spam Warning
            const logCount = (content.match(/console\.log/g) || []).length;
            if (logCount > 5) {
                terminalService.broadcast(`🧹 [Watchdog] ${fileName} has ${logCount} console.logs. Want a cleanup?`, 'warning');
            }

        } catch (e) {
            console.error("Watchdog read error:", e);
        }
    }
}

module.exports = new WatchdogService();
