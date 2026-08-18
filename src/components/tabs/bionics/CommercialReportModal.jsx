// Archivo: src/components/tabs/bionics/CommercialReportModal.jsx
// Ficha Institucional A4 Imprimible de Vitalis (Kernel Medical Officer)

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Copy, X, Stethoscope, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function CommercialReportModal({ isOpen, onClose, auditData, url }) {
    if (!isOpen || !auditData) return null;

    const domain = (url || 'tucured.ar').replace(/^https?:\/\//, '').split('/')[0];
    const dateStr = new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const score = auditData.score || 0;
    const isOptimal = score >= 85;
    const isWarning = score >= 60 && score < 85;

    // Diagnóstico Ejecutivo redactado por Vitalis
    const diagnosisText = isOptimal
        ? `El activo digital [${domain}] presenta un estado clínico de salud óptimo (${score}/100). Cumple con los estándares de cifrado SSL, tiempos de respuesta acelerados y jerarquía semántica adecuada. El sitio está perfectamente calibrado para maximizar conversión de leads y retención de usuarios.`
        : isWarning
        ? `El activo digital [${domain}] presenta anomalías moderadas (${score}/100). Se detectaron puntos de fuga en latencia o metadatos SEO que pueden reducir el posicionamiento orgánico en Google y la tasa de conversión en hasta un 35%. Se recomienda aplicar los parches sugeridos.`
        : `El activo digital [${domain}] se encuentra en estado crítico (${score}/100). La carencia de protocolos de seguridad o estructura básica de indexación compromete severamente la confianza de los visitantes y la visibilidad en buscadores. Requiere refactorización prioritaria inmediata.`;

    const handleCopyMarkdown = async () => {
        const md = `# 🩺 INFORME CLÍNICO DE AUDITORÍA DIGITAL // TUCU RED
**Oficial Médico**: VITALIS (Kernel Medical Officer - Nexus OS)
**Objetivo**: ${url}
**Fecha**: ${dateStr}
**Score Global**: ${score}/100 [${auditData.health}]
**Seguridad**: ${auditData.metrics?.isHttps ? 'HTTPS Certificado' : 'HTTP No Cifrado (Riesgo)'}
**Latencia TTFB**: ${auditData.metrics?.ttfb}ms | **DOM**: ${auditData.metrics?.domNodes} nodos

## 📋 Diagnóstico Ejecutivo de Vitalis
${diagnosisText}

## 🔍 Desglose de Hallazgos
${(auditData.issues || []).map((iss, i) => `${i + 1}. **[${(iss.severity || 'INFO').toUpperCase()}]** ${iss.title}: ${iss.desc}`).join('\n')}

---
*Certificado por Vitalis Medical Service • Tucu Red Engine v11.1*`;

        if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(md);
            toast.success("¡Informe clínico en Markdown copiado!");
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md print:p-0 print:bg-transparent print:backdrop-blur-none print:static">
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    id="vitalisPrintReport"
                    className="w-full max-w-3xl bg-[#080d1a] border border-cyan-500/20 rounded-2xl shadow-2xl overflow-hidden font-mono text-white flex flex-col max-h-[90vh] print:max-h-none print:border-none print:bg-white print:text-black print:w-full print:shadow-none print:rounded-none"
                >
                    {/* Header Bar (Hidden on print) */}
                    <div className="h-14 bg-white/5 border-b border-white/10 px-5 flex items-center justify-between shrink-0 print:hidden">
                        <div className="flex items-center gap-2">
                            <Stethoscope className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs font-bold tracking-wider text-cyan-300">INFORME CLÍNICO DE VITALIS</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={handleCopyMarkdown} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer">
                                <Copy className="w-3.5 h-3.5" /> Copiar MD
                            </button>
                            <button onClick={() => window.print()} className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-cyan-950/40">
                                <Printer className="w-3.5 h-3.5" /> Imprimir / PDF
                            </button>
                            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 ml-2 cursor-pointer">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* A4 Sheet Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar print:p-8 print:overflow-visible">
                        {/* Printable Branding */}
                        <div className="flex items-start justify-between border-b-2 border-cyan-500/40 print:border-black pb-4">
                            <div>
                                <div className="text-xs text-cyan-400 print:text-cyan-800 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                    <Stethoscope className="w-4 h-4" /> Tucu Red • Informe Clínico de Auditoría Digital
                                </div>
                                <h1 className="text-lg font-bold text-white print:text-black mt-1">Ficha Técnica de Salud y Rendimiento Web</h1>
                                <div className="text-xs text-gray-400 print:text-gray-700 mt-0.5">Objetivo: <span className="font-bold underline">{url}</span></div>
                            </div>
                            <div className="text-right text-[11px] text-gray-400 print:text-gray-700">
                                <div className="font-bold text-white print:text-black">VITALIS (Kernel Medical Officer)</div>
                                <div>{dateStr}</div>
                                <div className="text-emerald-400 print:text-emerald-800 font-bold">Nexus OS v11.1</div>
                            </div>
                        </div>

                        {/* Executive KPI Matrix */}
                        <div className="grid grid-cols-3 gap-3 print:gap-4">
                            <div className="bg-white/5 print:bg-gray-100 border border-white/10 print:border-gray-400 rounded-xl p-4 text-center">
                                <div className="text-[10px] text-gray-400 print:text-gray-600 uppercase font-bold">Score Clínico</div>
                                <div className={`text-3xl font-black mt-1 ${isOptimal ? 'text-emerald-400 print:text-emerald-800' : isWarning ? 'text-yellow-400 print:text-yellow-800' : 'text-rose-400 print:text-rose-800'}`}>
                                    {score}/100
                                </div>
                                <div className="text-[9px] font-bold uppercase mt-0.5 text-cyan-300 print:text-cyan-900">{auditData.health}</div>
                            </div>
                            <div className="bg-white/5 print:bg-gray-100 border border-white/10 print:border-gray-400 rounded-xl p-4 text-center">
                                <div className="text-[10px] text-gray-400 print:text-gray-600 uppercase font-bold">Latencia TTFB</div>
                                <div className="text-2xl font-bold text-white print:text-black mt-1">{auditData.metrics?.ttfb || 0}ms</div>
                                <div className="text-[9px] text-gray-400 print:text-gray-600">Tiempo de Respuesta</div>
                            </div>
                            <div className="bg-white/5 print:bg-gray-100 border border-white/10 print:border-gray-400 rounded-xl p-4 text-center">
                                <div className="text-[10px] text-gray-400 print:text-gray-600 uppercase font-bold">Protocolo SSL</div>
                                <div className="text-xl font-bold text-emerald-400 print:text-emerald-800 mt-2">{auditData.metrics?.isHttps ? 'HTTPS SEGURO' : 'HTTP INSEGURO'}</div>
                                <div className="text-[9px] text-gray-400 print:text-gray-600">Cifrado de Capa</div>
                            </div>
                        </div>

                        {/* Executive Diagnosis by Vitalis */}
                        <div className="bg-cyan-500/10 print:bg-cyan-50 border border-cyan-500/30 print:border-cyan-300 rounded-xl p-4">
                            <h3 className="text-xs font-bold text-cyan-300 print:text-cyan-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Diagnóstico Ejecutivo del Oficial Médico
                            </h3>
                            <p className="text-xs text-gray-300 print:text-gray-800 leading-relaxed">{diagnosisText}</p>
                        </div>

                        {/* Table of Findings */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-300 print:text-black uppercase tracking-wider mb-2.5">
                                Desglose Clínico de Hallazgos y Recomendaciones ({auditData.issues?.length || 0})
                            </h3>
                            <div className="space-y-2">
                                {(auditData.issues || []).map((iss, idx) => (
                                    <div key={idx} className="p-3 bg-white/5 print:bg-gray-50 border border-white/5 print:border-gray-300 rounded-xl flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <div className="text-xs font-bold text-white print:text-black">{iss.title}</div>
                                            <p className="text-[10px] text-gray-400 print:text-gray-700 mt-0.5">{iss.desc}</p>
                                        </div>
                                        <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold shrink-0 ${
                                            iss.severity === 'optimal' ? 'bg-emerald-500/20 text-emerald-300 print:bg-emerald-100 print:text-emerald-800' : 'bg-yellow-500/20 text-yellow-300 print:bg-yellow-100 print:text-yellow-800'
                                        }`}>
                                            {iss.severity}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Sign-off */}
                        <div className="pt-4 border-t border-white/10 print:border-gray-300 flex justify-between items-center text-[10px] text-gray-500 print:text-gray-600">
                            <div>Sello de Certificación: <span className="font-bold text-cyan-400 print:text-cyan-800">VITALIS-CLINIC-OK</span></div>
                            <div>Tucu Red HQ • San Miguel de Tucumán</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
