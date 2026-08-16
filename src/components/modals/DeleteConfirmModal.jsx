// Archivo: frontend/src/components/modals/DeleteConfirmModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export function DeleteConfirmModal({ isOpen, onClose, onConfirm }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70] flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-[#1e1e1e] border border-rose-500/30 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-rose-500" /></div>
              <h3 className="text-lg font-bold text-white mb-2">¿Eliminar Misión?</h3>
              <p className="text-sm text-gray-400 mb-6">Esta acción no se puede deshacer. Los datos serán eliminados permanentemente.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={onClose} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium">Cancelar</button>
                <button onClick={onConfirm} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors text-sm font-bold shadow-lg shadow-rose-500/20">Sí, Eliminar</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
