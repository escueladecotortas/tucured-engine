// Archivo: frontend/src/App.jsx
import React from 'react';
import { useAppLogic } from './hooks/useAppLogic';
import { useAppAuth } from './hooks/useAppAuth';
import { LoadingScreen, LoginScreen } from './components/app/AppAuthScreens';
import { AppMobileDashboard } from './components/app/AppMobileDashboard';
import { AppDesktopRouter } from './components/app/AppDesktopRouter';
import CommandPalette from './components/CommandPalette';

/**
 * NEXUS-OS ORCHESTRATOR - v3.0 PHOENIX
 * Orquestador principal de la aplicación.
 */
function App() {
  const {
    route, isMobileMode, setIsMobileMode,
    showCommandPalette, setShowCommandPalette,
    windowWidth, transcript, startListening
  } = useAppLogic();

  const { user, loading, isLoggingIn, handleLogin } = useAppAuth();

  const debugProps = { user, route, width: windowWidth, loading, isMobileMode, transcript };

  // --- ESCENARIOS DE RENDERIZADO ---
  
  if (loading) return <LoadingScreen debugProps={debugProps} />;

  if (!user) return <LoginScreen onLogin={handleLogin} isLoggingIn={isLoggingIn} debugProps={debugProps} />;

  if (isMobileMode) {
    return (
      <AppMobileDashboard 
        user={user} 
        route={route} 
        setIsMobileMode={setIsMobileMode} 
        startListening={startListening}
        debugProps={debugProps}
      />
    );
  }

  return (
    <>
      <AppDesktopRouter 
        route={route} 
        user={user} 
        transcript={transcript} 
        debugProps={debugProps} 
      />

      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onExecute={(cmd) => {
          if (cmd.type === 'nav' && cmd.id === 'open-vault') {
            window.location.hash = '#/project/system?tab=vault';
          }
          setShowCommandPalette(false);
        }}
      />
    </>
  );
}

export default App;
