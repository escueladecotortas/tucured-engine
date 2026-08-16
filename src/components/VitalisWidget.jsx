import React, { useState } from 'react';
import { Activity, CheckCircle, AlertTriangle, XCircle, Brain, Shield, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';



export default function VitalisWidget() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const runScan = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/vitalis/scan`);
      const data = await res.json();
      
      if (data.success) {
        setReport(data.data);
      } else {
        setError(data.error || 'Fallo desconocido en VITALIS');
      }
    } catch (err) {
      setError('Error de conexión con el Doctor VITALIS');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'HEALTHY' || status === 'OPTIMAL') return 'text-green-400';
    if (status === 'WARNING') return 'text-yellow-400';
    return 'text-red-500';
  };

  const getStatusIcon = (status) => {
    if (status === 'HEALTHY' || status === 'OPTIMAL') return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (status === 'WARNING') return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-2xl mx-auto shadow-2xl overflow-hidden relative">
      {/* Background Pulse Animation */}
      {loading && (
        <motion.div 
          className="absolute inset-0 bg-red-500/5 pointer-events-none"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-red-500/10 border border-red-500/20">
            <Activity className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-widest uppercase">VITALIS <span className="text-xs text-zinc-500 ml-2">SYSTEM DOCTOR v1.0</span></h2>
            <p className="text-xs text-zinc-400">Monitor de Signos Vitales & Auditoría Cognitiva</p>
          </div>
        </div>
        
        <button 
          onClick={runScan}
          disabled={loading}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2
            ${loading ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20'}
          `}
        >
          {loading ? (
            <>
              <Activity className="w-4 h-4 animate-spin" /> Escaneando...
            </>
          ) : (
            <>
              <Activity className="w-4 h-4" /> Ejecutar /heal
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm flex items-center gap-3"
          >
            <AlertTriangle className="w-5 h-5" /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Content */}
      <AnimatePresence>
        {report && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 relative z-10"
          >
            {/* Overall Status */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-zinc-400 text-sm uppercase tracking-wider">Estado General</span>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-black tracking-tighter ${getStatusColor(report.overallStatus)}`}>
                  {report.overallStatus}
                </span>
                {getStatusIcon(report.overallStatus)}
              </div>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.diagnosis.map((module, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                      {module.module === 'COGNITIVE_AUDIT' ? <Brain className="w-4 h-4 text-purple-400" /> : 
                       module.module === 'LOGIC_INTEGRITY' ? <Shield className="w-4 h-4 text-blue-400" /> :
                       <Heart className="w-4 h-4 text-zinc-400" />}
                      {module.module.replace('_', ' ')}
                    </h3>
                    {getStatusIcon(module.status)}
                  </div>
                  
                  {module.issues.length > 0 ? (
                    <ul className="space-y-2">
                      {module.issues.map((issue, i) => (
                        <li key={i} className="text-xs text-zinc-400 flex items-start gap-2 bg-red-500/5 p-2 rounded">
                          <span className="text-red-400 font-bold">•</span>
                          {issue.message}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-zinc-600 italic">Sin hallazgos patológicos.</p>
                  )}
                </div>
              ))}
            </div>

            {/* Action Plan */}
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <h3 className="text-sm font-bold text-emerald-400 mb-2 uppercase tracking-wide">Receta Médica</h3>
              {report.overallStatus === 'HEALTHY' || report.overallStatus === 'OPTIMAL' ? (
                <p className="text-sm text-zinc-400">El paciente se encuentra en excelente estado. Se recomienda mantener hidratación (actualizar dependencias) y descanso.</p>
              ) : (
                <ul className="text-sm text-zinc-400 list-disc list-inside">
                   <li>Revisar los módulos marcados en <span className="text-yellow-400">amarillo</span> o <span className="text-red-400">rojo</span>.</li>
                   <li>Ejecutar correcciones en los agentes afectados.</li>
                </ul>
              )}
            </div>
            
            <div className="text-center">

            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
