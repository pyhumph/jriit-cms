import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET /api/hero-slides/[id] - Get specific hero slide
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const slide = await prisma.heroSlide.findUnique({
      where: { id: params.id },
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

    if (!slide) {
      return NextResponse.json(
        { error: 'Hero slide not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      slide
    })
  } catch (error) {
    console.error('Error fetching hero slide:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hero slide' },
      { status: 500 }
    )
  }
}

// PUT /api/hero-slides/[id] - Update hero slide
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      mediaType,
      mediaUrl,
      ctaText,
      ctaLink,
      isActive,
      order
    } = body

    // Check if slide exists
    const existingSlide = await prisma.heroSlide.findUnique({
      where: { id: params.id }
    })

    if (!existingSlide) {
      return NextResponse.json(
        { error: 'Hero slide not found' },
        { status: 404 }
      )
    }

    const slide = await prisma.heroSlide.update({
      where: { id: params.id },
      data: {
        title,
        subtitle,
        description,
        mediaType,
        mediaUrl,
        ctaText,
        ctaLink,
        isActive,
        order
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
    console.error('Error updating hero slide:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update hero slide' },
      { status: 500 }
    )
  }
}

// DELETE /api/hero-slides/[id] - Delete hero slide
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if slide exists
    const existingSlide = await prisma.heroSlide.findUnique({
      where: { id: params.id }
    })

    if (!existingSlide) {
      return NextResponse.json(
        { error: 'Hero slide not found' },
        { status: 404 }
      )
    }

    await prisma.heroSlide.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Hero slide deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting hero slide:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete hero slide' },
      { status: 500 }
    )
  }
}



