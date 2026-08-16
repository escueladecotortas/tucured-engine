import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

const toastTypes = {
    error: {
        icon: AlertCircle,
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-400',
        iconBg: 'bg-red-500/20'
    },
    success: {
        icon: CheckCircle,
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        text: 'text-green-400',
        iconBg: 'bg-green-500/20'
    },
    warning: {
        icon: AlertTriangle,
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400',
        iconBg: 'bg-yellow-500/20'
    },
    info: {
        icon: Info,
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        iconBg: 'bg-blue-500/20'
    }
};

export function Toast({ message, type = 'info', onClose, action }) {
    const config = toastTypes[type];
    const Icon = config.icon;

    useEffect(() => {
        console.log("⏱️ Toast useEffect: Setting 7s timer"); // Debug
        const timer = setTimeout(() => {
            console.log("⏱️ Toast: Timer expired, calling onClose"); // Debug
            onClose();
        }, 7000);
        return () => {
            console.log("⏱️ Toast: Cleaning up timer"); // Debug
            clearTimeout(timer);
        };
    }, []); // Empty deps - only run once on mount

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`${config.bg} ${config.border} border backdrop-blur-xl rounded-lg p-4 shadow-2xl max-w-md w-full`}
        >
            <div className="flex items-start gap-3">
                <div className={`${config.iconBg} p-2 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${config.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`${config.text} text-sm font-medium`}>{message}</p>
                    {action && (
                        <button
                            onClick={action.onClick}
                            className={`${config.text} text-xs underline mt-2 hover:opacity-70 transition-opacity`}
                        >
                            {action.label}
                        </button>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}

export function ToastContainer({ toasts, removeToast }) {
    if (!toasts || toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map(toast => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            action={toast.action}
                            onClose={() => removeToast(toast.id)}
                        />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
}

// Hook for managing toasts
export function useToast() {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info', action = null) => {
        const id = Date.now();
        console.log("🟢 useToast: Adding toast", { id, message, type, action }); // Debug
        setToasts(prev => {
            const newToasts = [...prev, { id, message, type, action }];
            console.log("🟢 useToast: New toasts state:", newToasts); // Debug
            return newToasts;
        });
        return id;
    };

    const removeToast = (id) => {
        console.log("🔴 useToast: Removing toast", id); // Debug
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return { toasts, addToast, removeToast };
}
