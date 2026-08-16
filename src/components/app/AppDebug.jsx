// Archivo: frontend/src/components/app/AppDebug.jsx
import React from 'react';

export const DebugOverlay = ({ user, route, width, loading, isMobileMode, transcript }) => (
  <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.9)', color: '#0f0', fontSize: '10px', padding: '8px', zIndex: 9999, pointerEvents: 'none', borderTop: '1px solid #0f0', fontFamily: 'monospace' }}>
    {/* Debug data could be added here if needed, keeping it as requested */}
  </div>
);

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error("NEXUS CRITICAL ERROR:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: '#ef4444', backgroundColor: '#111', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>SYSTEM FAILURE</h2>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', marginBottom: '20px' }}>{this.state.error && this.state.error.toString()}</p>
          <button style={{ padding: '10px 20px', border: '1px solid #ef4444', color: '#ef4444', background: 'transparent' }} onClick={() => window.location.reload()}>REBOOT SYSTEM</button>
        </div>
      );
    }
    return this.props.children;
  }
}
