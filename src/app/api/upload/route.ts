import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '')
    const ext = path.extname(originalName) || '.jpg'
    const filename = `${timestamp}-${originalName.replace(ext, '')}${ext}`
    const filepath = path.join(uploadsDir, filename)

    // Convert File to Buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Return the public URL path
    const publicPath = `/uploads/${filename}`

    // Also save to Media table
    try {
      // Try to get image dimensions (optional, can be done with sharp later)
      const media = await prisma.media.create({
        data: {
          filename: filename,
          originalName: file.name,
          url: publicPath,
          type: 'IMAGE',
          mimeType: file.type,
          size: file.size,
          uploadedBy: session.user.id,
          isPublic: true,
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

      return NextResponse.json({
        success: true,
        url: publicPath,
        filename: filename,
        media: media,
      })
    } catch (dbError) {
      // If database save fails, still return the file URL
      // The file is already saved, so we can continue
      console.error('Error saving to database:', dbError)
      return NextResponse.json({
        success: true,
        url: publicPath,
        filename: filename,
        warning: 'File uploaded but not saved to media library',
      })
    }
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

