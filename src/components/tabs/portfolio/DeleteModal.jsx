// Archivo: frontend/src/components/tabs/portfolio/DeleteModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function DeleteModal({ client, onConfirm, onCancel }) {
    if (!client) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#0B0F19] border border-red-500/30 p-6 rounded-2xl shadow-2xl max-w-sm w-full relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-red-600 to-rose-600" />
                <h3 className="text-lg font-bold text-white mb-2">Confirmar Eliminación</h3>
                <p className="text-gray-400 text-sm mb-6">
                    ¿Estás seguro de eliminar el nodo <span className="text-white font-mono">{client.name}</span>?
                    <br />Esta acción purgará los datos de Firestore y es irreversible.
                </p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 text-sm font-medium transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm font-bold shadow-lg shadow-red-500/20 transition-all"
                    >
                        Eliminar Definitivamente
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
