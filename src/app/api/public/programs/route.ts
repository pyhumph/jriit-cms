import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/public/programs - Get active programs for public website
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')
    const search = searchParams.get('search') || ''
    const department = searchParams.get('department') // Can be department ID or slug
    const departmentSlug = searchParams.get('departmentSlug')
    const isActive = searchParams.get('isActive') !== 'false' // Default to true
    const featured = searchParams.get('featured')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      isActive: isActive !== false
    }
    
    if (featured === 'true') {
      where.isFeatured = true
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    // Handle department filter - can be ID or slug
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
    }

    // Get programs with department info
    const [programs, total] = await Promise.all([
      prisma.program.findMany({
        where,
        include: {
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

    return NextResponse.json({
      success: true,
      programs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching public programs:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

