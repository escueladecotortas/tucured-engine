// Archivo: frontend/src/components/tabs/SearchTab.jsx
import React from 'react';
import { Zap, Plus, TrendingUp } from 'lucide-react';
import DatabaseView from '../DatabaseView';
import { BatchSearch, ManualProspectForm } from '../leads';

const SearchTab = ({
    searchMethod, setSearchMethod,
    onImport, formData, setFormData, onManualAdd,
    onValidateAddress, isValidatingAddress,
    isExtracting, extractionStatus,
    prospects, onDelete, onGenerate, addToast, setTargetProspect, setOutreachModalOpen, onUpdateLead
}) => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
        <div className="flex gap-3 mb-6">
            {[
                { id: 'scrape', icon: Zap, label: 'Auto-Scrape (Google Maps)' },
                { id: 'manual', icon: Plus, label: 'Ingreso Manual' }
            ].map(m => (
                <button
                    key={m.id}
                    onClick={() => setSearchMethod(m.id)}
                    className={`flex-1 p-4 rounded-xl border transition-all ${searchMethod === m.id
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'}`}
                >
                    <div className="flex items-center justify-center gap-2">
                        <m.icon className="w-5 h-5" />
                        <span className="font-medium">{m.label}</span>
                    </div>
                </button>
            ))}
        </div>

        {searchMethod === 'scrape' ? (
            <BatchSearch onImport={onImport} />
        ) : (
            <ManualProspectForm
                formData={formData} onChange={setFormData} onSubmit={onManualAdd}
                onValidateAddress={onValidateAddress} isValidatingAddress={isValidatingAddress}
                isExtracting={isExtracting} extractionStatus={extractionStatus}
            />
        )}

        <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    Base de Datos Activa
                </h3>
            </div>
            <DatabaseView
                prospects={prospects} onDelete={onDelete}
                onGenerate={onGenerate}
                onCall={(p) => addToast(`Simulación de llamada a ${p.name}`, 'info')}
                onOutreach={(p) => { setTargetProspect(p); setOutreachModalOpen(true); }}
                onUpdateLead={onUpdateLead}
            />
        </div>
    </div>
);

export default SearchTab;
