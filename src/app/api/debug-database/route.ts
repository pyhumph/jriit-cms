import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Debug API to check what's actually in the database
export async function GET(request: NextRequest) {
  try {
    // Get all homepage components from database
    const components = await prisma.homepageComponent.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        type: true,
        title: true,
        subtitle: true,
        content: true,
        ctaText: true,
        ctaLink: true,
        cta2Text: true,
        cta2Link: true,
        cta3Text: true,
        cta3Link: true,
        isActive: true,
        order: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Database contents retrieved',
      totalComponents: components.length,
      components: components,
      databaseStatus: 'Connected and working'
    })

  } catch (error) {
    console.error('Error checking database:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check database',
        details: error.message,
        databaseStatus: 'Error connecting to database'
      },
      { status: 500 }
    )
  }
}
