import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

// IT Program Detail Content - Extracted from original frontend components
const IT_PROGRAM_DETAIL_CONTENT = [
  // 1. Computer Hardware (Standard Layout)
  {
    slug: 'computer-hardware',
    detailPageLayout: 'standard',
    heroTitle: 'Computer Hardware',
    heroSubtitle: 'Master the fundamentals of computer components and systems',
    heroImage: '/assets/computer-hardware.jpg',
    overviewTitle: 'Program Overview',
    overviewContent: `Our Computer Hardware program provides comprehensive training in the physical components that make up computer systems. Students will gain hands-on experience with processors, memory, storage devices, motherboards, and peripheral components.

This program is designed for individuals who want to understand how computers work at the hardware level, troubleshoot hardware issues, and pursue careers in computer repair, system building, and technical support.`,
    learningTitle: "What You'll Learn",
    learningItems: [
      { icon: 'Cpu', title: 'Processors & CPUs', description: 'Understanding CPU architecture, instruction sets, and performance optimization.' },
      { icon: 'MemoryStick', title: 'Memory Systems', description: 'RAM types, memory hierarchy, and storage technologies.' },
      { icon: 'HardDrive', title: 'Storage Devices', description: 'HDDs, SSDs, and emerging storage technologies.' },
      { icon: 'Monitor', title: 'Display Systems', description: 'Graphics cards, monitors, and display technologies.' },
      { icon: 'Zap', title: 'Power Systems', description: 'Power supplies, voltage regulation, and energy efficiency.' },
      { icon: 'Settings', title: 'System Assembly', description: 'Building, configuring, and troubleshooting complete systems.' },
    ],
    modulesTitle: 'Course Modules',
    modules: [
      'Introduction to Computer Hardware',
      'Motherboards and System Architecture',
      'Processors and CPU Technologies',
      'Memory Systems and RAM',
      'Storage Technologies',
      'Power Supply and Cooling Systems',
      'Input/Output Devices and Peripherals',
      'Graphics and Display Systems',
      'System Assembly and Configuration',
      'Hardware Troubleshooting and Repair',
      'Hardware Compatibility and Upgrades',
      'Industry Standards and Certifications',
    ],
    detailsDuration: '6 months',
    detailsFormat: 'Hands-on Lab + Theory',
    detailsSchedule: 'Flexible timing',
    detailsPrerequisites: 'Basic computer literacy',
    careerTitle: 'Career Opportunities',
    careerOpportunities: [
      'Computer Repair Technician',
      'Hardware Support Specialist',
      'System Builder',
      'IT Support Technician',
      'Field Service Engineer',
      'Hardware Sales Consultant',
    ],
    ctaTitle: 'Ready to Start?',
    ctaDescription: 'Join our Computer Hardware program and build your expertise in computer systems.',
  },
  // Note: Including only first program here for brevity - the full list is in seed-it-detail-content.ts
]

async function main() {
  console.log('🌱 Seeding IT Program Detail Content...\n')
  console.log('📝 This script will update detail content for all IT programs.\n')

  // Import the full content from the existing seed file
  // For now, we'll use the existing seed script approach
  console.log('⚠️  Please run: npm run db:seed-it-detail-content')
  console.log('   This will seed all 12 IT programs with detail content.\n')
  
  // Let's actually run the seeding logic here
  const { IT_PROGRAM_DETAIL_CONTENT: fullContent } = await import('./seed-it-detail-content')
  
  let updated = 0
  let notFound = 0
  let errors = 0

  for (const content of fullContent) {
    try {
      const program = await prisma.program.findUnique({
        where: { slug: content.slug },
      })

      if (!program) {
        console.log(`⚠️  Program not found: ${content.slug}`)
        console.log(`   → Run 'npm run db:seed-programs' first to create programs`)
        notFound++
        continue
      }

      const updateData: Prisma.ProgramUpdateInput = {
        detailPageLayout: content.detailPageLayout,
        heroTitle: content.heroTitle,
        heroSubtitle: content.heroSubtitle,
        heroImage: content.heroImage,
        overviewTitle: content.overviewTitle,
        overviewContent: content.overviewContent,
        learningTitle: content.learningTitle,
        learningItems: JSON.stringify(content.learningItems),
        modulesTitle: content.modulesTitle,
        modules: JSON.stringify(content.modules),
        detailsDuration: content.detailsDuration,
        detailsFormat: content.detailsFormat,
        detailsSchedule: content.detailsSchedule,
        detailsPrerequisites: content.detailsPrerequisites,
        careerTitle: content.careerTitle,
        careerOpportunitiesJson: JSON.stringify(content.careerOpportunities),
        ctaTitle: content.ctaTitle,
        ctaDescription: content.ctaDescription,
        ...(content.customContent && { customContent: content.customContent }),
      }

      await prisma.program.update({
        where: { slug: content.slug },
        data: updateData,
      })

      updated++
      console.log(`✅ Updated: ${content.slug}`)
    } catch (error) {
      errors++
      console.error(`❌ Error updating ${content.slug}:`, error)
    }
  }

  console.log(`\n✨ Seeding completed!`)
  console.log(`   Updated: ${updated} programs`)
  if (notFound > 0) {
    console.log(`   Not Found: ${notFound} programs (run db:seed-programs first)`)
  }
  if (errors > 0) {
    console.log(`   Errors: ${errors} programs`)
  }
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })




