// Archivo: src/components/booking/ServiceSelector.jsx
// v11.80-SOVEREIGN — Dynamic category service aggregator with robust fallback mapping
'use client';
import React, { useState, useEffect } from 'react';
import { getServices } from '@/lib/firebase/db';
import useSWR from 'swr';

export default function ServiceSelector({ onSelect, specialists, loadingSpecialists, initialCategoryId = null }) {
  const [activeFilter, setActiveFilter] = useState(initialCategoryId);

  const dayNamesEs = {
    monday: 'LUN', tuesday: 'MAR', wednesday: 'MIE',
    thursday: 'JUE', friday: 'VIE', saturday: 'SAB', sunday: 'DOM'
  };

  const { data: rawServices, isLoading: loadingServices } = useSWR('services', () => getServices(), {
    fallbackData: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('swr_cache_services') || 'null') : null,
    onSuccess: (data) => localStorage.setItem('swr_cache_services', JSON.stringify(data)),
    revalidateOnFocus: false,
    revalidateIfStale: true
  });

  const services = React.useMemo(() => {
    if (!rawServices) return [];
    return rawServices
      .filter(s => s.name && (s.active === true || s.status === 'active'))
      .map(s => {
        let cat = s.category || 'Otros';
        const n = s.name.toLowerCase().replace(/\s+/g, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        if (!s.category || s.category === 'Otros') {
          if (['semipermanente', 'softgel', 'kapping', 'manicuria', 'unas'].some(k => n.includes(k))) cat = 'Uñas';
          else if (['perfilado', 'lifting', 'pestana', 'ceja'].some(k => n.includes(k))) cat = 'Cejas y Pestañas';
          else if (['corte', 'barba'].some(k => n.includes(k))) cat = 'Barbería';
        }
        
        const catLower = cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (catLower.includes('una')) cat = 'Uñas';
        else if (catLower.includes('pestana') || catLower.includes('ceja')) cat = 'Cejas y Pestañas';
        else if (catLower.includes('barber') || catLower.includes('corte')) cat = 'Barbería';
        
        return { ...s, category: cat };
      });
  }, [rawServices]);

  useEffect(() => {
    setActiveFilter(initialCategoryId);
  }, [initialCategoryId]);

  const isLoading = loadingServices || loadingSpecialists;

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4 font-mono text-neutral-500">
      <div className="w-6 h-6 border-2 border-neutral-800 border-t-[#800000] rounded-none animate-spin" />
      <p className="text-[9px] uppercase tracking-widest font-bold">Sincronizando catálogo...</p>
    </div>
  );

  const expandedServices = [];
  services.forEach(service => {
    // Si algún especialista tiene este servicio asignado explícitamente por ID
    let matchedSpecs = specialists.filter(spec => spec.serviceIds?.includes(service.id));

    // Si no está asignado explícitamente a ningún especialista, lo asignamos por categoría/nombre
    if (matchedSpecs.length === 0) {
      const catLower = (service.category || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const nameLower = (service.name || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      let specId = 'YfasLb0kwkXFuVwatvZY'; // Micaela Sánchez por defecto (Cejas y Pestañas / Pestañas)
      if (catLower.includes('una') || ['semipermanente', 'softgel', 'kapping', 'manicuria', 'unas'].some(k => nameLower.includes(k))) {
        specId = 'rgd1lzY3pqT0eIa7TBX7'; // Victoria García (Uñas)
      } else if (catLower.includes('barber') || catLower.includes('corte') || ['corte', 'barba'].some(k => nameLower.includes(k))) {
        specId = 'InT4FMYqtlAtpf0tseM0'; // Enzo Martínez (Barbería)
      }
      
      const targetSpec = specialists.find(s => s.id === specId);
      if (targetSpec) {
        matchedSpecs = [targetSpec];
      } else if (specialists.length > 0) {
        matchedSpecs = [specialists[0]];
      }
    }

    matchedSpecs.forEach(specialist => {
      const fullName = specialist.firstName 
        ? `${specialist.firstName}${specialist.lastName ? ' ' + specialist.lastName : ''}`
        : (specialist.identity?.displayName || 'Especialista');

      expandedServices.push({
        ...service,
        specialistId: specialist.id,
        specialistName: fullName,
        specialistData: specialist
      });
    });
  });

  const filteredServices = expandedServices.filter(service => {
    if (!activeFilter) return true;
    const serviceCat = (service.category || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const filterCat = activeFilter.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Búsqueda flexible por subcadena para atajar discrepancias
    return serviceCat.includes(filterCat) || filterCat.includes(serviceCat);
  });

  const grouped = filteredServices.reduce((acc, item) => {
    let cat = (item.category || 'Otros').toUpperCase();
    const catLower = cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (catLower.includes('una')) cat = 'UÑAS';
    else if (catLower.includes('pestana') || catLower.includes('ceja')) cat = 'CEJAS Y PESTAÑAS';
    else if (catLower.includes('barber') || catLower.includes('corte')) cat = 'BARBERÍA';

    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-mono pb-2 text-neutral-900">
      <div className="flex justify-between items-center border-b border-neutral-300 pb-2">
        <span className="text-xs font-bold uppercase text-[#800000]">
          Elegí tu servicio
        </span>
        {activeFilter && (
          <button 
            onClick={() => setActiveFilter(null)}
            className="text-[9px] uppercase font-bold bg-[#EAEAEA] border border-neutral-800 text-neutral-800 px-2.5 py-1 hover:bg-[#800000] hover:text-white transition-all cursor-pointer"
          >
            [Ver Todo]
          </button>
        )}
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-neutral-300">
              <span className="text-xs font-black uppercase text-neutral-500">
                {category}
              </span>
              <span className="text-[10px] text-neutral-400 font-bold">[{items.length}]</span>
            </div>
            
            <div className="grid gap-2.5">
              {items.map((item, idx) => {
                const specialist = item.specialistData;
                const scheduleSource = specialist?.workingHours || specialist?.availability?.weekly || {};
                const availableDays = Object.keys(scheduleSource)
                  .filter(day => scheduleSource[day]?.active)
                  .map(day => dayNamesEs[day])
                  .join(', ');

                return (
                  <div
                    key={`${item.id}-${item.specialistId}-${idx}`}
                    onClick={() => onSelect({ 
                      service: item, 
                      specialistId: item.specialistId,
                      specialistName: item.specialistName
                    })}
                    className="p-3 bg-white border border-neutral-300 hover:border-[#800000] hover:bg-[#800000]/5 cursor-pointer transition-all flex justify-between items-center group select-none"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 group-hover:text-[#800000] transition-colors uppercase">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1">
                        {item.mostrarPrecioWeb !== false && `PRECIO: $${Number(item.price || 0).toLocaleString('es-AR')} - `}
                        {item.mostrarDuracionWeb !== false && `DURACIÓN: ${item.duration || 45} MIN - `}
                        PROFESIONAL: {item.specialistName}
                      </p>
                      <p className="text-[9px] text-neutral-400 font-bold uppercase mt-0.5">
                        Días: <span className="text-neutral-600">{availableDays || 'Consultar'}</span>
                      </p>
                    </div>
                    
                    <span className="text-xs font-black text-[#800000] px-2.5 py-1 bg-[#800000]/10 border border-[#800000]/20 tracking-wider shrink-0 select-none">
                      SELECCIONAR →
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {Object.keys(grouped).length === 0 && (
          <div className="py-12 text-center border-2 border-dashed border-neutral-300 bg-[#F1F1F1] p-6">
            <p className="text-[10px] tracking-widest uppercase text-neutral-400 font-bold">Catálogo vacío en esta sección</p>
          </div>
        )}
      </div>
    </div>
  );
}
