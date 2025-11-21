import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'
import { unlink } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

const prisma = new PrismaClient()

// POST /api/recycle-bin/permanent-delete - Permanently delete an item
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

    // Special handling for media files - delete physical file first
    if (itemType === 'media') {
      try {
        const mediaItem = await prisma.media.findUnique({
          where: { id: itemId }
        })

        if (mediaItem && mediaItem.url.startsWith('/uploads/')) {
          const filepath = path.join(
            process.cwd(),
            'public',
            mediaItem.url
          )

          if (existsSync(filepath)) {
            await unlink(filepath)
            console.log(`Permanently deleted file: ${filepath}`)
          }
        }
      } catch (error) {
        console.error('Failed to delete media file:', error)
        // Continue with database deletion even if file deletion fails
      }
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

    // PERMANENT DELETE - actually remove from database
    await model.delete({
      where: { id: itemId }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Item permanently deleted'
    })

  } catch (error: any) {
    console.error('Permanent delete error:', error)
    
    // Handle item not found
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to permanently delete item' },
      { status: 500 }
    )
  }
}

