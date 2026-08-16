// Archivo: frontend/src/components/app/AppAuthScreens.jsx
import React from 'react';
import { Zap, Loader2 } from 'lucide-react';
import { DebugOverlay } from './AppDebug';

export const LoadingScreen = ({ debugProps }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100dvh', backgroundColor: '#111', color: 'white', overflow: 'hidden' }}>
    <DebugOverlay {...debugProps} />
    <div style={{ fontSize: '20px', color: '#0f0', marginBottom: '10px' }}>SYSTEM BOOT v3.0-PHOENIX...</div>
    <div style={{ fontSize: '12px', color: '#666' }}>Initializing Core...</div>
  </div>
);

export const LoginScreen = ({ onLogin, isLoggingIn, debugProps }) => (
  <div style={{ position: 'absolute', inset: 0, height: '100dvh', backgroundColor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
    <DebugOverlay {...debugProps} />
    <div style={{ padding: '30px', backgroundColor: '#18181b', borderRadius: '16px', border: '1px solid #27272a', textAlign: 'center', maxWidth: '300px', width: '100%' }}>
      <div style={{ margin: '0 auto 20px', width: '60px', height: '60px', backgroundColor: 'rgba(34, 197, 94, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Zap size={30} color="#22c55e" />
      </div>
      <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '4px', letterSpacing: '2px' }}>NEXUS</h1>
      <p style={{ color: '#71717a', fontSize: '10px', letterSpacing: '3px', marginBottom: '24px' }}>MOBILE UPLINK v3.0</p>
      <button
        onClick={onLogin}
        disabled={isLoggingIn}
        style={{ width: '100%', padding: '14px', backgroundColor: isLoggingIn ? '#27272a' : '#22c55e', color: isLoggingIn ? '#71717a' : 'black', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: isLoggingIn ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s' }}
      >
        {isLoggingIn ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
        {isLoggingIn ? 'ACCESSING...' : 'INITIATE UPLINK'}
      </button>
      <div style={{ marginTop: '20px', fontSize: '9px', color: '#52525b', fontFamily: 'monospace' }}>
        HOST: {window.location.hostname}
      </div>
    </div>
  </div>
);
