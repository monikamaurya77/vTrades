// src/components/SocialSignInButtons.js
'use client'; // This component runs on the client-side

import React from 'react';
import Image from 'next/image';
import { auth, googleProvider, microsoftProvider } from '../firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast'; // For notifications

const SocialSignInButtons = ({ onLoadingChange }) => {
  // const { login } = useAuth(); // Use the login function from AuthContext

  const handleSocialSignIn = async (provider, providerName) => {
    onLoadingChange(true);
    try {
      const result = await signInWithPopup(auth, provider);
      // This is where Firebase handles the actual auth.
      // You can send result.user.accessToken to your backend for verification if you had one.
      // For this mock, we just use the Firebase user info.
      console.log(`${providerName} Sign-In Success:`, result.user);
      login(
        {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || result.user.email,
          photoURL: result.user.photoURL,
        },
        await result.user.getIdToken() // Get Firebase ID token
      );
    } catch (error) {
      console.error(`${providerName} Sign-In Error:`, error);
      toast.error(`${providerName} Sign-in failed: ` + error.message);
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <>
      <button
        onClick={() => handleSocialSignIn(googleProvider, 'Google')}
        className="social-button"
      >
        <Image src="/assets/google_logo.png" alt="Google" width={24} height={24} />
        Sign in with Google
      </button>
      <button
        onClick={() => handleSocialSignIn(microsoftProvider, 'Microsoft')}
        className="social-button"
      >
        <Image src="/assets/microsoft_logo.png" alt="Microsoft" width={24} height={24} />
        Sign in with Microsoft
      </button>
    </>
  );
};

export default SocialSignInButtons;