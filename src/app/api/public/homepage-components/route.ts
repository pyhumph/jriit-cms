import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/public/homepage-components - Get active homepage components for public website
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const order = searchParams.get('order') || 'asc'

    const where: any = {
      isActive: true
    }
    
    if (type) {
      where.type = type
    }

    const components = await prisma.homepageComponent.findMany({
      where,
      orderBy: { order: order as 'asc' | 'desc' },
      select: {
        id: true,
        name: true,
        type: true,
        title: true,
        subtitle: true,
        content: true,
        mediaType: true,
        mediaUrl: true,
        ctaText: true,
        ctaLink: true,
        cta2Text: true,
        cta2Link: true,
        cta3Text: true,
        cta3Link: true,
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
    console.error('Error fetching public homepage components:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch homepage components' },
      { status: 500 }
    )
  }
}


