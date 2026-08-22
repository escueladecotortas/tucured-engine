// Archivo: src/app/admin/login/page.jsx
'use client';
import React, { Suspense } from 'react';
import LoginForm from '@/components/admin/LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-[#FDFBF7] text-[#800000] text-xs font-bold uppercase">CARGANDO MÓDULO DE ACCESO...</div>}>
      <LoginForm />
    </Suspense>
  );
}
