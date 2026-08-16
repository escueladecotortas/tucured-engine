import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DocumentModal({ document, onClose }) {
    const [content, setContent] = useState('Cargando...');
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        if (document) {
            setLoading(true);
            setLoading(true);
            // Construct the API URL with query parameter
            const apiUrl = `${import.meta.env.VITE_API_URL || ''}/api/artifact?path=${encodeURIComponent(document.path || document.filename)}`;

            fetch(apiUrl)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                    }
                    return res.json();
                })
                .then(data => {
                    if (data.content) {
                        setContent(data.content);
                    } else if (data.error) {
                        setContent(`❌ Error del servidor: ${data.error}`);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error loading document:', err);
                    setContent(`❌ Error cargando documento:\n\n${err.message}\n\nArchivo solicitado: ${document.path || document.filename}`);
                    setLoading(false);
                });
        }
    }, [document]);

    if (!document) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-gray-900 border border-white/20 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="text-2xl">{document.icon}</span>
                                {document.name}
                            </h2>
                            <p className="text-sm text-gray-400 mt-1">{document.category}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                        {loading ? (
                            <div className="text-center text-gray-400 py-8">
                                Cargando documento...
                            </div>
                        ) : (
                            <div className="prose prose-invert prose-sm max-w-none">
                                <ReactMarkdown>{content}</ReactMarkdown>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
