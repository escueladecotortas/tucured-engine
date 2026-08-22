// Archivo: src/app/admin/configuracion/clientes/components/AdminHeader.jsx
import React from 'react';
import { Users, Search, RefreshCcw, Plus } from 'lucide-react';

export default function AdminHeader({ 
  clientsCount, 
  archivedCount,
  search, 
  onSearchChange, 
  loading, 
  onRefresh, 
  onCreate,
  showArchived,
  onToggleArchived
}) {
  return (
    <header className="flex flex-col gap-8 border-b border-gray-100 pb-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-bold text-gray-800 tracking-tight leading-none">
            Gestión de <span className="text-[#800000]">Clientes</span>
          </h2>
          <p className="text-[#800000] font-medium tracking-wide mt-3 text-xs bg-[#800000]/10 rounded-full inline-block px-3 py-1">
            SISTEMA V11.60
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleArchived}
            className={`flex items-center justify-center gap-2 px-6 min-h-[44px] transition-all text-xs font-semibold rounded-xl border ${
              showArchived 
                ? 'bg-[#800000] text-white border-[#800000]' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {showArchived ? 'Activos' : 'Archivados'}
            {archivedCount > 0 && <span className={`px-2 py-0.5 rounded-full text-[10px] ${showArchived ? 'bg-white text-[#800000]' : 'bg-gray-100 text-gray-600'}`}>{archivedCount}</span>}
          </button>
          
          <button 
            onClick={onRefresh} 
            className="flex items-center justify-center min-h-[44px] min-w-[44px] text-gray-600 hover:text-[#800000] hover:bg-gray-50 rounded-xl transition-all bg-white border border-gray-200"
            title="Sincronizar"
          >
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          
          <button 
            onClick={onCreate} 
            className="flex items-center justify-center gap-2 px-6 min-h-[44px] bg-[#800000] text-white text-sm hover:bg-[#800000]/90 rounded-xl transition-all font-semibold shadow-md"
          >
            <Plus size={18} /> Nuevo Registro
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xl flex justify-between items-center group transition-all duration-300">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1 font-semibold">
              {showArchived ? 'Total Archivados' : 'Total Activos'}
            </p>
            <p className="text-4xl font-bold text-gray-800">{showArchived ? archivedCount : clientsCount}</p>
          </div>
          <div className="w-14 h-14 bg-[#800000]/10 rounded-2xl flex items-center justify-center text-[#800000] group-hover:scale-105 transition-transform">
            <Users size={24} />
          </div>
        </div>
        
        <div className="md:col-span-2 relative">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            <Search size={20} />
          </div>
          <input 
            id="search"
            name="search"
            type="text" 
            placeholder="Buscar por nombre o WhatsApp..." 
            className="w-full h-full min-h-[44px] bg-white border border-gray-100 rounded-2xl pl-14 pr-6 py-6 outline-none focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000]/50 text-gray-800 placeholder:text-gray-400 font-medium text-sm transition-all shadow-xl"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}
