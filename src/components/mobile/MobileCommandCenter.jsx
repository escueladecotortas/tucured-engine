// Archivo: frontend/src/components/mobile/MobileCommandCenter.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Zap, Power } from 'lucide-react';
import { ConsoleDisplay } from './ConsoleDisplay';
import { DashboardCards } from './DashboardCards';
import { VoiceInterface } from './VoiceInterface';

export default function MobileCommandCenter({ user, onLogout }) {
    const [logs, setLogs] = useState([
        { id: 1, type: 'info', text: 'Secure Uplink Established', time: new Date().toLocaleTimeString() },
        { id: 2, type: 'success', text: `Identity Verified: ${user.name || 'Architect'}`, time: new Date().toLocaleTimeString() },
    ]);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    const addLog = (type, text) => setLogs(prev => [...prev.slice(-19), { id: Date.now(), type, text, time: new Date().toLocaleTimeString() }]);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) return addLog('error', 'Browser not supported');
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'es-ES';
        recognition.onstart = () => { setIsListening(true); addLog('info', 'Listening...'); };
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (e) => {
            const transcript = e.results[0][0].transcript;
            addLog('success', `USR: "${transcript}"`);
            processCommand(transcript);
        };
        recognitionRef.current = recognition;
    }, []);

    const processCommand = async (text) => {
        try {
            addLog('system', 'Sending to Nexus...');
            const response = await fetch('/api/nexus/chat', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history: [], projectId: 'mobile' })
            });
            const data = await response.json();
            const resText = data.response || 'Comando recibido.';
            addLog('system', `NEXUS: ${resText}`);
            speak(resText.replace(/\[.*?\]/g, '').trim());
        } catch (error) {
            addLog('error', `FAIL: ${error.message}`);
            speak("Fallo de enlace");
        }
    };

    const speak = (t) => {
        if (!synthRef.current) return;
        synthRef.current.cancel();
        const u = new SpeechSynthesisUtterance(t);
        u.lang = 'es-ES';
        synthRef.current.speak(u);
    };

    const toggleListening = () => recognitionRef.current && (isListening ? recognitionRef.current.stop() : recognitionRef.current.start());

    return (
        <div className="relative w-full h-[100dvh] flex flex-col bg-zinc-950 text-green-500 font-mono overflow-hidden">
            <Header onLogout={onLogout} />
            <DashboardCards />
            <ConsoleDisplay logs={logs} />
            <VoiceInterface 
                isListening={isListening} 
                toggleListening={toggleListening} 
                onSpeakTest={() => speak("Sistema activo nivel cinco.")} 
                onClearLogs={() => setLogs([])} 
            />
        </div>
    );
}

function Header({ onLogout }) {
    return (
        <div className="flex justify-between items-center px-6 py-4 border-b border-green-900/30 bg-black/40 shrink-0">
            <div className="flex items-center gap-3">
                <Zap size={18} className="text-green-500 animate-pulse" />
                <h2 className="text-lg font-black tracking-[0.2em] text-green-400">NEXUS LINK</h2>
            </div>
            <button onClick={onLogout} className="p-2 border border-red-900/30 rounded-lg text-red-700 hover:bg-red-900/10"><Power size={16} /></button>
        </div>
    );
}
