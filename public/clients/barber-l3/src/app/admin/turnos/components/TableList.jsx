// Archivo: src/app/admin/turnos/components/TableList.jsx
import React from 'react';
import MobileCardList from './MobileCardList';
import DesktopTable from './DesktopTable';

export default function TableList({
  loading,
  filteredData,
  sort,
  setSort,
  onUpdateStatus
}) {
  const getStatusBadge = (status) => {
    const currentStatus = String(status || 'pending').toLowerCase();
    return (
      <span className={`px-2.5 py-1 rounded-md font-black uppercase text-[8px] tracking-wider border ${
        currentStatus === 'confirmed' ? 'border-green-200 text-green-700 bg-green-50' : 
        currentStatus === 'cancelled' ? 'border-zinc-200 text-zinc-500 bg-zinc-100' : 
        'border-amber-200 text-amber-700 bg-amber-50'
      }`}>
        {currentStatus.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-16 text-center animate-pulse text-[#720E1C] font-black tracking-[0.3em] uppercase text-[11px] bg-white border border-zinc-200 rounded-xl">
        Sincronizando con Bóveda...
      </div>
    );
  }

  if (filteredData.length === 0) {
    return (
      <div className="p-16 text-center text-zinc-400 font-bold uppercase tracking-widest text-[11px] bg-white border border-zinc-200 rounded-xl">
        No hay turnos para los criterios seleccionados
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* VISTA MÓVIL (CARDS) */}
      <MobileCardList 
        filteredData={filteredData}
        onUpdateStatus={onUpdateStatus}
        getStatusBadge={getStatusBadge}
      />

      {/* VISTA DESKTOP (TABLA) */}
      <DesktopTable 
        filteredData={filteredData}
        sort={sort}
        setSort={setSort}
        onUpdateStatus={onUpdateStatus}
        getStatusBadge={getStatusBadge}
      />
    </div>
  );
}
