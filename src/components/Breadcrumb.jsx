import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Breadcrumb({ path = [] }) {
    if (path.length === 0) return null;

    return (
        <nav className="flex items-center gap-2 text-sm mb-6">
            <button
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-1 text-gray-400 hover:text-nexus-cyan transition-colors"
            >
                <Home className="w-4 h-4" />
                <span>Núcleo</span>
            </button>
            {path.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                    {item.onClick ? (
                        <button
                            onClick={item.onClick}
                            className="text-gray-400 hover:text-nexus-cyan transition-colors"
                        >
                            {item.label}
                        </button>
                    ) : (
                        <span className="text-gray-500">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
