// Archivo: src/components/app/AppDesktopRouter.jsx
import React from 'react';
import { DebugOverlay, ErrorBoundary } from './AppDebug';

const NexusConsole = React.lazy(() => import('../NexusConsole'));
const TucuRedLanding = React.lazy(() => import('../TucuRedLanding'));
const CinematicEntry = React.lazy(() => import('../CinematicEntry'));
const VisualEditorLayout = React.lazy(() => import('../VisualEditor/VisualEditorLayout'));

export const AppDesktopRouter = ({ route, user, transcript, debugProps }) => {
  // Normalizar ruta (limpiar hash si existe para soporte dual)
  const normalizedRoute = route.startsWith('#/') ? route.replace(/^#/, '') : route;
  
  const isProjectView = normalizedRoute.startsWith('/project/');
  let projectId = 'tucu-red';
  let queryParams = {};

  if (isProjectView) {
    const fullPath = normalizedRoute.split('/project/')[1] || '';
    const [id, query] = fullPath.split('?');
    projectId = id || 'tucu-red';
    if (query) {
      new URLSearchParams(query).forEach((value, key) => {
        queryParams[key] = value;
      });
    }
  } else if (normalizedRoute.includes('?')) {
    const [, query] = normalizedRoute.split('?');
    if (query) {
      new URLSearchParams(query).forEach((value, key) => {
        queryParams[key] = value;
      });
    }
  }

  return (
    <div className="absolute inset-0 font-sans bg-black">
      <DebugOverlay {...debugProps} />

      {normalizedRoute.startsWith('/visual-editor') ? (
        <React.Suspense fallback={<div className="flex h-screen items-center justify-center text-white font-mono text-xs">Cargando Editor Visual...</div>}>
          <VisualEditorLayout />
        </React.Suspense>
      ) : normalizedRoute === '/tucu-red-public' ? (
        <React.Suspense fallback={<div className="flex h-screen items-center justify-center text-white font-mono text-xs">Cargando Landing Pública...</div>}>
          <TucuRedLanding />
        </React.Suspense>
      ) : (normalizedRoute === '/' || normalizedRoute === '' || normalizedRoute.startsWith('/?start=lobby')) ? (
        <React.Suspense fallback={<div className="bg-black text-white h-screen flex items-center justify-center font-mono text-xs">INICIANDO CINEMATIC LOBBY...</div>}>
           <CinematicEntry />
        </React.Suspense>
      ) : (
        <ErrorBoundary>
          <React.Suspense fallback={<div className="flex h-screen items-center justify-center text-white text-xs font-mono tracking-widest animate-pulse">INITIATING CONSOLE...</div>}>
            <NexusConsole
              key={normalizedRoute}
              projectId={projectId}
              initialTab={queryParams.tab}
              initialAgent={queryParams.agent}
              userOverride={user} 
              mobileTranscript={transcript}
            />
          </React.Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
};
