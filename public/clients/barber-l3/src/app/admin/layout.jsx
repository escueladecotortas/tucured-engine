// Archivo: src/app/admin/layout.jsx
// v11.98-GOLD — Panel Admin con navegación responsiva y optimización de scroll lateral
'use client';
import React, { useState, useEffect, useMemo } from 'react';
import AdminAuthGuard from '@/components/layout/AdminAuthGuard';
import { logout } from '@/lib/firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { Calendar, Scissors, LogOut, Settings, Users, UserCog, Layers, Menu, X, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { collection, query, limit, onSnapshot, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useMounted } from '@/lib/hooks/useMounted';
import { useAuth } from '@/context/AuthContext';

const DING_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';
const ALLOWED_EMAILS = ['leolariarg@gmail.com', 'contacto@lafachadaunisex.ar', 'darcyrigonat@gmail.com'];
const NAV_ITEMS = [
  { label: 'Turnos', path: '/admin/turnos', icon: Calendar },
  { label: 'Manual', path: '/admin/manual', icon: BookOpen },
];
const CONFIG_ITEMS = [
  { label: 'Categorías', path: '/admin/configuracion/categorias', icon: Layers },
  { label: 'Servicios', path: '/admin/configuracion/servicios', icon: Scissors },
  { label: 'Personal', path: '/admin/configuracion/personal', icon: UserCog },
  { label: 'Clientes', path: '/admin/configuracion/clientes', icon: Users },
  { label: 'Sistema', path: '/admin/configuracion/sistema', icon: Settings },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useMounted();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const isAuthorized = useMemo(() => {
    if (!user?.email) return false;
    const email = user.email.toLowerCase().trim();
    return ALLOWED_EMAILS.some((a) => a.toLowerCase().trim() === email);
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  useEffect(() => {
    if (!mounted) return;
    const checkConnection = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);
    if (!user || !isAuthorized) {
      return () => {
        window.removeEventListener('online', checkConnection);
        window.removeEventListener('offline', checkConnection);
      };
    }
    const audio = new Audio(DING_SOUND_URL);
    let lastNotifiedId = localStorage.getItem('nexus_last_notified_id');
    const qNotif = query(collection(db, 'appointments'), where('status', '==', 'pending'), orderBy('createdAt', 'desc'), limit(1));
    const unsubscribeNotif = onSnapshot(qNotif, (snapshot) => {
      if (!snapshot.empty) {
        const latest = snapshot.docs[0];
        if (latest.id !== lastNotifiedId) {
          audio.play().catch(() => console.log("[AUDIO] Autoplay blocked"));
          lastNotifiedId = latest.id;
          localStorage.setItem('nexus_last_notified_id', latest.id);
        }
      }
    }, (error) => {
      console.warn('[FIRESTORE] Notification stream error (silenced):', error);
    });
    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
      unsubscribeNotif();
    };
  }, [mounted, user, isAuthorized]);

  const renderItem = (item) => {
    const isActive = pathname === item.path;
    return (
      <Link 
        key={item.path}
        href={item.path} 
        onClick={() => setIsSidebarOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 group text-sm font-medium ${
          isActive ? 'bg-[#800000] text-white shadow-md' : 'text-gray-500 hover:text-[#1A1A1A] hover:bg-gray-50'
        }`}
      >
        <item.icon size={18} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#800000] transition-colors'} />
        {item.label}
      </Link>
    );
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#800000] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AdminAuthGuard>
      <div className="admin-container flex h-screen bg-[#FDFBF7] text-[#1A1A1A] overflow-hidden relative font-sans">
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)} />
        )}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 right-4 z-50 w-12 h-12 flex items-center justify-center bg-[#800000] text-white rounded-md shadow-sm md:hidden active:scale-95 transition-all"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <aside className={`
          fixed md:relative inset-y-0 left-0 w-72 bg-white border-r border-gray-200 
          flex flex-col z-40 transition-transform duration-300 ease-in-out shadow-sm h-screen overflow-y-auto pb-12
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-6 border-b border-gray-100 bg-white flex items-center gap-3.5 shrink-0">
            <img 
              src="/assets/images/logo_barber-l3-barberia-unisex.jpeg" 
              alt="Logo Nexus Barber L3" 
              className="w-10 h-10 rounded-md border border-gray-200 object-cover shadow-sm" 
            />
            <div>
              <h1 className="text-xl font-serif tracking-tight text-[#1A1A1A] leading-none">Nexus Barber L3</h1>
              <p className="text-[9px] text-[#800000] font-black tracking-widest uppercase mt-1">Admin Panel</p>
            </div>
          </div>
          
          <nav className="flex-1 py-6 px-4 pb-20 space-y-8">
            <div className="space-y-2">
              <div className="px-4 mb-2 text-[10px] text-gray-400 font-semibold tracking-wider uppercase">OPERACIONES</div>
              {NAV_ITEMS.map(renderItem)}
            </div>
            <div className="space-y-4">
              <div className="px-4 text-[10px] text-[#800000] font-semibold tracking-wider uppercase flex items-center gap-2">
                <Settings size={14} /> CONFIGURACIÓN
              </div>
              <div className="space-y-2">{CONFIG_ITEMS.map(renderItem)}</div>
            </div>
          </nav>

          <div className="p-6 bg-white border-t border-gray-100 space-y-4 shrink-0">
            <div className="text-center">
              <p className="text-[11px] text-gray-500 truncate px-2 mb-3">{user?.email}</p>
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-3 w-full h-11 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-md transition-all text-sm font-semibold active:scale-95"
              >
                <LogOut size={16} /> CERRAR SESIÓN
              </button>
            </div>
            <div className="px-2 text-[10px] text-gray-400 uppercase tracking-wider flex justify-between items-center font-medium">
              <span>v11.98-GOLD</span>
              <span className={`px-2 py-1 rounded-full text-[9px] font-bold flex items-center gap-1.5 ${isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                {isOnline ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-auto relative bg-[#FDFBF7]">
          <div className="relative z-10 p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </AdminAuthGuard>
  );
}
