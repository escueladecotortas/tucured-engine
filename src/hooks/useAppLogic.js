// Archivo: src/hooks/useAppLogic.js
import { useState, useEffect } from 'react';

/**
 * getCleanRoute - Normaliza rutas limpias HTML5 y convierte hashes legados
 */
export const getCleanRoute = () => {
  if (typeof window === 'undefined') return '/';
  const hash = window.location.hash;
  if (hash && hash.startsWith('#/')) {
    const clean = hash.replace(/^#/, '');
    window.history.replaceState({}, '', clean);
    return clean;
  }
  const path = window.location.pathname;
  const search = window.location.search;
  return (path === '' || path === '/') ? '/' : `${path}${search}`;
};

/**
 * navigate - Despachador de navegación SPA limpia sin recarga
 */
export const navigate = (path) => {
  if (typeof window === 'undefined') return;
  const target = path.startsWith('#/') ? path.replace(/^#/, '') : path;
  window.history.pushState({}, '', target);
  window.dispatchEvent(new Event('nexus-navigate'));
};

export const useAppLogic = () => {
  const [route, setRoute] = useState(getCleanRoute);
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      const current = getCleanRoute();
      setRoute(current);
      if (current.startsWith('/mobile')) setIsMobileMode(true);
    };
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('nexus-navigate', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('nexus-navigate', handleRouteChange);
    };
  }, []);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice not supported on this device.");
      setTranscript('NOT SUPPORTED');
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'es-ES';
    recognition.onstart = () => { setIsListening(true); setTranscript('LISTENING...'); };
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setTimeout(() => setTranscript('PROCESSED: ' + text), 1000);
    };
    recognition.onerror = (event) => { setIsListening(false); setTranscript('ERROR: ' + event.error); };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return {
    route, setRoute,
    isMobileMode, setIsMobileMode,
    showCommandPalette, setShowCommandPalette,
    windowWidth,
    isListening, transcript, setTranscript,
    startListening,
    navigate
  };
};
