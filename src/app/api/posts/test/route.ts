import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

// Test endpoint to verify authentication
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        message: 'Please login first' 
      }, { status: 401 })
    }

    return NextResponse.json({
      message: 'Authentication successful',
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      }
    })
  } catch (error) {
    console.error('Auth test error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}






