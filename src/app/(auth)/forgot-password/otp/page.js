// src/app/(auth)/forgot-password/otp/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import OTPInput from '../../../components/OTPInput';
import api from '../../../utils/api';
import { validateOTP } from '../../../utils/validations';
import toast from 'react-hot-toast';

const ForgotPasswordOTPPage = () => {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState(''); // Email retrieved from localStorage
  const [otpError, setOtpError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60); // 60 seconds for resend

  useEffect(() => {
    const storedEmail = localStorage.getItem('forgotPasswordEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If no email in storage, redirect back to forgot password page
      toast.error('Please enter your email first.');
      router.replace('/forgot-password');
    }

    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer, router]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError('');
    setOtpError('');

    const validation = validateOTP(otp);
    if (validation) {
      setOtpError(validation);
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/api/verify-otp', { email, otp });
      toast.success(response.data.message);
      // OTP verified successfully, redirect to new password page
      router.push('/forgot-password/new-password');
    } catch (error) {
      console.error('OTP verification failed:', error);
      setGeneralError(error.message || 'OTP verification failed. Please try again.');
      toast.error(error.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setGeneralError('');
    try {
      const response = await api.post('/auth/forgot-password', { email });
      toast.success('New OTP sent! (MOCK OTP: ' + response.data.mockOtp + ')');
      setResendTimer(60); // Reset timer
    } catch (error) {
      console.error('Resend OTP failed:', error);
      setGeneralError(error.message || 'Failed to resend OTP.');
      toast.error(error.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-2 text-text">Enter OTP</h2>
      <p className="text-sm text-gray-400 mb-6">
        Enter the OTP we have sent to your email address:
        <br />
        <span className="font-bold">{email}</span>{' '}
        <Link href="/forgot-password" className="link-text text-sm">
          Change Email Address
        </Link>
      </p>

      <form onSubmit={handleVerifyOTP}>
        <OTPInput otp={otp} setOtp={setOtp} />
        {otpError && <p className="error-message text-center mb-4">{otpError}</p>}

        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={handleResendOTP}
            className="link-text text-sm !w-auto"
            disabled={resendTimer > 0 || loading}
          >
            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
          </button>
        </div>

        {generalError && <p className="error-message text-center mb-4">{generalError}</p>}

        <button type="submit" className="primary-button mb-6" disabled={loading}>
          {loading ? 'Verifying...' : 'Continue'}
        </button>
      </form>

      <p className="text-center text-gray-400 mt-6 text-sm">
        Remember your password?{' '}
        <Link href="/signin" className="link-text">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordOTPPage;