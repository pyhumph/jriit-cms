import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET /api/hero-slides - Get all hero slides
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')
    const order = searchParams.get('order') || 'asc'

    const where: any = {}
    if (isActive !== null) where.isActive = isActive === 'true'

    const slides = await prisma.heroSlide.findMany({
      where,
      orderBy: { order: order as 'asc' | 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      slides,
      total: slides.length
    })
  } catch (error) {
    console.error('Error fetching hero slides:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hero slides' },
      { status: 500 }
    )
  }
}

// POST /api/hero-slides - Create new hero slide
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      subtitle,
      description,
      mediaType = 'image',
      mediaUrl,
      ctaText,
      ctaLink,
      isActive = true,
      order = 0
    } = body

    // Validate required fields
    if (!title || !subtitle || !mediaUrl) {
      return NextResponse.json(
        { error: 'Title, subtitle, and media URL are required' },
        { status: 400 }
      )
    }

    const slide = await prisma.heroSlide.create({
      data: {
        title,
        subtitle,
        description,
        mediaType,
        mediaUrl,
        ctaText,
        ctaLink,
        isActive,
        order,
        authorId: session.user.id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      slide
    })
  } catch (error) {
    console.error('Error creating hero slide:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create hero slide' },
      { status: 500 }
    )
  }
}

