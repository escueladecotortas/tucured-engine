import React, { useState } from 'react';
import { Calendar, MonitorPlay, Zap } from 'lucide-react';
import { useToast } from './Toast';

const WIDGETS = [
    {
        id: 'turnero-basic',
        name: 'Turnero (WhatsApp)',
        description: 'Módulo inteligente de agenda. Permite al cliente seleccionar día y hora real, formateando el mensaje de reserva automáticamente para WhatsApp.',
        icon: Calendar,
        defaultState: true,
        nexusId: 'div_406da96d', // ID from index.html (Calendar Container)
        targetFile: 'index.html'
    },
    {
        id: 'smart-carousel',
        name: 'Auto-Carousel Loop',
        description: 'Galería infinita de alto rendimiento con controles táctiles y navegación automática. Ideal para Portfolios.',
        icon: MonitorPlay,
        defaultState: true,
        nexusId: 'div_97e66210', // ID from index.html (Carousel Wrapper)
        targetFile: 'index.html'
    },
    {
        id: 'promo-popup',
        name: 'Flash Promo Popup',
        description: 'Ventana emergente temporizada para capturar leads o anunciar descuentos. (En Desarrollo)',
        icon: Zap,
        defaultState: false,
        nexusId: 'popup_promo',
        targetFile: 'index.html'
    }
];



import { useLanguage } from '../context/LanguageContext';

export default function WidgetStudio({ projectId }) {
    const { addToast } = useToast();
    const { t } = useLanguage();

    // Initialize state from local storage or default to all active
    const [localWidgets, setLocalWidgets] = useState(() => {
        const saved = localStorage.getItem(`nexus_widgets_${projectId}`);
        if (saved) return JSON.parse(saved);
        return WIDGETS.reduce((acc, w) => ({ ...acc, [w.id]: w.defaultState }), {});
    });

    const [processing, setProcessing] = useState(null); // Track which widget is processing

    const handleToggle = async (id, currentStatus) => {
        if (processing) return; // Prevent double clicks

        console.log(`[WidgetStudio] 🖱️ CLICKED Toggle: ${id} | Current: ${currentStatus} | Project: ${projectId}`);

        if (!projectId) {
            console.error("[WidgetStudio] ❌ Missing Project ID. Cannot save.");
            addToast("Error: Application not linked to a project (ID Missing).", "error");
            return;
        }

        const widgetDef = WIDGETS.find(w => w.id === id);
        setProcessing(id); // Start loading UI

        // Calculate new status (Toggle)
        const newStatus = !currentStatus;

        // Backend Persistence
        try {
            console.log(`[WidgetStudio] 📡 Sending Patch Request to ${widgetDef.targetFile}...`);
            const res = await fetch('/api/nexus/apply-html-patch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId,
                    targetPath: projectId === 'amora-nails'
                        ? `nexus_archives/tucu-red/clients/amora-nails/${widgetDef.targetFile}`
                        : `nexus_archives/${projectId}/${widgetDef.targetFile}`,
                    patchData: [{
                        selector: `[data-nexus-id="${widgetDef.nexusId}"]`,
                        action: 'style',
                        value: newStatus ? '' : 'display: none !important;'
                    }]
                })
            });

            const data = await res.json();
            console.log(`[WidgetStudio] ✅ Backend Response:`, data);

            if (data.success) {
                // UPDATE STATE ONLY AFTER SUCCESS
                const newWidgets = { ...localWidgets, [id]: newStatus };
                setLocalWidgets(newWidgets);
                localStorage.setItem(`nexus_widgets_${projectId}`, JSON.stringify(newWidgets));

                // Reload Iframe
                const iframe = document.getElementById('preview-frame');
                if (iframe) iframe.contentWindow.location.reload();

                addToast(newStatus ? 'Module Activated' : 'Module Deactivated', newStatus ? "success" : "default");
            } else {
                console.error(`[WidgetStudio] ❌ Backend Failure:`, data.error);
                throw new Error(data.error || "Backend rejected change");
            }

        } catch (error) {
            console.error("Widget Toggle Failed", error);
            addToast(`Error: ${error.message}`, "error");
        } finally {
            setProcessing(null); // Stop loading UI
        }
    };



    return (
        <div className="h-full p-6 overflow-y-auto custom-scrollbar">
            

            <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
                <div className="font-bold text-yellow-400">⚠️ {t('widgets.warning_title')}</div>
                <div className="text-sm text-gray-400">
                    {t('widgets.warning_text')}
                </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-6 font-outfit flex items-center gap-3">
                <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-lg text-sm uppercase tracking-wider border border-indigo-500/20">{t('widgets.title')}</span>
                <span className="text-gray-500 text-sm font-normal">{t('widgets.subtitle')}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {WIDGETS.map((widget) => (
                    <div key={widget.id} className={`group p-6 rounded-2xl border transition-all relative overflow-hidden flex flex-col ${localWidgets[widget.id] ? 'bg-indigo-500/5 border-indigo-500/30' : 'bg-white/5 border-white/5 opacity-60 hover:opacity-100'}`}>

                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl transition-transform duration-500 group-hover:scale-110 ${localWidgets[widget.id] ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-800 text-gray-400'}`}>
                                <widget.icon className="w-6 h-6" />
                            </div>
                            <button
                                onClick={() => handleToggle(widget.id, localWidgets[widget.id])}
                                disabled={processing === widget.id}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors flex items-center gap-2 ${processing === widget.id ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30 cursor-wait' :
                                    localWidgets[widget.id] ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-gray-700 text-gray-400 border-gray-600 hover:bg-gray-600'
                                    }`}
                            >
                                {processing === widget.id ? (
                                    <>
                                        <div className="w-2 h-2 rounded-full border-2 border-current border-t-transparent animate-spin" />
                                        {t('widgets.saving')}
                                    </>
                                ) : (
                                    localWidgets[widget.id] ? t('widgets.active') : t('widgets.inactive')
                                )}
                            </button>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2">{widget.name}</h3>
                        <p className="text-sm text-gray-400 mb-6 flex-1 leading-relaxed">{widget.description}</p>

                        {localWidgets[widget.id] && (
                            <div className="flex items-center gap-2 text-[10px] text-indigo-300 font-mono mt-auto">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
                                Running v2.4.0
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
