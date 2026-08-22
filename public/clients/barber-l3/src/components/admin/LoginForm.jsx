// Archivo: src/components/admin/LoginForm.jsx
// v11.92-GOLD — Atomic popup handler & sovereign error branding
'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { login, loginWithGoogle } from '@/lib/firebase/auth';
import { Lock, User, ArrowRight, ShieldAlert, Fingerprint } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'unauthorized') {
      setError('ACCESO DENEGADO: IDENTIDAD NO AUTORIZADA EN WHITELIST.');
    }
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { user } = await login(email, password);
      if (!user) {
        setError('CREDENCIALES INVÁLIDAS // FALLO DE AUTENTICACIÓN');
        setLoading(false);
      }
    } catch (err) {
      setError('FALLO CRÍTICO EN NÚCLEO DE ACCESO');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const { user, error: authError } = await loginWithGoogle();
      if (authError) {
        if (authError === 'auth/popup-closed-by-user') {
          setError('ACCESO CANCELADO: VENTANA EMERGENTE CERRADA');
        } else if (authError === 'auth/blocked-by-popup-killer' || authError === 'auth/popup-blocked') {
          setError('ERROR: VENTANA EMERGENTE BLOQUEADA POR EL NAVEGADOR');
        } else if (authError === 'auth/cancelled-popup-request') {
          setError('PETICIÓN DE VENTANA EMERGENTE CANCELADA');
        } else {
          setError('ERROR EN SISTEMA FEDERADO GOOGLE');
        }
        setGoogleLoading(false);
      }
    } catch (err) {
      setError('ERROR EN SISTEMA FEDERADO GOOGLE');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 z-[99999] font-sans selection:bg-[#800000] selection:text-white overflow-y-auto">
      {/* Grid sutil */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="w-full max-w-[460px] relative z-10">
        {/* Header de identidad */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white border border-zinc-200 rounded-lg flex items-center justify-center shadow-sm">
              <Fingerprint size={20} className="text-[#800000]" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase">Sistema</p>
              <p className="text-[12px] text-gray-900 font-black tracking-[0.1em] uppercase">Nexus Admin</p>
            </div>
          </div>
          <div className="bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
            <p className="text-[9px] text-gray-600 font-bold tracking-[0.2em] uppercase">Platinum</p>
          </div>
        </div>

        {/* Panel principal */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden">
          {/* Título */}
          <div className="px-8 pt-8 pb-6 border-b border-zinc-100 bg-zinc-50/50">
            <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase leading-none">
              NEXUS<span className="text-[#800000]">_CORE</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold mt-2">
              ADMINISTRATION_OS // ACCESO RESTRINGIDO
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin} className="px-8 py-8 space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase text-gray-600 font-bold tracking-[0.2em]">Identidad</label>
                <User size={12} className="text-[#800000]" />
              </div>
              <input
                type="email"
                placeholder="USER@LAFACHADA.AR"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded-lg py-3 px-4 text-sm outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-all text-gray-900 font-medium placeholder:text-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase text-gray-600 font-bold tracking-[0.2em]">Clave de Acceso</label>
                <Lock size={12} className="text-[#800000]" />
              </div>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded-lg py-3 px-4 text-sm outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-all text-gray-900 font-medium placeholder:text-gray-400"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-[#800000] px-5 py-4 border border-red-100 rounded-lg flex items-center gap-3">
                <ShieldAlert size={18} className="shrink-0" />
                <p className="text-[11px] uppercase font-bold leading-tight">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-12 bg-[#800000] text-white rounded-lg uppercase text-[11px] font-bold tracking-[0.2em] hover:bg-[#800000]/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-2 shadow-sm"
            >
              {loading ? 'VALIDANDO...' : (
                <>
                  ACCEDER AL SISTEMA
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divisor */}
          <div className="px-8 pb-4">
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-zinc-200" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">o</span>
              <div className="h-[1px] flex-1 bg-zinc-200" />
            </div>
          </div>

          {/* Google Button */}
          <div className="px-8 pb-8 pt-2">
            <button
              onClick={handleGoogleLogin}
              type="button"
              disabled={loading || googleLoading}
              className="w-full h-12 flex items-center justify-center gap-3 bg-white text-gray-700 text-[11px] font-bold uppercase tracking-[0.2em] border border-zinc-300 rounded-lg hover:bg-zinc-50 hover:border-zinc-400 transition-all disabled:opacity-50 shadow-sm"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-[#800000] animate-spin rounded-full" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                </svg>
              )}
              {googleLoading ? 'AUTENTICANDO...' : 'CONTINUAR CON GOOGLE'}
            </button>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between">
            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
              © 2026 Nexus Barber L3
            </p>
            <div className="bg-white border border-zinc-200 px-2 py-1 rounded">
              <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">NEXUS PLATINUM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
