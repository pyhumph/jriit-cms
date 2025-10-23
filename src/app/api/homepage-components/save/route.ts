import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { components } = await request.json()

    if (!Array.isArray(components)) {
      return NextResponse.json({ error: 'Components must be an array' }, { status: 400 })
    }

    // Clear existing homepage components
    await prisma.homepageComponent.deleteMany({
      where: { authorId: session.user.id }
    })

    // Create new components
    const createdComponents = await Promise.all(
      components.map(async (component, index) => {
        return await prisma.homepageComponent.create({
          data: {
            name: component.name,
            type: component.type,
            title: component.title,
            subtitle: component.subtitle,
            content: component.content,
            mediaType: component.mediaType,
            mediaUrl: component.mediaUrl,
            ctaText: component.ctaText,
            ctaLink: component.ctaLink,
            isActive: component.isActive,
            order: index + 1,
            settings: component.settings || '{}',
            authorId: session.user.id
          }
        })
      })
    )

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: 'Homepage components saved successfully',
      components: createdComponents,
      totalComponents: createdComponents.length
    })

  } catch (error) {
    console.error('Error saving homepage components:', error)
    await prisma.$disconnect()
    return NextResponse.json(
      { success: false, error: 'Failed to save homepage components' },
      { status: 500 }
    )
  }
}
