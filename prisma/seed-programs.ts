import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Course category to department slug mapping
const DEPARTMENT_MAPPING: Record<string, string> = {
  'Information Technology': 'information-technology',
  'Cyber Security': 'cyber-security',
  'Computer Science': 'computer-science',
  'Computer Engineering': 'computer-engineering',
  'Electronics & Telecommunications': 'electronics-telecommunications',
  'Business Administration': 'business-administration',
  'Accountancy': 'accountancy',
  'Travel & Tourism Management': 'travel-tourism-management',
  'Short Courses': 'short-course',
  'Professional Courses': 'professional-course',
}

// All programs extracted from frontend
const PROGRAMS_DATA = [
  // Information Technology Programs
  {
    name: 'Computer Hardware',
    slug: 'computer-hardware',
    shortDescription: 'Learn the fundamentals of computer hardware, components, and devices.',
    courseCategory: 'Information Technology',
    order: 1,
  },
  {
    name: 'Computer Software',
    slug: 'computer-software',
    shortDescription: 'Understand software systems, operating systems, and essential programs.',
    courseCategory: 'Information Technology',
    order: 2,
  },
  {
    name: 'Computer Applications',
    slug: 'computer-applications',
    shortDescription: 'Gain practical skills in office tools and productivity applications.',
    courseCategory: 'Information Technology',
    order: 3,
  },
  {
    name: 'Networking & System Administration',
    slug: 'networking-system-administration',
    shortDescription: 'Manage networks, servers, and IT infrastructure effectively.',
    courseCategory: 'Information Technology',
    order: 4,
  },
  {
    name: 'Linux Administration',
    slug: 'linux-administration',
    shortDescription: 'Specialized system administration for Linux-based environments.',
    courseCategory: 'Information Technology',
    order: 5,
  },
  {
    name: 'Database Management',
    slug: 'database-management',
    shortDescription: 'Design, implement, and manage databases for applications and systems.',
    courseCategory: 'Information Technology',
    order: 6,
  },
  {
    name: 'Object-Oriented Programming (OOP)',
    slug: 'object-oriented-programming-oop',
    shortDescription: 'Master core programming concepts and object-oriented design principles.',
    courseCategory: 'Information Technology',
    order: 7,
  },
  {
    name: 'Website & Application Development',
    slug: 'website-application-development',
    shortDescription: 'Build web and mobile applications using modern technologies.',
    courseCategory: 'Information Technology',
    order: 8,
  },
  {
    name: 'Cyber Security',
    slug: 'cyber-security',
    shortDescription: 'Protect systems, networks, and data from cyber threats.',
    courseCategory: 'Information Technology',
    order: 9,
  },
  {
    name: 'Cloud Computing',
    slug: 'cloud-computing',
    shortDescription: 'Learn cloud infrastructure, deployment, and virtualization strategies.',
    courseCategory: 'Information Technology',
    order: 10,
  },
  {
    name: 'System Analysis & Design',
    slug: 'system-analysis-design',
    shortDescription: 'Plan and design IT systems efficiently for business and technical needs.',
    courseCategory: 'Information Technology',
    order: 11,
  },
  {
    name: 'Adobe Applications',
    slug: 'adobe-applications',
    shortDescription: 'Develop creative and design skills using Adobe multimedia tools.',
    courseCategory: 'Information Technology',
    order: 12,
  },

  // Cyber Security Programs
  {
    name: 'Introduction to Cyber Security',
    slug: 'intro-to-cyber-security',
    shortDescription: 'Learn the basics of cyber security, threats, and defense mechanisms.',
    courseCategory: 'Cyber Security',
    order: 1,
  },
  {
    name: 'Network & OS Security',
    slug: 'network-os-security',
    shortDescription: 'Understand how to secure computer networks and operating systems.',
    courseCategory: 'Cyber Security',
    order: 2,
  },
  {
    name: 'Cryptography Basics',
    slug: 'cryptography-basics',
    shortDescription: 'Explore encryption, decryption, and cryptographic security methods.',
    courseCategory: 'Cyber Security',
    order: 3,
  },
  {
    name: 'Ethical Hacking & Pen Testing',
    slug: 'ethical-hacking-pen-testing',
    shortDescription: 'Learn penetration testing, ethical hacking tools, and security audits.',
    courseCategory: 'Cyber Security',
    order: 4,
  },
  {
    name: 'Web Application Security',
    slug: 'web-application-security',
    shortDescription: 'Identify and fix vulnerabilities in websites and web applications.',
    courseCategory: 'Cyber Security',
    order: 5,
  },
  {
    name: 'Malware & Forensics',
    slug: 'malware-forensics',
    shortDescription: 'Analyze malware attacks and perform digital forensic investigations.',
    courseCategory: 'Cyber Security',
    order: 6,
  },
  {
    name: 'Wireless & Mobile Security',
    slug: 'wireless-mobile-security',
    shortDescription: 'Secure wireless networks and protect mobile devices from cyber threats.',
    courseCategory: 'Cyber Security',
    order: 7,
  },

  // Computer Science Programs
  {
    name: 'Programming Fundamentals',
    slug: 'programming-fundamentals',
    shortDescription: 'Learn the basics of programming languages and software development.',
    courseCategory: 'Computer Science',
    order: 1,
  },
  {
    name: 'Data Structures & Algorithms',
    slug: 'data-structures-algorithms',
    shortDescription: 'Master fundamental data structures and algorithmic problem solving.',
    courseCategory: 'Computer Science',
    order: 2,
  },
  {
    name: 'Software Engineering',
    slug: 'software-engineering',
    shortDescription: 'Learn software development methodologies and best practices.',
    courseCategory: 'Computer Science',
    order: 3,
  },
  {
    name: 'Database Systems',
    slug: 'database-systems',
    shortDescription: 'Design and implement database systems for applications.',
    courseCategory: 'Computer Science',
    order: 4,
  },
  {
    name: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    shortDescription: 'Explore AI concepts, machine learning, and intelligent systems.',
    courseCategory: 'Computer Science',
    order: 5,
  },
  {
    name: 'Computer Networks',
    slug: 'computer-networks',
    shortDescription: 'Understand network protocols, architecture, and communication.',
    courseCategory: 'Computer Science',
    order: 6,
  },

  // Computer Engineering Programs
  {
    name: 'Digital Electronics',
    slug: 'digital-electronics',
    shortDescription: 'Learn digital circuit design and electronic components.',
    courseCategory: 'Computer Engineering',
    order: 1,
  },
  {
    name: 'Computer Architecture',
    slug: 'computer-architecture',
    shortDescription: 'Understand computer hardware design and organization.',
    courseCategory: 'Computer Engineering',
    order: 2,
  },
  {
    name: 'Embedded Systems',
    slug: 'embedded-systems',
    shortDescription: 'Design and program embedded computer systems.',
    courseCategory: 'Computer Engineering',
    order: 3,
  },
  {
    name: 'Microprocessors',
    slug: 'microprocessors',
    shortDescription: 'Learn microprocessor design and programming.',
    courseCategory: 'Computer Engineering',
    order: 4,
  },
  {
    name: 'VLSI Design',
    slug: 'vlsi-design',
    shortDescription: 'Design very large scale integrated circuits.',
    courseCategory: 'Computer Engineering',
    order: 5,
  },
  {
    name: 'Hardware Programming',
    slug: 'hardware-programming',
    shortDescription: 'Program hardware using HDL and firmware development.',
    courseCategory: 'Computer Engineering',
    order: 6,
  },

  // Electronics & Telecommunications Programs
  {
    name: 'Electronic Circuits',
    slug: 'electronic-circuits',
    shortDescription: 'Learn analog and digital electronic circuit design.',
    courseCategory: 'Electronics & Telecommunications',
    order: 1,
  },
  {
    name: 'Communication Systems',
    slug: 'communication-systems',
    shortDescription: 'Understand wireless and wired communication technologies.',
    courseCategory: 'Electronics & Telecommunications',
    order: 2,
  },
  {
    name: 'Signal Processing',
    slug: 'signal-processing',
    shortDescription: 'Process and analyze electronic signals and data.',
    courseCategory: 'Electronics & Telecommunications',
    order: 3,
  },
  {
    name: 'Telecommunications Networks',
    slug: 'telecommunications-networks',
    shortDescription: 'Design and manage telecommunications infrastructure.',
    courseCategory: 'Electronics & Telecommunications',
    order: 4,
  },
  {
    name: 'Mobile Communications',
    slug: 'mobile-communications',
    shortDescription: 'Learn mobile network technologies and protocols.',
    courseCategory: 'Electronics & Telecommunications',
    order: 5,
  },
  {
    name: 'Satellite Communications',
    slug: 'satellite-communications',
    shortDescription: 'Understand satellite communication systems and technology.',
    courseCategory: 'Electronics & Telecommunications',
    order: 6,
  },

  // Business Administration Programs
  {
    name: 'Business Management',
    slug: 'business-management',
    shortDescription: 'Learn fundamental business management principles and practices.',
    courseCategory: 'Business Administration',
    order: 1,
  },
  {
    name: 'Marketing Management',
    slug: 'marketing-management',
    shortDescription: 'Develop marketing strategies and customer relationship skills.',
    courseCategory: 'Business Administration',
    order: 2,
  },
  {
    name: 'Financial Management',
    slug: 'financial-management',
    shortDescription: 'Master financial planning, budgeting, and investment strategies.',
    courseCategory: 'Business Administration',
    order: 3,
  },
  {
    name: 'Human Resource Management',
    slug: 'human-resource-management',
    shortDescription: 'Learn HR practices, recruitment, and employee development.',
    courseCategory: 'Business Administration',
    order: 4,
  },
  {
    name: 'Operations Management',
    slug: 'operations-management',
    shortDescription: 'Optimize business operations and supply chain management.',
    courseCategory: 'Business Administration',
    order: 5,
  },
  {
    name: 'Strategic Planning',
    slug: 'strategic-planning',
    shortDescription: 'Develop strategic thinking and business planning skills.',
    courseCategory: 'Business Administration',
    order: 6,
  },

  // Accountancy Programs
  {
    name: 'Financial Accounting',
    slug: 'financial-accounting',
    shortDescription: 'Learn fundamental accounting principles and financial reporting.',
    courseCategory: 'Accountancy',
    order: 1,
  },
  {
    name: 'Management Accounting',
    slug: 'management-accounting',
    shortDescription: 'Develop cost analysis and managerial accounting skills.',
    courseCategory: 'Accountancy',
    order: 2,
  },
  {
    name: 'Auditing & Assurance',
    slug: 'auditing-assurance',
    shortDescription: 'Master auditing procedures and financial statement analysis.',
    courseCategory: 'Accountancy',
    order: 3,
  },
  {
    name: 'Taxation',
    slug: 'taxation',
    shortDescription: 'Learn tax laws, compliance, and tax planning strategies.',
    courseCategory: 'Accountancy',
    order: 4,
  },
  {
    name: 'Financial Management',
    slug: 'financial-management-accountancy',
    shortDescription: 'Develop financial planning and investment analysis skills.',
    courseCategory: 'Accountancy',
    order: 5,
  },
  {
    name: 'Business Law',
    slug: 'business-law',
    shortDescription: 'Understand legal aspects of business and accounting.',
    courseCategory: 'Accountancy',
    order: 6,
  },

  // Travel & Tourism Management Programs
  {
    name: 'Tourism Operations',
    slug: 'tourism-operations',
    shortDescription: 'Learn tourism industry operations and management principles.',
    courseCategory: 'Travel & Tourism Management',
    order: 1,
  },
  {
    name: 'Customer Service Excellence',
    slug: 'customer-service-excellence',
    shortDescription: 'Develop exceptional customer service and hospitality skills.',
    courseCategory: 'Travel & Tourism Management',
    order: 2,
  },
  {
    name: 'Destination Management',
    slug: 'destination-management',
    shortDescription: 'Learn destination planning, marketing, and sustainable tourism.',
    courseCategory: 'Travel & Tourism Management',
    order: 3,
  },
  {
    name: 'Hotel Management',
    slug: 'hotel-management',
    shortDescription: 'Master hotel operations, front office, and housekeeping management.',
    courseCategory: 'Travel & Tourism Management',
    order: 4,
  },
  {
    name: 'Travel Agency Operations',
    slug: 'travel-agency-operations',
    shortDescription: 'Learn travel booking systems and tour package development.',
    courseCategory: 'Travel & Tourism Management',
    order: 5,
  },
  {
    name: 'Event Management',
    slug: 'event-management',
    shortDescription: 'Plan and manage tourism events and special occasions.',
    courseCategory: 'Travel & Tourism Management',
    order: 6,
  },

  // Short Courses Programs (32 programs)
  {
    name: 'Web Design',
    slug: 'web-design',
    shortDescription: 'Learn modern web design principles, HTML, CSS, and responsive design techniques.',
    courseCategory: 'Short Courses',
    order: 1,
  },
  {
    name: 'System Maintenance and Repair: With CISCO',
    slug: 'system-maintenance-cisco',
    shortDescription: 'Master computer system maintenance, troubleshooting, and CISCO networking fundamentals.',
    courseCategory: 'Short Courses',
    order: 2,
  },
  {
    name: 'Computer Hardware',
    slug: 'computer-hardware-short',
    shortDescription: 'Learn computer hardware components, assembly, and troubleshooting techniques.',
    courseCategory: 'Short Courses',
    order: 3,
  },
  {
    name: 'Networking: With CISCO Course',
    slug: 'networking-cisco',
    shortDescription: 'Master network design, implementation, and CISCO networking technologies.',
    courseCategory: 'Short Courses',
    order: 4,
  },
  {
    name: 'Basic Electronics And Repair',
    slug: 'basic-electronics-repair',
    shortDescription: 'Learn electronic components, circuits, and repair techniques for electronic devices.',
    courseCategory: 'Short Courses',
    order: 5,
  },
  {
    name: 'Graphics Design',
    slug: 'graphics-design',
    shortDescription: 'Master graphic design principles, Adobe Creative Suite, and visual communication.',
    courseCategory: 'Short Courses',
    order: 6,
  },
  {
    name: 'English: With CISCO Course',
    slug: 'english-cisco',
    shortDescription: 'Improve English language skills with CISCO certification preparation.',
    courseCategory: 'Short Courses',
    order: 7,
  },
  {
    name: 'Python: With CISCO Python Essentials',
    slug: 'python-cisco-essentials',
    shortDescription: 'Learn Python programming fundamentals and CISCO Python Essentials certification.',
    courseCategory: 'Short Courses',
    order: 8,
  },
  {
    name: 'Basic Computer: ITF(With CISCO OS and IT)',
    slug: 'basic-computer-itf-cisco',
    shortDescription: 'Master basic computer skills and CISCO IT Fundamentals certification.',
    courseCategory: 'Short Courses',
    order: 9,
  },
  {
    name: 'Digital Marketing',
    slug: 'digital-marketing',
    shortDescription: 'Learn digital marketing strategies, social media, and online advertising techniques.',
    courseCategory: 'Short Courses',
    order: 10,
  },
  {
    name: 'Mobile Applications',
    slug: 'mobile-applications',
    shortDescription: 'Develop mobile apps for iOS and Android platforms using modern frameworks.',
    courseCategory: 'Short Courses',
    order: 11,
  },
  {
    name: 'CCTV Camera',
    slug: 'cctv-camera',
    shortDescription: 'Learn CCTV system installation, configuration, and surveillance techniques.',
    courseCategory: 'Short Courses',
    order: 12,
  },
  {
    name: 'Mobile Repair',
    slug: 'mobile-repair',
    shortDescription: 'Master smartphone and tablet repair techniques and troubleshooting.',
    courseCategory: 'Short Courses',
    order: 13,
  },
  {
    name: 'TALLY',
    slug: 'tally',
    shortDescription: 'Learn TALLY accounting software for business financial management.',
    courseCategory: 'Short Courses',
    order: 14,
  },
  {
    name: 'QUICK BOOK',
    slug: 'quick-book',
    shortDescription: 'Master QuickBooks accounting software for small business management.',
    courseCategory: 'Short Courses',
    order: 15,
  },
  {
    name: 'Entrepreneurship',
    slug: 'entrepreneurship',
    shortDescription: 'Learn business planning, startup strategies, and entrepreneurial skills.',
    courseCategory: 'Short Courses',
    order: 16,
  },
  {
    name: 'Procurement & Supply',
    slug: 'procurement-supply',
    shortDescription: 'Master procurement processes, supply chain management, and vendor relations.',
    courseCategory: 'Short Courses',
    order: 17,
  },
  {
    name: 'Basic Account',
    slug: 'basic-account',
    shortDescription: 'Learn fundamental accounting principles and bookkeeping practices.',
    courseCategory: 'Short Courses',
    order: 18,
  },
  {
    name: 'Advance EXCEL',
    slug: 'advance-excel',
    shortDescription: 'Master advanced Excel functions, data analysis, and automation techniques.',
    courseCategory: 'Short Courses',
    order: 19,
  },
  {
    name: 'MCSA(Microsoft Certified Solution)',
    slug: 'mcsa-microsoft-certified',
    shortDescription: 'Prepare for Microsoft Certified Solutions Associate certification exams.',
    courseCategory: 'Short Courses',
    order: 20,
  },
  {
    name: 'ARDUINO Programming',
    slug: 'arduino-programming',
    shortDescription: 'Learn Arduino microcontroller programming and IoT project development.',
    courseCategory: 'Short Courses',
    order: 21,
  },
  {
    name: 'Photocopy and Printer Repair',
    slug: 'photocopy-printer-repair',
    shortDescription: 'Master photocopier and printer maintenance, repair, and troubleshooting.',
    courseCategory: 'Short Courses',
    order: 22,
  },
  {
    name: 'CISCO Courses',
    slug: 'cisco-courses',
    shortDescription: 'Comprehensive CISCO networking and IT certification preparation courses.',
    courseCategory: 'Short Courses',
    order: 23,
  },
  {
    name: 'Data Science; Data Analytics Essentials',
    slug: 'data-science-analytics',
    shortDescription: 'Learn data science fundamentals, analytics, and visualization techniques.',
    courseCategory: 'Short Courses',
    order: 24,
  },
  {
    name: 'Operating Systems and Information Technology',
    slug: 'operating-systems-it',
    shortDescription: 'Master operating systems, IT fundamentals, and system administration.',
    courseCategory: 'Short Courses',
    order: 25,
  },
  {
    name: 'Introduction to Cybersecurity',
    slug: 'introduction-cybersecurity',
    shortDescription: 'Learn cybersecurity fundamentals, threats, and protection strategies.',
    courseCategory: 'Short Courses',
    order: 26,
  },
  {
    name: 'Introduction to IoT',
    slug: 'introduction-iot',
    shortDescription: 'Explore Internet of Things concepts, devices, and smart technology applications.',
    courseCategory: 'Short Courses',
    order: 27,
  },
  {
    name: 'Ethical Hackers',
    slug: 'ethical-hackers',
    shortDescription: 'Learn ethical hacking techniques, penetration testing, and security assessment.',
    courseCategory: 'Short Courses',
    order: 28,
  },
  {
    name: 'CompTIA Courses',
    slug: 'comptia-courses',
    shortDescription: 'Prepare for CompTIA IT certifications including A+, Network+, and Security+.',
    courseCategory: 'Short Courses',
    order: 29,
  },
  {
    name: 'IT Operations Specialist',
    slug: 'it-operations-specialist',
    shortDescription: 'Master IT operations, system administration, and infrastructure management.',
    courseCategory: 'Short Courses',
    order: 30,
  },
  {
    name: 'NETWORK +',
    slug: 'network-plus',
    shortDescription: 'Prepare for CompTIA Network+ certification and advanced networking skills.',
    courseCategory: 'Short Courses',
    order: 31,
  },
  {
    name: 'Secure Infrastructure Specialist',
    slug: 'secure-infrastructure-specialist',
    shortDescription: 'Learn secure infrastructure design, implementation, and management practices.',
    courseCategory: 'Short Courses',
    order: 32,
  },
]

async function main() {
  console.log('🌱 Starting program seed...')

  // Get the first admin user to use as author
  const admin = await prisma.admin.findFirst()
  if (!admin) {
    throw new Error('No admin user found. Please create an admin user first.')
  }

  // Get or create departments
  const departments = new Map<string, string>()
  
  for (const [categoryName, slug] of Object.entries(DEPARTMENT_MAPPING)) {
    let department = await prisma.department.findUnique({
      where: { slug }
    })

    if (!department) {
      department = await prisma.department.create({
        data: {
          name: categoryName,
          slug,
          description: `${categoryName} department`,
          isActive: true,
          order: 0,
          authorId: admin.id,
        }
      })
      console.log(`✅ Created department: ${categoryName}`)
    } else {
      console.log(`ℹ️  Department already exists: ${categoryName}`)
    }
    
    departments.set(categoryName, department.id)
  }

  // Seed programs
  let created = 0
  let skipped = 0

  for (const programData of PROGRAMS_DATA) {
    const departmentId = departments.get(programData.courseCategory)
    
    if (!departmentId) {
      console.error(`❌ Department not found for: ${programData.courseCategory}`)
      continue
    }

    // Check if program already exists
    const existing = await prisma.program.findUnique({
      where: { slug: programData.slug }
    })

    if (existing) {
      console.log(`⏭️  Skipping existing program: ${programData.name}`)
      skipped++
      continue
    }

    await prisma.program.create({
      data: {
        name: programData.name,
        slug: programData.slug,
        shortDescription: programData.shortDescription,
        description: programData.shortDescription, // Use short description as full description for now
        departmentId,
        isActive: true,
        order: programData.order,
        authorId: admin.id,
      }
    })

    created++
    console.log(`✅ Created program: ${programData.name} (${programData.courseCategory})`)
  }

  console.log(`\n✨ Seed completed!`)
  console.log(`   Created: ${created} programs`)
  console.log(`   Skipped: ${skipped} programs (already exist)`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding programs:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

