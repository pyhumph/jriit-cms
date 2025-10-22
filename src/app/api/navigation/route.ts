import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { auth } from '@/auth'

// GET /api/navigation - Get navigation menu (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const position = searchParams.get('position')
    const isActive = searchParams.get('isActive')

    const where: any = {}
    if (position) where.position = position
    if (isActive !== null) where.isActive = isActive === 'true'

    const navigation = await prisma.navigation.findMany({
      where,
      orderBy: [
        { level: 'asc' },
        { order: 'asc' },
        { createdAt: 'asc' }
      ],
      include: {
        children: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(navigation)
  } catch (error) {
    console.error('Error fetching navigation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/navigation - Create navigation item (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const createSchema = z.object({
      label: z.string().min(1),
      url: z.string().optional(),
      icon: z.string().optional(),
      order: z.number().default(0),
      isActive: z.boolean().default(true),
      isExternal: z.boolean().default(false),
      target: z.string().default('_self'),
      parentId: z.string().optional(),
      level: z.number().default(0),
      position: z.enum(['HEADER', 'FOOTER', 'SIDEBAR']).default('HEADER'),
    })

    const validatedData = createSchema.parse(body)

    const navigation = await prisma.navigation.create({
      data: validatedData,
    })

    return NextResponse.json(navigation, { status: 201 })
  } catch (error) {
    console.error('Error creating navigation item:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
