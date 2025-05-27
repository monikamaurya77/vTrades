// src/context/AuthContext.js
'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebaseConfig'; // Ensure this path is correct
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import toast from 'react-hot-toast';

// 1. Define AuthContext
const AuthContext = createContext(null);

// 2. EXPORT AuthContext so it can be imported by useAuth.js
export { AuthContext }; // <-- ADD THIS LINE!

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        };
        setUser(userData);
        const idToken = await firebaseUser.getIdToken();
        setToken(idToken);
        localStorage.setItem('userToken', idToken);
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('userToken');
      }
      setLoading(false);
    });

    if (!user) {
        const storedMockToken = localStorage.getItem('userToken');
        if (storedMockToken) {
            setToken(storedMockToken);
            setUser({ uid: 'mock_user_id', email: 'mock@example.com', displayName: 'Mock User' });
        }
    }
    setLoading(false); // Ensure loading is false even if no token is found

    return () => unsubscribe();
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('userToken', userToken);
    toast.success('Login successful!');
    router.push('/dashboard');
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setToken(null);
      localStorage.removeItem('userToken');
      toast.success('Logged out successfully.');
      router.push('/signin');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed: ' + error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Keep useAuth as a named export as well
export const useAuth = () => {
  const context = useContext(AuthContext);
  // Add a more robust check for context being null, helpful for debugging
  if (context === null) {
    // throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};