import React from 'react';
import { DollarSign, Globe, CheckCircle, Clock } from 'lucide-react';

export default function CommercialData() {
    return (
        <div className="grid grid-cols-3 gap-4 h-full">
            {/* Price / Quote */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-emerald-400/80 mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Project Value</span>
                </div>
                <div>
                    <div className="text-2xl font-bold text-emerald-400 font-outfit">$1,200</div>
                    <div className="text-[10px] text-emerald-500/60 font-mono">Quotes: Web + Identity</div>
                </div>
            </div>

            {/* Payment Status */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Payment Status</span>
                </div>
                <div>
                    <div className="text-lg font-bold text-white font-outfit">50% Deposit</div>
                    <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                        <span className="text-[10px] text-amber-500 font-mono uppercase">Pending Final</span>
                    </div>
                </div>
            </div>

            {/* Domain */}
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-indigo-400/80 mb-1">
                    <Globe className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Domain</span>
                </div>
                <div>
                    <div className="text-sm font-bold text-white font-outfit truncate">amoranails.com</div>
                    <div className="flex items-center gap-1.5 mt-1">
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] text-emerald-500 font-mono uppercase">Secured</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
