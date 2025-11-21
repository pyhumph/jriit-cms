import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'

const prisma = new PrismaClient()

// GET /api/recycle-bin - List all deleted items across all models
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get deleted items from each model
    const [deletedPrograms, deletedDepartments, deletedFaculty, deletedPages, deletedMedia, deletedNews, deletedEvents, deletedHomepageComponents, deletedPageComponents, deletedPosts, deletedHeroSlides] = await Promise.all([
      prisma.program.findMany({
        where: { deletedAt: { not: null } },
        select: { 
          id: true, 
          name: true, 
          deletedAt: true, 
          deletedBy: true 
        }
      }),
      prisma.department.findMany({
        where: { deletedAt: { not: null } },
        select: { 
          id: true, 
          name: true, 
          deletedAt: true, 
          deletedBy: true 
        }
      }),
      prisma.faculty.findMany({
        where: { deletedAt: { not: null } },
        select: { 
          id: true, 
          name: true, 
          deletedAt: true, 
          deletedBy: true 
        }
      }),
      prisma.page.findMany({
        where: { deletedAt: { not: null } },
        select: { 
          id: true, 
          title: true, 
          deletedAt: true, 
          deletedBy: true 
        }
      }),
      prisma.media.findMany({
        where: { deletedAt: { not: null } },
        select: { 
          id: true, 
          filename: true, 
          originalName: true,
          deletedAt: true, 
          deletedBy: true 
        }
      }),
      prisma.news.findMany({
        where: { deletedAt: { not: null } },
        select: { 
          id: true, 
          title: true, 
          deletedAt: true, 
          deletedBy: true 
        }
      }),
      prisma.event.findMany({
        where: { deletedAt: { not: null } },
        select: { 
          id: true, 
          title: true, 
          deletedAt: true, 
          deletedBy: true 
        }
      }),
      prisma.homepageComponent.findMany({
        where: { deletedAt: { not: null } },
        select: { 
          id: true, 
          name: true, 
          type: true,
          deletedAt: true, 
          deletedBy: true 
        }
      }),
      prisma.pageComponent.findMany({
        where: { deletedAt: { not: null } },
        select: { 
          id: true, 
          pageName: true, 
          componentName: true,
          deletedAt: true, 
          deletedBy: true 
        }
      }),
      prisma.post.findMany({
        where: { deletedAt: { not: null } },
        select: { 
          id: true, 
          title: true, 
          deletedAt: true, 
          deletedBy: true 
        }
      }),
      prisma.heroSlide.findMany({
        where: { deletedAt: { not: null } },
        select: { 
          id: true, 
          title: true, 
          deletedAt: true, 
          deletedBy: true 
        }
      })
    ])

    // Combine and format all deleted items
    const recycleBinItems = [
      ...deletedPrograms.map(item => ({
        ...item,
        itemType: 'program',
        itemName: item.name
      })),
      ...deletedDepartments.map(item => ({
        ...item,
        itemType: 'department',
        itemName: item.name
      })),
      ...deletedFaculty.map(item => ({
        ...item,
        itemType: 'faculty',
        itemName: item.name
      })),
      ...deletedPages.map(item => ({
        ...item,
        itemType: 'page',
        itemName: item.title
      })),
      ...deletedMedia.map(item => ({
        ...item,
        itemType: 'media',
        itemName: item.originalName || item.filename
      })),
      ...deletedNews.map(item => ({
        ...item,
        itemType: 'news',
        itemName: item.title
      })),
      ...deletedEvents.map(item => ({
        ...item,
        itemType: 'event',
        itemName: item.title
      })),
      ...deletedHomepageComponents.map(item => ({
        ...item,
        itemType: 'homepage-component',
        itemName: `${item.name} (${item.type})`
      })),
      ...deletedPageComponents.map(item => ({
        ...item,
        itemType: 'page-component',
        itemName: `${item.pageName} - ${item.componentName}`
      })),
      ...deletedPosts.map(item => ({
        ...item,
        itemType: 'post',
        itemName: item.title
      })),
      ...deletedHeroSlides.map(item => ({
        ...item,
        itemType: 'hero-slide',
        itemName: item.title
      }))
    ]

    // Sort by deletion date (most recent first)
    recycleBinItems.sort((a, b) => 
      new Date(b.deletedAt!).getTime() - new Date(a.deletedAt!).getTime()
    )

    return NextResponse.json({
      success: true,
      items: recycleBinItems,
      total: recycleBinItems.length
    })

  } catch (error) {
    console.error('Recycle Bin fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recycle bin items' },
      { status: 500 }
    )
  }
}

