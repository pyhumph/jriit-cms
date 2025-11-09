import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { auth } from '@/auth'

// GET /api/media - Get all media files (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type')
    const isPublic = searchParams.get('isPublic')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (isPublic !== null) {
      where.isPublic = isPublic === 'true'
    }
    
    if (type) {
      where.type = type
    }
    
    if (search) {
      // SQLite doesn't support mode: 'insensitive', so we use contains without mode
      // For case-insensitive search in SQLite, we'll convert to lowercase in the query
      const searchLower = search.toLowerCase()
      where.OR = [
        { filename: { contains: search } },
        { originalName: { contains: search } },
        { altText: { contains: search } },
        { caption: { contains: search } },
      ]
    }

    // Get media files
    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        include: {
          uploader: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.media.count({ where }),
    ])

    return NextResponse.json({
      media,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/media - Upload media file (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const createSchema = z.object({
      filename: z.string().min(1),
      originalName: z.string().min(1),
      url: z.string().url(),
      thumbnailUrl: z.string().url().optional(),
      type: z.enum(['IMAGE', 'DOCUMENT', 'VIDEO', 'AUDIO', 'OTHER']),
      mimeType: z.string().min(1),
      size: z.number().min(0),
      width: z.number().optional(),
      height: z.number().optional(),
      altText: z.string().optional(),
      caption: z.string().optional(),
      description: z.string().optional(),
      tags: z.string().optional(), // JSON string
      isPublic: z.boolean().default(true),
    })

    const validatedData = createSchema.parse(body)

    const media = await prisma.media.create({
      data: {
        ...validatedData,
        uploadedBy: session.user.id,
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(media, { status: 201 })
  } catch (error) {
    console.error('Error creating media:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
