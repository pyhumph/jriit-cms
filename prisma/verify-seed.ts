import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verify() {
  console.log('🔍 Verifying IT Program Detail Content in Database...\n')

  const itProgramSlugs = [
    'computer-hardware',
    'computer-software',
    'computer-applications',
    'networking-system-administration',
    'linux-administration',
    'database-management',
    'object-oriented-programming-oop',
    'website-application-development',
    'cyber-security',
    'cloud-computing',
    'system-analysis-design',
    'adobe-applications',
  ]

  for (const slug of itProgramSlugs) {
    const program = await prisma.program.findUnique({
      where: { slug },
      select: {
        slug: true,
        name: true,
        detailPageLayout: true,
        heroTitle: true,
        heroSubtitle: true,
        overviewTitle: true,
        overviewContent: true,
        learningTitle: true,
        learningItems: true,
        modulesTitle: true,
        modules: true,
        detailsDuration: true,
        careerTitle: true,
        careerOpportunitiesJson: true,
        ctaTitle: true,
      },
    })

    if (!program) {
      console.log(`❌ Program NOT FOUND: ${slug}`)
      continue
    }

    const hasContent = !!(
      program.heroTitle ||
      program.overviewContent ||
      program.learningItems ||
      program.modules
    )

    if (hasContent) {
      console.log(`✅ ${slug}: HAS CONTENT`)
      console.log(`   - Layout: ${program.detailPageLayout || 'NULL'}`)
      console.log(`   - Hero Title: ${program.heroTitle ? 'YES' : 'NO'}`)
      console.log(`   - Overview: ${program.overviewContent ? 'YES' : 'NO'}`)
      console.log(`   - Learning Items: ${program.learningItems ? 'YES' : 'NO'}`)
      console.log(`   - Modules: ${program.modules ? 'YES' : 'NO'}`)
    } else {
      console.log(`⚠️  ${slug}: EXISTS but NO CONTENT`)
    }
    console.log('')
  }

  await prisma.$disconnect()
}

verify().catch(console.error)




