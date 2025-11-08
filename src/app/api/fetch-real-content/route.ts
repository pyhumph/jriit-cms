import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

// API to fetch REAL content from the actual website
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const componentType = searchParams.get('type') || 'all'
    const websiteUrl = 'http://localhost:3001' // Your website URL

    // Fetch the actual website content
    const response = await fetch(websiteUrl)
    const html = await response.text()

    // Parse the HTML to extract real content
    const components = []

    // Extract Hero Section content
    if (componentType === 'all' || componentType === 'hero') {
      const heroTitle = extractText(html, 'h1') || 'GET READY'
      const heroSubtitle = extractText(html, 'h2') || 'UNLEASH YOUR GREATNESS'
      const heroContent = extractText(html, '.hero-description, p') || 'Join us in shaping the future of technology through innovative education and cutting-edge programs.'
      const videoSrc = extractAttribute(html, 'video source', 'src') || '/ele.mp4'
      
      // Extract button texts
      const ctaText = extractText(html, '.hero-cta, .cta-button') || 'EXPLORE COURSES'
      const cta2Text = extractText(html, '.hero-cta2, .cta-button2') || 'PRICING & SCHOLARSHIPS'
      const cta3Text = extractText(html, '.hero-cta3, .cta-button3') || 'WHY JRIIT'
      
      // Extract button links
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
    }

    // Extract About Section content
    if (componentType === 'all' || componentType === 'about') {
      const aboutTitle = extractText(html, '.about-title, h2') || 'About JR Institute'
      const aboutContent = extractText(html, '.about-content, .about-description') || 'JR Institute is dedicated to shaping future leaders by providing high-quality education, innovative learning experiences, and a supportive community. Our programs are designed to equip students with the knowledge, practical skills, and confidence they need to excel in their careers and personal lives. We value diversity, creativity, and excellence, ensuring that every student feels empowered to achieve their full potential in a world of endless opportunities.'

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
    }

    return NextResponse.json({
      success: true,
      message: 'Real content fetched from website',
      components: components,
      totalComponents: components.length
    })

  } catch (error) {
    console.error('Error fetching real content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch real content from website' },
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
