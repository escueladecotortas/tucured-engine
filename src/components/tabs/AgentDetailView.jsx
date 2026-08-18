// Archivo: src/components/tabs/AgentDetailView.jsx
import React from 'react';
import { ChevronLeft, Zap, Volume2, TrendingUp, Activity } from 'lucide-react';
import StatBar from './StatBar';
import { voiceService } from '../../services/VoiceService';

const AgentDetailView = ({ agent, activities, onBack }) => {
    const [testText, setTestText] = React.useState('');
    const isReal = ['antigravity', 'nexus', 'atenea', 'codi', 'lorem', 'tucu_red', 'icaro', 'elara', 'kael', 'argus'].includes(agent.id);
    const IconComponent = agent.icon || Zap;

    const stats = React.useMemo(() => {
        const agentLogs = (activities || []).filter(a => a.agent === agent.id || a.agent === agent.name);
        const totalLogs = agentLogs.length;
        const errorLogs = agentLogs.filter(a => a.type === 'error' || (a.description && a.description.includes('Error'))).length;
        const promptCharsProcessed = agentLogs.reduce((acc, log) => acc + (log.metadata?.promptLength || 0), 0);

        return {
            efficiency: totalLogs > 0 ? Math.round(((totalLogs - errorLogs) / totalLogs) * 100) : 100,
            load: Math.min(totalLogs * 15, 100),
            memory: Math.min(25 + (totalLogs * 2), 99),
            missions: totalLogs,
            velocity: promptCharsProcessed > 0 ? Math.floor(promptCharsProcessed / 100) : totalLogs * 12,
            uptime: errorLogs > 0 ? Math.max(85, 99.9 - (errorLogs * 0.5)) : 99.9,
            creativity: ['atenea', 'lorem'].includes(agent.id) ? 95 : 85,
            autonomy: 90,
            alignment: 100
        };
    }, [activities, agent]);

    const handleSpeak = (text, agentId) => {
        const voiceMap = { antigravity: 'en-Carter_man', nexus: 'en-Carter_man', atenea: 'en-Emma_woman', codi: 'en-Davis_man', lorem: 'en-Grace_woman' };
        voiceService.speak(text, { voice: voiceMap[agentId] || 'en-Carter_man' });
    };

    return (
        <div className="h-full overflow-y-auto custom-scrollbar flex flex-col gap-4 p-4">
            <button onClick={onBack} className="self-start flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all text-xs font-mono cursor-pointer">
                <ChevronLeft className="w-4 h-4" /> Volver al equipo
            </button>

            <div className="flex-1 flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-1/3 flex flex-col gap-4">
                    <div className="bg-[#0A0A1A]/50 border border-white/10 rounded-2xl p-6 flex flex-col items-center relative overflow-hidden group">
                        <div 
                            className="w-28 h-28 rounded-3xl border-2 p-2 relative z-10 shadow-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105"
                            style={{ backgroundColor: `${agent.color}15`, borderColor: `${agent.color}50` }}
                        >
                            <IconComponent className="w-14 h-14" style={{ color: agent.color }} />
                            <div className="absolute bottom-1 right-2 w-4 h-4 rounded-full border-2 border-[#0A0A1A]" style={{ backgroundColor: agent.color }}></div>
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight font-['Outfit']">{agent.name}</h2>
                        <div className={`mt-2 px-3 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-widest border uppercase flex items-center gap-1.5 ${isReal ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> OPERATIVO
                        </div>
                        <div className="text-nexus-cyan font-mono text-xs uppercase tracking-wider mb-2 mt-3">{agent.role}</div>
                        <p className="text-gray-400 text-center text-xs px-4">{agent.desc}</p>
                    </div>

                    <div className="bg-[#0A0A1A]/50 border border-white/10 rounded-2xl p-5">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 font-mono">Performance Metrics</h3>
                        <div className="space-y-3">
                            <StatBar label="Efficiency" value={stats.efficiency} color={agent.color} />
                            <StatBar label="Task Load" value={stats.load} color={agent.color} />
                            <StatBar label="Memory Usage" value={stats.memory} color={agent.color} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-6">
                    <div className="bg-[#0A0A1A]/50 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 font-mono"><TrendingUp size={16} className="text-emerald-400" /> Rendimiento de Agente</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <h4 className="text-[10px] text-gray-400 font-mono uppercase mb-2 border-b border-white/5 pb-1">Métricas Duras</h4>
                                <StatBar label="Misiones" value={stats.missions} color={agent.color} suffix="" />
                                <StatBar label="Velocity" value={stats.velocity} color={agent.color} suffix=" LOC/h" />
                                <StatBar label="Uptime" value={stats.uptime} color={agent.color} suffix="%" />
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-[10px] text-gray-400 font-mono uppercase mb-2 border-b border-white/5 pb-1">Habilidades Especializadas</h4>
                                <StatBar label="Creativity" value={stats.creativity} color="#a78bfa" />
                                <StatBar label="Autonomy" value={stats.autonomy} color="#f472b6" />
                                <StatBar label="Alignment" value={stats.alignment} color="#34d399" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0A0A1A]/50 border border-white/10 rounded-2xl p-6 flex-1 overflow-hidden flex flex-col">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 font-mono"><Activity size={16} className="text-indigo-400" /> Registro de Actividad</h3>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                            {(activities || []).filter(a => a.agent === agent.id || a.agent === agent.name).length === 0 ? (
                                <div className="text-center py-8 text-gray-500 font-mono text-xs">Sin registros recientes para este agente.</div>
                            ) : (
                                (activities || []).filter(a => a.agent === agent.id || a.agent === agent.name).map((log, i) => (
                                    <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 flex gap-3 items-start">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                        <div className="flex-1 flex flex-col">
                                            <span className="text-xs text-gray-300 font-mono leading-relaxed">{log.description || log.message}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentDetailView;
