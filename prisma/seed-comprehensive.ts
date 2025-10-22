import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting comprehensive database seeding...')

  // 1. Create Admin User
  console.log('👤 Creating admin user...')
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@jriit.com' },
    update: {},
    create: {
      email: 'admin@jriit.com',
      password: hashedPassword,
      name: 'System Administrator',
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // 2. Create Global Settings
  console.log('⚙️ Creating global settings...')
  const globalSettings = await prisma.globalSettings.upsert({
    where: { id: 'global-settings' },
    update: {},
    create: {
      id: 'global-settings',
      siteName: 'JRIIIT Institute',
      siteTagline: 'Empowering Future Technology Leaders',
      siteDescription: 'Leading institute for Information Technology, Cybersecurity, and Computer Science education.',
      academicYear: '2025-2026',
      currentYear: 2025,
      copyrightText: '© {CURRENT_YEAR} {SITE_NAME}. All rights reserved.',
      contactEmail: 'info@jriit.com',
      contactPhone: '+1 (555) 123-4567',
      contactAddress: '123 Education Street',
      contactCity: 'Tech City',
      contactState: 'TC',
      contactZip: '12345',
      contactCountry: 'United States',
      facebookUrl: 'https://facebook.com/jriit',
      twitterUrl: 'https://twitter.com/jriit',
      instagramUrl: 'https://instagram.com/jriit',
      linkedinUrl: 'https://linkedin.com/company/jriit',
      youtubeUrl: 'https://youtube.com/jriit',
      announcementBanner: 'Welcome to JRIIIT Institute - Admissions Open for 2025-2026!',
      announcementLink: '/admissions',
      showAnnouncement: true,
      defaultMetaTitle: 'JRIIIT Institute - Leading Technology Education',
      defaultMetaDescription: 'Premier institute for Information Technology, Cybersecurity, and Computer Science programs.',
      defaultMetaKeywords: 'technology, education, IT, cybersecurity, computer science, programming',
    },
  })
  console.log('✅ Global settings created')

  // 3. Create Text Snippets
  console.log('📝 Creating text snippets...')
  const textSnippets = [
    {
      key: 'welcome_message',
      title: 'Welcome Message',
      content: 'Welcome to {SITE_NAME} - Empowering Future Technology Leaders',
      description: 'Main welcome message displayed on homepage',
      category: 'homepage',
    },
    {
      key: 'academic_year_display',
      title: 'Academic Year Display',
      content: 'Academic Year {ACADEMIC_YEAR}',
      description: 'Academic year text used across the site',
      category: 'general',
    },
    {
      key: 'footer_copyright',
      title: 'Footer Copyright',
      content: '© {CURRENT_YEAR} {SITE_NAME}. All rights reserved.',
      description: 'Copyright text for footer',
      category: 'footer',
    },
    {
      key: 'hero_subtitle',
      title: 'Hero Section Subtitle',
      content: 'Empowering Future Technology Leaders',
      description: 'Subtitle for hero section',
      category: 'homepage',
    },
    {
      key: 'contact_info',
      title: 'Contact Information',
      content: 'Contact us at {CONTACT_EMAIL} or call {CONTACT_PHONE}',
      description: 'Contact information snippet',
      category: 'contact',
    },
  ]

  for (const snippet of textSnippets) {
    await prisma.textSnippet.upsert({
      where: { key: snippet.key },
      update: {},
      create: snippet,
    })
  }
  console.log('✅ Text snippets created')

  // 4. Create Navigation Menu
  console.log('🧭 Creating navigation menu...')
  const navigationItems = [
    // Main Menu Items
    { label: 'Home', url: '/', order: 1, level: 0, position: 'HEADER' },
    { label: 'About', url: '/about', order: 2, level: 0, position: 'HEADER' },
    { label: 'Programs', url: '/programs', order: 3, level: 0, position: 'HEADER' },
    { label: 'Admissions', url: '/admissions', order: 4, level: 0, position: 'HEADER' },
    { label: 'News & Events', url: '/news', order: 5, level: 0, position: 'HEADER' },
    { label: 'Gallery', url: '/gallery/photos', order: 6, level: 0, position: 'HEADER' },
    { label: 'Contact', url: '/contact', order: 7, level: 0, position: 'HEADER' },
    
    // Footer Menu Items
    { label: 'Privacy Policy', url: '/privacy', order: 1, level: 0, position: 'FOOTER' },
    { label: 'Terms of Service', url: '/terms', order: 2, level: 0, position: 'FOOTER' },
    { label: 'Academic Calendar', url: '/calendar', order: 3, level: 0, position: 'FOOTER' },
  ]

  for (const item of navigationItems) {
    await prisma.navigation.create({
      data: item,
    })
  }
  console.log('✅ Navigation menu created')

  // 5. Create Departments
  console.log('🏫 Creating departments...')
  const departments = [
    {
      name: 'Information Technology',
      slug: 'information-technology',
      description: 'Leading department in IT education and research',
      headOfDepartment: 'Dr. Sarah Johnson',
      email: 'it@jriit.com',
      phone: '+1 (555) 123-4567',
      office: 'Building A, Room 101',
      order: 1,
      authorId: admin.id,
    },
    {
      name: 'Cybersecurity',
      slug: 'cybersecurity',
      description: 'Specialized department for cybersecurity education',
      headOfDepartment: 'Dr. Michael Chen',
      email: 'cyber@jriit.com',
      phone: '+1 (555) 123-4568',
      office: 'Building B, Room 201',
      order: 2,
      authorId: admin.id,
    },
    {
      name: 'Computer Science',
      slug: 'computer-science',
      description: 'Core computer science programs and research',
      headOfDepartment: 'Dr. Emily Rodriguez',
      email: 'cs@jriit.com',
      phone: '+1 (555) 123-4569',
      office: 'Building C, Room 301',
      order: 3,
      authorId: admin.id,
    },
  ]

  const createdDepartments = []
  for (const dept of departments) {
    const department = await prisma.department.upsert({
      where: { slug: dept.slug },
      update: {},
      create: dept,
    })
    createdDepartments.push(department)
  }
  console.log('✅ Departments created')

  // 6. Create Programs
  console.log('📚 Creating programs...')
  const programs = [
    {
      name: 'Bachelor of Information Technology',
      slug: 'bachelor-information-technology',
      description: 'Comprehensive 4-year program covering all aspects of IT',
      shortDescription: '4-year comprehensive IT program',
      duration: '4 years',
      degree: 'Bachelor',
      departmentId: createdDepartments[0].id,
      requirements: 'High school diploma, Mathematics background',
      curriculum: 'Programming, Database Management, Networking, Web Development',
      careerOpportunities: 'Software Developer, System Administrator, IT Consultant',
      isActive: true,
      isFeatured: true,
      order: 1,
      authorId: admin.id,
    },
    {
      name: 'Diploma in Cybersecurity',
      slug: 'diploma-cybersecurity',
      description: 'Intensive 2-year cybersecurity program',
      shortDescription: '2-year intensive cybersecurity program',
      duration: '2 years',
      degree: 'Diploma',
      departmentId: createdDepartments[1].id,
      requirements: 'High school diploma, Basic computer knowledge',
      curriculum: 'Network Security, Ethical Hacking, Digital Forensics',
      careerOpportunities: 'Cybersecurity Analyst, Penetration Tester, Security Consultant',
      isActive: true,
      isFeatured: true,
      order: 2,
      authorId: admin.id,
    },
    {
      name: 'Certificate in Web Development',
      slug: 'certificate-web-development',
      description: '6-month intensive web development program',
      shortDescription: '6-month web development certificate',
      duration: '6 months',
      degree: 'Certificate',
      departmentId: createdDepartments[0].id,
      requirements: 'Basic computer literacy',
      curriculum: 'HTML, CSS, JavaScript, React, Node.js',
      careerOpportunities: 'Web Developer, Frontend Developer, Full-stack Developer',
      isActive: true,
      isFeatured: false,
      order: 3,
      authorId: admin.id,
    },
  ]

  for (const program of programs) {
    await prisma.program.upsert({
      where: { slug: program.slug },
      update: {},
      create: program,
    })
  }
  console.log('✅ Programs created')

  // 7. Create Faculty
  console.log('👨‍🏫 Creating faculty...')
  const faculty = [
    {
      name: 'Dr. Sarah Johnson',
      title: 'Head of Information Technology',
      email: 'sarah.johnson@jriit.com',
      phone: '+1 (555) 123-4570',
      bio: 'Expert in software engineering with 15 years of industry experience',
      departmentId: createdDepartments[0].id,
      specialization: 'Software Engineering, Database Systems',
      education: 'PhD in Computer Science, MIT',
      experience: '15 years in software development and education',
      isActive: true,
      order: 1,
      authorId: admin.id,
    },
    {
      name: 'Dr. Michael Chen',
      title: 'Head of Cybersecurity',
      email: 'michael.chen@jriit.com',
      phone: '+1 (555) 123-4571',
      bio: 'Cybersecurity expert with extensive industry experience',
      departmentId: createdDepartments[1].id,
      specialization: 'Network Security, Ethical Hacking',
      education: 'PhD in Cybersecurity, Stanford',
      experience: '12 years in cybersecurity and research',
      isActive: true,
      order: 2,
      authorId: admin.id,
    },
    {
      name: 'Dr. Emily Rodriguez',
      title: 'Head of Computer Science',
      email: 'emily.rodriguez@jriit.com',
      phone: '+1 (555) 123-4572',
      bio: 'Computer science researcher and educator',
      departmentId: createdDepartments[2].id,
      specialization: 'Algorithms, Machine Learning',
      education: 'PhD in Computer Science, Carnegie Mellon',
      experience: '10 years in computer science research',
      isActive: true,
      order: 3,
      authorId: admin.id,
    },
  ]

  for (const facultyMember of faculty) {
    await prisma.faculty.upsert({
      where: { email: facultyMember.email },
      update: {},
      create: facultyMember,
    })
  }
  console.log('✅ Faculty created')

  // 8. Create Sample News
  console.log('📰 Creating sample news...')
  const newsItems = [
    {
      title: 'New Cybersecurity Lab Opens',
      slug: 'new-cybersecurity-lab-opens',
      content: `
        <h2>State-of-the-Art Cybersecurity Lab</h2>
        <p>We are excited to announce the opening of our new cybersecurity laboratory, equipped with the latest technology and security tools.</p>
        <h3>Features</h3>
        <ul>
          <li>Advanced penetration testing equipment</li>
          <li>Network simulation environment</li>
          <li>Digital forensics workstations</li>
          <li>Secure coding practice stations</li>
        </ul>
        <p>This lab will provide our students with hands-on experience in real-world cybersecurity scenarios.</p>
      `,
      excerpt: 'New state-of-the-art cybersecurity laboratory opens with advanced equipment and tools.',
      published: true,
      publishedAt: new Date(),
      category: 'Campus News',
      tags: JSON.stringify(['cybersecurity', 'lab', 'technology']),
      isBreaking: false,
      isFeatured: true,
      authorId: admin.id,
    },
    {
      title: 'Admissions Open for 2025-2026',
      slug: 'admissions-open-2025-2026',
      content: `
        <h2>Admissions Now Open</h2>
        <p>Applications are now being accepted for the 2025-2026 academic year. We offer a wide range of programs in Information Technology, Cybersecurity, and Computer Science.</p>
        <h3>Application Deadlines</h3>
        <ul>
          <li>Early Decision: March 15, 2025</li>
          <li>Regular Decision: May 1, 2025</li>
          <li>Late Applications: June 15, 2025</li>
        </ul>
        <p>Apply now to secure your spot in our prestigious programs!</p>
      `,
      excerpt: 'Applications are now being accepted for the 2025-2026 academic year.',
      published: true,
      publishedAt: new Date(),
      category: 'Admissions',
      tags: JSON.stringify(['admissions', '2025-2026', 'applications']),
      isBreaking: true,
      isFeatured: true,
      authorId: admin.id,
    },
  ]

  for (const news of newsItems) {
    await prisma.news.upsert({
      where: { slug: news.slug },
      update: {},
      create: news,
    })
  }
  console.log('✅ Sample news created')

  // 9. Create Sample Events
  console.log('📅 Creating sample events...')
  const events = [
    {
      title: 'Open House 2025',
      slug: 'open-house-2025',
      description: 'Join us for our annual open house event',
      content: `
        <h2>Open House 2025</h2>
        <p>Discover what makes JRIIIT Institute the leading choice for technology education.</p>
        <h3>Event Highlights</h3>
        <ul>
          <li>Campus tours</li>
          <li>Program presentations</li>
          <li>Faculty meet and greet</li>
          <li>Student showcase</li>
        </ul>
      `,
      startDate: new Date('2025-03-15T10:00:00Z'),
      endDate: new Date('2025-03-15T16:00:00Z'),
      location: 'Main Campus',
      venue: 'Auditorium',
      isPublic: true,
      isFree: true,
      category: 'Open House',
      tags: JSON.stringify(['open house', 'campus tour', 'admissions']),
      isFeatured: true,
      authorId: admin.id,
    },
    {
      title: 'Cybersecurity Workshop',
      slug: 'cybersecurity-workshop-2025',
      description: 'Hands-on cybersecurity workshop for students',
      content: `
        <h2>Cybersecurity Workshop</h2>
        <p>Learn practical cybersecurity skills in this intensive workshop.</p>
        <h3>Workshop Topics</h3>
        <ul>
          <li>Network security fundamentals</li>
          <li>Penetration testing basics</li>
          <li>Digital forensics introduction</li>
          <li>Security best practices</li>
        </ul>
      `,
      startDate: new Date('2025-04-20T09:00:00Z'),
      endDate: new Date('2025-04-20T17:00:00Z'),
      location: 'Cybersecurity Lab',
      venue: 'Building B, Room 201',
      isPublic: true,
      isFree: true,
      category: 'Workshop',
      tags: JSON.stringify(['workshop', 'cybersecurity', 'hands-on']),
      isFeatured: false,
      authorId: admin.id,
    },
  ]

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {},
      create: event,
    })
  }
  console.log('✅ Sample events created')

  // 10. Create Sample Pages
  console.log('📄 Creating sample pages...')
  const pages = [
    {
      title: 'About Us',
      slug: 'about',
      content: `
        <h1>About JRIIIT Institute</h1>
        <p>JRIIIT Institute is a leading educational institution dedicated to providing world-class education in Information Technology, Cybersecurity, and Computer Science.</p>
        <h2>Our Mission</h2>
        <p>To empower students with cutting-edge knowledge and practical skills that prepare them for successful careers in the technology industry.</p>
        <h2>Our Vision</h2>
        <p>To be the premier institute for technology education, recognized globally for our excellence in teaching and research.</p>
      `,
      excerpt: 'Learn about JRIIIT Institute, our mission, vision, and commitment to technology education.',
      published: true,
      publishedAt: new Date(),
      isHomepage: false,
      showInMenu: true,
      order: 1,
      authorId: admin.id,
    },
    {
      title: 'Contact Us',
      slug: 'contact',
      content: `
        <h1>Contact Information</h1>
        <p>Get in touch with us for more information about our programs and admissions.</p>
        <h2>Contact Details</h2>
        <p><strong>Email:</strong> info@jriit.com</p>
        <p><strong>Phone:</strong> +1 (555) 123-4567</p>
        <p><strong>Address:</strong> 123 Education Street, Tech City, TC 12345</p>
      `,
      excerpt: 'Contact JRIIIT Institute for information about programs and admissions.',
      published: true,
      publishedAt: new Date(),
      isHomepage: false,
      showInMenu: true,
      order: 2,
      authorId: admin.id,
    },
  ]

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    })
  }
  console.log('✅ Sample pages created')

  // 11. Create Testimonials
  console.log('💬 Creating testimonials...')
  const testimonials = [
    {
      name: 'John Smith',
      title: 'IT Graduate, Class of 2023',
      content: 'JRIIIT Institute provided me with the skills and knowledge needed to excel in my career. The hands-on approach and industry-relevant curriculum were exceptional.',
      rating: 5,
      isActive: true,
      order: 1,
      authorId: admin.id,
    },
    {
      name: 'Sarah Johnson',
      title: 'Cybersecurity Graduate, Class of 2022',
      content: 'The cybersecurity program at JRIIIT is outstanding. The faculty is knowledgeable and the lab facilities are state-of-the-art.',
      rating: 5,
      isActive: true,
      order: 2,
      authorId: admin.id,
    },
    {
      name: 'Michael Chen',
      title: 'Computer Science Graduate, Class of 2023',
      content: 'The computer science program prepared me well for my career in software development. I highly recommend JRIIIT Institute.',
      rating: 5,
      isActive: true,
      order: 3,
      authorId: admin.id,
    },
  ]

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: testimonial,
    })
  }
  console.log('✅ Testimonials created')

  // 12. Create Fee Structures
  console.log('💰 Creating fee structures...')
  const feeStructures = [
    {
      programId: (await prisma.program.findFirst({ where: { slug: 'bachelor-information-technology' } }))?.id,
      academicYear: '2025-2026',
      semester: 'Per Year',
      tuitionFee: 15000,
      registrationFee: 500,
      libraryFee: 200,
      labFee: 300,
      totalFee: 16000,
      currency: 'USD',
      paymentDeadline: new Date('2025-08-15'),
      notes: 'Payment plans available',
      isActive: true,
      authorId: admin.id,
    },
    {
      programId: (await prisma.program.findFirst({ where: { slug: 'diploma-cybersecurity' } }))?.id,
      academicYear: '2025-2026',
      semester: 'Per Year',
      tuitionFee: 12000,
      registrationFee: 500,
      libraryFee: 200,
      labFee: 400,
      totalFee: 13100,
      currency: 'USD',
      paymentDeadline: new Date('2025-08-15'),
      notes: 'Scholarships available for eligible students',
      isActive: true,
      authorId: admin.id,
    },
  ]

  for (const fee of feeStructures) {
    if (fee.programId) {
      await prisma.feeStructure.create({
        data: fee,
      })
    }
  }
  console.log('✅ Fee structures created')

  console.log('🎉 Comprehensive database seeding completed successfully!')
  console.log('📊 Summary:')
  console.log(`   - Admin users: 1`)
  console.log(`   - Global settings: 1`)
  console.log(`   - Text snippets: ${textSnippets.length}`)
  console.log(`   - Navigation items: ${navigationItems.length}`)
  console.log(`   - Departments: ${departments.length}`)
  console.log(`   - Programs: ${programs.length}`)
  console.log(`   - Faculty: ${faculty.length}`)
  console.log(`   - News items: ${newsItems.length}`)
  console.log(`   - Events: ${events.length}`)
  console.log(`   - Pages: ${pages.length}`)
  console.log(`   - Testimonials: ${testimonials.length}`)
  console.log(`   - Fee structures: ${feeStructures.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
