// Archivo: frontend/src/components/app/AppMobileDashboard.jsx
import React from 'react';
import { Zap } from 'lucide-react';
import MobileCommandCenter from '../mobile/MobileCommandCenter';
import { DebugOverlay } from './AppDebug';

export const AppMobileDashboard = ({ user, route, setIsMobileMode, startListening, debugProps }) => {
  const isVoiceMode = route === '#/mobile/voice';

  if (isVoiceMode) {
    return (
      <div style={{ position: 'absolute', inset: 0, height: '100dvh', backgroundColor: '#09090b', color: 'white', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DebugOverlay {...debugProps} />
        <MobileCommandCenter 
          user={user} 
          onLogout={() => {
            setIsMobileMode(false);
            window.location.hash = '#/';
          }} 
        />
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0, height: '100dvh', backgroundColor: '#09090b', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '20px' }}>
      <DebugOverlay {...debugProps} />
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
        <Zap size={40} color="#22c55e" />
      </div>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>UPLINK <span style={{ color: '#22c55e' }}>SECURE</span></h1>
      <p style={{ color: '#a1a1aa', fontSize: '12px', fontFamily: 'monospace', marginBottom: '40px' }}>BYPASS PROTOCOL: ACTIVE</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', width: '100%', maxWidth: '280px' }}>
        <button 
          onClick={() => { window.location.hash = '#/project/system'; setIsMobileMode(false); }}
          style={{ padding: '16px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
        >
          OPEN SYS CONSOLE
        </button>
        <button 
          onClick={() => { window.location.hash = '#/mobile/voice'; startListening(); }}
          style={{ padding: '16px', backgroundColor: '#27272a', border: '1px solid #22c55e', color: '#22c55e', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <span style={{ width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%', display: 'inline-block' }}></span>
          VOICE MODULE
        </button>
      </div>
    </div>
  );
};
