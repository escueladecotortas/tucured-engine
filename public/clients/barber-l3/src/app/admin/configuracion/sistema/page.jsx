// Archivo: src/app/admin/configuracion/sistema/page.jsx
// v11.90-SYSTEM — Modular Sovereign Panel of Reserve Parameters (V8/V9)
'use client';
import React from 'react';
import BookingParamsManager from './components/BookingParamsManager';
import HolidaysManager from './components/HolidaysManager';
import ServiceBlocksManager from './components/ServiceBlocksManager';
import UsersManager from './components/UsersManager';

export default function SystemSettings() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans text-[#1A1A1A]">
      <BookingParamsManager />
      <HolidaysManager />
      <ServiceBlocksManager />
      <UsersManager />
    </div>
  );
}
