import { motion } from 'framer-motion';
import { MessageCircle, Mail } from 'lucide-react';
import { PhoneInput } from './PhoneInput';

interface StepContactProps {
    onNext: () => void;
    onBack: () => void;
    whatsapp: string;
    setWhatsapp: (val: string) => void;
    email: string;
    setEmail: (val: string) => void;
}

export const StepContact = ({
    onNext,
    onBack,
    whatsapp,
    setWhatsapp,
    email,
    setEmail
}: StepContactProps) => {
    // Validar length basico de WA (area + num ~ 10 digitos) y Email
    const isValid = whatsapp.length > 10 && email.includes('@') && email.includes('.');

    return (
        <div className="flex flex-col items-center justify-start pt-4 max-w-2xl mx-auto w-full">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full space-y-8"
            >
                <div className="text-center space-y-3">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-green-500/10 rounded-full border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                            <MessageCircle className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Contacto Directo</h2>
                    <p className="text-white/50 text-sm max-w-xs mx-auto leading-relaxed">
                        ¿Dónde te enviamos las credenciales de acceso?
                    </p>
                </div>

                <div className="space-y-6 pt-2">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-green-500 font-bold ml-1">WhatsApp (Obligatorio)</label>
                        {/* Note: PhoneInput likely needs refactor too, but assuming it accepts styling classes or we wrap it */}
                        <div className="relative">
                            <PhoneInput 
                                value={whatsapp} 
                                onChange={setWhatsapp} 
                                className="w-full bg-green-500/3 border border-green-500/20 rounded-xl py-4 px-5 text-white placeholder-white/20 focus:outline-none focus:border-green-500/60 focus:bg-green-500/5 focus:shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all font-medium backdrop-blur-md"
                            />
                        </div>
                        <p className="text-[10px] text-white/30 ml-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>
                            Canal seguro encriptado
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold ml-1">Email (Obligatorio)</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#D4AF37] transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-14 pr-5 text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-white/10 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all font-medium backdrop-blur-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        onClick={onBack}
                        className="px-6 py-4 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all font-medium text-sm"
                    >
                        Volver
                    </button>
                    <button
                        onClick={onNext}
                        disabled={!isValid}
                        className={`flex-1 py-4 rounded-xl font-bold text-black uppercase tracking-widest text-xs transition-all transform shadow-lg ${isValid
                                ? 'bg-white hover:bg-gray-100 hover:scale-[1.02] shadow-white/10'
                                : 'bg-white/10 text-white/20 cursor-not-allowed border border-white/5'
                            }`}
                    >
                        Siguiente
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
