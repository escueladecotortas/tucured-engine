// Archivo: frontend/src/components/leads/AgentPanel.jsx
import React, { useState, useEffect } from "react";
import { AgentCard } from "./agents/AgentCard";
import { GenerationTimer } from "./agents/GenerationTimer";

const AGENT_TRIGGERS = {
    Atenea: ["color", "paleta", "estilo", "vibración", "design", "visual", "director de arte"],
    Lorem:  ["copy", "texto", "stitch", "generando", "escribiendo", "semilla"],
    Codi:   ["inyectando", "widget", "healer", "html", "navbar", "mapa", "descarga"],
    Argus:  ["validando", "qa", "argus", "exitoso", "netlify", "deploy"],
};

const AGENTS = [
    { id: "Atenea", label: "Atenea",  role: "Diseño & Paleta",    color: "#ec4899", glow: "rgba(236,72,153,0.35)" },
    { id: "Lorem",  label: "Lorem",   role: "Copy & UX Voice",    color: "#f59e0b", glow: "rgba(245,158,11,0.35)"  },
    { id: "Codi",   label: "Codi",    role: "Inyección & HTML",   color: "#3b82f6", glow: "rgba(59,130,246,0.35)"  },
    { id: "Argus",  label: "Argus",   role: "QA & Deploy",        color: "#10b981", glow: "rgba(16,185,129,0.35)"  },
];

function detectActiveAgent(logs) {
    if (!logs?.length) return null;
    const lastMsg = (logs[logs.length - 1]?.message || "").toLowerCase();
    return Object.keys(AGENT_TRIGGERS).find(id => AGENT_TRIGGERS[id].some(kw => lastMsg.includes(kw))) || null;
}

/**
 * PANEL DE AGENTES VIVOS (Vanguardia 2026)
 * Orquestador visual de la actividad de los agentes durante la generación.
 * Cumple con la Ley de 200 líneas (< 100 líneas efectivas).
 */
export default function AgentPanel({ logs = [], isRunning, isFinished }) {
    const [activeAgent, setActiveAgent] = useState(null);
    const [agentHistory, setAgentHistory] = useState({});

    useEffect(() => {
        const detected = detectActiveAgent(logs);
        if (detected) {
            setActiveAgent(detected);
            setAgentHistory(prev => ({ ...prev, [detected]: (logs[logs.length - 1]?.message || "").slice(0, 60) }));
        }
    }, [logs]);

    useEffect(() => {
        if (!isRunning || isFinished) return;
        let idx = 0;
        const fallback = setInterval(() => {
            if (!detectActiveAgent(logs)) {
                setActiveAgent(AGENTS[idx % AGENTS.length].id);
                idx++;
            }
        }, 3200);
        return () => clearInterval(fallback);
    }, [isRunning, isFinished, logs]);

    return (
        <div className="agent-orchestrator-ui">
            <style>{`
                @keyframes nexus-pulse { 0% { transform: scale(1); opacity: 0.7; } 70% { transform: scale(1.6); opacity: 0; } 100% { transform: scale(1.6); opacity: 0; } }
                @keyframes nexus-spin-slow { to { transform: rotate(360deg); } }
            `}</style>

            <GenerationTimer isRunning={isRunning} isFinished={isFinished} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {AGENTS.map((agent) => (
                    <AgentCard 
                        key={agent.id} 
                        agent={agent} 
                        isActive={activeAgent === agent.id && isRunning && !isFinished} 
                        wasDone={!!agentHistory[agent.id]} 
                        lastAction={agentHistory[agent.id]} 
                    />
                ))}
            </div>
        </div>
    );
}
