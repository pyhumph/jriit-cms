import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { auth } from '@/auth'

// GET /api/programs/[id] - Get program by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const identifier = id

    // Try to find by ID first, then by slug
    // Use findFirst with include to get ALL fields including detail page fields
    const program = await prisma.program.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier }
        ]
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

    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      )
    }

    // Debug: Log detail page fields to verify they're being returned
    console.log('GET /api/programs/[id] - Program fetched:')
    console.log('  id:', program.id)
    console.log('  slug:', program.slug)
    console.log('  detailPageLayout:', program.detailPageLayout)
    console.log('  heroTitle:', program.heroTitle ? `"${program.heroTitle.substring(0, 50)}..."` : 'NULL')
    console.log('  overviewContent:', program.overviewContent ? `HAS_CONTENT (${program.overviewContent.length} chars)` : 'NULL')
    console.log('  learningItems:', program.learningItems ? `HAS_CONTENT (${program.learningItems.length} chars)` : 'NULL')
    console.log('  modules:', program.modules ? `HAS_CONTENT (${program.modules.length} chars)` : 'NULL')
    console.log('  customContent:', program.customContent ? `HAS_CONTENT (${program.customContent.length} chars)` : 'NULL')

    // Return program with all fields - Prisma includes all fields when using include
    return NextResponse.json({
      success: true,
      program,
    })
  } catch (error) {
    console.error('❌ ERROR IN GET /api/programs/[id]:')
    console.error('Error type:', error?.constructor?.name)
    console.error('Error message:', error?.message)
    console.error('Error stack:', error?.stack)
    if (error instanceof Error) {
      console.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
    }
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error?.message || 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    )
  }
}

// PUT /api/programs/[id] - Update program (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('1. PUT /api/programs/[id] - Starting...')
    const { id } = await params
    console.log('2. Resolved params.id:', id)
    
    const session = await auth()
    console.log('3. Session check:', session?.user ? 'Authenticated' : 'Not authenticated')
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('4. Body received, keys:', Object.keys(body))
    console.log('5. Body sample (first 500 chars):', JSON.stringify(body).substring(0, 500))
    
    const updateSchema = z.object({
      name: z.string().min(1).optional(),
      slug: z.string().min(1).optional(),
      description: z.string().nullable().optional(),
      shortDescription: z.string().nullable().optional(),
      duration: z.string().nullable().optional(),
      degree: z.string().nullable().optional(),
      departmentId: z.string().nullable().optional(),
      requirements: z.string().nullable().optional(),
      curriculum: z.string().nullable().optional(),
      careerOpportunities: z.string().nullable().optional(),
      featuredImage: z.string().nullable().optional(),
      isActive: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      order: z.number().optional(),
      // Detail Page Content Fields - all nullable and optional
      detailPageLayout: z.union([
        z.enum(['standard', 'custom-applications', 'custom-adobe']),
        z.null(),
        z.literal(''),
      ]).transform((val) => val === '' ? null : val).optional(),
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
    })

    // Filter out undefined values and convert empty strings to null
    const cleanedBody: any = {}
    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined) {
        // Convert empty strings to null for nullable fields (except name and slug which are required)
        if (value === '' && key !== 'name' && key !== 'slug') {
          cleanedBody[key] = null
        } else if (key === 'detailPageLayout' && value === '') {
          // Handle empty string for enum - convert to null
          cleanedBody[key] = null
        } else {
          cleanedBody[key] = value
        }
      }
    }

    const validatedData = updateSchema.parse(cleanedBody)

    // Check if program exists
    const existingProgram = await prisma.program.findUnique({
      where: { id }
    })

    if (!existingProgram) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      )
    }

    // Check for slug uniqueness if slug is being updated
    if (validatedData.slug && validatedData.slug !== existingProgram.slug) {
      const slugExists = await prisma.program.findUnique({
        where: { slug: validatedData.slug }
      })
      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 409 }
        )
      }
    }

    const program = await prisma.program.update({
      where: { id },
      data: validatedData,
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

    return NextResponse.json({
      success: true,
      program,
    })
  } catch (error) {
    console.error('❌ ERROR IN PUT /api/programs/[id]:')
    console.error('Error type:', error?.constructor?.name)
    console.error('Error message:', error?.message)
    console.error('Error stack:', error?.stack)
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
    
    if (error instanceof z.ZodError) {
      console.error('Zod validation errors:', error.issues)
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error?.message || 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    )
  }
}

// DELETE /api/programs/[id] - Delete program (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if program exists
    const existingProgram = await prisma.program.findUnique({
      where: { id }
    })

    if (!existingProgram) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      )
    }

    await prisma.program.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Program deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting program:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

