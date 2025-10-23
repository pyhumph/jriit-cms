import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Test if we can import Prisma
    const { PrismaClient } = await import('@prisma/client')
    console.log('✅ PrismaClient imported successfully')
    
    // Test if we can create a client
    const prisma = new PrismaClient()
    console.log('✅ PrismaClient instance created')
    
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connected')
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Raw query successful:', result)
    
    await prisma.$disconnect()
    
    return NextResponse.json({ 
      success: true, 
      message: 'All tests passed',
      result: Array.isArray(result) ? result.map(r => ({ ...r, test: Number(r.test) })) : result
    })
    
  } catch (error) {
    console.error('Simple test failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Test failed',
      details: error.message,
      stack: error.stack
    })
  }
}
