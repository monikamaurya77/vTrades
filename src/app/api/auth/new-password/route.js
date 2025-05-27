// src/app/api/auth/new-password/route.js
import { NextResponse } from 'next/server';

// This mock API simply simulates success. In a real app,
// you'd update the user's password in your database.
export async function POST(req) {
  try {
    const { email, newPassword } = await req.json();

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!email || !newPassword) {
      return NextResponse.json({ message: 'Email and new password are required.' }, { status: 400 });
    }

    // Simulate updating password for the given email
    console.log(`MOCK: Password for ${email} updated to ${newPassword}`);

    return NextResponse.json(
      { message: 'Your password has been successfully updated!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Set new password API error:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred while setting new password.' },
      { status: 500 }
    );
  }
}