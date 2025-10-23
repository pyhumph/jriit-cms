import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding website pages and components...')

  // First, ensure we have an admin user
  let admin = await prisma.admin.findFirst({
    where: { email: 'admin@jriit.com' }
  })

  if (!admin) {
    const hashedPassword = await bcrypt.hash('admin123', 12)
    admin = await prisma.admin.create({
      data: {
        email: 'admin@jriit.com',
        password: hashedPassword,
        name: 'JRIIT Admin',
        role: 'ADMIN'
      }
    })
    console.log('✅ Created admin user')
  }

  // Create website pages
  const websitePages = [
    {
      name: 'Homepage',
      slug: 'homepage',
      title: 'JRIIT - Leading IT Education in Tanzania',
      description: 'Join JRIIT for world-class IT education and career opportunities',
      metaTitle: 'JRIIT - IT Education Tanzania',
      metaDescription: 'Leading institute for Information Technology education in Tanzania',
      isActive: true,
      order: 1
    },
    {
      name: 'About',
      slug: 'about',
      title: 'About JRIIT - Our Story',
      description: 'Learn about JRIIT\'s mission, vision, and commitment to excellence',
      metaTitle: 'About JRIIT - Our Mission & Vision',
      metaDescription: 'Discover JRIIT\'s mission to provide quality IT education in Tanzania',
      isActive: true,
      order: 2
    },
    {
      name: 'Programs',
      slug: 'programs',
      title: 'Academic Programs - JRIIT',
      description: 'Explore our comprehensive range of IT and business programs',
      metaTitle: 'Academic Programs - JRIIT',
      metaDescription: 'Discover our IT and business programs designed for career success',
      isActive: true,
      order: 3
    },
    {
      name: 'Contact',
      slug: 'contact',
      title: 'Contact Us - JRIIT',
      description: 'Get in touch with JRIIT for admissions and information',
      metaTitle: 'Contact JRIIT - Get in Touch',
      metaDescription: 'Contact JRIIT for admissions, information, and support',
      isActive: true,
      order: 4
    },
    {
      name: 'Admission',
      slug: 'admission',
      title: 'Admissions - JRIIT',
      description: 'Apply to JRIIT and start your IT career journey',
      metaTitle: 'Admissions - Apply to JRIIT',
      metaDescription: 'Apply to JRIIT programs and start your IT education',
      isActive: true,
      order: 5
    }
  ]

  // Create or update website pages
  for (const page of websitePages) {
    const existing = await prisma.websitePage.findFirst({
      where: { slug: page.slug }
    })

    if (existing) {
      await prisma.websitePage.update({
        where: { id: existing.id },
        data: {
          ...page,
          authorId: admin.id
        }
      })
      console.log(`✅ Updated website page: ${page.name}`)
    } else {
      await prisma.websitePage.create({
        data: {
          ...page,
          authorId: admin.id
        }
      })
      console.log(`✅ Created website page: ${page.name}`)
    }
  }

  // Create page components for each page
  const pageComponents = [
    // Homepage components
    {
      pageName: 'homepage',
      componentName: 'hero',
      title: 'GET READY',
      subtitle: 'UNLEASH YOUR GREATNESS',
      content: 'Join us in shaping the future of technology through innovative education and cutting-edge programs.',
      mediaType: 'video',
      mediaUrl: '/assets/ele.mp4',
      ctaText: 'EXPLORE COURSES',
      ctaLink: '#programs',
      isActive: true,
      order: 1
    },
    {
      pageName: 'homepage',
      componentName: 'about-section',
      title: 'About JR Institute',
      subtitle: 'Leading the Way in IT Education',
      content: 'JR Institute is dedicated to shaping future leaders by providing high-quality education, innovative learning experiences, and a supportive community.',
      isActive: true,
      order: 2
    },
    {
      pageName: 'homepage',
      componentName: 'programs-showcase',
      title: 'Courses Offered by JRIIT',
      subtitle: 'Discover a range of courses designed to ignite your potential',
      content: 'Explore our comprehensive programs in Computer Science, Information Technology, Cybersecurity, and more.',
      ctaText: 'View All Programs',
      ctaLink: '/programs',
      isActive: true,
      order: 3
    },
    {
      pageName: 'homepage',
      componentName: 'statistics',
      title: 'Our Impact',
      subtitle: 'Numbers that speak for themselves',
      content: 'Join thousands of successful graduates who have transformed their careers through our programs.',
      isActive: true,
      order: 4
    },
    {
      pageName: 'homepage',
      componentName: 'breaking-news',
      title: 'Latest News & Updates',
      subtitle: 'Stay informed with our latest announcements',
      content: 'Admissions Open for 2025-2026 Academic Year. Apply now and secure your future in technology.',
      isActive: true,
      order: 5
    },

    // About page components
    {
      pageName: 'about',
      componentName: 'hero',
      title: 'About JRIIT',
      subtitle: 'Empowering Future Technology Leaders',
      content: 'Discover our mission, vision, and commitment to providing world-class IT education in Tanzania.',
      mediaType: 'image',
      mediaUrl: '/assets/about-hero.jpg',
      ctaText: 'Learn More',
      ctaLink: '#mission',
      isActive: true,
      order: 1
    },
    {
      pageName: 'about',
      componentName: 'mission-vision',
      title: 'Our Mission & Vision',
      subtitle: 'Shaping the Future of IT Education',
      content: 'Our mission is to provide accessible, high-quality IT education that prepares students for successful careers in technology.',
      isActive: true,
      order: 2
    },
    {
      pageName: 'about',
      componentName: 'history',
      title: 'Our History',
      subtitle: 'A Legacy of Excellence',
      content: 'Founded with a vision to bridge the digital divide in Tanzania, JRIIT has been at the forefront of IT education for over a decade.',
      isActive: true,
      order: 3
    },
    {
      pageName: 'about',
      componentName: 'leadership',
      title: 'Leadership Team',
      subtitle: 'Experienced Professionals',
      content: 'Meet our dedicated team of educators and administrators who are committed to student success.',
      isActive: true,
      order: 4
    },

    // Programs page components
    {
      pageName: 'programs',
      componentName: 'hero',
      title: 'Academic Programs',
      subtitle: 'Discover Your Path to Success',
      content: 'Explore our comprehensive range of academic programs designed to prepare you for success in the digital age.',
      mediaType: 'image',
      mediaUrl: '/assets/programs-hero.jpg',
      ctaText: 'Browse Programs',
      ctaLink: '#programs-list',
      isActive: true,
      order: 1
    },
    {
      pageName: 'programs',
      componentName: 'programs-filter',
      title: 'Find Your Program',
      subtitle: 'Filter by level, field, or career interest',
      content: 'Use our advanced search and filter tools to find the perfect program for your career goals.',
      isActive: true,
      order: 2
    },
    {
      pageName: 'programs',
      componentName: 'programs-list',
      title: 'All Programs',
      subtitle: 'Comprehensive Academic Offerings',
      content: 'Browse our complete catalog of undergraduate, graduate, diploma, and certificate programs.',
      isActive: true,
      order: 3
    },
    {
      pageName: 'programs',
      componentName: 'admission-process',
      title: 'How to Apply',
      subtitle: 'Simple Steps to Start Your Journey',
      content: 'Follow our streamlined application process to begin your academic journey at JRIIT.',
      isActive: true,
      order: 4
    },

    // Contact page components
    {
      pageName: 'contact',
      componentName: 'hero',
      title: 'Get in Touch with Us',
      subtitle: 'We\'d Love to Hear from You',
      content: 'Have questions about our programs, admissions, or anything else? We\'d love to hear from you.',
      mediaType: 'image',
      mediaUrl: '/assets/contact-hero.jpg',
      ctaText: 'Contact Us',
      ctaLink: '#contact-form',
      isActive: true,
      order: 1
    },
    {
      pageName: 'contact',
      componentName: 'contact-form',
      title: 'Send Us a Message',
      subtitle: 'We\'ll Get Back to You Promptly',
      content: 'Fill out the form below and we will get back to you as soon as possible.',
      isActive: true,
      order: 2
    },
    {
      pageName: 'contact',
      componentName: 'contact-info',
      title: 'Contact Information',
      subtitle: 'Multiple Ways to Reach Us',
      content: 'Find our address, phone numbers, email addresses, and office hours.',
      isActive: true,
      order: 3
    },
    {
      pageName: 'contact',
      componentName: 'map',
      title: 'Find Us on the Map',
      subtitle: 'Visit Our Campus',
      content: 'Visit our campus and experience the JRIIT difference firsthand.',
      isActive: true,
      order: 4
    },

    // Admission page components
    {
      pageName: 'admission',
      componentName: 'hero',
      title: 'Apply to JRIIT',
      subtitle: 'Start Your IT Career Journey',
      content: 'Join thousands of students who have chosen JRIIT for their education and career success.',
      mediaType: 'image',
      mediaUrl: '/assets/admission-hero.jpg',
      ctaText: 'Apply Now',
      ctaLink: '#application-form',
      isActive: true,
      order: 1
    },
    {
      pageName: 'admission',
      componentName: 'requirements',
      title: 'Admission Requirements',
      subtitle: 'What You Need to Apply',
      content: 'Review the admission requirements for your chosen program and prepare your application.',
      isActive: true,
      order: 2
    },
    {
      pageName: 'admission',
      componentName: 'application-form',
      title: 'Application Form',
      subtitle: 'Complete Your Application',
      content: 'Fill out our online application form to begin your journey at JRIIT.',
      isActive: true,
      order: 3
    },
    {
      pageName: 'admission',
      componentName: 'important-dates',
      title: 'Important Dates',
      subtitle: 'Application Deadlines',
      content: 'Stay informed about application deadlines, exam dates, and other important milestones.',
      isActive: true,
      order: 4
    }
  ]

  // Create or update page components
  for (const component of pageComponents) {
    const existing = await prisma.pageComponent.findFirst({
      where: { 
        pageName: component.pageName,
        componentName: component.componentName
      }
    })

    if (existing) {
      await prisma.pageComponent.update({
        where: { id: existing.id },
        data: {
          ...component,
          authorId: admin.id
        }
      })
      console.log(`✅ Updated component: ${component.pageName} - ${component.componentName}`)
    } else {
      await prisma.pageComponent.create({
        data: {
          ...component,
          authorId: admin.id
        }
      })
      console.log(`✅ Created component: ${component.pageName} - ${component.componentName}`)
    }
  }

  console.log('🎉 Website pages and components seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding website pages:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
