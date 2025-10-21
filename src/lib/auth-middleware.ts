import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db'

export async function getAuthenticatedUser(req?: NextRequest) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return null
    }
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })
    
    return user
  } catch (error) {
    console.error('Error getting authenticated user:', error)
    return null
  }
}

export async function requireAuth(req?: NextRequest) {
  const user = await getAuthenticatedUser(req)
  
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  return user
}
