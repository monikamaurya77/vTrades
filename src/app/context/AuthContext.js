// src/context/AuthContext.js
'use client'; // This directive is crucial for client-side functionality

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebaseConfig'; // Adjust this path if firebaseConfig.js is NOT directly in 'src' folder
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import toast from 'react-hot-toast';

// Initialize the AuthContext
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Firebase Auth State Listener (for real auth)
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user data and token from Firebase
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        };
        setUser(userData);

        const idToken = await firebaseUser.getIdToken();
        setToken(idToken);
        localStorage.setItem('userToken', idToken); // Store token (e.g., for persistent login)
      } else {
        // No user logged in
        setUser(null);
        setToken(null);
        localStorage.removeItem('userToken');
      }
      setLoading(false); // Set loading to false once auth state is determined
    });

    // Handle mock token for scenarios where Firebase might not be fully set up yet
    // or for direct mock API logins
    if (!user) { // Only attempt to set mock user if Firebase didn't provide one
        const storedMockToken = localStorage.getItem('userToken');
        if (storedMockToken) {
            setToken(storedMockToken);
            // For mock, assume a basic user if token is present
            setUser({ uid: 'mock_user_id', email: 'mock@example.com', displayName: 'Mock User' });
        }
    }
    setLoading(false); // Ensure loading is false even if no token is found

    return () => unsubscribe(); // Clean up the listener
  }, []); // Empty dependency array means this runs once on mount

  // Authentication function for manual login
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('userToken', userToken);
    toast.success('Login successful!');
    router.push('/dashboard'); // Redirect to dashboard
  };

  // Logout function
  const logout = async () => {
    try {
      await firebaseSignOut(auth); // Sign out from Firebase
      setUser(null);
      setToken(null);
      localStorage.removeItem('userToken');
      toast.success('Logged out successfully.');
      router.push('/signin'); // Redirect to signin page
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed: ' + error.message);
    }
  };

  // Provide the context values to children components
  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) { // More robust check for context being null
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};