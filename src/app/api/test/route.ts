import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/test - Test endpoint to verify Prisma client and database connection
export async function GET() {
  try {
    // Test basic Prisma connection
    await prisma.$queryRaw`SELECT 1`
    
    // Test if we can access the new models
    const adminCount = await prisma.admin.count()
    const globalSettingsCount = await prisma.globalSettings.count()
    const textSnippetsCount = await prisma.textSnippet.count()
    const navigationCount = await prisma.navigation.count()
    const newsCount = await prisma.news.count()
    const eventsCount = await prisma.event.count()
    const pagesCount = await prisma.page.count()
    const programsCount = await prisma.program.count()
    const departmentsCount = await prisma.department.count()
    const facultyCount = await prisma.faculty.count()
    const testimonialsCount = await prisma.testimonial.count()
    const mediaCount = await prisma.media.count()

    return NextResponse.json({
      status: 'success',
      message: 'All API endpoints are working correctly',
      database: {
        connected: true,
        counts: {
          admins: adminCount,
          globalSettings: globalSettingsCount,
          textSnippets: textSnippetsCount,
          navigation: navigationCount,
          news: newsCount,
          events: eventsCount,
          pages: pagesCount,
          programs: programsCount,
          departments: departmentsCount,
          faculty: facultyCount,
          testimonials: testimonialsCount,
          media: mediaCount,
        }
      }
    })
  } catch (error) {
    console.error('Test endpoint error:', error)
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
