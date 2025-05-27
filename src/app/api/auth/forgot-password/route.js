// src/app/api/auth/forgot-password/route.js
import { NextResponse } from 'next/server';

// Simulate a database of users and their associated OTPs
const OTP_STORE = new Map(); // Map: email -> { otp, expiresAt }

export async function POST(req) {
  try {
    const { email } = await req.json();

    await new Promise((resolve) => setTimeout(resolve, 800));

    // In a real app, check if email exists in your user database
    // For mock, we'll always generate an OTP for any email.
    if (!email) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes

    OTP_STORE.set(email, { otp, expiresAt });
    console.log(`MOCK: OTP for ${email}: ${otp}`); // Log OTP to console for testing

    return NextResponse.json(
      {
        message: 'Password reset link sent to your email. Please check your inbox.',
        // In a real app, don't send OTP back to client directly
        // For mock, it's helpful for testing
        mockOtp: otp,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password API error:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}