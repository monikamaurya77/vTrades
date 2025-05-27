// src/app/(auth)/layout.js
import AuthLayout from '../components/AuthLayout';

export default function AuthPagesLayout({ children }) {
  return <AuthLayout>{children}</AuthLayout>;
}