import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null); // 'admin', 'viewer', etc.
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in.
                setCurrentUser(user);

                // Fetch or Create User Profile in Firestore
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    setUserRole(userSnap.data().role || 'viewer');
                } else {
                    // First time login - Create basic profile

                    // Check for pending invite
                    let initialRole = 'viewer';
                    try {
                        const { collection, query, where, getDocs } = await import('firebase/firestore');
                        const q = query(collection(db, 'invites'), where('email', '==', user.email.toLowerCase()));
                        const inviteSnap = await getDocs(q);

                        if (!inviteSnap.empty) {
                            const inviteData = inviteSnap.docs[0].data();
                            if (inviteData.role) {
                                initialRole = inviteData.role;
                                console.log(`[Auth] Found invite for ${user.email}, assigning role: ${initialRole}`);
                            }
                        }
                    } catch (err) {
                        console.error("Error checking invites:", err);
                    }

                    await setDoc(userRef, {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        role: initialRole,
                        createdAt: serverTimestamp(),
                        lastLogin: serverTimestamp()
                    });
                    setUserRole(initialRole);
                }
            } else {
                // User is signed out.
                setCurrentUser(null);
                setUserRole(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Login Failed", error);
            throw error;
        }
    };

    const logout = () => {
        return signOut(auth);
    };

    const value = {
        currentUser,
        userRole,
        loginWithGoogle,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
