import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Shield, ArrowRight } from 'lucide-react';

interface StepAgreementProps {
    onConfirm: (data: { plan: 'base' | 'full', acceptedTerms: boolean }) => void;
    onBack: () => void;
    clientName: string;
}

export const StepAgreement = ({ onConfirm, onBack, clientName }: StepAgreementProps) => {
    const [accepted, setAccepted] = useState(false);

    return (
        <div className="flex flex-col items-center justify-start pt-0 max-w-2xl mx-auto w-full pb-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full space-y-6"
            >
                <div className="text-center space-y-2 mb-6">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Tu Plan, {clientName}</h2>
                    <p className="text-white/50 text-xs text-balance">
                        Estás a un paso de tener tu Sede Digital activa.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4">

                    {/* PLAN ÚNICO: GOLD GLASS */}
                    <div
                        className="relative rounded-2xl p-6 transition-all border overflow-hidden bg-[#0a0a0a]/80 border-[#D4AF37]/30 shadow-[0_0_50px_-10px_rgba(212,175,55,0.15)] ring-1 ring-[#D4AF37]/20 backdrop-blur-xl"
                    >
                        <div className="absolute top-0 right-0 p-3">
                            <span className="bg-[#D4AF37] text-black text-[9px] font-bold px-2 py-1 rounded-full shadow-lg shimmer-effect">
                                PAGO ÚNICO
                            </span>
                        </div>

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-[#D4AF37] flex items-center gap-2">
                                    <Star className="w-4 h-4 fill-[#D4AF37]" />
                                    Activación Total
                                </h3>
                                <p className="text-[10px] text-white/50 uppercase tracking-wider">Propiedad Digital 100% Tuya</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="text-4xl font-bold text-white tracking-tighter">$75.000</div>
                            <div className="text-[9px] text-white/40 font-bold tracking-widest mt-1 uppercase">Precio Final</div>
                        </div>

                         <ul className="space-y-3 text-sm text-white/90 mb-4 border-t border-white/10 pt-4">
                            <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-[#D4AF37]" /> Diseño Premium Finalizado</li>
                            <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-[#D4AF37]" /> Hosting Incluido 24/7</li>
                            <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-[#D4AF37]" /> Sin mantenimiento mensual</li>
                            <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-[#D4AF37]" /> Soporte vía WhatsApp</li>
                        </ul>
                    </div>
                </div>

                {/* TERMS */}
                <div className="pt-6 border-t border-white/10 mt-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${accepted ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'border-white/30 group-hover:border-white'}`}>
                            {accepted && <Check size={12} strokeWidth={4} />}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={accepted}
                            onChange={(e) => setAccepted(e.target.checked)}
                        />
                        <span className="text-xs text-white/50 leading-relaxed select-none">
                            Acepto los <a href="/terminos" target="_blank" className="text-white hover:text-[#D4AF37] underline decoration-1 underline-offset-2">Términos del Servicio</a> y la política de privacidad.
                        </span>
                    </label>
                </div>

                <div className="flex justify-center pt-4">
                    <button
                        onClick={() => onConfirm({ plan: 'base', acceptedTerms: accepted })}
                        disabled={!accepted}
                        className={`w-full py-5 rounded-xl font-bold text-sm uppercase tracking-widest transition-all transform flex items-center justify-center gap-3 ${accepted
                                ? 'bg-white text-black hover:bg-gray-100 shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                                : 'bg-white/10 text-white/20 cursor-not-allowed border border-white/5'
                            }`}
                    >
                        Confirmar Alta
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
