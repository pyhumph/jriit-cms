import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { auth } from '@/auth'

// GET /api/programs - Get all programs (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const department = searchParams.get('department') // Can be ID
    const departmentSlug = searchParams.get('departmentSlug') // Can be slug
    const courseCategory = searchParams.get('courseCategory') // Can be department name
    const isActive = searchParams.get('isActive')
    const featured = searchParams.get('featured')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      deletedAt: null  // Exclude soft-deleted items
    }
    
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }
    
    if (featured !== null) {
      where.isFeatured = featured === 'true'
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    // Handle department filter - can be ID, slug, or name
    if (department) {
      where.departmentId = department
    } else if (departmentSlug) {
      // Find department by slug first
      const dept = await prisma.department.findUnique({
        where: { slug: departmentSlug },
        select: { id: true }
      })
      if (dept) {
        where.departmentId = dept.id
      }
    } else if (courseCategory) {
      // Find department by name
      const dept = await prisma.department.findFirst({
        where: { name: { equals: courseCategory, mode: 'insensitive' } },
        select: { id: true }
      })
      if (dept) {
        where.departmentId = dept.id
      }
    }

    // Get programs with department info
    const [programs, total] = await Promise.all([
      prisma.program.findMany({
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
          { isFeatured: 'desc' },
          { order: 'asc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit,
      }),
      prisma.program.count({ where }),
    ])

    const response = NextResponse.json({
      programs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
    
    // Disable caching to ensure fresh data after deletions
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    
    return response
  } catch (error) {
    console.error('Error fetching programs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/programs - Create program (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const createSchema = z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().nullable().optional(),
      shortDescription: z.string().nullable().optional(),
      duration: z.string().nullable().optional(),
      degree: z.string().nullable().optional(),
      departmentId: z.string().nullable().optional(),
      requirements: z.string().nullable().optional(),
      curriculum: z.string().nullable().optional(),
      careerOpportunities: z.string().nullable().optional(),
      featuredImage: z.string().nullable().optional(),
      isActive: z.boolean().default(true),
      isFeatured: z.boolean().default(false),
      order: z.number().default(0),
      // Detail Page Content Fields
      detailPageLayout: z.enum([
        'standard',
        'custom-applications',
        'custom-adobe',
        'cyber-security',
        'business-administration',
        'travel-tourism',
        'short-course',
      ]).nullable().optional(),
      heroTitle: z.string().nullable().optional(),
      heroSubtitle: z.string().nullable().optional(),
      heroImage: z.string().nullable().optional(),
      overviewTitle: z.string().nullable().optional(),
      overviewContent: z.string().nullable().optional(),
      learningTitle: z.string().nullable().optional(),
      learningItems: z.string().nullable().optional(), // JSON string
      modulesTitle: z.string().nullable().optional(),
      modules: z.string().nullable().optional(), // JSON string
      detailsDuration: z.string().nullable().optional(),
      detailsFormat: z.string().nullable().optional(),
      detailsSchedule: z.string().nullable().optional(),
      detailsPrerequisites: z.string().nullable().optional(),
      careerTitle: z.string().nullable().optional(),
      careerOpportunitiesJson: z.string().nullable().optional(), // JSON string
      ctaTitle: z.string().nullable().optional(),
      ctaDescription: z.string().nullable().optional(),
      customContent: z.string().nullable().optional(), // JSON string
      // Professional Course fields
      level: z.string().nullable().optional(),
      keyCertifications: z.string().nullable().optional(), // JSON array string
      externalLink: z.string().nullable().optional(), // External URL
    })

    const validatedData = createSchema.parse(body)

    // Clean up data: convert empty strings to null
    const createData: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(validatedData)) {
      // Convert empty strings to null for all fields except name and slug
      if (value === '' && key !== 'name' && key !== 'slug') {
        createData[key] = null
      } else {
        createData[key] = value
      }
    }

    const program = await prisma.program.create({
      data: {
        ...createData,
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

    return NextResponse.json(program, { status: 201 })
  } catch (error) {
    console.error('Error creating program:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
