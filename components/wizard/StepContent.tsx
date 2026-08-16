import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, SkipForward, Instagram, CheckCircle } from 'lucide-react';
import CatalogIngest from '../../components/CatalogIngest';

interface StepContentProps {
    onNext: () => void;
    onBack: () => void;
    onCatalogProcessed: (items: any[]) => void;
}

export const StepContent = ({ onNext, onBack, onCatalogProcessed }: StepContentProps) => {
    const [mode, setMode] = useState<'select' | 'upload' | 'manual'>('select');

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] max-w-3xl mx-auto w-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
            >
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">Material Inicial</h2>
                    <p className="text-gray-500">
                        ¿Tenés fotos de tus productos o un menú? <br />
                        Esto nos ayuda a armar tu catálogo más rápido.
                    </p>
                </div>

                {mode === 'select' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                        <button
                            onClick={() => setMode('upload')}
                            className="group flex flex-col items-center p-8 bg-amber-50/50 border border-amber-100 rounded-2xl hover:bg-amber-50 hover:border-amber-300 transition-all text-center space-y-4"
                        >
                            <div className="p-4 rounded-full bg-white text-amber-500 shadow-sm group-hover:scale-110 transition-transform">
                                <Upload className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-gray-900 font-bold text-lg">Subir Menú / Lista</h3>
                                <p className="text-sm text-gray-500 mt-1">Foto o PDF de tus precios.</p>
                            </div>
                        </button>

                        <button
                            onClick={onNext}
                            className="group flex flex-col items-center p-8 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-white hover:shadow-md transition-all text-center space-y-4"
                        >
                            <div className="p-4 rounded-full bg-white text-gray-400 shadow-sm group-hover:text-amber-500 transition-colors">
                                <SkipForward className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-gray-900 font-bold text-lg">Lo envío después</h3>
                                <p className="text-sm text-gray-500 mt-1">Coordinar con Concierge por WhatsApp.</p>
                            </div>
                        </button>
                    </div>
                )}

                {mode === 'upload' && (
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                        <CatalogIngest onItemsExtracted={(items) => {
                            onCatalogProcessed(items);
                            setTimeout(onNext, 1500);
                        }} />

                        <div className="text-center pb-4 mt-4">
                            <button
                                onClick={() => setMode('select')}
                                className="text-xs text-gray-500 hover:text-gray-800 transition-colors underline"
                            >
                                Cancelar y volver atrás
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex gap-4 pt-4 justify-center">
                    {mode === 'select' && (
                        <button
                            onClick={onBack}
                            className="px-6 py-3 rounded-xl text-gray-400 hover:text-gray-600 transition-all font-medium text-sm"
                        >
                            Volver
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
