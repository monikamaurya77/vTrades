// src/app/api/auth/login/route.js
import { NextResponse } from 'next/server';

const MOCK_USERS = [
  {
    id: 'user123',
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    token: 'mock_jwt_token_for_test_user',
  },
  {
    id: 'user456',
    email: 'john@example.com',
    password: 'securepassword',
    name: 'John Doe',
    token: 'mock_jwt_token_for_john_doe',
  },
];

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      return NextResponse.json(
        {
          message: 'Login successful',
          user: { id: user.id, email: user.email, name: user.name },
          token: user.token,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred during login.' },
      { status: 500 }
    );
  }
}