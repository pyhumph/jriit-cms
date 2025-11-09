import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/public/programs/[slug] - Get program by slug (public endpoint)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const programSlug = slug

    // Find program by slug - include all fields including detail page fields
    const program = await prisma.program.findUnique({
      where: { slug: programSlug },
      include: {
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
        { success: false, error: 'Program not found' },
        { status: 404 }
      )
    }

    // Only return active programs for public endpoint
    if (!program.isActive) {
      return NextResponse.json(
        { success: false, error: 'Program not found' },
        { status: 404 }
      )
    }

    // Debug: Log detail page fields to verify they're being returned
    console.log('GET /api/public/programs/[slug] - Program fetched:')
    console.log('  slug:', program.slug)
    console.log('  detailPageLayout:', program.detailPageLayout)
    console.log('  heroTitle:', program.heroTitle ? `"${program.heroTitle.substring(0, 50)}..."` : 'NULL')
    console.log('  overviewContent:', program.overviewContent ? `HAS_CONTENT (${program.overviewContent.length} chars)` : 'NULL')
    console.log('  learningItems:', program.learningItems ? `HAS_CONTENT (${program.learningItems.length} chars)` : 'NULL')
    console.log('  modules:', program.modules ? `HAS_CONTENT (${program.modules.length} chars)` : 'NULL')
    console.log('  customContent:', program.customContent ? `HAS_CONTENT (${program.customContent.length} chars)` : 'NULL')
    console.log('  heroApplications:', program.heroApplications ? `HAS_CONTENT (${program.heroApplications.length} chars)` : 'NULL')
    console.log('  applicationCards:', program.applicationCards ? `HAS_CONTENT (${program.applicationCards.length} chars)` : 'NULL')
    console.log('  learningLevels:', program.learningLevels ? `HAS_CONTENT (${program.learningLevels.length} chars)` : 'NULL')
    console.log('  suiteTitle:', program.suiteTitle || 'NULL')
    console.log('  suiteDescription:', program.suiteDescription ? `HAS_CONTENT (${program.suiteDescription.length} chars)` : 'NULL')
    console.log('  learningPathTitle:', program.learningPathTitle || 'NULL')
    console.log('  learningPathDesc:', program.learningPathDesc ? `HAS_CONTENT (${program.learningPathDesc.length} chars)` : 'NULL')

    // Return program with all fields - Prisma includes all fields when using include
    return NextResponse.json({
      success: true,
      program,
    })
  } catch (error) {
    console.error('❌ ERROR IN GET /api/public/programs/[slug]:')
    console.error('Error type:', error?.constructor?.name)
    console.error('Error message:', error?.message)
    console.error('Error stack:', error?.stack)
    if (error instanceof Error) {
      console.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
    }
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: error?.message || 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    )
  }
}

