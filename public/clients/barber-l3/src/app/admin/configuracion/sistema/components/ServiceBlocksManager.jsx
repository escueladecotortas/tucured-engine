// Archivo: src/app/admin/configuracion/sistema/components/ServiceBlocksManager.jsx
// v1.00-ELEGANT — Panel de gestión de inactividad temporal por servicio (V4 Brutalista)
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Plus, Trash2, AlertCircle, Calendar } from 'lucide-react';
import { getServices, getServiceBlocks, addServiceBlock, deleteServiceBlock } from '@/lib/firebase/db';
import { useAuth } from '@/context/AuthContext';

export default function ServiceBlocksManager() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [newDate, setNewDate] = useState('');
  const [startTime, setStartTime] = useState('12:00');
  const [endTime, setEndTime] = useState('16:00');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [allServices, allBlocks] = await Promise.all([
        getServices(true),
        getServiceBlocks()
      ]);
      setServices(allServices.filter(s => s.active !== false));
      setBlocks(allBlocks);
    } catch (err) {
      console.error(err);
      setError('Error al recuperar datos de servicios y bloqueos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedServiceId) return setError('Seleccione un servicio.');
    if (!newDate) return setError('Seleccione una fecha válida.');
    if (!startTime || !endTime) return setError('Complete el horario de inicio y fin.');
    if (startTime >= endTime) return setError('La hora de inicio debe ser anterior a la hora de fin.');

    const service = services.find(s => s.id === selectedServiceId);
    if (!service) return setError('Servicio no encontrado.');

    setSaving(true);
    try {
      const blockData = {
        serviceId: selectedServiceId,
        serviceName: service.name,
        date: newDate,
        startTime,
        endTime,
        updatedBy: user?.email || 'admin'
      };

      const newBlock = await addServiceBlock(blockData);
      setBlocks(prev => [...prev, newBlock].sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)));
      setSuccess(`Bloqueo para "${service.name}" agregado con éxito.`);
      
      // Reset form
      setSelectedServiceId('');
      setNewDate('');
      setStartTime('12:00');
      setEndTime('16:00');
    } catch (err) {
      console.error(err);
      setError('Error al guardar el bloqueo en la base de datos.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (blockId) => {
    if (!confirm('¿Está seguro de que desea eliminar este bloqueo?')) return;
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await deleteServiceBlock(blockId);
      setBlocks(prev => prev.filter(b => b.id !== blockId));
      setSuccess('Bloqueo eliminado correctamente.');
    } catch (err) {
      console.error(err);
      setError('Error al eliminar el bloqueo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg mt-8 overflow-hidden font-sans text-gray-800">
      <div className="bg-gray-50 px-5 py-3.5 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Lock size={16} className="text-[#800000]" />
          <span className="font-semibold text-xs tracking-wider uppercase text-gray-700">Bloqueo de Horarios por Servicio</span>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 text-xs font-semibold rounded-md shadow-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        {success && (
          <div className="p-3.5 bg-green-50 border border-green-200 text-green-700 flex items-center gap-2 text-xs font-semibold rounded-md shadow-sm">
            <AlertCircle size={16} className="text-green-600" /> {success}
          </div>
        )}

        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-gray-50 p-4 border border-gray-150 rounded-lg items-end">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold text-gray-500 uppercase">Servicio</span>
            <select
              value={selectedServiceId}
              onChange={e => setSelectedServiceId(e.target.value)}
              className="h-10 bg-white border border-gray-300 focus:border-[#800000] outline-none px-3 text-xs rounded-md focus:ring-1 focus:ring-[#800000]/20 font-bold uppercase text-gray-700 w-full"
              required
            >
              <option value="">SELECCIONAR SERVICIO</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold text-gray-500 uppercase">Fecha</span>
            <input
              type="date"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              className="h-10 bg-white border border-gray-300 focus:border-[#800000] outline-none px-3 text-xs rounded-md focus:ring-1 focus:ring-[#800000]/20 font-bold w-full"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold text-gray-500 uppercase">Desde</span>
            <input
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="h-10 bg-white border border-gray-300 focus:border-[#800000] outline-none px-3 text-xs rounded-md focus:ring-1 focus:ring-[#800000]/20 font-bold w-full"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold text-gray-500 uppercase">Hasta</span>
            <input
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="h-10 bg-white border border-gray-300 focus:border-[#800000] outline-none px-3 text-xs rounded-md focus:ring-1 focus:ring-[#800000]/20 font-bold w-full"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving || loading}
            className="h-10 px-4 bg-[#800000] hover:bg-[#600000] text-white text-xs font-bold uppercase rounded-md flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm w-full"
          >
            <Plus size={14} /> BLOQUEAR
          </button>
        </form>

        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-left text-xs text-gray-700">
            <thead className="bg-gray-50 text-[10px] font-bold uppercase text-gray-500 tracking-wider">
              <tr>
                <th className="px-6 py-3">Servicio</th>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Horario</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-400 font-bold">
                    Cargando bloqueos activos...
                  </td>
                </tr>
              ) : blocks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-400 font-bold">
                    No hay bloqueos configurados.
                  </td>
                </tr>
              ) : (
                blocks.map(block => (
                  <tr key={block.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 uppercase">
                      {block.serviceName}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold flex items-center gap-1.5">
                      <Calendar size={13} className="text-gray-400" />
                      {block.date.split('-').reverse().join('/')}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold">
                      {block.startTime} a {block.endTime} hs
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(block.id)}
                        disabled={saving}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer rounded-md hover:bg-red-50 disabled:opacity-50"
                        title="Eliminar bloqueo"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
