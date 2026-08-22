// Archivo: src/context/AuthContext.js
// v11.93-GOLD — Clean Atomic Subscription (signInWithPopup optimization)
'use client';
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { onAuthChange } from '@/lib/firebase/auth';
import { useMounted } from '@/lib/hooks/useMounted';

const AuthContext = createContext({
  user: null,
  loading: true,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const mounted = useMounted();
  const resolvedRef = useRef(false);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (!mounted) return;

    console.log('[AUTH] Initializing onAuthChange subscriber...');

    const unsubscribe = onAuthChange((firebaseUser) => {
      resolvedRef.current = true;
      console.log('[AUTH] STATE_CHANGED:', firebaseUser ? `user=${firebaseUser.email}` : 'null');
      setUser(firebaseUser);
      setLoading(false);
    });

    // Fail-safe 6s
    const timeout = setTimeout(() => {
      if (!resolvedRef.current) {
        console.warn('[AUTH] Timeout 6s: Firebase no respondió. Forzando render.');
        setLoading(false);
      }
    }, 6000);

    cleanupRef.current = () => {
      unsubscribe();
      clearTimeout(timeout);
    };

    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
