// src/app/(auth)/forgot-password/page.js
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import api from '../../utils/api';
import { validateEmail } from '../../utils/validations';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [mockOtpValue, setMockOtpValue] = useState(''); // To display mock OTP for testing

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError('');
    setEmailError('');

    const validation = validateEmail(email);
    if (validation) {
      setEmailError(validation);
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setModalMessage(response.data.message);
      setMockOtpValue(response.data.mockOtp); // Capture mock OTP
      setShowModal(true);
      toast.success(response.data.message);

      // Store email in local storage or context for OTP verification page
      localStorage.setItem('forgotPasswordEmail', email);

    } catch (error) {
      console.error('Forgot password failed:', error);
      setGeneralError(error.message || 'Failed to send reset link. Please try again.');
      toast.error(error.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setMockOtpValue('');
    router.push('/forgot-password/otp'); // Redirect to OTP page after modal close
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-2 text-text">Forgot Your Password?</h2>
      <p className="text-sm text-gray-400 mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
          disabled={loading}
        />
        {emailError && <p className="error-message">{emailError}</p>}

        {generalError && <p className="error-message text-center mb-4">{generalError}</p>}

        <button type="submit" className="primary-button mb-6" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      <p className="text-center text-gray-400 mt-6 text-sm">
        Remember your password?{' '}
        <Link href="/signin" className="link-text">
          Sign In
        </Link>
      </p>

      <Modal
        show={showModal}
        onClose={handleModalClose}
        icon="/email-sent-icon.png" 
        title="Link Sent Successfully!"
        message={`${modalMessage} (MOCK OTP for testing: ${mockOtpValue})`}
      />
    </div>
  );
};

export default ForgotPasswordPage;