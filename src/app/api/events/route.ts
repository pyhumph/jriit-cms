import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { auth } from '@/auth'

// GET /api/events - Get all events (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category')
    const isPublic = searchParams.get('isPublic')
    const isFree = searchParams.get('isFree')
    const featured = searchParams.get('featured')
    const upcoming = searchParams.get('upcoming')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (isPublic !== null) {
      where.isPublic = isPublic === 'true'
    }
    
    if (isFree !== null) {
      where.isFree = isFree === 'true'
    }
    
    if (featured !== null) {
      where.isFeatured = featured === 'true'
    }
    
    if (upcoming === 'true') {
      where.startDate = { gte: new Date() }
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    if (category) {
      where.category = category
    }

    // Get events with author info
    const [events, total] = await Promise.all([
      prisma.event.findMany({
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
          { isFeatured: 'desc' },
          { startDate: 'asc' }
        ],
        skip,
        take: limit,
      }),
      prisma.event.count({ where }),
    ])

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/events - Create event (admin only)
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
      description: z.string().min(1),
      content: z.string().optional(),
      featuredImage: z.string().optional(),
      startDate: z.string().datetime(),
      endDate: z.string().datetime().optional(),
      location: z.string().optional(),
      venue: z.string().optional(),
      registrationUrl: z.string().url().optional(),
      capacity: z.number().optional(),
      isPublic: z.boolean().default(true),
      isFree: z.boolean().default(true),
      price: z.number().optional(),
      currency: z.string().default('USD'),
      category: z.string().optional(),
      tags: z.string().optional(), // JSON string
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      metaKeywords: z.string().optional(),
      isFeatured: z.boolean().default(false),
      registrationDeadline: z.string().datetime().optional(),
    })

    const validatedData = createSchema.parse(body)

    const event = await prisma.event.create({
      data: {
        ...validatedData,
        authorId: session.user.id,
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
        registrationDeadline: validatedData.registrationDeadline ? new Date(validatedData.registrationDeadline) : undefined,
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

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
