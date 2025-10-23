import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Create a fresh Prisma client for this API
const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...')
    
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connected')
    
    // Test if pageComponent table exists
    try {
      const components = await prisma.pageComponent.findMany({ take: 1 })
      console.log('✅ pageComponent table accessible')
    } catch (error) {
      console.log('❌ pageComponent error:', error.message)
      return NextResponse.json({ 
        success: false, 
        error: 'pageComponent table not accessible',
        details: error.message 
      })
    }
    
    // Test if websitePage table exists
    try {
      const pages = await prisma.websitePage.findMany({ take: 1 })
      console.log('✅ websitePage table accessible')
    } catch (error) {
      console.log('❌ websitePage error:', error.message)
      return NextResponse.json({ 
        success: false, 
        error: 'websitePage table not accessible',
        details: error.message 
      })
    }
    
    const pageComponentsCount = await prisma.pageComponent.count()
    const websitePagesCount = await prisma.websitePage.count()
    
    await prisma.$disconnect()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      pageComponents: pageComponentsCount,
      websitePages: websitePagesCount
    })
    
  } catch (error) {
    console.error('Database test failed:', error)
    await prisma.$disconnect()
    return NextResponse.json({ 
      success: false, 
      error: 'Database connection failed',
      details: error.message 
    })
  }
}
