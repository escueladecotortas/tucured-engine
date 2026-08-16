import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, FileText, Check } from 'lucide-react';
import { useToast } from './Toast';

export default function SmartNotepad({ clientId, context = 'general' }) {
    const { addToast } = useToast();
    const [notes, setNotes] = useState('');
    const [saved, setSaved] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const savedNotes = localStorage.getItem(`nexus_notepad_${clientId}`);
        if (savedNotes) setNotes(savedNotes);
    }, [clientId]);

    const handleSave = () => {
        localStorage.setItem(`nexus_notepad_${clientId}`, notes);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        addToast("Notes saved to local memory", "success");
    };

    const convertToMission = async () => {
        if (!notes.trim()) return;

        addToast("Analizando notas con Nexus AI...", "info");

        try {
            const response = await fetch('/api/nexus/convert-notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    notes,
                    projectId: clientId,
                    context: context || 'general'
                })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Error en conversión");

            addToast(`Misión Creada: ${data.mission.title}`, "success");
            setNotes(''); // Clear notes on success
            localStorage.setItem(`nexus_notepad_${clientId}`, ''); // Clear local storage
            setSaved(true); // Technically saved/processed
            setTimeout(() => setSaved(false), 2000);

        } catch (error) {
            console.error("Conversion failed", error);
            addToast(`Error: ${error.message}`, "error");
        }
    };

    return (
        <div className="h-full flex flex-col relative overflow-hidden group glass-panel rounded-2xl">

            <div className="flex-1 relative z-10 p-1">
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Escribe una directiva para iniciar una misión..."
                    className="w-full h-full bg-white/5 border border-white/5 rounded-xl p-4 text-sm text-gray-200 focus:outline-none focus:border-nexus-orange/50 focus:bg-white/10 resize-none font-sans leading-relaxed placeholder-gray-600 transition-all custom-scrollbar hover:bg-white/10"
                />
            </div>

            <div className="mt-3 flex gap-2 relative z-10 px-1">
                <button
                    onClick={() => setNotes('')}
                    className="p-3 text-gray-500 hover:text-nexus-error hover:bg-nexus-error/10 rounded-xl transition-colors border border-transparent hover:border-nexus-error/20"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
                <button
                    onClick={convertToMission}
                    disabled={!notes.trim()}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg
                        ${notes.trim()
                            ? 'bg-gradient-to-r from-nexus-orange to-orange-600 text-white shadow-nexus-orange/30 hover:shadow-nexus-orange/50 hover:scale-[1.02] border border-orange-400/50'
                            : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'}
                    `}
                >
                    {saved ? (
                        <>
                            <Check className="w-4 h-4" /> ENVIADO
                        </>
                    ) : (
                        <>
                            <Plus className="w-4 h-4" /> ENVIAR MISIÓN
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
