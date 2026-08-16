// Archivo: frontend/src/components/ProjectStatusDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Package, Zap } from 'lucide-react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

// Componentes Atómicos
import { HealthGauge } from './status/HealthGauge';
import { ChecklistSection } from './status/ChecklistSection';
import { InstalledWidgets } from './status/InstalledWidgets';

/**
 * DASHBOARD DE ESTADO DEL PROYECTO (Vanguardia 2026)
 * Orquestador principal de la salud y cumplimiento del cliente.
 * Cumple con la Ley de 200 líneas mediante fragmentación atómica.
 */
export default function ProjectStatusDashboard({ clientId = 'amora-nails' }) {
    const [projectStatus, setProjectStatus] = useState(null);
    const [widgets, setWidgets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Suscripción a la salud y checklists del proyecto
        const statusUnsubscribe = onSnapshot(
            doc(db, 'tucu_clients', clientId, 'project_status', 'checklist'),
            (doc) => {
                if (doc.exists()) setProjectStatus(doc.data());
                setLoading(false);
            }
        );

        // Suscripción a la colección de widgets activos
        const widgetsUnsubscribe = onSnapshot(
            collection(db, 'tucu_clients', clientId, 'widgets'),
            (snapshot) => {
                setWidgets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        );

        return () => {
            statusUnsubscribe();
            widgetsUnsubscribe();
        };
    }, [clientId]);

    if (loading) return (
        <div className="h-full flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Sincronizando Estado...</div>
            </div>
        </div>
    );

    if (!projectStatus) return (
        <div className="h-full flex items-center justify-center">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">Sin Datos de Verdad</div>
        </div>
    );

    const { healthScore = 0, technical = [], business = [] } = projectStatus;

    return (
        <div className="h-full p-8 overflow-y-auto custom-scrollbar space-y-12 bg-[#020202]">
            {/* Header y Health Gauge */}
            <header className="flex items-start justify-between border-b border-white/5 pb-8">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Status Report</h2>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                        Monitor de Integridad en Tiempo Real
                    </p>
                </div>
                <HealthGauge score={healthScore} />
            </header>

            {/* Secciones de Checklist */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <ChecklistSection 
                    title="Technical Stack" 
                    items={technical} 
                    icon={Package} 
                    iconColor="text-indigo-400"
                />
                <ChecklistSection 
                    title="Business Integration" 
                    items={business} 
                    icon={Zap} 
                    iconColor="text-yellow-400"
                />
            </div>

            {/* Inventario de Widgets */}
            <InstalledWidgets widgets={widgets} />
        </div>
    );
}
