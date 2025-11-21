import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function requireAuth() {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  return session
}

export async function requireRole(requiredRole: string) {
  const session = await requireAuth()
  
  if (session instanceof NextResponse) {
    return session
  }
  
  if (session.user.role !== requiredRole && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  return session
}




















