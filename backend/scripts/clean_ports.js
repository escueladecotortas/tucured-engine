const { exec } = require('child_process');

const PORTS = [5005, 5174, 3005];

console.log('\n🧹 NEXUS PORT CLEANER');
console.log('=====================');

function killPort(port) {
    return new Promise((resolve) => {
        // Command to find PID by port on Windows
        const cmdFind = `netstat -ano | findstr :${port}`;
        
        exec(cmdFind, (err, stdout) => {
            if (err || !stdout) {
                console.log(`✅ Port ${port} is free.`);
                return resolve();
            }

            const lines = stdout.split('\n').filter(line => line.trim() !== '');
            const pids = new Set();

            lines.forEach(line => {
                const parts = line.trim().split(/\s+/);
                const pid = parts[parts.length - 1];
                if (pid && pid !== '0') { // Ignore System Idle Process
                    pids.add(pid);
                }
            });

            if (pids.size === 0) {
                console.log(`✅ Port ${port} is free.`);
                return resolve();
            }

            const activePids = Array.from(pids);
            console.log(`⚠️  Port ${port} is busy. Killing PIDs: ${activePids.join(', ')}...`);

            // Kill all found PIDs
            const killCmd = `taskkill /F /PID ${activePids.join(' /PID ')}`;
            exec(killCmd, (killErr) => {
                if (killErr) {
                    console.log(`❌ Failed to kill some processes on port ${port}. may need Admin.`);
                } else {
                    console.log(`💀 Port ${port} liberated.`);
                }
                resolve();
            });
        });
    });
}

(async () => {
    console.log('Scanning active ports...');
    for (const port of PORTS) {
        await killPort(port);
    }
    console.log('✨ All ports clean. Starting System...\n');
})();
