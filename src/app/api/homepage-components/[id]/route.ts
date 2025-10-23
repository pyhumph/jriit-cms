import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET /api/homepage-components/[id] - Get specific homepage component
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const component = await prisma.homepageComponent.findUnique({
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

    if (!component) {
      return NextResponse.json(
        { error: 'Homepage component not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      component
    })
  } catch (error) {
    console.error('Error fetching homepage component:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch homepage component' },
      { status: 500 }
    )
  }
}

// PUT /api/homepage-components/[id] - Update homepage component
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
      name,
      type,
      title,
      subtitle,
      content,
      mediaType,
      mediaUrl,
      ctaText,
      ctaLink,
      isActive,
      order,
      settings
    } = body

    // Check if component exists
    const existingComponent = await prisma.homepageComponent.findUnique({
      where: { id: params.id }
    })

    if (!existingComponent) {
      return NextResponse.json(
        { error: 'Homepage component not found' },
        { status: 404 }
      )
    }

    const component = await prisma.homepageComponent.update({
      where: { id: params.id },
      data: {
        name,
        type,
        title,
        subtitle,
        content,
        mediaType,
        mediaUrl,
        ctaText,
        ctaLink,
        isActive,
        order,
        settings: settings ? JSON.stringify(settings) : null
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
      component
    })
  } catch (error) {
    console.error('Error updating homepage component:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update homepage component' },
      { status: 500 }
    )
  }
}

// DELETE /api/homepage-components/[id] - Delete homepage component
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if component exists
    const existingComponent = await prisma.homepageComponent.findUnique({
      where: { id: params.id }
    })

    if (!existingComponent) {
      return NextResponse.json(
        { error: 'Homepage component not found' },
        { status: 404 }
      )
    }

    await prisma.homepageComponent.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Homepage component deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting homepage component:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete homepage component' },
      { status: 500 }
    )
  }
}

