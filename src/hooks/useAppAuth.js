// Archivo: frontend/src/hooks/useAppAuth.js
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";

const provider = new GoogleAuthProvider();

export const useAppAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Auth Fail:", error);
      setIsLoggingIn(false);
    }
  };

  return { user, setUser, loading, isLoggingIn, setIsLoggingIn, handleLogin };
};
