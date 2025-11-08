import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const componentType = searchParams.get('type') || 'all'
    const activeOnly = searchParams.get('active') === 'true'

    // Build where clause
    const where: any = {}
    if (componentType !== 'all') {
      where.type = componentType
    }
    if (activeOnly) {
      where.isActive = true
    }

    // Fetch homepage components from database
    const components = await prisma.homepageComponent.findMany({
      where,
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        type: true,
        title: true,
        subtitle: true,
        content: true,
        mediaType: true,
        mediaUrl: true,
        ctaText: true,
        ctaLink: true,
        isActive: true,
        order: true,
        settings: true,
        updatedAt: true
      }
    })

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      components,
      totalComponents: components.length,
      lastUpdated: components.length > 0 ? components[0].updatedAt : null
    })

  } catch (error) {
    console.error('Error fetching homepage content:', error)
    await prisma.$disconnect()
    return NextResponse.json(
      { success: false, error: 'Failed to fetch homepage content' },
      { status: 500 }
    )
  }
}


