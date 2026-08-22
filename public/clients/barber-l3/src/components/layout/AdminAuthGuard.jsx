// Archivo: src/components/layout/AdminAuthGuard.jsx
// v11.80-PLATINUM — Atomic Route Guard + Whitelist Sovereign + Pure Redirect Fix
'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useMounted } from '@/lib/hooks/useMounted';
import LoginForm from '@/components/admin/LoginForm';
import { logout } from '@/lib/firebase/auth';
import { ShieldAlert } from 'lucide-react';
import { checkIsAdmin } from '@/lib/firebase/users';

export default function AdminAuthGuard({ children }) {
  const { user, loading } = useAuth();
  const mounted = useMounted();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const normalizedPath = pathname ? pathname.replace(/\/$/, '') : '';
  
  // Normalizar para que la página de login sea única y no interfiera con rutas de servidor
  const isLoginPage = normalizedPath === '/admin/login';

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    if (!user?.email) {
      setIsAuthorized(false);
      setCheckingRole(false);
      return;
    }
    setCheckingRole(true);
    checkIsAdmin(user.email).then(isAdmin => {
      setIsAuthorized(isAdmin);
      setCheckingRole(false);
    });
  }, [user]);

  useEffect(() => {
    // Esperar a que el componente esté montado y Firebase Auth resuelva
    if (!mounted || loading || checkingRole || isLoggingOut) return;

    if (user && isAuthorized) {
      // Si el usuario está autorizado y se encuentra en login, redirigir a turnos
      if (isLoginPage) {
        router.replace('/admin/turnos');
      }
    } else if (user && !isAuthorized) {
      // Autenticado pero no autorizado: se maneja en el flujo visual (Acceso Restringido)
    } else {
      // Sin sesión: proteger rutas privadas redirigiendo a la pantalla de acceso
      if (!isLoginPage) {
        router.replace('/admin/login');
      }
    }
  }, [user, loading, mounted, isAuthorized, checkingRole, isLoginPage, router, isLoggingOut]);

  const handleLogoutAndRetry = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.replace('/admin/login');
    } catch (e) {
      console.error('[AUTH] Error during self-healing logout:', e);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // ─── 1. PRE-MONTAJE: Pantalla elegante (evita parpadeos de hidratación) ───
  if (!mounted) return <div className="min-h-screen bg-[#FDFBF7]" />;

  // ─── 2. CARGANDO AUTH / PROCESANDO REDIRECT DE GOOGLE ───
  if (loading || checkingRole || isLoggingOut) {
    return (
      <div className="fixed inset-0 h-screen bg-[#FDFBF7] flex flex-col items-center justify-center gap-6 z-[9999] font-sans selection:bg-[#800000] selection:text-white">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-zinc-200 rounded-full" />
          <div className="absolute inset-0 border-t-4 border-[#800000] animate-spin rounded-full" />
        </div>
        <div className="flex flex-col items-center gap-2 text-center px-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">
            {isLoggingOut ? 'CERRANDO SESIÓN' : 'AUTENTICANDO CREDENCIALES'}
          </p>
          <div className="h-[2px] w-24 bg-[#800000]" />
          <p className="text-[9px] uppercase tracking-[0.2em] text-[#800000] font-black">
            NEXUS PLATINUM
          </p>
        </div>
      </div>
    );
  }

  // ─── 3. CASO: AUTENTICADO PERO NO AUTORIZADO (WHITELIST FAIL) ───
  // Evaluado antes de isLoginPage para que, si el usuario ya inició sesión con una cuenta no autorizada,
  // reciba inmediatamente la pantalla de bloqueo en lugar del formulario genérico de login.
  if (user && !isAuthorized) {
    return (
      <div className="fixed inset-0 h-screen bg-[#FDFBF7] flex flex-col items-center justify-center z-[9999] font-sans p-6 selection:bg-[#800000] selection:text-white">
        <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-xl max-w-md w-full relative overflow-hidden">
          {/* Top colored accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#800000]" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center">
              <ShieldAlert size={20} className="text-[#800000]" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-gray-900 uppercase">
                ACCESO RESTRINGIDO
              </h2>
              <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold">
                NEXUS SECURITY GUARD
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <p className="text-gray-600 text-xs font-medium leading-relaxed">
              El correo ingresado no forma parte del personal administrativo autorizado en la Whitelist del sistema.
            </p>
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4">
              <p className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider">Usuario activo</p>
              <p className="text-sm font-black text-gray-800 tracking-tight mt-1">{user.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogoutAndRetry}
            className="w-full h-12 bg-white text-gray-700 text-[11px] font-bold uppercase tracking-[0.2em] border border-zinc-300 rounded-lg hover:bg-zinc-50 hover:border-zinc-400 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            INTENTAR CON OTRO USUARIO
          </button>
        </div>
      </div>
    );
  }

  // ─── 4. PÁGINA DE LOGIN (SIN SESIÓN) ───
  if (isLoginPage) {
    // Si ya está autorizado y se encuentra en login, pantalla elegante mientras redirige en el useEffect
    if (user && isAuthorized) return <div className="min-h-screen bg-[#FDFBF7]" />;
    return <LoginForm />;
  }

  // ─── 5. CASO: SIN SESIÓN EN RUTA PRIVADA ───
  // Fondo elegante de transición mientras el useEffect redirige a /admin/login
  if (!user) {
    return <div className="min-h-screen bg-[#FDFBF7]" />;
  }

  // ─── 6. ACCESO CONCEDIDO (AUTENTICADO Y AUTORIZADO) ───
  return <>{children}</>;
}
