import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' }
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin user already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@dbcoffeeclub.com',
        password: hashedPassword,
        isActive: true // Admin is automatically active
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true
      }
    });

    return NextResponse.json({
      message: 'Admin user created successfully',
      admin,
      credentials: {
        username: 'admin',
        password: 'admin123'
      }
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 