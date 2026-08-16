// Archivo: frontend/src/components/leads/agents/GenerationTimer.jsx
import React, { useState, useEffect, useRef } from "react";

export function GenerationTimer({ isRunning, isFinished }) {
    const [elapsed, setElapsed] = useState(0);
    const startRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isRunning && !isFinished) {
            if (!startRef.current) startRef.current = Date.now();
            timerRef.current = setInterval(() => {
                setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
            }, 1000);
        } else {
            clearInterval(timerRef.current);
            if (!isRunning) {
                startRef.current = null;
                setElapsed(0);
            }
        }
        return () => clearInterval(timerRef.current);
    }, [isRunning, isFinished]);

    const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    if (!isRunning) return null;

    return (
        <div style={{ textAlign: "center", marginBottom: 20 }}>
            <span style={{
                fontFamily: "monospace", fontSize: "2.2rem", fontWeight: 900,
                background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                letterSpacing: "0.08em",
            }}>
                {fmt(elapsed)}
            </span>
            <div style={{ fontSize: "0.7rem", opacity: 0.45, marginTop: 2, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                {isFinished ? "completado" : "procesando"}
            </div>
        </div>
    );
}
