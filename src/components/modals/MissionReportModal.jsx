// Archivo: frontend/src/components/modals/MissionReportModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, FolderOpen, Layout } from 'lucide-react';

export function MissionReportModal({ isOpen, mission, terminalLogs, logsEndRef, onClose, onPreviewFile }) {
  if (!mission) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex-1 bg-black/50 p-4 font-mono text-xs overflow-y-auto custom-scrollbar">
              {terminalLogs.length === 0 ? (
                <div className="text-gray-600 italic">Awaiting neural link...</div>
              ) : (
                terminalLogs.map((log, i) => (
                  <div key={log.id || i} className={`${log.type === 'stderr' || log.type === 'error' ? 'text-red-400' : log.type === 'command' ? 'text-yellow-400 font-bold' : 'text-gray-300'} whitespace-pre-wrap`}>
                    <span className="opacity-30 mr-2">[{new Date().toLocaleTimeString()}]</span>
                    {log.text}
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>

            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20"><CheckCircle className="w-5 h-5 text-emerald-400" /></div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{mission.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <span className="uppercase tracking-wider">Mission Report</span>
                    <span>•</span>
                    <span>{mission.completedAt ? new Date(mission.completedAt.seconds * 1000).toLocaleString() : 'Recently'}</span>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><X className="w-5 h-5 text-white/40" /></button>
            </div>

            <div className="p-6 overflow-y-auto font-mono text-sm leading-relaxed text-gray-300 bg-black/50">
              <pre className="whitespace-pre-wrap font-sans">{mission.result || "No detailed result data available."}</pre>
              {mission.artifacts?.length > 0 && (
                <div className="mt-6 pt-4 border-t border-white/10">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-2"><FolderOpen className="w-4 h-4" /> GENERATED ARTIFACTS</h4>
                  <div className="space-y-2">
                    {mission.artifacts.map((art, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/20 transition-colors group cursor-pointer" onClick={() => onPreviewFile(art)}>
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-indigo-500/20 rounded"><Layout className="w-4 h-4 text-indigo-300" /></div>
                          <span className="text-sm font-medium text-indigo-100">{art.path}</span>
                        </div>
                        <span className="text-[10px] text-indigo-400 uppercase bg-black/30 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">{art.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end">
              <button onClick={onClose} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium">Cerrar Reporte</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
