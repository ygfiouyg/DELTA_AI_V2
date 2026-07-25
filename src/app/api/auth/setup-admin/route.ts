import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

/**
 * POST /api/auth/setup-admin
 * 
 * V.66: One-time admin setup endpoint.
 * Creates an admin user if none exists.
 * 
 * Body: { email: string, password: string, name?: string }
 * 
 * Security: Only works if NO admin users exist yet (one-time setup).
 */
export async function POST(request: NextRequest) {
  try {
    // Check if any admin user already exists
    const existingAdmin = await db.user.findFirst({
      where: { role: 'admin' },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: 'Admin user already exists. Use login instead.' },
        { status: 409 }
      );
    }

    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const trimmedEmail = String(email).trim().toLowerCase();

    // Check if user with this email already exists (non-admin)
    const existingUser = await db.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (existingUser) {
      // Upgrade existing user to admin
      const hashedPassword = await hashPassword(password);
      await db.user.update({
        where: { id: existingUser.id },
        data: {
          role: 'admin',
          password: hashedPassword,
          isActive: true,
          isVerified: true,
        },
      });
      console.log(`[SetupAdmin] Upgraded user ${trimmedEmail} to admin`);
      return NextResponse.json({
        success: true,
        message: 'Existing user upgraded to admin',
        email: trimmedEmail,
      });
    }

    // Create new admin user
    const hashedPassword = await hashPassword(password);
    const adminUser = await db.user.create({
      data: {
        email: trimmedEmail,
        name: name || 'Admin',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        isVerified: true,
        language: 'ar',
        dialect: 'egyptian',
      },
    });

    console.log(`[SetupAdmin] Created admin user: ${trimmedEmail}`);

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      email: trimmedEmail,
      userId: adminUser.id,
    });
  } catch (error) {
    console.error('[SetupAdmin] Error:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Setup failed' },
      { status: 500 }
    );
  }
}
