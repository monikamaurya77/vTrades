// src/app/(auth)/signup/page.js
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import api from '../../utils/api';
import { validateEmail, validatePassword, validateConfirmPassword } from '../../utils/validations';
import { useAuth } from '../../hooks/useAuth';
import SocialSignInButtons from '../../components/SocialSignInButtons';
import toast from 'react-hot-toast';

const SignUpPage = () => {
  // const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError('');
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    let isValid = true;

    if (!name) {
      setNameError('Name is required.');
      isValid = false;
    }
    const emailValidation = validateEmail(email);
    if (emailValidation) {
      setEmailError(emailValidation);
      isValid = false;
    }
    const passwordValidation = validatePassword(password);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      isValid = false;
    }
    const confirmPasswordValidation = validateConfirmPassword(password, confirmPassword);
    if (confirmPasswordValidation) {
      setConfirmPasswordError(confirmPasswordValidation);
      isValid = false;
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/signup', { name, email, password });
      login(response.data.user, response.data.token);
      // login context will handle redirection and toast
    } catch (error) {
      console.error('Signup failed:', error);
      setGeneralError(error.message || 'Signup failed. Please try again.');
      toast.error(error.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-2 text-text">Sign Up</h2>
      <p className="text-sm text-gray-400 mb-6">
        Create your account to get started.
      </p>

      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => { setName(e.target.value); setNameError(''); }}
          disabled={loading}
        />
        {nameError && <p className="error-message">{nameError}</p>}

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

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => { setConfirmPassword(e.target.value); setConfirmPasswordError(''); }}
          disabled={loading}
        />
        {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}

        {generalError && <p className="error-message text-center mb-4">{generalError}</p>}

        <button type="submit" className="primary-button mb-6" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
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
        Already have an account?{' '}
        <Link href="/signin" className="link-text">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default SignUpPage;