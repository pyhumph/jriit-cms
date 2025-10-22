import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { auth } from '@/auth'

// GET /api/pages - Get all pages (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const published = searchParams.get('published')
    const showInMenu = searchParams.get('showInMenu')
    const isHomepage = searchParams.get('isHomepage')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (published !== null) {
      where.published = published === 'true'
    }
    
    if (showInMenu !== null) {
      where.showInMenu = showInMenu === 'true'
    }
    
    if (isHomepage !== null) {
      where.isHomepage = isHomepage === 'true'
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Get pages with author info
    const [pages, total] = await Promise.all([
      prisma.page.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          parent: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          children: {
            select: {
              id: true,
              title: true,
              slug: true,
              order: true,
            },
            orderBy: { order: 'asc' }
          },
        },
        orderBy: [
          { isHomepage: 'desc' },
          { order: 'asc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit,
      }),
      prisma.page.count({ where }),
    ])

    return NextResponse.json({
      pages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/pages - Create page (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const createSchema = z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      content: z.string().min(1),
      excerpt: z.string().optional(),
      featuredImage: z.string().optional(),
      published: z.boolean().default(false),
      publishedAt: z.string().datetime().optional(),
      template: z.string().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      metaKeywords: z.string().optional(),
      isHomepage: z.boolean().default(false),
      showInMenu: z.boolean().default(true),
      order: z.number().default(0),
      parentId: z.string().optional(),
    })

    const validatedData = createSchema.parse(body)

    const page = await prisma.page.create({
      data: {
        ...validatedData,
        authorId: session.user.id,
        publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        parent: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json(page, { status: 201 })
  } catch (error) {
    console.error('Error creating page:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
