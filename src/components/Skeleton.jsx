import { motion } from 'framer-motion';

export function SkeletonCard({ className = '' }) {
    return (
        <div className={`bg-white/5 rounded-lg overflow-hidden ${className}`}>
            <div className="animate-pulse space-y-4 p-6">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="space-y-2">
                    <div className="h-3 bg-white/10 rounded"></div>
                    <div className="h-3 bg-white/10 rounded w-5/6"></div>
                </div>
            </div>
        </div>
    );
}

export function SkeletonAgentCard() {
    return (
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="animate-pulse space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-white/10 rounded w-1/2"></div>
                        <div className="h-3 bg-white/10 rounded w-3/4"></div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="h-2 bg-white/10 rounded"></div>
                    <div className="h-2 bg-white/10 rounded w-4/5"></div>
                </div>
            </div>
        </div>
    );
}

export function SkeletonProjectCard() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-6 border border-white/10"
        >
            <div className="animate-pulse space-y-4">
                <div className="flex items-center justify-between">
                    <div className="h-6 bg-white/10 rounded w-1/3"></div>
                    <div className="h-4 bg-white/10 rounded-full w-16"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-3 bg-white/10 rounded w-full"></div>
                    <div className="h-3 bg-white/10 rounded w-5/6"></div>
                </div>
                <div className="flex gap-2">
                    <div className="h-8 w-8 bg-white/10 rounded-full"></div>
                    <div className="h-8 w-8 bg-white/10 rounded-full"></div>
                    <div className="h-8 w-8 bg-white/10 rounded-full"></div>
                </div>
            </div>
        </motion.div>
    );
}
