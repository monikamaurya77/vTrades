// src/app/api/auth/signup/route.js
import { NextResponse } from 'next/server';

// In a real app, you'd store users in a database.
// For mock, we'll simulate a successful creation.
const MOCK_REGISTERED_USERS = []; // Keep track of registered users for uniqueness

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();

    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate user already exists
    if (MOCK_REGISTERED_USERS.some((u) => u.email === email)) {
      return NextResponse.json(
        { message: 'User with this email already exists.' },
        { status: 409 }
      );
    }

    const newUser = {
      id: `user_${Date.now()}`, // Simple unique ID
      email,
      password, // In real app, hash this!
      name,
      token: `mock_jwt_token_for_${email}`,
    };

    MOCK_REGISTERED_USERS.push(newUser); // Add to mock store

    return NextResponse.json(
      {
        message: 'Account created successfully!',
        user: { id: newUser.id, email: newUser.email, name: newUser.name },
        token: newUser.token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred during signup.' },
      { status: 500 }
    );
  }
}