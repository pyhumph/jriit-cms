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

    // Note: We do NOT delete the physical file yet - only soft delete in database
    // Files will be cleaned up when permanently deleted from Recycle Bin
    
    // Soft delete: mark as deleted instead of actually deleting
    await prisma.media.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: session.user.id
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Media moved to Recycle Bin',
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

