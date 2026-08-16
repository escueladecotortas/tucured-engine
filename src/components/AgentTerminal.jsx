"use client";

import { useState, useEffect, useRef } from 'react';

export default function AgentTerminal() {
  const [logs, setLogs] = useState([]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    const eventSource = new EventSource('/api/terminal/stream');
    eventSource.onmessage = (event) => setLogs((prev) => [...prev, JSON.parse(event.data)]);
    return () => eventSource.close();
  }, []);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [logs]);

  const handleExecute = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const commandToRun = input;

    // 1. Siempre mandamos el texto al backend para que quede registrado en el chat (y lo lean los agentes)
    await fetch('/api/terminal/execute', { 
        method: 'POST', 
        body: JSON.stringify({ command: commandToRun, agent: 'USER' }) 
    });

    // 2. EL ENRUTADOR: Si empieza con "/", es un comando directo para Windows.
    if (commandToRun.startsWith("/")) {
        const cleanCommand = commandToRun.substring(1); // Le sacamos la barra
        window.postMessage({ 
            action: "EXECUTE_NATIVE", 
            command: cleanCommand
        }, "*");
    }

    setInput('');
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto rounded-xl border border-border bg-background shadow-lg overflow-hidden font-mono text-sm">
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-2 text-foreground/80">
          <span className="font-semibold tracking-tight">NEXUS_OS // AGENT TERMINAL</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">SSE ONLINE</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-black/5 dark:bg-black/40">
        {logs.map((log, idx) => (
          <div key={idx} className="flex gap-3">
            <span className="text-emerald-500/80">{new Date(log.timestamp).toLocaleTimeString()}</span>
            <span className="text-blue-400 font-bold">[{log.agent}]</span>
            <span className="text-foreground">{log.message}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={handleExecute} className="p-3 bg-muted/20 border-t border-border flex gap-2">
        <input className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-foreground" value={input} onChange={(e) => setInput(e.target.value)} />
        <button disabled={!input.trim()} type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">Ejecutar</button>
      </form>
    </div>
  );
}