import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET /api/page-components - Get all page components
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageName = searchParams.get('pageName')
    const componentName = searchParams.get('componentName')
    const isActive = searchParams.get('isActive')
    const order = searchParams.get('order') || 'asc'

    const where: any = {}
    if (pageName) where.pageName = pageName
    if (componentName) where.componentName = componentName
    if (isActive !== null) where.isActive = isActive === 'true'

    const components = await prisma.pageComponent.findMany({
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
    console.error('Error fetching page components:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch page components' },
      { status: 500 }
    )
  }
}

// POST /api/page-components - Create new page component
export async function POST(request: NextRequest) {
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
      isActive = true,
      order = 0,
      settings
    } = body

    // Validate required fields
    if (!pageName || !componentName) {
      return NextResponse.json(
        { error: 'Page name and component name are required' },
        { status: 400 }
      )
    }

    const component = await prisma.pageComponent.create({
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
        settings: settings ? JSON.stringify(settings) : null,
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
    console.error('Error creating page component:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create page component' },
      { status: 500 }
    )
  }
}

