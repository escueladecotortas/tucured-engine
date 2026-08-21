// Archivo: src/components/AgentTerminal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Activity, Cpu, GitBranch, Folder, Trash2, Send } from 'lucide-react';
import QuickBtn from './terminal/QuickBtn';

function getAgentBadgeClass(agent) {
  switch ((agent || '').toUpperCase()) {
    case 'USER': return 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30';
    case 'VITALIS': return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
    case 'CODI': return 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30';
    case 'OUTPUT': return 'bg-white/10 text-gray-300';
    case 'STDERR': case 'ERROR': return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
    default: return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
  }
}

export default function AgentTerminal() {
  const [logs, setLogs] = useState([]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    let eventSource = null;
    let reconnectTimeout = null;
    let retryCount = 0;

    const connectSSE = () => {
      try {
        if (eventSource) eventSource.close();
        eventSource = new EventSource('/api/terminal/stream');
        eventSource.onopen = () => { retryCount = 0; };
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setLogs((prev) => [...prev, data]);
          } catch (e) {
            console.warn("Error parseando log SSE:", e);
          }
        };
        eventSource.onerror = () => {
          eventSource.close();
          const delay = Math.min(1000 * Math.pow(2, retryCount), 15000);
          retryCount++;
          reconnectTimeout = setTimeout(connectSSE, delay);
        };
      } catch (e) {
        reconnectTimeout = setTimeout(connectSSE, 3000);
      }
    };

    connectSSE();
    return () => { 
      if (eventSource) eventSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const executeCommand = async (cmd) => {
    if (!cmd || !cmd.trim()) return;
    try {
      await fetch('/api/terminal/execute', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd.trim(), agent: 'USER' }) 
      });
    } catch (err) {
      console.error("Error ejecutando comando en terminal:", err);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    executeCommand(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[650px] w-full max-w-5xl mx-auto rounded-2xl border border-white/10 bg-[#0A0A1A]/80 backdrop-blur-xl shadow-2xl overflow-hidden font-mono text-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-black/60 border-b border-white/10 relative z-20">
        <div className="flex items-center gap-2 text-white">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-bold tracking-tight text-xs uppercase">NEXUS CORE // TERMINAL SSE</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse ml-2" />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <QuickBtn icon={<Activity className="w-3.5 h-3.5 text-emerald-400" />} label="Salud Motor" tooltip="Diagnóstico clínico VITALIS: Evalúa el tiempo de actividad (Uptime), uso de memoria RAM de Node.js y estabilidad del Kernel." onClick={() => executeCommand('health')} />
          <QuickBtn icon={<Cpu className="w-3.5 h-3.5 text-cyan-400" />} label="Servicios" tooltip="Auditoría del Enjambre: Verifica la disponibilidad y estado de los 51 servicios activos del catálogo (Stitch, Vision, Deploy, etc.)." onClick={() => executeCommand('services')} />
          <QuickBtn icon={<GitBranch className="w-3.5 h-3.5 text-indigo-400" />} label="Git Status" tooltip="Control de Versiones: Ejecuta 'git status' en segundo plano para auditar la rama activa y cambios pendientes de commit." onClick={() => executeCommand('git status')} />
          <QuickBtn icon={<Folder className="w-3.5 h-3.5 text-amber-400" />} label="Directorio" tooltip="Explorador de Archivos: Lista el contenido y estructura del directorio raíz del satélite tucured-engine." onClick={() => executeCommand('dir')} />
          <QuickBtn icon={<Trash2 className="w-3.5 h-3.5 text-rose-400" />} label="Limpiar" tooltip="Mantenimiento Visual: Vacía el buffer de texto y registros en pantalla de la terminal sin afectar los procesos de fondo." onClick={() => setLogs([])} isDanger />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1.5 bg-black/50 custom-scrollbar text-xs leading-relaxed">
        {logs.length === 0 ? (
          <div className="text-gray-500 italic text-center py-16">Terminal listo. Selecciona una acción rápida o ingresa un comando.</div>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2.5 hover:bg-white/5 px-2 py-0.5 rounded transition-colors">
              <span className="text-gray-500 select-none text-[10px] pt-0.5">{new Date(log.timestamp).toLocaleTimeString()}</span>
              <span className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${getAgentBadgeClass(log.agent)}`}>
                [{log.agent}]
              </span>
              <span className="text-gray-200 break-all flex-1">{log.message}</span>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleFormSubmit} className="p-3 bg-black/70 border-t border-white/10 flex gap-2">
        <input className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-500/50" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribir comando shell (ej: health, services, dir, node -v)..." />
        <button disabled={!input.trim()} type="submit" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-900/20">
          <Send className="w-3.5 h-3.5" />
          <span>Ejecutar</span>
        </button>
      </form>
    </div>
  );
}