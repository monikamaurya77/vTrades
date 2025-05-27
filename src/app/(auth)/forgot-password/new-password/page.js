// src/app/(auth)/forgot-password/new-password/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../utils/api';
import { validatePassword, validateConfirmPassword } from '../../../utils/validations';
import Modal from '../../../components/Modal';
import toast from 'react-hot-toast';

const CreateNewPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState(''); // Email retrieved from localStorage
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('forgotPasswordEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If no email in storage, redirect back to forgot password page
      toast.error('Please start the password reset process from the beginning.');
      router.replace('/forgot-password');
    }
  }, [router]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError('');
    setNewPasswordError('');
    setConfirmNewPasswordError('');

    let isValid = true;
    const passwordValidation = validatePassword(newPassword);
    if (passwordValidation) {
      setNewPasswordError(passwordValidation);
      isValid = false;
    }
    const confirmPasswordValidation = validateConfirmPassword(newPassword, confirmNewPassword);
    if (confirmPasswordValidation) {
      setConfirmNewPasswordError(confirmPasswordValidation);
      isValid = false;
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/new-password', { email, newPassword });
      setShowModal(true);
      toast.success(response.data.message);
      localStorage.removeItem('forgotPasswordEmail'); // Clear email from storage
    } catch (error) {
      console.error('Update password failed:', error);
      setGeneralError(error.message || 'Failed to update password. Please try again.');
      toast.error(error.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    router.push('/signin'); // Redirect to sign-in page after password reset
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-2 text-text">Create New Password</h2>
      <p className="text-sm text-gray-400 mb-6">
        Please create a new password to keep your account safe.
      </p>

      <form onSubmit={handleUpdatePassword}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => { setNewPassword(e.target.value); setNewPasswordError(''); }}
          disabled={loading}
        />
        {newPasswordError && <p className="error-message">{newPasswordError}</p>}

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmNewPassword}
          onChange={(e) => { setConfirmNewPassword(e.target.value); setConfirmNewPasswordError(''); }}
          disabled={loading}
        />
        {confirmNewPasswordError && <p className="error-message">{confirmNewPasswordError}</p>}

        {generalError && <p className="error-message text-center mb-4">{generalError}</p>}

        <button type="submit" className="primary-button mb-6" disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      <Modal
        show={showModal}
        onClose={handleModalClose}
        icon="/password-reset-success-icon.png" 
        title="Password Created!"
        message="Your password has been successfully updated. You can now login with your new password."
      />
    </div>
  );
};

export default CreateNewPasswordPage;