import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'

const prisma = new PrismaClient()

// POST /api/recycle-bin/restore - Restore a deleted item
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { itemType, itemId } = await request.json()

    if (!itemType || !itemId) {
      return NextResponse.json(
        { error: 'itemType and itemId are required' },
        { status: 400 }
      )
    }

    // Map itemType to Prisma model
    const modelMap: Record<string, any> = {
      'program': prisma.program,
      'department': prisma.department,
      'faculty': prisma.faculty,
      'page': prisma.page,
      'media': prisma.media,
      'news': prisma.news,
      'event': prisma.event,
      'homepage-component': prisma.homepageComponent,
      'page-component': prisma.pageComponent,
      'post': prisma.post,
      'hero-slide': prisma.heroSlide
    }

    const model = modelMap[itemType]

    if (!model) {
      return NextResponse.json(
        { error: 'Invalid item type' },
        { status: 400 }
      )
    }

    // Restore: clear deletedAt and deletedBy
    await model.update({
      where: { id: itemId },
      data: {
        deletedAt: null,
        deletedBy: null
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Item restored successfully'
    })

  } catch (error: any) {
    console.error('Restore error:', error)
    
    // Handle item not found
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to restore item' },
      { status: 500 }
    )
  }
}

