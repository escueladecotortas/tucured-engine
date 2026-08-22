// Archivo: src/app/admin/turnos/components/AdminHeader.jsx
import React, { useMemo } from 'react';
import { Plus, RefreshCcw, TrendingUp, Clock, XCircle, DollarSign, Search, Calendar, Scissors, Sparkles, Eye } from 'lucide-react';
import DarkDatePicker from '@/components/admin/DarkDatePicker';

export default function AdminHeader({
  stats,
  filters,
  setFilters,
  services,
  loading,
  onRefresh,
  onNewAppointment
}) {
  const revenueDisplay = (stats.revenue || 0).toLocaleString('es-AR', { 
    style: 'currency', currency: 'ARS', minimumFractionDigits: 0 
  });

  const kpis = [
    { label: 'CONFIRMADOS', value: stats.confirmed, icon: TrendingUp, color: 'text-green-700' },
    { label: 'PENDIENTES', value: stats.pending, icon: Clock, color: 'text-amber-600' },
    { label: 'CANCELADOS', value: stats.cancelled, icon: XCircle, color: 'text-zinc-400' },
    { label: 'INGRESO EST.', value: revenueDisplay, icon: DollarSign, color: 'text-[#720E1C]' }
  ];

  // Garantizar que el selector de servicios siga el orden jerárquico: Barbería > Pestañas > Uñas
  const sortedServices = useMemo(() => {
    return [...services].sort((a, b) => {
      const getPriority = (s) => {
        const cat = (s.category || '').toLowerCase();
        const name = (s.name || '').toLowerCase();
        
        if (cat.includes('barber') || name.includes('barber')) return 1;
        if (cat.includes('pesta') || name.includes('pesta')) return 2;
        if (cat.includes('uñ') || cat.includes('uñas') || cat.includes('uas') || 
            name.includes('uñ') || name.includes('uñas') || name.includes('uas')) return 3;
        return 99;
      };

      const prioA = getPriority(a);
      const prioB = getPriority(b);
      
      if (prioA !== prioB) return prioA - prioB;
      return (a.name || '').localeCompare(b.name || '');
    });
  }, [services]);

  const handleShowAll = () => {
    setFilters({
      search: '',
      date: 'all',
      dateFrom: '',
      dateTo: '',
      service: 'all',
      status: 'all'
    });
  };

  return (
    <header className="flex flex-col gap-6 border-b border-zinc-200 pb-6 select-none">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif italic text-[#720E1C] uppercase tracking-tighter font-black">
            Control de Operaciones
          </h2>
          <p className="text-[#333333] uppercase tracking-[0.2em] mt-1 text-[9px] font-bold">
            Sincronización en Tiempo Real / Nexus Barber L3
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onNewAppointment} 
            className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-[#720E1C] text-white rounded-lg font-black hover:bg-[#720E1C]/90 transition-all uppercase tracking-widest shadow-sm text-[10px]"
          >
            <Plus size={14} /> Nuevo Turno
          </button>
          <button 
            onClick={onRefresh} 
            className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center bg-zinc-50 border border-zinc-200 text-zinc-600 hover:text-[#720E1C] hover:bg-zinc-100 rounded-lg transition-colors font-bold"
            title="Sincronizar datos"
          >
            <RefreshCcw size={15} className={loading ? 'animate-spin text-[#720E1C]' : ''} />
          </button>
        </div>
      </div>

      {/* Tarjetas de KPIs — Tablero de Control */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div 
            key={idx} 
            className="bg-white border-2 border-zinc-200 p-5 rounded-xl flex justify-between items-center group hover:border-[#720E1C]/40 hover:shadow-md transition-all shadow-sm"
          >
            <div>
              <p className="font-sans text-[9px] uppercase tracking-widest text-[#333333]/70 mb-1.5 font-bold">
                {kpi.label}
              </p>
              <p className={`text-3xl font-black font-serif ${kpi.color}`}>
                {kpi.value}
              </p>
            </div>
            <kpi.icon size={26} strokeWidth={2.5} className={`${kpi.color} opacity-30 group-hover:opacity-80 group-hover:scale-110 transition-all`} />
          </div>
        ))}
      </div>

      {/* Controles de Filtrado Principal */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-zinc-50 p-4 rounded-xl border border-zinc-200 shadow-xs">
        <div className="relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input 
            id="search" name="search" type="text" placeholder="BUSCAR POR NOMBRE O WHATSAPP..." 
            className="w-full bg-white border border-zinc-300 rounded-lg pl-9 pr-3 py-2 outline-none focus:border-[#720E1C] text-[#333333] font-bold text-[10px] placeholder:text-zinc-400" 
            value={filters.search || ''} 
            onChange={e => setFilters({...filters, search: e.target.value})} 
          />
        </div>
        
        <div className="w-full">
          <DarkDatePicker 
            value={filters.date} 
            onChange={date => setFilters({...filters, date, dateFrom: '', dateTo: ''})} 
            label="TODOS LOS TURNOS"
          />
        </div>

        <select 
          id="filter-service" name="filter-service" 
          className="bg-white border border-zinc-300 rounded-lg px-3 py-2 outline-none text-[#333333] font-bold uppercase text-[10px]" 
          value={filters.service || 'all'} 
          onChange={e => setFilters({...filters, service: e.target.value})}
        >
          <option value="all">TODOS LOS SERVICIOS</option>
          {sortedServices.map(s => (
            <option key={s.id} value={s.id}>
              {(s.name || 'Sin Nombre').toUpperCase()}
            </option>
          ))}
        </select>

        <select 
          id="filter-status" name="filter-status" 
          className="bg-white border border-zinc-300 rounded-lg px-3 py-2 outline-none text-[#333333] font-bold uppercase text-[10px]" 
          value={filters.status || 'all'} 
          onChange={e => setFilters({...filters, status: e.target.value})}
        >
          <option value="all">TODOS LOS ESTADOS</option>
          {['pending', 'confirmed', 'cancelled'].map(s => (
            <option key={s} value={s}>
              {s.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Filtros Avanzados de Fechas (CODI) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-zinc-50/50 p-3 rounded-lg border border-zinc-200 text-[10px]">
        <div className="flex items-center gap-2 text-[#720E1C] font-bold">
          <Calendar size={13} />
          <span className="uppercase tracking-wider font-black">Filtrar por Rango:</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[#333333] font-bold uppercase text-[9px]">Desde:</span>
            <input 
              type="date"
              className="bg-white border border-zinc-300 rounded px-2 py-1 text-[#333333] font-bold outline-none focus:border-[#720E1C]"
              value={filters.dateFrom || ''}
              onChange={e => setFilters({...filters, dateFrom: e.target.value, date: 'all'})}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#333333] font-bold uppercase text-[9px]">Hasta:</span>
            <input 
              type="date"
              className="bg-white border border-zinc-300 rounded px-2 py-1 text-[#333333] font-bold outline-none focus:border-[#720E1C]"
              value={filters.dateTo || ''}
              onChange={e => setFilters({...filters, dateTo: e.target.value, date: 'all'})}
            />
          </div>
          
          <div className="flex items-center gap-3 bg-zinc-100/50 p-1.5 rounded-xl border border-zinc-200">
            <span className={`text-[8px] font-black uppercase tracking-widest transition-colors px-2 ${filters.date === 'all' && !filters.dateFrom ? 'text-zinc-400' : 'text-[#720E1C]'}`}>
              HOY
            </span>
            <button
              type="button"
              onClick={() => {
                if (filters.date === 'all' && !filters.dateFrom && !filters.dateTo) {
                  setFilters({
                    ...filters,
                    date: new Date().toISOString().split('T')[0],
                    dateFrom: '',
                    dateTo: ''
                  });
                } else {
                  handleShowAll();
                }
              }}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 border-2 ${
                filters.date === 'all' && !filters.dateFrom && !filters.dateTo
                  ? 'bg-[#720E1C] border-[#720E1C]'
                  : 'bg-zinc-300 border-zinc-400'
              }`}
            >
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${
                filters.date === 'all' && !filters.dateFrom && !filters.dateTo ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
            <span className={`text-[8px] font-black uppercase tracking-widest transition-colors px-2 ${filters.date === 'all' && !filters.dateFrom ? 'text-[#720E1C]' : 'text-zinc-400'}`}>
              HISTORIAL
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
