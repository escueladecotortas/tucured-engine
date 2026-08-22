// Archivo: src/app/admin/configuracion/clientes/components/TableList.jsx
// v11.70-PLATINUM — Reconstrucción Total: zinc-950 / bordó / zero gray / 44px mobile
'use client';
import React from 'react';
import {
  Calendar,
  DollarSign,
  MessageSquare,
  Edit2,
  Trash2,
  RotateCcw,
  User,
  ArrowUpDown,
} from 'lucide-react';
import { formatPhoneForWhatsApp } from '@/lib/utils/whatsapp';

export default function TableList({
  clients,
  loading,
  sort,
  onSort,
  onEdit,
  onDelete,
  onRestore,
  isArchivedView,
}) {
  const headers = [
    { label: 'Cliente', key: 'name' },
    { label: 'WhatsApp', key: 'whatsapp' },
    { label: 'Último Turno', key: 'lastVisit' },
    { label: 'Turnos', key: 'totalAppointments' },
    { label: 'Inversión', key: 'totalSpent' },
  ];

  /* ─── ESTADO LOADING ─── */
  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#800000] rounded-full animate-spin" />
        <p className="font-sans text-sm font-medium text-gray-400">
          Cargando clientes...
        </p>
      </div>
    );
  }

  /* ─── ESTADO VACÍO ─── */
  if (clients.length === 0) {
    return (
      <div className="py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 text-center">
        <p className="font-sans text-sm font-medium text-gray-500">
          No se encontraron clientes {isArchivedView ? 'archivados' : 'activos'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans">

      {/* ═══ DESKTOP: TABLA ELEGANT ═══ */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
            <tr>
              {headers.map((h) => (
                <th
                  key={h.key}
                  onClick={() => onSort(h.key)}
                  className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors text-xs font-semibold tracking-wider uppercase select-none"
                >
                  <div className="flex items-center gap-2">
                    {h.label}
                    <ArrowUpDown
                      size={12}
                      className={sort.key === h.key ? 'text-[#800000]' : 'text-gray-300'}
                    />
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clients.map((client) => (
              <tr
                key={client.id || client.whatsapp}
                className={`group transition-colors ${
                  client.status === 'archived'
                    ? 'opacity-40 bg-gray-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                {/* Nombre */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#800000]/10 rounded-full flex items-center justify-center shrink-0">
                      <User size={18} className="text-[#800000]" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-bold text-sm">
                        {client.name || 'Sin Nombre'}
                      </p>
                      {client.status === 'archived' && (
                        <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-semibold mt-1 inline-block">
                          Archivado
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                {/* WhatsApp */}
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {client.whatsapp || '—'}
                </td>
                {/* Último turno */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar size={14} className="text-gray-400" />
                    {client.lastVisit || 'S/D'}
                  </div>
                </td>
                {/* Cantidad */}
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold text-xs rounded-full">
                    {client.totalAppointments} turnos
                  </span>
                </td>
                {/* Inversión */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-gray-900 font-bold text-sm">
                    <DollarSign size={14} className="text-gray-400" />
                    {(client.totalSpent || 0).toLocaleString('es-AR')}
                  </div>
                </td>
                {/* Acciones */}
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    {client.status !== 'archived' ? (
                      <>
                        {client.whatsapp && (
                          <a
                            href={`https://wa.me/${client.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all"
                            title="WhatsApp"
                          >
                            <MessageSquare size={16} />
                          </a>
                        )}
                        <button
                          onClick={() => onEdit(client)}
                          className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-all"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(client.id)}
                          className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                          title="Archivar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onRestore(client.id)}
                        className="flex items-center gap-2 px-4 min-h-[40px] bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-xs font-semibold"
                      >
                        <RotateCcw size={14} />
                        Restaurar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ═══ MÓVIL: CARDS ELEGANT — min-h 44px ═══ */}
      <div className="md:hidden space-y-4">
        {clients.map((client) => (
          <div
            key={client.id || client.whatsapp}
            className={`bg-white border border-gray-100 rounded-2xl shadow-sm relative overflow-hidden ${
              client.status === 'archived' ? 'opacity-50' : ''
            }`}
          >
            {/* Header de la card */}
            <div className="p-4 flex justify-between items-start border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#800000]/10 rounded-full flex items-center justify-center shrink-0">
                  <User size={18} className="text-[#800000]" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-bold text-sm">
                    {client.name || 'Sin Nombre'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {client.whatsapp || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {client.status === 'archived' ? (
                  <span className="text-[10px] bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 font-semibold">
                    Archivado
                  </span>
                ) : (
                  <>
                    <span className="text-[10px] bg-green-50 text-green-700 rounded-full px-2 py-0.5 font-semibold block w-fit ml-auto">
                      Activo
                    </span>
                    <p className="text-sm text-gray-900 font-bold mt-1">
                      ${(client.totalSpent || 0).toLocaleString('es-AR')}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 p-4 border-b border-gray-50 bg-gray-50/50">
              <div className="border-r border-gray-200">
                <p className="text-xs text-gray-500 font-medium">Turnos</p>
                <p className="text-sm font-bold text-gray-900">{client.totalAppointments || 0}</p>
              </div>
              <div className="pl-4">
                <p className="text-xs text-gray-500 font-medium">Última Visita</p>
                <p className="text-sm font-bold text-gray-900">{client.lastVisit || 'N/A'}</p>
              </div>
            </div>

            {/* Botones acción — mínimo 44px */}
            <div className="p-4 flex flex-col gap-3">
              {client.status !== 'archived' ? (
                <>
                  <a
                    href={`https://wa.me/${client.whatsapp?.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-[#800000] text-white text-sm font-semibold rounded-xl hover:bg-[#800000]/90 transition-all shadow-sm"
                  >
                    <MessageSquare size={18} />
                    Contactar por WhatsApp
                  </a>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => onEdit(client)}
                      className="min-h-[44px] flex items-center justify-center gap-2 bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 hover:bg-gray-100 transition-all"
                    >
                      <Edit2 size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(client.id)}
                      className="min-h-[44px] flex items-center justify-center gap-2 bg-red-50 text-red-600 text-sm font-semibold rounded-xl border border-red-100 hover:bg-red-100 transition-all"
                    >
                      <Trash2 size={16} />
                      Archivar
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => onRestore(client.id)}
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 hover:bg-gray-200 transition-all"
                >
                  <RotateCcw size={18} />
                  Restaurar Acceso
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
