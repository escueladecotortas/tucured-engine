// Archivo: src/app/admin/configuracion/sistema/components/HolidaysManager.jsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/context/AuthContext';
import { CalendarX2, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { ARG_2026 } from './holidaysData';
import HolidaysTable from './HolidaysTable';

export default function HolidaysManager() {
  const { user } = useAuth();
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState('custom');
  const [error, setError] = useState('');

  const fetchHolidays = useCallback(async () => {
    setLoading(true);
    try {
      const docSnap = await getDoc(doc(db, 'settings', 'holidays_cache'));
      if (docSnap.exists() && docSnap.data().holidays) {
        setHolidays(docSnap.data().holidays);
      } else {
        const oldSnap = await getDoc(doc(db, 'settings', 'holidays'));
        if (oldSnap.exists() && oldSnap.data().blockedDates) {
          setHolidays(oldSnap.data().blockedDates.map(d => ({ ...d, type: 'custom', isException: false })));
        }
      }
    } catch (err) {
      console.error(err);
      setError('Error al recuperar los feriados.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchHolidays(); }, [fetchHolidays]);

  const saveList = async (list) => {
    await setDoc(doc(db, 'settings', 'holidays_cache'), {
      holidays: list, updatedAt: new Date().toISOString(), updatedBy: user?.email || 'admin'
    });
    const oldBlocked = list.filter(h => !h.isException).map(h => ({ date: h.date, desc: h.desc }));
    await setDoc(doc(db, 'settings', 'holidays'), {
      blockedDates: oldBlocked, updatedAt: new Date().toISOString(), updatedBy: user?.email || 'admin'
    }, { merge: true });
    setHolidays(list);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newDate) return setError('Seleccione una fecha válida.');
    if (holidays.some(h => h.date === newDate)) return setError('Esta fecha ya se encuentra bloqueada.');
    
    setSaving(true);
    const updated = [...holidays, { date: newDate, desc: desc || 'Cerrado', type, isException: false, custom: true }];
    updated.sort((a, b) => a.date.localeCompare(b.date));
    try {
      await saveList(updated);
      setNewDate(''); setDesc(''); setType('custom'); setError('');
    } catch (err) { setError('Error al guardar el feriado.'); } finally { setSaving(false); }
  };

  const handleDelete = async (date) => {
    setSaving(true);
    try {
      await saveList(holidays.filter(h => h.date !== date));
    } catch (err) { setError('Error al eliminar el feriado.'); } finally { setSaving(false); }
  };

  const toggleException = async (date) => {
    setSaving(true);
    const updated = holidays.map(h => h.date === date ? { ...h, isException: !h.isException } : h);
    try {
      await saveList(updated);
    } catch (err) { setError('Error al actualizar el estado operativo.'); } finally { setSaving(false); }
  };

  const handleSync = async () => {
    setSaving(true);
    setError('');
    const currentYear = new Date().getFullYear();
    try {
      let apiHolidays = [];
      try {
        const res = await fetch(`https://nolaborables.com.ar/api/v1/feriados/${currentYear}?incluir=opcional`);
        if (res.ok) {
          const data = await res.json();
          apiHolidays = data.map(i => ({
            date: `${currentYear}-${String(i.mes).padStart(2, '0')}-${String(i.dia).padStart(2, '0')}`,
            desc: i.motivo, type: i.tipo || 'inamovible', isException: false, custom: false
          }));
        }
      } catch (e) { console.warn("API argentina falló, utilizando contingencia local."); }
      
      if (apiHolidays.length === 0) {
        apiHolidays = ARG_2026.map(h => ({ ...h, isException: false, custom: false }));
      }

      const merged = [...holidays];
      apiHolidays.forEach(h => {
        if (!merged.some(x => x.date === h.date)) merged.push(h);
      });
      merged.sort((a, b) => a.date.localeCompare(b.date));
      await saveList(merged);
    } catch (err) { setError('Error al sincronizar feriados.'); } finally { setSaving(false); }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg mt-8 overflow-hidden font-sans text-gray-800">
      <div className="bg-gray-50 px-5 py-3.5 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          <CalendarX2 size={16} className="text-[#800000]" />
          <span className="font-semibold text-xs tracking-wider uppercase text-gray-700">Administrador de Feriados</span>
        </div>
        <button
          onClick={handleSync}
          disabled={saving || loading}
          className="flex items-center justify-center gap-1.5 h-8 px-3 bg-[#800000] text-white text-[10px] font-bold uppercase rounded-md hover:bg-[#800000]/90 transition-all cursor-pointer shadow-sm disabled:opacity-50"
        >
          <RefreshCw size={12} className={saving ? 'animate-spin' : ''} />
          Sincronizar {new Date().getFullYear()}
        </button>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 text-xs font-semibold rounded-md shadow-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-gray-50 p-4 border border-gray-150 rounded-lg">
          <input
            type="date"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            className="h-10 bg-white border border-gray-300 focus:border-[#800000] outline-none px-3 text-xs rounded-md focus:ring-1 focus:ring-[#800000]/20 font-bold"
            required
          />
          <input
            type="text"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="MOTIVO (EJ. DÍA DE LA PATRIA)"
            className="h-10 bg-white border border-gray-300 focus:border-[#800000] outline-none px-3 text-xs rounded-md focus:ring-1 focus:ring-[#800000]/20 font-bold uppercase"
          />
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="h-10 bg-white border border-gray-300 focus:border-[#800000] outline-none px-3 text-xs rounded-md focus:ring-1 focus:ring-[#800000]/20 font-bold uppercase text-gray-700"
          >
            <option value="custom">PERSONALIZADO</option>
            <option value="inamovible">INAMOVIBLE</option>
            <option value="trasladable">TRASLADABLE</option>
            <option value="puente">TURÍSTICO / PUENTE</option>
          </select>
          <button
            type="submit"
            disabled={saving || loading}
            className="h-10 px-4 bg-[#800000] hover:bg-[#600000] text-white text-xs font-bold uppercase rounded-md flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Plus size={14} /> BLOQUEAR FECHA
          </button>
        </form>

        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <HolidaysTable 
            holidays={holidays}
            loading={loading}
            saving={saving}
            toggleException={toggleException}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
