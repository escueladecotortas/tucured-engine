// Archivo: frontend/src/components/mobile/VoiceInterface.jsx
import React from 'react';
import { Mic, Volume2, Terminal } from 'lucide-react';

export function VoiceInterface({ isListening, toggleListening, onSpeakTest, onClearLogs }) {
    return (
        <div className="w-full flex flex-col items-center justify-center pt-4 pb-8 shrink-0 bg-zinc-950 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-8 mb-4">
                <IconButton icon={<Volume2 size={24} />} onClick={onSpeakTest} />
                
                <button
                    onClick={toggleListening}
                    className={`w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all duration-300 shadow-2xl active:scale-90 ${
                        isListening 
                        ? 'bg-red-500/20 border-red-500 text-red-500 scale-110 shadow-red-500/50' 
                        : 'bg-green-500/10 border-green-500 text-green-500 hover:bg-green-500/20 shadow-green-500/30'
                    }`}
                >
                    <Mic size={40} className={isListening ? 'animate-pulse' : ''} />
                </button>
                
                <IconButton icon={<Terminal size={24} />} onClick={onClearLogs} />
            </div>
            
            <div className="text-center text-[9px] text-zinc-700 font-mono tracking-[0.3em] uppercase">
                Nexus OS Phoenix • Mobile Uplink
            </div>
        </div>
    );
}

function IconButton({ icon, onClick }) {
    return (
        <button onClick={onClick} className="p-4 rounded-full bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-white active:scale-95 transition-all">
            {icon}
        </button>
    );
}
