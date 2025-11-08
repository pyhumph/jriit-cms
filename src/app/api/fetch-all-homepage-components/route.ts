import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

// API to fetch ALL homepage components from the actual website
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const websiteUrl = 'http://localhost:3001' // Your website URL

    // Fetch the actual website content
    const response = await fetch(websiteUrl)
    const html = await response.text()

    // Parse the HTML to extract ALL homepage components
    const components = []

    // 1. Hero Section
    const heroTitle = extractText(html, 'h1') || 'GET READY'
    const heroSubtitle = extractText(html, 'h2') || 'UNLEASH YOUR GREATNESS'
    const heroContent = extractText(html, '.hero-description, p') || 'Join us in shaping the future of technology through innovative education and cutting-edge programs.'
    const videoSrc = extractAttribute(html, 'video source', 'src') || '/ele.mp4'
    
    // Extract all 3 button texts and links
    const ctaText = extractText(html, '.hero-cta, .cta-button') || 'EXPLORE COURSES'
    const cta2Text = extractText(html, '.hero-cta2, .cta-button2') || 'PRICING & SCHOLARSHIPS'
    const cta3Text = extractText(html, '.hero-cta3, .cta-button3') || 'WHY JRIIT'
    
    const ctaLink = extractAttribute(html, '.hero-cta a, .cta-button a', 'href') || '#programs'
    const cta2Link = extractAttribute(html, '.hero-cta2 a, .cta-button2 a', 'href') || '/fees'
    const cta3Link = extractAttribute(html, '.hero-cta3 a, .cta-button3 a', 'href') || '#about'

    components.push({
      id: 'hero-section',
      name: 'Hero Section',
      type: 'hero',
      title: heroTitle,
      subtitle: heroSubtitle,
      content: heroContent,
      mediaType: 'video',
      mediaUrl: videoSrc,
      ctaText: ctaText,
      ctaLink: ctaLink,
      cta2Text: cta2Text,
      cta2Link: cta2Link,
      cta3Text: cta3Text,
      cta3Link: cta3Link,
      isActive: true,
      order: 1,
      settings: JSON.stringify({
        buttons: [
          { text: ctaText, link: ctaLink, type: 'primary' },
          { text: cta2Text, link: cta2Link, type: 'secondary' },
          { text: cta3Text, link: cta3Link, type: 'tertiary' }
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
    })

    // 2. About Section
    const aboutTitle = extractText(html, '.about-title, h2') || 'About JR Institute'
    const aboutContent = extractText(html, '.about-content, .about-description') || 'JR Institute is dedicated to shaping future leaders by providing high-quality education, innovative learning experiences, and a supportive community.'

    components.push({
      id: 'about-section',
      name: 'About Section',
      type: 'about',
      title: aboutTitle,
      content: aboutContent,
      isActive: true,
      order: 2,
      authorId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: session.user.id,
        name: session.user.name || 'Admin',
        email: session.user.email || 'admin@jriit.com'
      }
    })

    // 3. Explore Programs Section
    const programsTitle = extractText(html, '#programs h2') || 'Courses Offered by JRIIT'
    const programsContent = extractText(html, '#programs p') || 'Discover a range of courses designed to ignite your potential and prepare you for success in the future.'

    components.push({
      id: 'programs-section',
      name: 'Explore Programs',
      type: 'programs',
      title: programsTitle,
      content: programsContent,
      isActive: true,
      order: 3,
      authorId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: session.user.id,
        name: session.user.name || 'Admin',
        email: session.user.email || 'admin@jriit.com'
      }
    })

    // 4. Statistics Section
    const statsTitle = extractText(html, '.statistics h2') || 'Our Impact'
    const statsContent = extractText(html, '.statistics p') || 'Numbers that speak to our commitment to excellence and student success.'

    components.push({
      id: 'statistics-section',
      name: 'Statistics Section',
      type: 'statistics',
      title: statsTitle,
      content: statsContent,
      isActive: true,
      order: 4,
      authorId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: session.user.id,
        name: session.user.name || 'Admin',
        email: session.user.email || 'admin@jriit.com'
      }
    })

    // 5. Breaking News Section
    const newsTitle = extractText(html, '.breaking-news h2') || 'Latest News & Updates'
    const newsContent = extractText(html, '.breaking-news p') || 'Stay updated with the latest news and announcements from JRIIT.'

    components.push({
      id: 'breaking-news-section',
      name: 'Breaking News Updates',
      type: 'breaking-news',
      title: newsTitle,
      content: newsContent,
      isActive: true,
      order: 5,
      authorId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: session.user.id,
        name: session.user.name || 'Admin',
        email: session.user.email || 'admin@jriit.com'
      }
    })

    // 6. Accreditation Section
    const accreditationTitle = extractText(html, '.accreditation h2') || 'Accreditation & Recognition'
    const accreditationContent = extractText(html, '.accreditation p') || 'Our programs are recognized and accredited by leading educational bodies.'

    components.push({
      id: 'accreditation-section',
      name: 'Accreditation Section',
      type: 'accreditation',
      title: accreditationTitle,
      content: accreditationContent,
      isActive: true,
      order: 6,
      authorId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: session.user.id,
        name: session.user.name || 'Admin',
        email: session.user.email || 'admin@jriit.com'
      }
    })

    // 7. Philosophy Section
    const philosophyTitle = extractText(html, '.philosophy h2') || 'Our Philosophy'
    const philosophyContent = extractText(html, '.philosophy p') || 'We believe in empowering students through innovative education and practical learning experiences.'

    components.push({
      id: 'philosophy-section',
      name: 'Philosophy Section',
      type: 'philosophy',
      title: philosophyTitle,
      content: philosophyContent,
      isActive: true,
      order: 7,
      authorId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: session.user.id,
        name: session.user.name || 'Admin',
        email: session.user.email || 'admin@jriit.com'
      }
    })

    // 8. History Section
    const historyTitle = extractText(html, '.history h2') || 'Our History'
    const historyContent = extractText(html, '.history p') || 'Founded with a vision to transform education and create future leaders.'

    components.push({
      id: 'history-section',
      name: 'History Section',
      type: 'history',
      title: historyTitle,
      content: historyContent,
      isActive: true,
      order: 8,
      authorId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: session.user.id,
        name: session.user.name || 'Admin',
        email: session.user.email || 'admin@jriit.com'
      }
    })

    // 9. Partnership Reel Section
    const partnershipTitle = extractText(html, '.partnership h2') || 'Our Partners'
    const partnershipContent = extractText(html, '.partnership p') || 'Strategic partnerships that enhance our educational offerings.'

    components.push({
      id: 'partnership-section',
      name: 'Partnership Reel',
      type: 'partnership',
      title: partnershipTitle,
      content: partnershipContent,
      isActive: true,
      order: 9,
      authorId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: session.user.id,
        name: session.user.name || 'Admin',
        email: session.user.email || 'admin@jriit.com'
      }
    })

    // 10. Upcoming Events Section
    const eventsTitle = extractText(html, '.events h2') || 'Upcoming Events'
    const eventsContent = extractText(html, '.events p') || 'Join us for exciting events and activities throughout the year.'

    components.push({
      id: 'events-section',
      name: 'Upcoming Events',
      type: 'events',
      title: eventsTitle,
      content: eventsContent,
      isActive: true,
      order: 10,
      authorId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: session.user.id,
        name: session.user.name || 'Admin',
        email: session.user.email || 'admin@jriit.com'
      }
    })

    // 11. Campus News Section
    const campusNewsTitle = extractText(html, '.campus-news h2') || 'Campus News'
    const campusNewsContent = extractText(html, '.campus-news p') || 'Latest updates from our campus community.'

    components.push({
      id: 'campus-news-section',
      name: 'Campus News',
      type: 'campus-news',
      title: campusNewsTitle,
      content: campusNewsContent,
      isActive: true,
      order: 11,
      authorId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: session.user.id,
        name: session.user.name || 'Admin',
        email: session.user.email || 'admin@jriit.com'
      }
    })

    // 12. With JRIIT Section
    const withJriitTitle = extractText(html, '.with-jriit h2') || 'With JRIIT'
    const withJriitContent = extractText(html, '.with-jriit p') || 'Join our community and be part of something greater.'

    components.push({
      id: 'with-jriit-section',
      name: 'With JRIIT',
      type: 'with-jriit',
      title: withJriitTitle,
      content: withJriitContent,
      isActive: true,
      order: 12,
      authorId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: session.user.id,
        name: session.user.name || 'Admin',
        email: session.user.email || 'admin@jriit.com'
      }
    })

    // 13. Quick Downloads Section
    const downloadsTitle = extractText(html, '.downloads h2') || 'Quick Downloads'
    const downloadsContent = extractText(html, '.downloads p') || 'Access important documents and resources.'

    components.push({
      id: 'downloads-section',
      name: 'Quick Downloads',
      type: 'downloads',
      title: downloadsTitle,
      content: downloadsContent,
      isActive: true,
      order: 13,
      authorId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: session.user.id,
        name: session.user.name || 'Admin',
        email: session.user.email || 'admin@jriit.com'
      }
    })

    // 14. Full Screen Image Section
    const fullscreenTitle = extractText(html, '.fullscreen h2') || 'Full Screen Image'
    const fullscreenContent = extractText(html, '.fullscreen p') || 'Immersive visual experience showcasing our campus.'

    components.push({
      id: 'fullscreen-section',
      name: 'Full Screen Image',
      type: 'fullscreen',
      title: fullscreenTitle,
      content: fullscreenContent,
      isActive: true,
      order: 14,
      authorId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: session.user.id,
        name: session.user.name || 'Admin',
        email: session.user.email || 'admin@jriit.com'
      }
    })

    // 15. Stuff Section
    const stuffTitle = extractText(html, '.stuff h2') || 'Stuff Section'
    const stuffContent = extractText(html, '.stuff p') || 'Additional information and resources.'

    components.push({
      id: 'stuff-section',
      name: 'Stuff Section',
      type: 'stuff',
      title: stuffTitle,
      content: stuffContent,
      isActive: true,
      order: 15,
      authorId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: session.user.id,
        name: session.user.name || 'Admin',
        email: session.user.email || 'admin@jriit.com'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'All homepage components fetched from website',
      components: components,
      totalComponents: components.length
    })

  } catch (error) {
    console.error('Error fetching all homepage components:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch all homepage components from website' },
      { status: 500 }
    )
  }
}

// Helper function to extract text from HTML
function extractText(html: string, selector: string): string | null {
  try {
    // Simple regex-based extraction (in a real implementation, you'd use a proper HTML parser)
    const regex = new RegExp(`<[^>]*class="[^"]*${selector.replace('.', '')}[^"]*"[^>]*>([^<]*)</[^>]*>`, 'i')
    const match = html.match(regex)
    return match ? match[1].trim() : null
  } catch (error) {
    return null
  }
}

// Helper function to extract attribute from HTML
function extractAttribute(html: string, selector: string, attribute: string): string | null {
  try {
    // Simple regex-based extraction
    const regex = new RegExp(`<[^>]*class="[^"]*${selector.replace('.', '')}[^"]*"[^>]*${attribute}="([^"]*)"[^>]*>`, 'i')
    const match = html.match(regex)
    return match ? match[1].trim() : null
  } catch (error) {
    return null
  }
}
