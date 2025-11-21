import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { auth } from '@/auth'

// GET /api/faculty - Get all faculty (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const department = searchParams.get('department')
    const isActive = searchParams.get('isActive')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      deletedAt: null  // Exclude soft-deleted items
    }
    
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }
    
    if (department) {
      where.departmentId = department
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { specialization: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Get faculty with department info
    const [faculty, total] = await Promise.all([
      prisma.faculty.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          department: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: [
          { order: 'asc' },
          { name: 'asc' }
        ],
        skip,
        take: limit,
      }),
      prisma.faculty.count({ where }),
    ])

    return NextResponse.json({
      faculty,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching faculty:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/faculty - Create faculty member (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const createSchema = z.object({
      name: z.string().min(1),
      title: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      bio: z.string().optional(),
      photo: z.string().optional(),
      departmentId: z.string().optional(),
      specialization: z.string().optional(),
      education: z.string().optional(),
      experience: z.string().optional(),
      achievements: z.string().optional(),
      socialLinks: z.string().optional(), // JSON string
      isActive: z.boolean().default(true),
      order: z.number().default(0),
    })

    const validatedData = createSchema.parse(body)

    const faculty = await prisma.faculty.create({
      data: {
        ...validatedData,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json(faculty, { status: 201 })
  } catch (error) {
    console.error('Error creating faculty member:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
