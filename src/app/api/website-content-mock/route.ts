import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

// Mock website content API that provides sample data for testing
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const componentType = searchParams.get('type') || 'all'

    // Mock homepage components data
    const mockComponents = [
      {
        id: 'hero-section',
        name: 'Hero Section',
        type: 'hero',
        title: 'GET READY',
        subtitle: 'UNLEASH YOUR GREATNESS',
        content: 'Join us in shaping the future of technology through innovative education and cutting-edge programs.',
        mediaType: 'video',
        mediaUrl: '/ele.mp4',
        ctaText: 'EXPLORE COURSES',
        ctaLink: '#programs',
        cta2Text: 'PRICING & SCHOLARSHIPS',
        cta2Link: '/fees',
        cta3Text: 'WHY JRIIT',
        cta3Link: '#about',
        isActive: true,
        order: 1,
        settings: JSON.stringify({
          buttons: [
            { text: 'EXPLORE COURSES', link: '#programs', type: 'primary' },
            { text: 'PRICING & SCHOLARSHIPS', link: '/fees', type: 'secondary' },
            { text: 'WHY JRIIT', link: '#about', type: 'tertiary' }
          ]
        }),
        authorId: session.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: session.user.id,
          name: session.user.name || 'Admin',
          email: session.user.email || 'admin@jriit.com'
        }
      },
      {
        id: 'explore-programs',
        name: 'Explore Programs',
        type: 'programs',
        title: 'Explore Our Programs',
        subtitle: 'Choose Your Path to Success',
        content: 'Discover our comprehensive range of programs designed to prepare you for the future of technology.',
        mediaType: 'none',
        mediaUrl: null,
        ctaText: 'View All Programs',
        ctaLink: '/programs',
        isActive: true,
        order: 2,
        settings: '{}',
        authorId: session.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: session.user.id,
          name: session.user.name || 'Admin',
          email: session.user.email || 'admin@jriit.com'
        }
      },
      {
        id: 'about-jriit',
        name: 'About JRIIT',
        type: 'about',
        title: 'About JRIIT',
        subtitle: 'Leading IT Education in Tanzania',
        content: 'Junior Institute of Information Technology (JRIIT) is a leading educational institution in Tanzania, dedicated to providing world-class IT education and training.',
        mediaType: 'image',
        mediaUrl: '/assets/about-jriit.jpg',
        ctaText: 'Learn More',
        ctaLink: '/about',
        isActive: true,
        order: 3,
        settings: '{}',
        authorId: session.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: session.user.id,
          name: session.user.name || 'Admin',
          email: session.user.email || 'admin@jriit.com'
        }
      },
      {
        id: 'statistics-section',
        name: 'Statistics Section',
        type: 'statistics',
        title: 'Our Impact',
        subtitle: 'Numbers That Matter',
        content: 'See how we\'re making a difference in the lives of our students and the community.',
        mediaType: 'none',
        mediaUrl: null,
        ctaText: null,
        ctaLink: null,
        isActive: true,
        order: 4,
        settings: '{}',
        authorId: session.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: session.user.id,
          name: session.user.name || 'Admin',
          email: session.user.email || 'admin@jriit.com'
        }
      },
      {
        id: 'breaking-news',
        name: 'Breaking News Updates',
        type: 'news',
        title: 'Latest News & Updates',
        subtitle: 'Stay Informed',
        content: 'Keep up with the latest news, events, and announcements from JRIIT.',
        mediaType: 'none',
        mediaUrl: null,
        ctaText: 'Read More',
        ctaLink: '/news',
        isActive: true,
        order: 5,
        settings: '{}',
        authorId: session.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: session.user.id,
          name: session.user.name || 'Admin',
          email: session.user.email || 'admin@jriit.com'
        }
      },
      {
        id: 'accreditation-section',
        name: 'NACTE Accreditation',
        type: 'accreditation',
        title: 'NACTE Accredited',
        subtitle: 'Quality Assured Education',
        content: 'Our programs are accredited by the National Council for Technical Education (NACTE), ensuring quality and recognition.',
        mediaType: 'image',
        mediaUrl: '/assets/nacte-logo.jpg',
        ctaText: 'Learn More',
        ctaLink: '/accreditation',
        isActive: true,
        order: 6,
        settings: '{}',
        authorId: session.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: session.user.id,
          name: session.user.name || 'Admin',
          email: session.user.email || 'admin@jriit.com'
        }
      },
      {
        id: 'philosophy-section',
        name: 'Philosophy Section',
        type: 'philosophy',
        title: 'Our Philosophy',
        subtitle: 'Excellence in Education',
        content: 'We believe in providing practical, hands-on education that prepares students for real-world challenges.',
        mediaType: 'none',
        mediaUrl: null,
        ctaText: 'Our Mission',
        ctaLink: '/mission',
        isActive: true,
        order: 7,
        settings: '{}',
        authorId: session.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: session.user.id,
          name: session.user.name || 'Admin',
          email: session.user.email || 'admin@jriit.com'
        }
      },
      {
        id: 'history-section',
        name: 'History Section',
        type: 'history',
        title: 'Our History',
        subtitle: 'A Legacy of Excellence',
        content: 'Founded with a vision to transform IT education in Tanzania, JRIIT has been at the forefront of technological education.',
        mediaType: 'image',
        mediaUrl: '/assets/history.jpg',
        ctaText: 'Our Story',
        ctaLink: '/history',
        isActive: true,
        order: 8,
        settings: '{}',
        authorId: session.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: session.user.id,
          name: session.user.name || 'Admin',
          email: session.user.email || 'admin@jriit.com'
        }
      },
      {
        id: 'partnership-reel',
        name: 'Partnership Reel',
        type: 'partnerships',
        title: 'Our Partners',
        subtitle: 'Industry Connections',
        content: 'We work with leading companies and organizations to provide our students with real-world experience.',
        mediaType: 'none',
        mediaUrl: null,
        ctaText: 'View Partners',
        ctaLink: '/partners',
        isActive: true,
        order: 9,
        settings: '{}',
        authorId: session.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: session.user.id,
          name: session.user.name || 'Admin',
          email: session.user.email || 'admin@jriit.com'
        }
      },
      {
        id: 'upcoming-events',
        name: 'Upcoming Events',
        type: 'events',
        title: 'Upcoming Events',
        subtitle: 'Don\'t Miss Out',
        content: 'Join us for exciting events, workshops, and activities throughout the year.',
        mediaType: 'none',
        mediaUrl: null,
        ctaText: 'View Events',
        ctaLink: '/events',
        isActive: true,
        order: 10,
        settings: '{}',
        authorId: session.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: session.user.id,
          name: session.user.name || 'Admin',
          email: session.user.email || 'admin@jriit.com'
        }
      },
      {
        id: 'campus-news',
        name: 'Campus News',
        type: 'campus-news',
        title: 'Campus News',
        subtitle: 'What\'s Happening',
        content: 'Stay updated with the latest happenings around our campus.',
        mediaType: 'none',
        mediaUrl: null,
        ctaText: 'Read More',
        ctaLink: '/campus-news',
        isActive: true,
        order: 11,
        settings: '{}',
        authorId: session.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: session.user.id,
          name: session.user.name || 'Admin',
          email: session.user.email || 'admin@jriit.com'
        }
      },
      {
        id: 'with-jriit',
        name: 'With JRIIT (Stuff Section)',
        type: 'stuff',
        title: 'With JRIIT',
        subtitle: 'Your Success is Our Mission',
        content: 'Join thousands of successful graduates who have transformed their careers with JRIIT.',
        mediaType: 'none',
        mediaUrl: null,
        ctaText: 'Join Us',
        ctaLink: '/admission',
        isActive: true,
        order: 12,
        settings: '{}',
        authorId: session.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: session.user.id,
          name: session.user.name || 'Admin',
          email: session.user.email || 'admin@jriit.com'
        }
      },
      {
        id: 'quick-downloads',
        name: 'Quick Downloads',
        type: 'downloads',
        title: 'Quick Downloads',
        subtitle: 'Important Documents',
        content: 'Access important documents, forms, and resources for students and applicants.',
        mediaType: 'none',
        mediaUrl: null,
        ctaText: 'Download',
        ctaLink: '/downloads',
        isActive: true,
        order: 13,
        settings: '{}',
        authorId: session.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: session.user.id,
          name: session.user.name || 'Admin',
          email: session.user.email || 'admin@jriit.com'
        }
      },
      {
        id: 'showcase-section',
        name: 'Showcase Section',
        type: 'showcase',
        title: 'Campus Showcase',
        subtitle: 'Explore Our Campus',
        content: 'Take a virtual tour of our state-of-the-art facilities and modern learning environment.',
        mediaType: 'image',
        mediaUrl: '/assets/campus-showcase.jpg',
        ctaText: 'Take Tour',
        ctaLink: '/campus-tour',
        isActive: true,
        order: 14,
        settings: '{}',
        authorId: session.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: session.user.id,
          name: session.user.name || 'Admin',
          email: session.user.email || 'admin@jriit.com'
        }
      }
    ]

    // Filter by component type if specified
    const filteredComponents = componentType === 'all' 
      ? mockComponents 
      : mockComponents.filter(comp => comp.type === componentType)

    return NextResponse.json({
      success: true,
      message: 'Mock website content loaded successfully',
      components: filteredComponents,
      totalComponents: filteredComponents.length,
      loadedAt: new Date().toISOString(),
      source: 'mock-data'
    })

  } catch (error) {
    console.error('Error loading mock website content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load mock website content' },
      { status: 500 }
    )
  }
}
