import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface StepWelcomeProps {
    onNext: () => void;
    clientName: string;
}

export const StepWelcome = ({ onNext, clientName }: StepWelcomeProps) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-10">
            {/* Logo Tucu Red - Visible y Prominente */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
            >
                <div className="w-20 h-20 bg-amber-500 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/20 mx-auto transform rotate-3">
                    <span className="text-white font-bold text-3xl tracking-tighter">TR</span>
                </div>
                <h2 className="mt-4 text-amber-600 font-bold tracking-widest text-xs uppercase">Agencia Tucu Red</h2>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4 max-w-2xl"
            >
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                    Hola <span className="text-amber-600">{clientName || 'Visitante'}</span>,
                </h1>
                <p className="text-xl text-gray-600 font-medium leading-relaxed">
                    Vimos tu negocio y nos encantó. <br />
                    <span className="text-gray-900">Preparamos una propuesta digital a medida para vos.</span>
                </p>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="pt-4 w-full max-w-md"
            >
                <button
                    onClick={onNext}
                    className="group relative w-full bg-black hover:bg-zinc-800 text-white font-bold py-5 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-xl flex items-center justify-center gap-3"
                >
                    <span className="text-lg">Ver Propuesta</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="mt-4 text-xs text-gray-400 uppercase tracking-widest">
                    Sin compromiso de compra
                </p>
            </motion.div>
        </div>
    );
};
