// Archivo: frontend/src/components/tabs/AgentDetailView.jsx
import React from 'react';
import { ChevronLeft, Zap, Volume2, TrendingUp, Activity, Terminal } from 'lucide-react';
import StatBar from './StatBar';
import { voiceService } from '../../services/VoiceService';

const AgentDetailView = ({ agent, activities, onBack }) => {
    const [testText, setTestText] = React.useState('');
    const isReal = ['antigravity', 'nexus', 'atenea', 'codi', 'lorem', 'tucu_red'].includes(agent.id);

    const stats = React.useMemo(() => {
        const agentLogs = activities.filter(a => a.agent === agent.id || a.agent === agent.name);
        const totalLogs = agentLogs.length;
        const errorLogs = agentLogs.filter(a => a.type === 'error' || (a.description && a.description.includes('Error'))).length;
        const parseTime = (ts) => ts instanceof Date ? ts : new Date(ts?.seconds ? ts.seconds * 1000 : ts);
        const baseMemory = agentLogs.reduce((acc, log) => acc + (log.description?.length || 0), 0) % 90;
        const promptCharsProcessed = agentLogs.reduce((acc, log) => acc + (log.metadata?.promptLength || 0), 0);

        return {
            efficiency: totalLogs > 0 ? Math.round(((totalLogs - errorLogs) / totalLogs) * 100) : 100,
            load: Math.min(agentLogs.filter(a => (new Date() - parseTime(a.timestamp)) < 3600000).length * 15, 100),
            memory: Math.min(10 + baseMemory + (totalLogs * 2), 99),
            missions: totalLogs,
            velocity: promptCharsProcessed > 0 ? Math.floor(promptCharsProcessed / 100) : totalLogs * 12,
            uptime: errorLogs > 0 ? Math.max(85, 99.9 - (errorLogs * 0.5)) : 99.9,
            creativity: ['atenea', 'lorem'].includes(agent.id) ? 95 : 85 + (totalLogs % 10),
            autonomy: 85 + Math.min(totalLogs, 10),
            alignment: Math.max(0, 100 - (errorLogs * 2))
        };
    }, [activities, agent]);

    const handleSpeak = (text, agentId) => {
        const voiceMap = { antigravity: 'en-Carter_man', nexus: 'en-Carter_man', atenea: 'en-Emma_woman', orion: 'en-Mike_man', codi: 'en-Davis_man', lorem: 'en-Grace_woman', licitia: 'sp-Spk0_woman' };
        voiceService.speak(text, { voice: voiceMap[agentId] || 'en-Carter_man' });
    };

    return (
        <div className="h-full overflow-y-auto custom-scrollbar flex flex-col gap-4 p-4">
            <button onClick={onBack} className="self-start flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all text-sm">
                <ChevronLeft className="w-4 h-4" /> Volver al equipo
            </button>

            <div className="flex-1 flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-1/3 flex flex-col gap-4">
                    <div className="bg-[#0A0A1A]/50 border border-white/10 rounded-2xl p-6 flex flex-col items-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-linear-to-br from-transparent to-black/50 pointer-events-none"></div>
                        <div className="w-32 h-32 rounded-full border-4 border-white/10 p-1 relative z-10 shadow-2xl">
                            <img src={`/avatars/team_${agent.id}.png`} alt={agent.name} className="w-full h-full object-cover rounded-full" />
                            <div className="absolute bottom-1 right-3 w-5 h-5 rounded-full border-2 border-[#0A0A1A]" style={{ backgroundColor: agent.color }}></div>
                        </div>
                        <h2 className="text-2xl font-bold mt-4 text-white tracking-tight">{agent.name}</h2>
                        <div className={`mt-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border uppercase flex items-center gap-2 ${isReal ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30 border-dashed'}`}>
                            {isReal ? <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> REAL OPERATIVE</> : <><span className="w-1.5 h-1.5 rounded-full border border-fuchsia-500"></span> MOCKUP CONCEPT</>}
                        </div>
                        <div className="text-nexus-cyan font-mono text-xs uppercase tracking-[0.2em] mb-2 mt-4">{agent.role}</div>
                        <p className="text-gray-400 text-center text-sm px-4">{agent.desc}</p>
                    </div>
                    <div className="bg-[#0A0A1A]/50 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Performance Metrics</h3>
                        <div className="space-y-4">
                            <StatBar label="Efficiency" value={stats.efficiency} color={agent.color} />
                            <StatBar label="Task Load" value={stats.load} color={agent.color} />
                            <StatBar label="Memory Usage" value={stats.memory} color={agent.color} />
                        </div>
                    </div>
                    <div className="bg-[#0A0A1A]/50 border border-indigo-500/20 rounded-2xl p-6">
                        <div className="flex gap-2">
                            <input type="text" value={testText} onChange={(e) => setTestText(e.target.value)} placeholder="Test voice..." className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500/50" />
                            <button onClick={() => handleSpeak(testText, agent.id)} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg p-2 transition-all"><Zap size={16} /></button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-6">
                    <div className="bg-[#0A0A1A]/50 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-emerald-400" /> Performance Hub</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <h4 className="text-[10px] text-gray-400 font-mono uppercase mb-3 border-b border-white/5 pb-1">Hard Metrics</h4>
                                <StatBar label="Missions" value={stats.missions} color={agent.color} suffix="" />
                                <StatBar label="Velocity" value={stats.velocity} color={agent.color} suffix=" LOC/h" />
                                <StatBar label="Uptime" value={stats.uptime} color={agent.color} suffix="%" />
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-[10px] text-gray-400 font-mono uppercase mb-3 border-b border-white/5 pb-1">Soft Skills</h4>
                                <StatBar label="Creativity" value={stats.creativity} color="#a78bfa" />
                                <StatBar label="Autonomy" value={stats.autonomy} color="#f472b6" />
                                <StatBar label="Alignment" value={stats.alignment} color="#34d399" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0A0A1A]/50 border border-white/10 rounded-2xl p-6 flex-1 overflow-hidden flex flex-col">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-3"><Activity size={16} className="text-indigo-400" /> Activity Log</h3>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                            {activities.filter(a => a.agent === agent.id || a.agent === agent.name).map((log, i) => (
                                <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/5 flex gap-3 items-start">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500"></div>
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex justify-between items-start gap-2">
                                            <span className="text-xs text-gray-300 font-mono leading-relaxed">{log.description || log.message}</span>
                                            <button onClick={() => handleSpeak(log.description || log.message, agent.id)} className="p-1 hover:bg-white/10 rounded transition-colors text-indigo-400"><Volume2 size={12} /></button>
                                        </div>
                                        <span className="text-[10px] text-gray-500 mt-1">{log.timestamp instanceof Date ? log.timestamp.toLocaleTimeString() : 'Recent'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentDetailView;
