import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateToken } from '@/lib/auth'

/**
 * V.112: Guest login — بيستخدم نفس الـ guest user دايماً (مش بيعمل جديد كل مرة)
 * ده بيحل مشكلة "طلب login تاني بعد كل rebuild"
 */

const GUEST_EMAIL = 'guest@anzaro.ai';

export async function POST() {
  try {
    // V.112: ابحث عن الـ guest user الموجود، لو مش موجود اعمله
    let user = await db.user.findUnique({ where: { email: GUEST_EMAIL } });

    if (!user) {
      user = await db.user.create({
        data: {
          email: GUEST_EMAIL,
          name: 'زائر',
          password: null,
          isVerified: true,
          role: 'user',
        },
      });
      console.log('[Guest Auth] Created persistent guest user:', user.id);
    } else {
      console.log('[Guest Auth] Reusing existing guest user:', user.id);
    }

    // Create session
    const token = generateToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 365) // V.112: 365 days instead of 7

    await db.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    })

    const response = NextResponse.json({ user, token })

    // Set session cookie
    response.cookies.set('anzaro_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 365 * 24 * 60 * 60, // V.112: 365 days
    })

    return response
  } catch (e) {
    console.error('[Guest Auth] Error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
