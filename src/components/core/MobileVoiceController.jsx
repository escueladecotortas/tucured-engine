import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Radio } from 'lucide-react';
import { voiceService } from '../../services/VoiceService';

/**
 * MobileVoiceController - Controlador optimizado para móviles (PWA)
 * Permite dictado (ASR) y locución (TTS) en un layout de baja fricción.
 */
export default function MobileVoiceController({ agentId = 'atenea', agentName = 'Atenea', onMessageSent }) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        // Inicializar Web Speech API (ASR)
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const rec = new SpeechRecognition();
            rec.continuous = false;
            rec.interimResults = true;
            rec.lang = 'es-ES';

            rec.onresult = (event) => {
                const text = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');
                setTranscript(text);
            };

            rec.onend = () => {
                setIsListening(false);
            };

            setRecognition(rec);
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognition.stop();
            if (transcript && onMessageSent) {
                onMessageSent(transcript);
                setTranscript('');
            }
        } else {
            setTranscript('');
            recognition.start();
            setIsListening(true);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black via-black/90 to-transparent z-100 md:hidden">
            <div className="bg-[#0A0A1A]/80 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-indigo-500/50 p-1">
                            <img src={`/avatars/team_${agentId}.png`} alt={agentName} className="w-full h-full rounded-full object-cover" />
                        </div>
                        <div>
                            <div className="text-[10px] text-indigo-400 font-mono uppercase tracking-widest">Nexus Mobile Link</div>
                            <div className="text-sm font-bold text-white">{agentName} está escuchando...</div>
                        </div>
                    </div>
                    <Radio className={`w-4 h-4 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-600'}`} />
                </div>

                <div className="min-h-[60px] bg-white/5 rounded-xl p-4 border border-white/5 text-gray-300 text-sm italic">
                    {transcript || "Presiona el botón para hablar..."}
                </div>

                <button
                    onClick={toggleListening}
                    className={`w-full py-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95
                        ${isListening 
                            ? 'bg-red-500/20 border border-red-500/50 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' 
                            : 'bg-indigo-600 border border-indigo-400 text-white shadow-[0_0_30px_rgba(79,70,229,0.3)]'}
                    `}
                >
                    {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                    <span className="text-xl font-bold tracking-tight">
                        {isListening ? 'ENVIAR' : 'HABLAR'}
                    </span>
                </button>
            </div>
        </div>
    );
}
