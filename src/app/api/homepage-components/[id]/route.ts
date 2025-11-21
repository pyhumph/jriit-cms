import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const serializeSettings = (value: unknown) => {
  if (value === null || value === undefined) return null
  if (typeof value === 'string') return value
  try {
    return JSON.stringify(value)
  } catch (error) {
    console.warn('Failed to serialise homepage component settings.', error)
    return JSON.stringify(String(value))
  }
}

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
      cta2Text,
      cta2Link,
      cta3Text,
      cta3Link,
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

    const updateData: Record<string, unknown> = {}

    if (name !== undefined) updateData.name = name
    if (type !== undefined) updateData.type = type
    if (title !== undefined) updateData.title = title
    if (subtitle !== undefined) updateData.subtitle = subtitle
    if (content !== undefined) updateData.content = content
    if (mediaType !== undefined) updateData.mediaType = mediaType
    if (mediaUrl !== undefined) updateData.mediaUrl = mediaUrl
    if (ctaText !== undefined) updateData.ctaText = ctaText
    if (ctaLink !== undefined) updateData.ctaLink = ctaLink
    if (cta2Text !== undefined) updateData.cta2Text = cta2Text
    if (cta2Link !== undefined) updateData.cta2Link = cta2Link
    if (cta3Text !== undefined) updateData.cta3Text = cta3Text
    if (cta3Link !== undefined) updateData.cta3Link = cta3Link
    if (isActive !== undefined) updateData.isActive = isActive
    if (order !== undefined) updateData.order = order
    if (settings !== undefined) updateData.settings = serializeSettings(settings)

    console.log('API: Updating homepage component', params.id, updateData)

    const component = await prisma.homepageComponent.update({
      where: { id: params.id },
      data: updateData,
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
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update homepage component'
      },
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

    // Soft delete: mark as deleted instead of actually deleting
    await prisma.homepageComponent.update({
      where: { id: params.id },
      data: {
        deletedAt: new Date(),
        deletedBy: session.user.id
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Homepage component moved to Recycle Bin'
    })
  } catch (error) {
    console.error('Error deleting homepage component:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete homepage component' },
      { status: 500 }
    )
  }
}



