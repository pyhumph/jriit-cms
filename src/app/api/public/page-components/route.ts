import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/public/page-components - Get active page components for public website
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageName = searchParams.get('pageName')
    const componentName = searchParams.get('componentName')
    const order = searchParams.get('order') || 'asc'

    const where: any = {
      isActive: true,
      deletedAt: null  // Exclude soft-deleted items
    }
    
    if (pageName) {
      where.pageName = pageName
    }
    
    if (componentName) {
      where.componentName = componentName
    }

    const components = await prisma.pageComponent.findMany({
      where,
      orderBy: { order: order as 'asc' | 'desc' },
      select: {
        id: true,
        pageName: true,
        componentName: true,
        title: true,
        subtitle: true,
        content: true,
        mediaType: true,
        mediaUrl: true,
        ctaText: true,
        ctaLink: true,
        order: true,
        settings: true
      }
    })

    return NextResponse.json({
      success: true,
      components,
      total: components.length
    })
  } catch (error) {
    console.error('Error fetching public page components:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch page components' },
      { status: 500 }
    )
  }
}


