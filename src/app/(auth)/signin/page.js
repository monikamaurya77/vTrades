// src/app/(auth)/signin/page.js
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import api from '../../utils/api';
import { validateEmail, validatePassword } from '../../utils/validations';
import { useAuth } from '../../hooks/useAuth';
import SocialSignInButtons from '../../components/SocialSignInButtons';
import toast from 'react-hot-toast';

const SignInPage = () => {
  // const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError('');
    setEmailError('');
    setPasswordError('');

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (emailValidation) {
      setEmailError(emailValidation);
    }
    if (passwordValidation) {
      setPasswordError(passwordValidation);
    }

    if (emailValidation || passwordValidation) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.user, response.data.token);
      // login context will handle redirection and toast
    } catch (error) {
      console.error('Login failed:', error);
      setGeneralError(error.message || 'Login failed. Please check your credentials.');
      toast.error(error.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-2 text-text">Sign In</h2>
      <p className="text-sm text-gray-400 mb-6">
        Sign in to your account to continue.
      </p>

      <form onSubmit={handleSignIn}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
          disabled={loading}
        />
        {emailError && <p className="error-message">{emailError}</p>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
          disabled={loading}
        />
        {passwordError && <p className="error-message">{passwordError}</p>}

        <div className="flex justify-end mb-6">
          <Link href="/forgot-password" className="link-text text-sm">
            Forgot Password?
          </Link>
        </div>

        {generalError && <p className="error-message text-center mb-4">{generalError}</p>}

        <button type="submit" className="primary-button mb-6" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center text-gray-400 mb-6">
        <span className="relative inline-block w-full">
          <span className="absolute left-0 top-1/2 w-5/12 h-px bg-gray-600 transform -translate-y-1/2"></span>
          <span className="px-2 bg-card z-10">OR</span>
          <span className="absolute right-0 top-1/2 w-5/12 h-px bg-gray-600 transform -translate-y-1/2"></span>
        </span>
      </div>

      <SocialSignInButtons onLoadingChange={setLoading} />

      <p className="text-center text-gray-400 mt-6 text-sm">
        Don't have an account?{' '}
        <Link href="/signup" className="link-text">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default SignInPage;