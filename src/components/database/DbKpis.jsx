// Archivo: frontend/src/components/database/DbKpis.jsx
// Célula atómica: Panel de KPIs del DatabaseView

import React from "react";
import { Database, TrendingUp, Star, DollarSign } from "lucide-react";

const KpiCard = ({ label, value, subtext, icon: Icon, color = "indigo" }) => (
  <div className={`bg-zinc-900/50 border border-${color}-500/20 rounded-xl p-4 flex items-center justify-between relative overflow-hidden group hover:border-${color}-500/40 transition-colors`}>
    <div className={`absolute inset-0 bg-${color}-500/5 group-hover:bg-${color}-500/10 transition-colors`} />
    <div>
      <div className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </div>
      <div className="text-2xl font-bold text-white font-mono">{value}</div>
      {subtext && <div className="text-xs text-zinc-500 mt-1">{subtext}</div>}
    </div>
    <div className={`w-10 h-10 rounded-full bg-${color}-500/20 flex items-center justify-center border border-${color}-500/30`}>
      {Icon && <Icon className={`w-5 h-5 text-${color}-400`} />}
    </div>
  </div>
);

export default function DbKpis({ prospects }) {
  const total = prospects.length;
  const generated = prospects.filter((p) => p.status === "generated").length;
  const convRate = total > 0 ? ((generated / total) * 100).toFixed(1) : 0;
  const avgScore = total > 0
    ? Math.round(prospects.reduce((acc, p) => acc + (p.leadScore || 0), 0) / total)
    : 0;
  // $75.000 por lead en pipeline (Tucu Red pricing)
  const potential = prospects.filter((p) => p.status === "ready").length * 75000;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <KpiCard label="Total Assets" value={total} icon={Database} subtext="Registros en Bóveda" color="zinc" />
      <KpiCard label="Conquest Ratio" value={`${convRate}%`} icon={TrendingUp} subtext={`${generated} sitios generados`} color="emerald" />
      <KpiCard label="Quality Index" value={avgScore} icon={Star} subtext="Promedio Lead Score" color="blue" />
      <KpiCard label="Potential Value" value={`$${potential}`} icon={DollarSign} subtext="En pipeline (Ready)" color="purple" />
    </div>
  );
}
