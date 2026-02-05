import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { isUsernameValid } from '@/lib/profanity-filter';

export async function POST(request: NextRequest) {
  try {
    const { username, firstName, lastName, email, password } = await request.json();

    // Validation
    if (!username || !firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Username, first name, last name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate username
    const usernameValidation = isUsernameValid(username);
    if (!usernameValidation.valid) {
      return NextResponse.json(
        { error: usernameValidation.error },
        { status: 400 }
      );
    }

    // Validate names
    if (firstName.trim().length < 2) {
      return NextResponse.json(
        { error: 'First name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    if (lastName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Last name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email,
        password: hashedPassword,
        isActive: false // Requires email confirmation
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
        createdAt: true
      }
    });

    // Generate email confirmation token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours
    await prisma.token.create({
      data: {
        type: 'EMAIL_CONFIRMATION',
        token,
        userId: user.id,
        expiresAt
      }
    });

    // Simulate sending email (log the confirmation link)
    const confirmUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/confirm?token=${token}`;
    console.log('Email confirmation link:', confirmUrl);

    return NextResponse.json(
      { 
        message: 'User registered successfully. Please check your email to confirm your account.',
        user 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 