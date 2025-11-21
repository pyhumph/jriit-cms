const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper function to generate generic content for Short Course programs
const generateShortCourseContent = (program) => {
  const { slug, name, shortDescription } = program;
  
  // Default hero image
  const heroImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=2072&q=80';
  
  // Generic core concepts (6 concepts for each program)
  const coreConcepts = [
    {
      icon: 'BookOpen',
      title: 'Fundamentals',
      description: `Master the core fundamentals of ${name.toLowerCase()}`,
      features: ['Basic concepts', 'Essential skills', 'Industry standards', 'Best practices'],
      color: 'blue'
    },
    {
      icon: 'Lightbulb',
      title: 'Practical Skills',
      description: 'Develop hands-on practical skills',
      features: ['Real-world projects', 'Practical exercises', 'Case studies', 'Live demonstrations'],
      color: 'green'
    },
    {
      icon: 'Users',
      title: 'Professional Development',
      description: 'Enhance your professional capabilities',
      features: ['Career advancement', 'Industry certification prep', 'Professional networking', 'Job readiness'],
      color: 'purple'
    },
    {
      icon: 'Tool',
      title: 'Tools & Technologies',
      description: 'Learn industry-standard tools',
      features: ['Modern software', 'Latest technologies', 'Tool proficiency', 'Workflow optimization'],
      color: 'orange'
    },
    {
      icon: 'Target',
      title: 'Problem Solving',
      description: 'Develop critical thinking and problem-solving skills',
      features: ['Analytical thinking', 'Troubleshooting', 'Solution design', 'Decision making'],
      color: 'red'
    },
    {
      icon: 'Award',
      title: 'Certification & Recognition',
      description: 'Earn industry-recognized certification',
      features: ['Certificate of completion', 'Skill validation', 'Portfolio development', 'Industry recognition'],
      color: 'indigo'
    }
  ];
  
  // Generic learning path (3 levels)
  const learningPath = [
    {
      title: 'Foundation Level',
      duration: '2 months',
      topics: ['Introduction and basics', 'Core concepts', 'Fundamental skills']
    },
    {
      title: 'Intermediate Level',
      duration: '2 months',
      topics: ['Advanced techniques', 'Practical applications', 'Tool proficiency']
    },
    {
      title: 'Advanced Level',
      duration: '2 months',
      topics: ['Expert-level skills', 'Real-world projects', 'Certification preparation']
    }
  ];
  
  // Generic modules (12 modules)
  const modules = [
    `Introduction to ${name}`,
    'Fundamentals and Core Concepts',
    'Essential Tools and Technologies',
    'Practical Skills Development',
    'Hands-on Laboratory Sessions',
    'Industry Best Practices',
    'Advanced Techniques and Methods',
    'Problem Solving and Troubleshooting',
    'Real-World Applications',
    'Professional Development',
    'Project Work and Portfolio Building',
    'Capstone Project and Certification Prep'
  ];
  
  return {
    slug,
    detailPageLayout: 'short-course',
    heroTitle: name,
    heroSubtitle: shortDescription,
    heroImage,
    overviewTitle: 'Program Overview',
    overviewContent: `${name} is a comprehensive short course designed to equip you with essential skills and knowledge in this field. This program covers everything from fundamental concepts to advanced practical applications.\n\nAt JR Institute of Information Technology, we provide hands-on training with industry-standard tools and real-world projects. You'll learn from experienced instructors and gain the skills needed to excel in your career.`,
    coreConcepts: JSON.stringify(coreConcepts),
    learningPath: JSON.stringify(learningPath),
    modules: JSON.stringify(modules),
    ctaTitle: `Ready to Master ${name}?`,
    ctaDescription: 'Join professionals who have transformed their careers through comprehensive training at JR Institute of Information Technology'
  };
};

// All Short Course programs from seed-programs.ts
const shortCoursePrograms = [
  { slug: 'web-design', name: 'Web Design', shortDescription: 'Learn modern web design principles, HTML, CSS, and responsive design techniques.' },
  { slug: 'system-maintenance-cisco', name: 'System Maintenance and Repair: With CISCO', shortDescription: 'Master computer system maintenance, troubleshooting, and CISCO networking fundamentals.' },
  { slug: 'computer-hardware-short', name: 'Computer Hardware', shortDescription: 'Learn computer hardware components, assembly, and troubleshooting techniques.' },
  { slug: 'networking-cisco', name: 'Networking: With CISCO Course', shortDescription: 'Master network design, implementation, and CISCO networking technologies.' },
  { slug: 'basic-electronics-repair', name: 'Basic Electronics And Repair', shortDescription: 'Learn electronic components, circuits, and repair techniques for electronic devices.' },
  { slug: 'graphics-design', name: 'Graphics Design', shortDescription: 'Master graphic design principles, Adobe Creative Suite, and visual communication.' },
  { slug: 'english-cisco', name: 'English: With CISCO Course', shortDescription: 'Improve English language skills with CISCO certification preparation.' },
  { slug: 'python-cisco-essentials', name: 'Python: With CISCO Python Essentials', shortDescription: 'Learn Python programming fundamentals and CISCO Python Essentials certification.' },
  { slug: 'basic-computer-itf-cisco', name: 'Basic Computer: ITF(With CISCO OS and IT)', shortDescription: 'Master basic computer skills and CISCO IT Fundamentals certification.' },
  { slug: 'digital-marketing', name: 'Digital Marketing', shortDescription: 'Learn digital marketing strategies, social media, and online advertising techniques.' },
  { slug: 'mobile-applications', name: 'Mobile Applications', shortDescription: 'Develop mobile apps for iOS and Android platforms using modern frameworks.' },
  { slug: 'cctv-camera', name: 'CCTV Camera', shortDescription: 'Learn CCTV system installation, configuration, and surveillance techniques.' },
  { slug: 'mobile-repair', name: 'Mobile Repair', shortDescription: 'Master smartphone and tablet repair techniques and troubleshooting.' },
  { slug: 'tally', name: 'TALLY', shortDescription: 'Learn TALLY accounting software for business financial management.' },
  { slug: 'quick-book', name: 'QUICK BOOK', shortDescription: 'Master QuickBooks accounting software for small business management.' },
  { slug: 'entrepreneurship', name: 'Entrepreneurship', shortDescription: 'Learn business planning, startup strategies, and entrepreneurial skills.' },
  { slug: 'procurement-supply', name: 'Procurement & Supply', shortDescription: 'Master procurement processes, supply chain management, and vendor relations.' },
  { slug: 'basic-account', name: 'Basic Account', shortDescription: 'Learn fundamental accounting principles and bookkeeping practices.' },
  { slug: 'advance-excel', name: 'Advance EXCEL', shortDescription: 'Master advanced Excel functions, data analysis, and automation techniques.' },
  { slug: 'mcsa-microsoft-certified', name: 'MCSA(Microsoft Certified Solution)', shortDescription: 'Prepare for Microsoft Certified Solutions Associate certification exams.' },
  { slug: 'arduino-programming', name: 'ARDUINO Programming', shortDescription: 'Learn Arduino microcontroller programming and IoT project development.' },
  { slug: 'photocopy-printer-repair', name: 'Photocopy and Printer Repair', shortDescription: 'Master photocopier and printer maintenance, repair, and troubleshooting.' },
  { slug: 'cisco-courses', name: 'CISCO Courses', shortDescription: 'Comprehensive CISCO networking and IT certification preparation courses.' },
  { slug: 'data-science-analytics', name: 'Data Science; Data Analytics Essentials', shortDescription: 'Learn data science fundamentals, analytics, and visualization techniques.' },
  { slug: 'operating-systems-it', name: 'Operating Systems and Information Technology', shortDescription: 'Master operating systems, IT fundamentals, and system administration.' },
  { slug: 'introduction-cybersecurity', name: 'Introduction to Cybersecurity', shortDescription: 'Learn cybersecurity fundamentals, threats, and protection strategies.' },
  { slug: 'introduction-iot', name: 'Introduction to IoT', shortDescription: 'Explore Internet of Things concepts, devices, and smart technology applications.' },
  { slug: 'ethical-hackers', name: 'Ethical Hackers', shortDescription: 'Learn ethical hacking techniques, penetration testing, and security assessment.' },
  { slug: 'comptia-courses', name: 'CompTIA Courses', shortDescription: 'Prepare for CompTIA IT certifications including A+, Network+, and Security+.' },
  { slug: 'it-operations-specialist', name: 'IT Operations Specialist', shortDescription: 'Master IT operations, system administration, and infrastructure management.' },
  { slug: 'network-plus', name: 'NETWORK +', shortDescription: 'Prepare for CompTIA Network+ certification and advanced networking skills.' },
  { slug: 'secure-infrastructure-specialist', name: 'Secure Infrastructure Specialist', shortDescription: 'Learn secure infrastructure design, implementation, and management practices.' },
];

async function main() {
  console.log('🚀 Seeding ALL Short Course programs...\n');

  const department = await prisma.department.findUnique({
    where: { slug: 'short-course' }
  });

  if (!department) {
    console.error('❌ Department "short-course" not found!');
    return;
  }

  console.log(`✅ Found department: ${department.name}\n`);

  let updated = 0;
  let notFound = 0;
  let errors = 0;

  for (const programInfo of shortCoursePrograms) {
    try {
      const program = await prisma.program.findUnique({
        where: { slug: programInfo.slug }
      });

      if (!program) {
        console.log(`⚠️  NOT FOUND: ${programInfo.slug}`);
        notFound++;
        continue;
      }

      const content = generateShortCourseContent(programInfo);

      await prisma.program.update({
        where: { slug: programInfo.slug },
        data: {
          detailPageLayout: content.detailPageLayout,
          heroTitle: content.heroTitle,
          heroSubtitle: content.heroSubtitle,
          heroImage: content.heroImage,
          overviewTitle: content.overviewTitle,
          overviewContent: content.overviewContent,
          coreConcepts: content.coreConcepts,
          learningPath: content.learningPath,
          modules: content.modules,
          ctaTitle: content.ctaTitle,
          ctaDescription: content.ctaDescription
        }
      });

      console.log(`✅ ${program.name}`);
      updated++;
    } catch (error) {
      console.error(`❌ ERROR: ${programInfo.slug} - ${error.message}`);
      errors++;
    }
  }

  console.log(`\n📊 SUMMARY:`);
  console.log(`   ✅ Successfully updated: ${updated}/${shortCoursePrograms.length} programs`);
  if (notFound > 0) console.log(`   ⚠️  Not found: ${notFound} programs`);
  if (errors > 0) console.log(`   ❌ Errors: ${errors} programs`);
  
  console.log('\n✨ All Short Course programs have been seeded!');
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

