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

// GET /api/homepage-components - Get all homepage components
export async function GET(request: NextRequest) {
  try {
    console.log('API: Fetching homepage components...')
    
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const isActive = searchParams.get('isActive')
    const order = searchParams.get('order') || 'asc'

    const where: any = {}
    if (type) where.type = type
    if (isActive !== null) where.isActive = isActive === 'true'

    console.log('API: Prisma client available:', !!prisma)
    console.log('API: HomepageComponent model available:', !!prisma.homepageComponent)

    const components = await prisma.homepageComponent.findMany({
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
      components,
      total: components.length
    })
  } catch (error) {
    console.error('Error fetching homepage components:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch homepage components' },
      { status: 500 }
    )
  }
}

// POST /api/homepage-components - Create new homepage component
export async function POST(request: NextRequest) {
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
      isActive = true,
      order = 0,
      settings
    } = body

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      )
    }

    const component = await prisma.homepageComponent.create({
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
        cta2Text,
        cta2Link,
        cta3Text,
        cta3Link,
        isActive,
        order,
        settings: serializeSettings(settings),
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
      component
    })
  } catch (error) {
    console.error('Error creating homepage component:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create homepage component' },
      { status: 500 }
    )
  }
}
