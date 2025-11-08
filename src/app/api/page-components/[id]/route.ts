import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET /api/page-components/[id] - Get specific page component
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const component = await prisma.pageComponent.findUnique({
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
        { error: 'Page component not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      component
    })
  } catch (error) {
    console.error('Error fetching page component:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch page component' },
      { status: 500 }
    )
  }
}

// PUT /api/page-components/[id] - Update page component
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
      pageName,
      componentName,
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
    const existingComponent = await prisma.pageComponent.findUnique({
      where: { id: params.id }
    })

    if (!existingComponent) {
      return NextResponse.json(
        { error: 'Page component not found' },
        { status: 404 }
      )
    }

    const component = await prisma.pageComponent.update({
      where: { id: params.id },
      data: {
        pageName,
        componentName,
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
    console.error('Error updating page component:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update page component' },
      { status: 500 }
    )
  }
}

// DELETE /api/page-components/[id] - Delete page component
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
    const existingComponent = await prisma.pageComponent.findUnique({
      where: { id: params.id }
    })

    if (!existingComponent) {
      return NextResponse.json(
        { error: 'Page component not found' },
        { status: 404 }
      )
    }

    await prisma.pageComponent.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Page component deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting page component:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete page component' },
      { status: 500 }
    )
  }
}


