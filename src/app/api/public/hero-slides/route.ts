import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/public/hero-slides - Get active hero slides for public website
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const order = searchParams.get('order') || 'asc'

    const slides = await prisma.heroSlide.findMany({
      where: {
        isActive: true,
        deletedAt: null  // Exclude soft-deleted items
      },
      orderBy: { order: order as 'asc' | 'desc' },
      select: {
        id: true,
        title: true,
        subtitle: true,
        description: true,
        mediaType: true,
        mediaUrl: true,
        ctaText: true,
        ctaLink: true,
        order: true
      }
    })

    return NextResponse.json({
      success: true,
      slides,
      total: slides.length
    })
  } catch (error) {
    console.error('Error fetching public hero slides:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hero slides' },
      { status: 500 }
    )
  }
}



