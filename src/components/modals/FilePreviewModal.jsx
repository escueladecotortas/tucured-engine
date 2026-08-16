// Archivo: frontend/src/components/modals/FilePreviewModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText } from 'lucide-react';

export function FilePreviewModal({ isOpen, file, content, onClose }) {
  if (!file) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-[#1e1e1e] w-full max-w-4xl h-[80vh] rounded-xl border border-white/10 flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#252526]">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span className="font-mono text-sm text-white">{file.path}</span>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-0">
              {content === 'LOADING...' ? (
                <div className="flex items-center justify-center h-full text-indigo-400 font-mono animate-pulse">ACCESSING NEURAL STORAGE...</div>
              ) : (
                <pre className="p-4 font-mono text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{content}</pre>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
