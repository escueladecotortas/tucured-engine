import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface StepIdentityProps {
    onNext: () => void;
    onBack: () => void;
    firstName: string;
    setFirstName: (val: string) => void;
    lastName: string;
    setLastName: (val: string) => void;
}

export const StepIdentity = ({
    onNext,
    onBack,
    firstName,
    setFirstName,
    lastName,
    setLastName
}: StepIdentityProps) => {
    const isValid = firstName.trim().length > 1 && lastName.trim().length > 1;

    return (
        <div className="flex flex-col items-center justify-start pt-4 max-w-2xl mx-auto w-full">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-8"
            >
                {/* Header Section */}
                <div className="text-center space-y-3">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/20 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                            <User className="w-8 h-8 text-[#D4AF37]" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Datos del Responsable</h2>
                    <p className="text-white/50 text-sm max-w-xs mx-auto leading-relaxed">
                        ¿A nombre de quién registramos la propiedad digital del proyecto?
                    </p>
                </div>

                {/* Form Section */}
                <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold ml-1">Nombre</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Ej. Juan"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 px-5 text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-white/[0.08] focus:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all font-medium backdrop-blur-md"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold ml-1">Apellido</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Ej. Pérez"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 px-5 text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-white/[0.08] focus:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all font-medium backdrop-blur-md"
                        />
                    </div>
                </div>

                {/* Actions */}
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
                                ? 'bg-[#D4AF37] hover:bg-[#c5a028] hover:scale-[1.02] shadow-[#D4AF37]/20'
                                : 'bg-white/10 text-white/20 cursor-not-allowed border border-white/5'
                            }`}
                    >
                        Continuar
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
