// Archivo: frontend/src/components/status/ChecklistSection.jsx
import React from 'react';
import { CheckCircle, AlertCircle, XCircle, Lock, Sparkles } from 'lucide-react';

const STATUS_CONFIG = {
    complete: { icon: CheckCircle, label: 'Completo', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    partial: { icon: AlertCircle, label: 'Parcial', bg: 'bg-yellow-500/5', border: 'border-yellow-500/20', text: 'text-yellow-400' },
    missing: { icon: XCircle, label: 'Faltante', bg: 'bg-red-500/5', border: 'border-red-500/20', text: 'text-red-400' },
    blocked: { icon: Lock, label: 'Bloqueado', bg: 'bg-orange-500/5', border: 'border-orange-500/20', text: 'text-orange-400' },
    upsell: { icon: Sparkles, label: 'Upgrade', bg: 'bg-purple-500/5', border: 'border-purple-500/20', text: 'text-purple-400' }
};

export function ChecklistSection({ title, items, icon: SectionIcon, iconColor }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
                <SectionIcon className={`w-4 h-4 ${iconColor}`} />
                <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">{title}</h3>
            </div>

            <div className="grid gap-2">
                {items.map((item) => {
                    const config = STATUS_CONFIG[item.status] || STATUS_CONFIG.missing;
                    const Icon = config.icon;

                    return (
                        <div key={item.id} className={`p-4 rounded-xl border ${config.bg} ${config.border} flex items-center justify-between group hover:scale-[1.01] transition-transform`}>
                            <div className="flex items-center gap-4">
                                <Icon className={`w-5 h-5 ${config.text}`} />
                                <div>
                                    <div className="text-sm font-bold text-white tracking-tight">{item.label}</div>
                                    {item.description && <div className="text-[10px] text-zinc-500 mt-0.5">{item.description}</div>}
                                    {item.requiredFields?.length > 0 && (
                                        <div className="text-[9px] text-zinc-600 mt-1 uppercase font-bold">Requerido: {item.requiredFields.join(', ')}</div>
                                    )}
                                </div>
                            </div>
                            <div className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${config.bg} ${config.text} border border-current/10`}>
                                {config.label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
