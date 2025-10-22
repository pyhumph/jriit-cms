import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { auth } from '@/auth'

// GET /api/snippets - Get all text snippets (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isActive = searchParams.get('isActive')

    const where: any = {}
    if (category) where.category = category
    if (isActive !== null) where.isActive = isActive === 'true'

    const snippets = await prisma.textSnippet.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(snippets)
  } catch (error) {
    console.error('Error fetching text snippets:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/snippets - Create new text snippet (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const createSchema = z.object({
      key: z.string().min(1),
      title: z.string().min(1),
      content: z.string().min(1),
      description: z.string().optional(),
      category: z.string().optional(),
      isActive: z.boolean().default(true),
    })

    const validatedData = createSchema.parse(body)

    const snippet = await prisma.textSnippet.create({
      data: validatedData,
    })

    return NextResponse.json(snippet, { status: 201 })
  } catch (error) {
    console.error('Error creating text snippet:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
