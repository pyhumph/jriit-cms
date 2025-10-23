import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding homepage components...')

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

  // Create homepage components
  const homepageComponents = [
    {
      name: 'Hero Section',
      type: 'hero',
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
      name: 'About JRIIT',
      type: 'about',
      title: 'About JR Institute',
      subtitle: 'Leading the Way in IT Education',
      content: 'JR Institute is dedicated to shaping future leaders by providing high-quality education, innovative learning experiences, and a supportive community. Our programs are designed to equip students with the knowledge, practical skills, and confidence they need to excel in their careers and personal lives.',
      isActive: true,
      order: 2
    },
    {
      name: 'Programs Showcase',
      type: 'programs',
      title: 'Courses Offered by JRIIT',
      subtitle: 'Discover a range of courses designed to ignite your potential',
      content: 'Explore our comprehensive programs in Computer Science, Information Technology, Cybersecurity, and more.',
      ctaText: 'View All Programs',
      ctaLink: '/programs',
      isActive: true,
      order: 3
    },
    {
      name: 'Statistics Section',
      type: 'statistics',
      title: 'Our Impact',
      subtitle: 'Numbers that speak for themselves',
      content: 'Join thousands of successful graduates who have transformed their careers through our programs.',
      isActive: true,
      order: 4
    },
    {
      name: 'Breaking News Updates',
      type: 'breaking-news',
      title: 'Latest News & Updates',
      subtitle: 'Stay informed with our latest announcements',
      content: 'Admissions Open for 2025-2026 Academic Year. Apply now and secure your future in technology.',
      isActive: true,
      order: 5
    },
    {
      name: 'Student Testimonials',
      type: 'testimonials',
      title: 'What Our Students Say',
      subtitle: 'Success stories from our community',
      content: 'Hear from our students and alumni about their transformative experiences at JRIIT.',
      isActive: true,
      order: 6
    },
    {
      name: 'Quick Downloads',
      type: 'downloads',
      title: 'Important Documents',
      subtitle: 'Download forms and guides',
      content: 'Access brochures, application forms, and other important documents.',
      ctaText: 'Download Now',
      ctaLink: '/downloads',
      isActive: true,
      order: 7
    },
    {
      name: 'Photo Gallery',
      type: 'gallery',
      title: 'Campus Life',
      subtitle: 'See our facilities and student life',
      content: 'Explore our state-of-the-art facilities, modern classrooms, and vibrant campus life.',
      isActive: true,
      order: 8
    }
  ]

  // Create or update homepage components
  for (const component of homepageComponents) {
    const existing = await prisma.homepageComponent.findFirst({
      where: { type: component.type }
    })

    if (existing) {
      await prisma.homepageComponent.update({
        where: { id: existing.id },
        data: {
          ...component,
          authorId: admin.id
        }
      })
      console.log(`✅ Updated ${component.name}`)
    } else {
      await prisma.homepageComponent.create({
        data: {
          ...component,
          authorId: admin.id
        }
      })
      console.log(`✅ Created ${component.name}`)
    }
  }

  // Create hero slides
  const heroSlides = [
    {
      title: 'Welcome to JRIIT',
      subtitle: 'Empowering Future Technology Leaders',
      description: 'Join us in shaping the future of technology through innovative education and cutting-edge programs.',
      mediaType: 'video',
      mediaUrl: '/assets/ele.mp4',
      ctaText: 'Explore Programs',
      ctaLink: '/programs',
      isActive: true,
      order: 1
    },
    {
      title: 'Excellence in Education',
      subtitle: 'Leading the Way in IT Education',
      description: 'Discover our world-class programs in Computer Science, Cybersecurity, and Information Technology.',
      mediaType: 'image',
      mediaUrl: '/assets/hero-img-1.jpg',
      ctaText: 'Apply Now',
      ctaLink: '/admission',
      isActive: true,
      order: 2
    },
    {
      title: 'Innovation Hub',
      subtitle: 'Where Ideas Come to Life',
      description: 'Experience hands-on learning with state-of-the-art facilities and industry partnerships.',
      mediaType: 'image',
      mediaUrl: '/assets/hero-img-2.jpg',
      ctaText: 'Campus Tour',
      ctaLink: '/campus-tour',
      isActive: false,
      order: 3
    }
  ]

  // Create or update hero slides
  for (const slide of heroSlides) {
    const existing = await prisma.heroSlide.findFirst({
      where: { 
        title: slide.title,
        subtitle: slide.subtitle
      }
    })

    if (existing) {
      await prisma.heroSlide.update({
        where: { id: existing.id },
        data: {
          ...slide,
          authorId: admin.id
        }
      })
      console.log(`✅ Updated hero slide: ${slide.title}`)
    } else {
      await prisma.heroSlide.create({
        data: {
          ...slide,
          authorId: admin.id
        }
      })
      console.log(`✅ Created hero slide: ${slide.title}`)
    }
  }

  console.log('🎉 Homepage components seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding homepage components:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


