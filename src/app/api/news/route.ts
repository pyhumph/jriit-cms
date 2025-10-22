import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { auth } from '@/auth'

// GET /api/news - Get all news (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category')
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const breaking = searchParams.get('breaking')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (published !== null) {
      where.published = published === 'true'
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    if (category) {
      where.category = category
    }
    
    if (featured !== null) {
      where.isFeatured = featured === 'true'
    }
    
    if (breaking !== null) {
      where.isBreaking = breaking === 'true'
    }

    // Get news with author info
    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: [
          { isBreaking: 'desc' },
          { isFeatured: 'desc' },
          { publishedAt: 'desc' }
        ],
        skip,
        take: limit,
      }),
      prisma.news.count({ where }),
    ])

    return NextResponse.json({
      news,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/news - Create news article (admin only)
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
      category: z.string().optional(),
      tags: z.string().optional(), // JSON string
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      metaKeywords: z.string().optional(),
      isBreaking: z.boolean().default(false),
      isFeatured: z.boolean().default(false),
    })

    const validatedData = createSchema.parse(body)

    const news = await prisma.news.create({
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
      },
    })

    return NextResponse.json(news, { status: 201 })
  } catch (error) {
    console.error('Error creating news:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
