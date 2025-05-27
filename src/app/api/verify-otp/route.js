// src/app/api/verify-otp/route.js
import { NextResponse } from 'next/server';

// This relies on the same OTP_STORE from forgot-password/route.js
// In a real setup, OTP validation would be a backend service.
const OTP_STORE = new Map(); // Re-declare or import if necessary for standalone API route

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    await new Promise((resolve) => setTimeout(resolve, 600));

    const storedOtpData = OTP_STORE.get(email);

    if (!storedOtpData) {
      return NextResponse.json({ message: 'No OTP found for this email. Please request a new one.' }, { status: 400 });
    }

    if (storedOtpData.expiresAt < Date.now()) {
      OTP_STORE.delete(email); // OTP expired
      return NextResponse.json({ message: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    if (storedOtpData.otp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP. Please try again.' }, { status: 401 });
    }

    // OTP is valid. Clear it after successful verification.
    OTP_STORE.delete(email);

    return NextResponse.json({ message: 'OTP verified successfully!', email }, { status: 200 });
  } catch (error) {
    console.error('OTP verification API error:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred during OTP verification.' },
      { status: 500 }
    );
  }
}