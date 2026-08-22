// Archivo: src/app/admin/configuracion/personal/components/GridDisplay.jsx
import React from 'react';
import { UserCog, Trash2, Edit2, Clock, Scissors, Mail, Phone, Bell, BellOff } from 'lucide-react';

const DAYS = [
  { key: 'monday', label: 'LUNES' },
  { key: 'tuesday', label: 'MARTES' },
  { key: 'wednesday', label: 'MIÉRCOLES' },
  { key: 'thursday', label: 'JUEVES' },
  { key: 'friday', label: 'VIERNES' },
  { key: 'saturday', label: 'SÁBADO' },
  { key: 'sunday', label: 'DOMINGO' }
];

export default function GridDisplay({ specialists, services, loading, onEdit, onDelete }) {
  const safeSpecialists = Array.isArray(specialists) ? specialists : [];
  const safeServices = Array.isArray(services) ? services : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        <div className="col-span-full text-center py-20 animate-pulse text-slate-300 uppercase tracking-[0.5em] font-bold">
          Sincronizando Bóveda...
        </div>
      ) : safeSpecialists.length === 0 ? (
        <div className="col-span-full text-center py-20 text-slate-400 uppercase tracking-widest border border-dashed border-zinc-800 rounded-2xl font-bold">
          No hay staff registrado
        </div>
      ) : (
        safeSpecialists.map(spec => (
          <div key={spec.id} className="group relative bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-center text-[#800000] group-hover:bg-[#800000] group-hover:text-white transition-all duration-500 shadow-inner">
                <UserCog size={28} />
              </div>
              <div>
                <h4 className="text-zinc-800 font-bold text-lg uppercase tracking-tight">
                  {spec.firstName 
                    ? `${spec.firstName} ${spec.lastName || ''}`.trim() 
                    : spec.identity?.displayName 
                    || spec.identity?.firstName 
                    || spec.name 
                    || 'Sin Nombre'}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-[#800000] font-bold uppercase tracking-widest text-[9px] bg-[#800000]/5 px-2 py-0.5 rounded-full border border-[#800000]/10">
                    {spec.role || spec.identity?.role || 'Especialista'}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-zinc-500 line-clamp-2 leading-relaxed h-10 text-[11px] font-medium italic">
              {spec.bio || 'Especialista en servicios de excelencia y atención personalizada.'}
            </p>

            {(spec.email || spec.celular) && (
              <div className="flex flex-col gap-2 p-3 bg-zinc-50/50 border border-zinc-100 rounded-xl text-[10px]">
                {spec.email && (
                  <div className="flex items-center justify-between text-zinc-600 font-medium gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <Mail size={12} className="text-[#800000]/60 shrink-0" />
                      <span className="truncate font-mono">{spec.email}</span>
                    </div>
                    {spec.recibirAlertas !== false ? (
                      <span className="text-[8px] font-bold text-[#800000] bg-[#800000]/5 border border-[#800000]/10 px-1.5 py-0.5 rounded-full shrink-0 flex items-center gap-1 uppercase tracking-wider">
                        <Bell size={9} /> Avisar
                      </span>
                    ) : (
                      <span className="text-[8px] font-bold text-zinc-400 bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded-full shrink-0 flex items-center gap-1 uppercase tracking-wider">
                        <BellOff size={9} /> Silenciar
                      </span>
                    )}
                  </div>
                )}
                {spec.celular && (
                  <div className="flex items-center gap-2 text-zinc-600 font-medium">
                    <Phone size={12} className="text-[#800000]/60 shrink-0" />
                    <span className="font-mono">{spec.celular}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-4 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-[#800000]/60" /> 
                    <span className="text-[10px] uppercase font-black tracking-tight text-[#800000]">
                      Horarios de Atención
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-1 pl-5">
                    {DAYS.filter(d => spec.workingHours?.[d.key]?.active).map(d => (
                      <div key={d.key} className="flex justify-between items-center text-[9px] font-bold uppercase tracking-tighter">
                        <span className="text-zinc-500">{d.label.slice(0,3)}</span>
                        <span className="text-zinc-800 font-mono">
                          {spec.workingHours[d.key].start} - {spec.workingHours[d.key].end}
                        </span>
                      </div>
                    )) || (
                      <span className="text-[9px] text-zinc-400 font-bold italic uppercase">Sin días asignados</span>
                    )}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-lg text-[9px] font-bold border ${spec.status === 'active' ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-zinc-100 bg-zinc-50 text-zinc-400'}`}>
                  {spec.status === 'active' ? 'EN LÍNEA' : 'INACTIVO'}
                </span>
              </div>
              
              {Array.isArray(spec.serviceIds) && spec.serviceIds.length > 0 && (
                <div className="flex items-start gap-2 bg-zinc-50/50 p-2 rounded-xl border border-zinc-100/50">
                  <Scissors size={14} className="text-[#800000]/60 mt-0.5 shrink-0" />
                  <p className="text-[9px] text-zinc-500 uppercase font-bold leading-tight line-clamp-2">
                    {safeServices.filter(s => spec.serviceIds.includes(s.id)).map(s => s.name).join(', ')}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => onEdit(spec)} 
                className="flex-1 flex justify-center items-center py-3 bg-white hover:bg-zinc-50 text-[#800000] rounded-xl border border-zinc-200 transition-all shadow-sm font-bold text-[10px] uppercase tracking-widest gap-2 active:scale-95"
              >
                <Edit2 size={14} /> Editar
              </button>
              <button 
                onClick={() => onDelete(spec.id)} 
                className="flex-1 flex justify-center items-center py-3 bg-white hover:bg-rose-50 text-zinc-400 hover:text-rose-600 rounded-xl border border-zinc-200 transition-all shadow-sm font-bold text-[10px] uppercase tracking-widest gap-2 active:scale-95"
              >
                <Trash2 size={14} /> Quitar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
