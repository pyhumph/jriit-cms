import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { PrismaClient } from '@prisma/client'

// Create a fresh Prisma client for this API
const prisma = new PrismaClient()

// Website pages configuration based on App.js routes
const WEBSITE_PAGES = [
  // Main pages
  { path: '/', name: 'Homepage', slug: 'homepage', type: 'main' },
  { path: '/about', name: 'About', slug: 'about', type: 'main' },
  { path: '/about/mission', name: 'Mission', slug: 'mission', type: 'about' },
  { path: '/about/trustees', name: 'Board of Trustees', slug: 'trustees', type: 'about' },
  { path: '/about/terms-conditions', name: 'Terms & Conditions', slug: 'terms', type: 'about' },
  
  // Programs
  { path: '/programs', name: 'Programs', slug: 'programs', type: 'main' },
  { path: '/course/information-technology', name: 'Information Technology', slug: 'it', type: 'program' },
  { path: '/course/cyber-security', name: 'Cyber Security', slug: 'cybersecurity', type: 'program' },
  { path: '/course/computer-science', name: 'Computer Science', slug: 'cs', type: 'program' },
  { path: '/course/computer-engineering', name: 'Computer Engineering', slug: 'ce', type: 'program' },
  { path: '/course/electronics-telecommunications', name: 'Electronics & Telecommunications', slug: 'et', type: 'program' },
  { path: '/course/business-administration', name: 'Business Administration', slug: 'ba', type: 'program' },
  { path: '/course/accountancy', name: 'Accountancy', slug: 'accountancy', type: 'program' },
  { path: '/course/travel-tourism-management', name: 'Travel & Tourism Management', slug: 'ttm', type: 'program' },
  { path: '/course/short-courses', name: 'Short Courses', slug: 'short-courses', type: 'program' },
  { path: '/course/professional-courses', name: 'Professional Courses', slug: 'professional', type: 'program' },
  
  // Academic pages
  { path: '/academics', name: 'Academics', slug: 'academics', type: 'academic' },
  { path: '/departments', name: 'Departments', slug: 'departments', type: 'academic' },
  { path: '/library', name: 'Library', slug: 'library', type: 'academic' },
  
  // Student services
  { path: '/admissions', name: 'Admissions', slug: 'admissions', type: 'service' },
  { path: '/apply', name: 'Apply', slug: 'apply', type: 'service' },
  { path: '/student-portal', name: 'Student Portal', slug: 'student-portal', type: 'service' },
  { path: '/fees', name: 'Fee Structure', slug: 'fees', type: 'service' },
  
  // Media & Events
  { path: '/gallery/photos', name: 'Photo Gallery', slug: 'photo-gallery', type: 'media' },
  { path: '/gallery/videos', name: 'Video Gallery', slug: 'video-gallery', type: 'media' },
  { path: '/events', name: 'Events', slug: 'events', type: 'media' },
  { path: '/news', name: 'News', slug: 'news', type: 'media' },
  
  // Other services
  { path: '/contact', name: 'Contact Us', slug: 'contact', type: 'service' },
  { path: '/services', name: 'Services', slug: 'services', type: 'service' },
  { path: '/feedback', name: 'Feedback', slug: 'feedback', type: 'service' },
  { path: '/athletics', name: 'Athletics', slug: 'athletics', type: 'service' },
  { path: '/campus-tour', name: 'Campus Tour', slug: 'campus-tour', type: 'service' },
  
  // IT Program sub-pages
  { path: '/courses/information-technology/computer-hardware', name: 'Computer Hardware', slug: 'it-hardware', type: 'it-program' },
  { path: '/courses/information-technology/computer-software', name: 'Computer Software', slug: 'it-software', type: 'it-program' },
  { path: '/courses/information-technology/computer-applications', name: 'Computer Applications', slug: 'it-applications', type: 'it-program' },
  { path: '/courses/information-technology/networking-system-administration', name: 'Networking & System Administration', slug: 'it-networking', type: 'it-program' },
  { path: '/courses/information-technology/linux-administration', name: 'Linux Administration', slug: 'it-linux', type: 'it-program' },
  { path: '/courses/information-technology/database-management', name: 'Database Management', slug: 'it-database', type: 'it-program' },
  { path: '/courses/information-technology/object-oriented-programming-oop', name: 'Object-Oriented Programming', slug: 'it-oop', type: 'it-program' },
  { path: '/courses/information-technology/website-application-development', name: 'Web Application Development', slug: 'it-webdev', type: 'it-program' },
  { path: '/courses/information-technology/cyber-security', name: 'Cyber Security', slug: 'it-cybersecurity', type: 'it-program' },
  { path: '/courses/information-technology/cloud-computing', name: 'Cloud Computing', slug: 'it-cloud', type: 'it-program' },
  { path: '/courses/information-technology/system-analysis-design', name: 'System Analysis & Design', slug: 'it-analysis', type: 'it-program' },
  { path: '/courses/information-technology/adobe-applications', name: 'Adobe Applications', slug: 'it-adobe', type: 'it-program' },
  
  // Cyber Security Program sub-pages
  { path: '/courses/cyber-security/intro-to-cyber-security', name: 'Introduction to Cyber Security', slug: 'cyber-intro', type: 'cyber-program' },
  { path: '/courses/cyber-security/network-os-security', name: 'Network & OS Security', slug: 'cyber-network', type: 'cyber-program' },
  { path: '/courses/cyber-security/cryptography-basics', name: 'Cryptography Basics', slug: 'cyber-crypto', type: 'cyber-program' },
  { path: '/courses/cyber-security/ethical-hacking-pen-testing', name: 'Ethical Hacking & Pen Testing', slug: 'cyber-ethical', type: 'cyber-program' },
  { path: '/courses/cyber-security/web-application-security', name: 'Web Application Security', slug: 'cyber-web', type: 'cyber-program' },
  { path: '/courses/cyber-security/malware-forensics', name: 'Malware & Forensics', slug: 'cyber-malware', type: 'cyber-program' },
  { path: '/courses/cyber-security/wireless-mobile-security', name: 'Wireless & Mobile Security', slug: 'cyber-wireless', type: 'cyber-program' },
  
  // Computer Science Program sub-pages
  { path: '/courses/computer-science/programming-fundamentals', name: 'Programming Fundamentals', slug: 'cs-programming', type: 'cs-program' },
  { path: '/courses/computer-science/data-structures-algorithms', name: 'Data Structures & Algorithms', slug: 'cs-dsa', type: 'cs-program' },
  
  // Computer Engineering Program sub-pages
  { path: '/courses/computer-engineering/digital-electronics', name: 'Digital Electronics', slug: 'ce-digital', type: 'ce-program' },
  { path: '/courses/computer-engineering/computer-architecture', name: 'Computer Architecture', slug: 'ce-architecture', type: 'ce-program' }
]

// GET /api/website-scraper - Get all website pages and their content
export async function GET(request: NextRequest) {
  try {
    console.log('API: Starting website scraper...')
    
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('API: Prisma client available:', !!prisma)
    console.log('API: pageComponent model available:', !!prisma.pageComponent)

    const { searchParams } = new URL(request.url)
    const pageType = searchParams.get('type')
    const pageSlug = searchParams.get('slug')

    // Filter pages by type if specified
    let filteredPages = WEBSITE_PAGES
    if (pageType) {
      filteredPages = WEBSITE_PAGES.filter(page => page.type === pageType)
    }
    if (pageSlug) {
      filteredPages = filteredPages.filter(page => page.slug === pageSlug)
    }

    // Get content for each page from database
    const pagesWithContent = await Promise.all(
      filteredPages.map(async (page) => {
        try {
          console.log(`API: Fetching components for page: ${page.slug}`)
          
          // Get page components from database
          const components = await prisma.pageComponent.findMany({
            where: {
              pageName: page.slug,
              isActive: true
            },
            orderBy: { order: 'asc' },
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          })

          console.log(`API: Found ${components.length} components for ${page.slug}`)

          // Get website page info
          const websitePage = await prisma.websitePage.findFirst({
            where: { slug: page.slug }
          })

          return {
            ...page,
            components,
            websitePage,
            componentCount: components.length,
            lastUpdated: components.length > 0 
              ? Math.max(...components.map(c => new Date(c.updatedAt).getTime()))
              : null
          }
        } catch (error) {
          console.error(`API: Error fetching components for ${page.slug}:`, error)
          return {
            ...page,
            components: [],
            websitePage: null,
            componentCount: 0,
            lastUpdated: null
          }
        }
      })
    )

    // Group pages by type for better organization
    const groupedPages = pagesWithContent.reduce((acc, page) => {
      if (!acc[page.type]) {
        acc[page.type] = []
      }
      acc[page.type].push(page)
      return acc
    }, {} as Record<string, any[]>)

    await prisma.$disconnect()
    
    return NextResponse.json({
      success: true,
      pages: pagesWithContent,
      groupedPages,
      totalPages: pagesWithContent.length,
      pageTypes: Object.keys(groupedPages)
    })
  } catch (error) {
    console.error('Error fetching website pages:', error)
    await prisma.$disconnect()
    return NextResponse.json(
      { success: false, error: 'Failed to fetch website pages' },
      { status: 500 }
    )
  }
}

// POST /api/website-scraper - Create/update page content from website
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { pageSlug, components } = body

    if (!pageSlug || !components) {
      return NextResponse.json(
        { error: 'Page slug and components are required' },
        { status: 400 }
      )
    }

    // Find the page configuration
    const pageConfig = WEBSITE_PAGES.find(p => p.slug === pageSlug)
    if (!pageConfig) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    // Create or update website page
    const websitePage = await prisma.websitePage.upsert({
      where: { slug: pageSlug },
      update: {
        name: pageConfig.name,
        title: pageConfig.name,
        description: `Content for ${pageConfig.name} page`,
        isActive: true
      },
      create: {
        name: pageConfig.name,
        slug: pageSlug,
        title: pageConfig.name,
        description: `Content for ${pageConfig.name} page`,
        isActive: true,
        authorId: session.user.id
      }
    })

    // Create or update components
    const createdComponents = []
    for (const component of components) {
      const createdComponent = await prisma.pageComponent.upsert({
        where: {
          pageName_componentName: {
            pageName: pageSlug,
            componentName: component.componentName
          }
        },
        update: {
          title: component.title,
          subtitle: component.subtitle,
          content: component.content,
          mediaType: component.mediaType,
          mediaUrl: component.mediaUrl,
          ctaText: component.ctaText,
          ctaLink: component.ctaLink,
          isActive: component.isActive || true,
          order: component.order || 0,
          settings: component.settings ? JSON.stringify(component.settings) : null
        },
        create: {
          pageName: pageSlug,
          componentName: component.componentName,
          title: component.title,
          subtitle: component.subtitle,
          content: component.content,
          mediaType: component.mediaType,
          mediaUrl: component.mediaUrl,
          ctaText: component.ctaText,
          ctaLink: component.ctaLink,
          isActive: component.isActive || true,
          order: component.order || 0,
          settings: component.settings ? JSON.stringify(component.settings) : null,
          authorId: session.user.id
        }
      })
      createdComponents.push(createdComponent)
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${pageConfig.name} page`,
      page: {
        ...pageConfig,
        websitePage,
        components: createdComponents
      }
    })
  } catch (error) {
    console.error('Error updating page content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update page content' },
      { status: 500 }
    )
  }
}
