import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Folder } from 'lucide-react';
import FileManager from './FileManager';
import { useLanguage } from '../context/LanguageContext';

export default function FileManagerModal({ onClose }) {
    const { t } = useLanguage();

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#050B14] border border-white/10 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden"
            >
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Folder className="w-5 h-5 text-purple-400" />
                        {t('dashboard.files')}
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
                <div className="flex-1 overflow-hidden p-4">
                    <FileManager />
                </div>
            </motion.div>
        </div>
    );
}
