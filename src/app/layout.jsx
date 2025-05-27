// src/app/layout.js
import '../app/styles/globals.css'; // Adjust path if 'styles' folder is NOT directly in 'src' folder
import { AuthProvider } from '../app/context/AuthContext'; // Adjust path if 'context' folder is NOT directly in 'src' folder
import { Toaster } from 'react-hot-toast'; // Ensure react-hot-toast is installed: npm install react-hot-toast

export const metadata = {
  title: 'vTrades Frontend Task - Workhive',
  description: 'Authentication pages for Workhive',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* AuthProvider MUST wrap the children to make the context available */}
        <AuthProvider>
          {children}
          <Toaster position="top-right" reverseOrder={false} />
        </AuthProvider>
      </body>
    </html>
  );
}