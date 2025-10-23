import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

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

    // Get the first admin user or create a default one
    let adminUser = await prisma.admin.findFirst()
    
    if (!adminUser) {
      // Create a default admin user
      adminUser = await prisma.admin.create({
        data: {
          name: 'System Admin',
          email: 'admin@jriit.com',
          password: '$2b$10$default.hash.here', // Default hashed password
          role: 'ADMIN'
        }
      })
    }

    // Clear existing homepage components
    await prisma.homepageComponent.deleteMany()

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
            cta2Text: component.cta2Text,
            cta2Link: component.cta2Link,
            cta3Text: component.cta3Text,
            cta3Link: component.cta3Link,
            isActive: component.isActive,
            order: index + 1,
            settings: component.settings || '{}',
            authorId: adminUser.id
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
