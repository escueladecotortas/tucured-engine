// Archivo: frontend/src/hooks/useAppLogic.js
import { useState, useEffect } from 'react';

export const useAppLogic = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
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
    const handleHashChange = () => {
        const h = window.location.hash || '#/';
        setRoute(h);
        if (h === '#/mobile') setIsMobileMode(true);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
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
    startListening
  };
};
