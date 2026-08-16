import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Terminal, Loader2, Zap, Hexagon } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function NexusTerminal({ isOpen, onClose }) {
    const [messages, setMessages] = useState([
        { role: 'model', content: 'Sistema Neural Activo. ¿Cuál es tu visión, Operador?\n\n— NEXUS' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            // Filter history: Gemini requires first message to be from 'user'
            // The initial welcome message from 'model' should be skipped.
            // We also need to ensure the history sent to the API starts with a 'user' message.
            const apiHistory = messages.slice(1); // Skip the initial welcome message from the state

            const response = await fetch(`${API_URL}/api/nexus/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    history: apiHistory
                })
            });

            const data = await response.json();

            if (data.error) {
                setMessages(prev => [...prev, { role: 'model', content: `[ERROR] ${data.error}\n\n— NEXUS` }]);
            } else {
                setMessages(prev => [...prev, { role: 'model', content: data.response }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', content: `[ERROR] Conexión neural perdida. Verifica el backend.\n\n— NEXUS` }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="w-full max-w-3xl h-[80vh] bg-[#0A0F1A] border border-cyan-900/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col font-mono"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
            >
                {/* Header */}
                <div className="p-4 border-b border-cyan-900/30 flex items-center justify-between bg-black/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
                            <Hexagon className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-cyan-400 tracking-widest">NEXUS TERMINAL</h2>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Arquitecto Estratégico</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-900/50">
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] p-4 rounded-xl text-sm whitespace-pre-wrap
                                ${msg.role === 'user'
                                    ? 'bg-white/10 text-white'
                                    : 'bg-cyan-950/30 border border-cyan-900/30 text-cyan-100'
                                }`}
                            >
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}

                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                        >
                            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-900/30 flex items-center gap-2 text-cyan-400">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-xs">Procesando...</span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-cyan-900/30 bg-black/50">
                    <div className="flex items-center gap-3">
                        <Terminal className="w-5 h-5 text-cyan-600" />
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Describe tu visión..."
                            disabled={loading}
                            className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-gray-600 disabled:opacity-50"
                            autoFocus
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            className="p-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
                        >
                            <Send className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>,
        document.body
    );
}
