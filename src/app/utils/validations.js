// src/utils/validations.js

export const validateEmail = (email) => {
  if (!email) return 'Email is required.';
  if (!/\S+@\S+\.\S+/.test(email)) return 'Email address is invalid.';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required.';
  if (password.length < 6) return 'Password must be at least 6 characters.';
  // Add more complex regex for strength if needed
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Confirm password is required.';
  if (password !== confirmPassword) return 'Passwords do not match.';
  return null;
};

export const validateOTP = (otp) => {
  if (!otp) return 'OTP is required.';
  if (otp.length !== 6 || !/^\d+$/.test(otp)) return 'OTP must be a 6-digit number.';
  return null;
};