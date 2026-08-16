// Archivo: frontend/src/components/app/AppDesktopRouter.jsx
import React from 'react';
import { DebugOverlay, ErrorBoundary } from './AppDebug';

const NexusConsole = React.lazy(() => import('../NexusConsole'));
const TucuRedLanding = React.lazy(() => import('../TucuRedLanding'));
const CinematicEntry = React.lazy(() => import('../CinematicEntry'));
const VisualEditorLayout = React.lazy(() => import('../VisualEditor/VisualEditorLayout'));

export const AppDesktopRouter = ({ route, user, transcript, debugProps }) => {
  const isProjectView = route.startsWith('#/project/');
  let projectId = null;
  let queryParams = {};

  if (isProjectView) {
    const fullPath = route.split('/project/')[1];
    const [id, query] = fullPath.split('?');
    projectId = id;
    if (query) {
      new URLSearchParams(query).forEach((value, key) => {
        queryParams[key] = value;
      });
    }
  }

  return (
    <div className="absolute inset-0 font-sans bg-black">
      <DebugOverlay {...debugProps} />

      {route.startsWith('#/visual-editor') ? (
        <React.Suspense fallback={<div className="flex h-screen items-center justify-center text-white">Loading Visual Editor...</div>}>
          <VisualEditorLayout />
        </React.Suspense>
      ) : route === '#/tucu-red-public' ? (
        <React.Suspense fallback={<div className="flex h-screen items-center justify-center text-white">Loading Public Site...</div>}>
          <TucuRedLanding />
        </React.Suspense>
      ) : (route === '#/' || route === '') ? (
        <React.Suspense fallback={<div className="bg-black text-white h-screen flex items-center justify-center font-mono">LOADING CINEMATIC...</div>}>
           <CinematicEntry />
        </React.Suspense>
      ) : (
        <ErrorBoundary>
          <React.Suspense fallback={<div className="flex h-screen items-center justify-center text-white text-2xl animate-pulse">INITIATING CONSOLE...</div>}>
            <NexusConsole
              key={route}
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
