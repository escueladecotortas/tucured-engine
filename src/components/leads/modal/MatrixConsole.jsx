// Archivo: frontend/src/components/leads/modal/MatrixConsole.jsx
import React, { useEffect, useRef } from 'react';

const ERROR_RE = /Error|Falló/i;

export function MatrixConsole({ logs }) {
    const bottomRef = useRef(null);
    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);

    return (
        <div className="bg-[#020617] border border-white/5 rounded-xl p-4 font-mono text-[10px] max-h-40 overflow-y-auto custom-scrollbar text-gray-500 shadow-inner">
            {logs.length === 0 ? (
                <span className="opacity-30 tracking-tighter">› Esperando señal del pipeline neural...</span>
            ) : (
                logs.slice(-40).map((log, i) => {
                    const text = log.line || log.message || "";
                    const isError = ERROR_RE.test(text);
                    const isOk = /success|✅|completado/i.test(text);
                    return (
                        <div key={i} className={`mb-1 flex gap-2 ${isError ? 'text-red-400' : isOk ? 'text-emerald-400' : 'text-gray-400'}`}>
                            <span className="opacity-20 shrink-0">[{new Date().toLocaleTimeString()}] ›</span>
                            <span className="break-all">{text}</span>
                        </div>
                    );
                })
            )}
            <div ref={bottomRef} />
        </div>
    );
}
