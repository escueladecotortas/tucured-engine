// Archivo: frontend/src/components/leads/agents/AgentCard.jsx
import React from "react";

const PulseRing = ({ color, glow }) => (
    <span style={{
        position: "absolute", inset: -4, borderRadius: "50%",
        border: `2px solid ${color}`, opacity: 0.6,
        animation: "nexus-pulse 1.4s ease-out infinite",
        boxShadow: `0 0 12px ${glow}`,
    }} />
);

export function AgentCard({ agent, isActive, wasDone, lastAction }) {
    return (
        <div style={{
            background: isActive ? `linear-gradient(135deg, ${agent.glow}, #0f172a)` : "#0f172a",
            border: `1px solid ${isActive ? agent.color : "rgba(255,255,255,0.08)"}`,
            borderRadius: 16, padding: "16px 14px",
            transition: "all 0.4s ease",
            boxShadow: isActive ? `0 0 24px ${agent.glow}` : "none",
            position: "relative", overflow: "hidden",
        }}>
            {isActive && (
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 2,
                    background: `linear-gradient(90deg, transparent, ${agent.color}, transparent)`,
                    animation: "nexus-spin-slow 2s linear infinite",
                }} />
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{
                        width: 38, height: 38, borderRadius: "50%",
                        background: isActive ? `radial-gradient(circle, ${agent.color}40, ${agent.color}15)` : "rgba(255,255,255,0.05)",
                        border: `2px solid ${isActive ? agent.color : "rgba(255,255,255,0.1)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.75rem", fontWeight: 700, color: isActive ? agent.color : "rgba(255,255,255,0.35)",
                    }}>
                        {agent.id.slice(0, 2)}
                    </div>
                    {isActive && <PulseRing color={agent.color} glow={agent.glow} />}
                </div>

                <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem", color: isActive ? agent.color : "rgba(255,255,255,0.6)" }}>
                        {agent.label}
                    </div>
                    <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", marginTop: 1 }}>
                        {agent.role}
                    </div>
                </div>

                <div style={{ marginLeft: "auto" }}>
                    {isActive ? (
                        <span style={{
                            display: "inline-block", width: 8, height: 8, borderRadius: "50%",
                            background: agent.color, boxShadow: `0 0 8px ${agent.color}`,
                            animation: "nexus-pulse 1s ease-in-out infinite",
                        }} />
                    ) : wasDone ? (
                        <span style={{ color: "#10b981", fontSize: "0.9rem" }}>✓</span>
                    ) : (
                        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.8rem" }}>○</span>
                    )}
                </div>
            </div>

            {lastAction && (
                <div style={{
                    marginTop: 10, fontSize: "0.65rem",
                    color: isActive ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    fontFamily: "monospace",
                }}>
                    › {lastAction}
                </div>
            )}
        </div>
    );
}
