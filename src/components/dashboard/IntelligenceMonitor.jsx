// Archivo: src/components/dashboard/IntelligenceMonitor.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, CheckCircle } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { IntelligenceTabs } from './intelligence/IntelligenceTabs';
import { TranscriptionFeed } from './intelligence/TranscriptionFeed';
import { StrategicResponse } from './intelligence/StrategicResponse';

/**
 * INTELLIGENCE MONITOR (Saneado v2026)
 * Orquestador de la capa neural del proyecto con fallbacks resilientes.
 */
export default function IntelligenceMonitor({ projectId }) {
    const [transcription, setTranscription] = useState('');
    const [brief, setBrief] = useState('');
    const [activeTab, setActiveTab] = useState('insights'); 
    const [createdMissions, setCreatedMissions] = useState({});

    useEffect(() => {
        if (!projectId) return;
        const q = query(collection(db, "tasks"), where("projectId", "==", projectId));
        return onSnapshot(q, (snap) => {
            const missionsMap = {};
            snap.forEach(doc => {
                const data = doc.data();
                if (data.title?.startsWith('[STRATEGY] ')) {
                    missionsMap[data.title.replace('[STRATEGY] ', '')] = data.status;
                }
            });
            setCreatedMissions(missionsMap);
        });
    }, [projectId]);

    useEffect(() => {
        const fetchNeuralData = async () => {
            const endpoints = [
                { key: 'trans', path: `nexus_archives/tucu_red/clients/${projectId}/raw_inputs/transcription_groq.md` },
                { key: 'brief', path: `nexus_archives/tucu_red/clients/${projectId}/assets/brief.md` }
            ];
            for (const ep of endpoints) {
                try {
                    const res = await fetch(`/api/files/read?path=${encodeURIComponent(ep.path)}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data?.content) {
                            ep.key === 'trans' ? setTranscription(data.content) : setBrief(data.content);
                        } else {
                            ep.key === 'trans' 
                                ? setTranscription('## 🎧 Archivo: Transcripción\n> Sin grabaciones o transcripciones procesadas.') 
                                : setBrief('## 📋 Requerimientos Estratégicos\n- Sin notas de briefing registradas para este proyecto');
                        }
                    } else {
                        ep.key === 'trans' 
                            ? setTranscription('## 🎧 Archivo: Transcripción\n> Sin notas de audio registradas para este proyecto.') 
                            : setBrief('## 📋 Requerimientos Estratégicos\n- Sin notas de briefing registradas para este proyecto');
                    }
                } catch (e) {
                    ep.key === 'trans' 
                        ? setTranscription('## 🎧 Archivo: Transcripción\n> Sin notas de audio registradas.') 
                        : setBrief('## 📋 Requerimientos\n- Sin notas de briefing registradas');
                }
            }
        };
        if (projectId) fetchNeuralData();
    }, [projectId]);

    const parseInsights = (md) => md?.split('## 🎧').filter(i => i.trim()).map(block => ({
        title: block.split('\n')[0].replace('Archivo:', '').trim(),
        content: block.split('\n').slice(1).join(' ').replace(/>/g, '').trim().substring(0, 150) + '...'
    })) || [];

    const parseNeeds = (md) => md?.split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace('-', '').trim()) || [];

    const insights = parseInsights(transcription);
    const needs = parseNeeds(brief);

    return (
        <div className="h-full flex flex-col bg-[#0A0A0A]/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#0F0F12]">
                <HeaderBrand />
                <IntelligenceTabs activeTab={activeTab} setActiveTab={setActiveTab} counts={{ insights: insights.length, needs: needs.length }} />
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar relative">
                {activeTab === 'insights' && <TranscriptionFeed insights={insights} />}
                {activeTab === 'needs' && <NeedsList needs={needs} />}
                {activeTab === 'strategy' && <StrategicResponse projectId={projectId} createdMissions={createdMissions} />}
            </div>
        </div>
    );
}

function HeaderBrand() {
    return (
        <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg"><Cpu className="w-4 h-4 text-purple-400" /></div>
            <div>
                <h3 className="text-xs font-bold text-white tracking-[0.2em] uppercase">Cortex Monitor</h3>
                <p className="text-[9px] text-gray-500 font-mono tracking-tighter uppercase">Neural Processor v4.0</p>
            </div>
        </div>
    );
}

function NeedsList({ needs }) {
    return (
        <div className="space-y-2">
            {needs.map((need, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs text-gray-300 tracking-tight font-medium">{need}</span>
                </motion.div>
            ))}
        </div>
    );
}
