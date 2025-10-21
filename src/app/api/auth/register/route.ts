import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password are required' 
      }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ 
        error: 'Password must be at least 6 characters' 
      }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ 
        error: 'User already exists with this email' 
      }, { status: 409 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || null,
        plan: 'free' // Start with free plan
      }
    })

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user

    return NextResponse.json({ 
      success: true,
      user: userWithoutPassword 
    })

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ 
      error: 'Failed to create user',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

