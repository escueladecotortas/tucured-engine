// Archivo: src/app/admin/configuracion/clientes/page.jsx
'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase/config';
import { subscribeClients, subscribeAppointments, deleteClient, restoreClient } from '@/lib/firebase/db';
import { useAuth } from '@/context/AuthContext';
import AdminHeader from './components/AdminHeader';
import TableList from './components/TableList';
import FormModals from './components/FormModals';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Toast from '@/components/ui/Toast';

export default function GestionClientes() {
  const { user } = useAuth();
  const [rawClients, setRawClients] = useState([]);
  const [rawAppointments, setRawAppointments] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ key: 'lastVisit', dir: 'desc' });
  const [isCreating, setIsCreating] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
  const [showArchived, setShowArchived] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Conexión viva a la Bóveda de Firebase (onSnapshot) para evitar estados vacíos
    const unsubClients = subscribeClients((data) => {
      setRawClients(Array.isArray(data) ? data : []);
      setLoadingClients(false);
    });

    const unsubAppts = subscribeAppointments((data) => {
      setRawAppointments(Array.isArray(data) ? data : []);
      setLoadingAppts(false);
    });

    return () => {
      unsubClients();
      unsubAppts();
    };
  }, []);

  // Mapeo y cruce de datos instantáneo y reactivo
  const allClients = useMemo(() => {
    const safeData = rawClients;
    const safeAppointments = rawAppointments;

    const mapped = safeData.map(client => {
      const clientAppointments = safeAppointments.filter(app => app.clientId === client.id && app.status !== 'cancelled');
      const totalSpent = clientAppointments.reduce((acc, curr) => acc + (Number(curr.precioCobrado) || 0), 0);
      
      let lastVisit = 'N/A';
      if (clientAppointments.length > 0) {
        const sortedApps = [...clientAppointments].sort((a, b) => {
          const dateA = a.appointmentDate?.toDate ? a.appointmentDate.toDate() : new Date(a.appointmentDate);
          const dateB = b.appointmentDate?.toDate ? b.appointmentDate.toDate() : new Date(b.appointmentDate);
          return dateB - dateA;
        });
        const latestApp = sortedApps[0];
        const latestDate = latestApp.appointmentDate?.toDate ? latestApp.appointmentDate.toDate() : new Date(latestApp.appointmentDate);
        
        if (!isNaN(latestDate.getTime())) {
          const dd = String(latestDate.getDate()).padStart(2, '0');
          const mm = String(latestDate.getMonth() + 1).padStart(2, '0');
          const yyyy = latestDate.getFullYear();
          lastVisit = `${dd}/${mm}/${yyyy}`;
        }
      }

      const fullName = client.firstName || client.lastName 
        ? `${client.firstName || ''} ${client.lastName || ''}`.trim() 
        : client.name || 'Sin Nombre';

      return {
        ...client,
        name: fullName,
        totalAppointments: clientAppointments.length,
        totalSpent,
        lastVisit
      };
    });

    return mapped;
  }, [rawClients, rawAppointments]);

  const loading = loadingClients || loadingAppts;

  // Filtrado por estado (active vs archived) y búsqueda
  const filteredClients = useMemo(() => {
    return allClients
      .filter(c => {
        const matchesSearch = (c.name?.toLowerCase() || '').includes(search.toLowerCase()) || c.whatsapp?.includes(search);
        const matchesStatus = showArchived ? c.status === 'archived' : (c.status === 'active' || !c.status);
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const valA = a[sort.key] || '';
        const valB = b[sort.key] || '';
        if (valA < valB) return sort.dir === 'asc' ? -1 : 1;
        if (valA > valB) return sort.dir === 'asc' ? 1 : -1;
        return 0;
      });
  }, [allClients, search, sort, showArchived]);

  const handleSort = (key) => {
    setSort(prev => ({
      key,
      dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDeleteClient = (id) => {
    setConfirmDelete({ show: true, id });
  };
  
  const handleConfirmDelete = async () => {
    if (confirmDelete.id) {
      try {
        await deleteClient(confirmDelete.id, user?.uid);
        setToast({ message: 'Cliente archivado correctamente', type: 'success' });
      } catch (e) {
        setToast({ message: 'Error al archivar cliente: ' + e.message, type: 'error' });
      } finally {
        setConfirmDelete({ show: false, id: null });
      }
    }
  };

  const handleRestoreClient = async (id) => {
    try {
      await restoreClient(id, user?.uid);
      setToast({ message: 'Cliente restaurado correctamente', type: 'success' });
    } catch (e) {
      setToast({ message: 'Error al restaurar cliente: ' + e.message, type: 'error' });
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10 font-sans">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <AdminHeader 
        clientsCount={allClients.filter(c => c.status === 'active' || !c.status).length}
        archivedCount={allClients.filter(c => c.status === 'archived').length}
        search={search}
        onSearchChange={setSearch}
        loading={loading}
        onRefresh={() => {}} // Flujo continuo 100% real-time
        onCreate={() => setIsCreating(true)}
        showArchived={showArchived}
        onToggleArchived={() => setShowArchived(!showArchived)}
      />

      <TableList 
        clients={filteredClients}
        loading={loading}
        sort={sort}
        onSort={handleSort}
        onEdit={setEditingClient}
        onDelete={handleDeleteClient}
        onRestore={handleRestoreClient}
        isArchivedView={showArchived}
      />


      <FormModals 
        editing={editingClient}
        isCreating={isCreating}
        onClose={() => {
          setIsCreating(false);
          setEditingClient(null);
        }}
        onSuccess={(feedback) => {
          if (feedback?.type === 'error') {
            setToast({ message: feedback.message, type: 'error' });
          } else {
            setToast({ message: editingClient ? 'Cliente actualizado' : 'Cliente registrado', type: 'success' });
            setIsCreating(false);
            setEditingClient(null);
          }
        }} 
      />

      <ConfirmModal 
        isOpen={confirmDelete.show}
        title="¿ELIMINAR CLIENTE?"
        message="Se mantendrá el registro histórico pero el cliente no aparecerá en las listas activas del búnker."
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete({ show: false, id: null })}
        confirmText="SÍ, ELIMINAR"
        cancelText="CANCELAR"
      />
    </div>
  );
}
