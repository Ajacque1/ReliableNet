import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { validatePassword, sanitizeInput, userSchema } from '@/lib/security';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate and sanitize input
    const validatedData = userSchema.parse({
      ...body,
      email: body.email.toLowerCase(),
      name: sanitizeInput(body.name),
      password: body.password,
    });

    // Validate password
    const passwordValidation = validatePassword(validatedData.password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        email: validatedData.email,
        name: validatedData.name,
        password: hashedPassword,
        isModerator: false,
        notifications: {
          speedTestReminders: false,
          newReviews: false,
          ispUpdates: false,
        },
      },
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: 'User created successfully', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 