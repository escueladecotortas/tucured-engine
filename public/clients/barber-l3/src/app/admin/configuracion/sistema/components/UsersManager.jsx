// Archivo: src/app/admin/configuracion/sistema/components/UsersManager.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { subscribeAdmins, addAdmin, removeAdmin, updateAdminAlerts } from '@/lib/firebase/users';
import { ShieldAlert, Check, Plus, Trash2, Users, Bell, BellOff } from 'lucide-react';

export default function UsersManager() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeAdmins((data) => {
      setAdmins(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes('@')) return;
    try {
      await addAdmin(newEmail);
      setNewEmail('');
      setFeedback({ message: 'ADMINISTRADOR AGREGADO', type: 'success' });
    } catch (error) {
      console.error(error);
      setFeedback({ message: 'ERROR AL AGREGAR', type: 'error' });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleRemove = async (id) => {
    if (!confirm('¿Quitar acceso a este usuario?')) return;
    try {
      await removeAdmin(id);
      setFeedback({ message: 'ACCESO REVOCADO', type: 'success' });
    } catch (error) {
      console.error(error);
      setFeedback({ message: 'ERROR AL REVOCAR', type: 'error' });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleToggleAlerts = async (id, currentVal) => {
    try {
      await updateAdminAlerts(id, !currentVal);
      setFeedback({ 
        message: `AVISOS DE TURNOS ${!currentVal ? 'ACTIVADOS' : 'SILENCIADOS'}`, 
        type: 'success' 
      });
    } catch (error) {
      console.error(error);
      setFeedback({ message: 'ERROR AL ACTUALIZAR CONFIGURACIÓN', type: 'error' });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg relative overflow-hidden mt-6">
      <div className="bg-gray-50 px-5 py-3.5 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Users size={16} className="text-gray-500" />
          <span className="text-[#1A1A1A] font-semibold text-xs tracking-wider uppercase">
            Control de Accesos y Alertas Globales
          </span>
        </div>
        <span className="text-xs font-medium text-gray-500 tracking-wider">
          {admins.length} ADMINS
        </span>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        <p className="text-zinc-500 text-xs leading-relaxed font-medium">
          Configuración de accesos administrativos y switches globales de notificaciones por email. Si una administradora está de vacaciones o franco, puede silenciar sus avisos desde aquí.
        </p>

        {feedback && (
          <div className={`p-3 border flex items-center gap-3 rounded-md shadow-sm transition-all ${
            feedback.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {feedback.type === 'success' ? <Check size={16} /> : <ShieldAlert size={16} />}
            <div className="text-[10px] font-bold uppercase tracking-wider">{feedback.message}</div>
          </div>
        )}

        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
            className="flex-1 h-10 bg-white border border-gray-300 focus:border-[#800000] outline-none px-3 text-sm rounded-md transition-all focus:ring-1 focus:ring-[#800000]/20"
          />
          <button
            type="submit"
            className="h-10 px-4 bg-[#800000] hover:bg-[#600000] text-white text-xs font-bold uppercase tracking-widest rounded-md flex items-center gap-2 transition-all cursor-pointer shadow-sm shrink-0"
          >
            <Plus size={14} />
            AGREGAR
          </button>
        </form>

        {loading ? (
          <div className="text-xs text-gray-500 text-center py-4 font-bold tracking-widest">CARGANDO...</div>
        ) : (
          <div className="space-y-3">
            {admins.map((admin) => {
              const recibirAlertas = admin.recibirAlertas !== false;
              return (
                <div key={admin.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-zinc-800 break-all">{admin.email}</span>
                    <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Perfil Administradora</span>
                  </div>
                  
                  <div className="flex items-center gap-2.5 justify-end">
                    <button
                      type="button"
                      onClick={() => handleToggleAlerts(admin.id, recibirAlertas)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-[10px] font-bold uppercase tracking-wider cursor-pointer active:scale-95 ${
                        recibirAlertas
                          ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100/70'
                          : 'border-zinc-200 bg-zinc-100 text-zinc-400 hover:bg-zinc-200/50'
                      }`}
                      title="Recibir Avisos de TODOS los Turnos (Email)"
                    >
                      {recibirAlertas ? (
                        <>
                          <Bell size={13} className="text-amber-500 fill-amber-500" />
                          <span>Avisos Activos</span>
                        </>
                      ) : (
                        <>
                          <BellOff size={13} className="text-zinc-400" />
                          <span>Silenciado</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleRemove(admin.id)}
                      className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 transition-all cursor-pointer"
                      title="Revocar acceso"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
