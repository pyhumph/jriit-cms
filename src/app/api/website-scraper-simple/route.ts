import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

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
  { path: '/campus-tour', name: 'Campus Tour', slug: 'campus-tour', type: 'service' }
]

// GET /api/website-scraper-simple - Get all website pages (without database)
export async function GET(request: NextRequest) {
  try {
    console.log('API: Starting simple website scraper...')
    
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    // Add mock components for each page
    const pagesWithContent = filteredPages.map(page => ({
      ...page,
      components: [
        {
          id: `${page.slug}-hero`,
          pageName: page.slug,
          componentName: 'hero',
          title: `${page.name} - Hero Section`,
          subtitle: `Welcome to ${page.name}`,
          content: `This is the hero section for ${page.name} page.`,
          mediaType: 'image',
          mediaUrl: '/assets/hero-bg.jpg',
          ctaText: 'Learn More',
          ctaLink: '#content',
          isActive: true,
          order: 1,
          author: {
            id: '1',
            name: 'System',
            email: 'system@jriit.com'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: `${page.slug}-content`,
          pageName: page.slug,
          componentName: 'content',
          title: `${page.name} Content`,
          subtitle: `Main content for ${page.name}`,
          content: `This is the main content section for ${page.name} page. You can edit this content through the CMS dashboard.`,
          isActive: true,
          order: 2,
          author: {
            id: '1',
            name: 'System',
            email: 'system@jriit.com'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      websitePage: {
        id: page.slug,
        name: page.name,
        slug: page.slug,
        title: page.name,
        description: `Content for ${page.name} page`,
        isActive: true
      },
      componentCount: 2,
      lastUpdated: new Date().getTime()
    }))

    // Group pages by type for better organization
    const groupedPages = pagesWithContent.reduce((acc, page) => {
      if (!acc[page.type]) {
        acc[page.type] = []
      }
      acc[page.type].push(page)
      return acc
    }, {} as Record<string, any[]>)

    return NextResponse.json({
      success: true,
      pages: pagesWithContent,
      groupedPages,
      totalPages: pagesWithContent.length,
      pageTypes: Object.keys(groupedPages),
      message: 'Using mock data - database not available'
    })
  } catch (error) {
    console.error('Error fetching website pages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch website pages' },
      { status: 500 }
    )
  }
}

