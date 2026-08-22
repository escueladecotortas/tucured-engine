// Archivo: src/app/admin/turnos/hooks/useAppointmentData.js
// Hook de procesamiento de datos para la pantalla de Turnos (v11.91)
import { useState, useMemo } from 'react';

export function useAppointmentData({ appointments = [], clients = [], services = [] }) {
  const [filters, setFilters] = useState({ 
    search: '', 
    date: new Date().toISOString().split('T')[0], 
    dateFrom: '',
    dateTo: '',
    service: 'all', 
    status: 'all' 
  });
  const [sort, setSort] = useState({ key: 'time', dir: 'asc' });

  // Enriquecer turnos con datos resueltos de clientes y servicios
  const appointmentsWithClients = useMemo(() => {
    return appointments.map(a => {
      const client = clients.find(c => 
        c.id === a.clientId || 
        (a.client?.whatsapp && c.whatsapp === String(a.client.whatsapp).replace(/\D/g, ''))
      ) || a.client || null;
      
      const service = services.find(s => s.id === a.serviceId) || null;
      const resolvedServices = Array.isArray(a.serviceIds) 
        ? services.filter(s => a.serviceIds.includes(s.id))
        : (service ? [service] : []);
        
      let dateString = '';
      let timeString = '';
      let dateObj = null;

      if (a.appointmentDate && typeof a.appointmentDate.toDate === 'function') {
        dateObj = a.appointmentDate.toDate();
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        dateString = `${year}-${month}-${day}`;
        // Forzar 24h y remover cualquier sufijo
        timeString = dateObj.toLocaleTimeString('es-AR', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        });
      } else {
        dateString = a.date || a.dateString || '';
        // Limpiar "hs" de strings manuales
        timeString = (a.time || '').replace(/\s*hs\s*$/i, '');
      }

      const servicesTotal = resolvedServices.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
      const finalPrice = (a.precioCobrado !== undefined && a.precioCobrado !== null)
        ? Number(a.precioCobrado)
        : (servicesTotal > 0 ? servicesTotal : (Number(a.price) || 0));
      const servicesTotalDuration = resolvedServices.reduce((sum, s) => sum + (Number(s.duration) || 0), 0);
      const finalDuration = (a.duracionCobrada !== undefined && a.duracionCobrada !== null)
        ? Number(a.duracionCobrada)
        : (servicesTotalDuration > 0 ? servicesTotalDuration : (a.totalDuration || 0));

      return {
        ...a,
        price: finalPrice,
        totalDuration: finalDuration,
        resolvedClient: client,
        resolvedServices,
        resolvedService: service,
        dateString,
        timeString,
        timestampValue: dateObj ? dateObj.getTime() : 0
      };
    });
  }, [appointments, clients, services]);

  // Aplicar filtros y ordenamiento
  const filteredData = useMemo(() => {
    return appointmentsWithClients.filter(a => {
      const clientFullName = a.resolvedClient 
        ? `${a.resolvedClient.firstName || ''} ${a.resolvedClient.lastName || ''}`.toLowerCase() 
        : '';
      const matchSearch = clientFullName.includes(filters.search.toLowerCase()) || 
                          (a.id || '').toLowerCase().includes(filters.search.toLowerCase());
      
      let matchDate = true;
      if (filters.dateFrom && filters.dateTo) {
        matchDate = a.dateString >= filters.dateFrom && a.dateString <= filters.dateTo;
      } else if (filters.date && filters.date !== 'all' && filters.date !== '') {
        matchDate = a.dateString === filters.date;
      }
      
      const matchService = filters.service === 'all' 
        ? true 
        : ((Array.isArray(a.serviceIds) && a.serviceIds.includes(filters.service)) || a.serviceId === filters.service);
      
      const matchStatus = filters.status === 'all' 
        ? true 
        : String(a.status || '').toLowerCase() === String(filters.status || '').toLowerCase();
      
      return matchSearch && matchDate && matchService && matchStatus;
    }).sort((a, b) => {
      if (sort.key === 'time') {
        return sort.dir === 'asc' 
          ? a.timestampValue - b.timestampValue 
          : b.timestampValue - a.timestampValue;
      }
      const valA = a[sort.key]; 
      const valB = b[sort.key];
      if (valA < valB) return sort.dir === 'asc' ? -1 : 1;
      return sort.dir === 'asc' ? 1 : -1;
    });
  }, [appointmentsWithClients, filters, sort]);

  // Calcular métricas / KPIs
  const stats = useMemo(() => {
    const confirmedList = filteredData.filter(a => String(a.status || '').toLowerCase() === 'confirmed');
    const confirmed = confirmedList.length;
    const pending = filteredData.filter(a => (!a.status || String(a.status).toLowerCase() === 'pending')).length;
    const cancelled = filteredData.filter(a => String(a.status || '').toLowerCase() === 'cancelled').length;
    const revenueTotal = confirmedList.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
    
    return { confirmed, pending, cancelled, revenue: revenueTotal };
  }, [filteredData]);

  return {
    filters,
    setFilters,
    sort,
    setSort,
    appointmentsWithClients,
    filteredData,
    stats
  };
}
