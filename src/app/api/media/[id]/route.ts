import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { unlink } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

// DELETE /api/media/[id] - Delete media item (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Get media item
    const mediaItem = await prisma.media.findUnique({
      where: { id },
    })

    if (!mediaItem) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }

    // Delete file from filesystem if it's a local upload
    if (mediaItem.url.startsWith('/uploads/')) {
      try {
        const filepath = path.join(
          process.cwd(),
          'public',
          mediaItem.url
        )

        // Check if file exists before trying to delete
        if (existsSync(filepath)) {
          await unlink(filepath)
          console.log(`Deleted file: ${filepath}`)
        } else {
          console.warn(`File not found: ${filepath} (continuing with database deletion)`)
        }
      } catch (error) {
        console.error('Failed to delete file:', error)
        // Continue with database deletion even if file deletion fails
        // The file might have been manually deleted or doesn't exist
      }
    }

    // Delete from database
    await prisma.media.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully',
    })
  } catch (error) {
    console.error('Delete media error:', error)
    return NextResponse.json(
      {
        error: 'Failed to delete media',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// GET /api/media/[id] - Get single media item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const mediaItem = await prisma.media.findUnique({
      where: { id },
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

    if (!mediaItem) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(mediaItem)
  } catch (error) {
    console.error('Get media error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch media',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

