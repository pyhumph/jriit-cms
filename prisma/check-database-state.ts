import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabase() {
  console.log('🔍 Checking Database State for IT Programs...\n')

  const slugs = [
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

  console.log('Checking if programs exist and have detail content:\n')

  for (const slug of slugs) {
    const program = await prisma.program.findUnique({
      where: { slug },
      select: {
        slug: true,
        name: true,
        detailPageLayout: true,
        heroTitle: true,
        overviewContent: true,
        learningItems: true,
        modules: true,
      },
    })

    if (!program) {
      console.log(`❌ ${slug}: PROGRAM NOT FOUND`)
    } else {
      const hasContent = !!(program.heroTitle || program.overviewContent || program.learningItems || program.modules)
      if (hasContent) {
        console.log(`✅ ${slug}: EXISTS with CONTENT`)
        console.log(`   Layout: ${program.detailPageLayout || 'NULL'}`)
        console.log(`   Hero: ${program.heroTitle ? 'YES' : 'NO'}`)
        console.log(`   Overview: ${program.overviewContent ? 'YES' : 'NO'}`)
        console.log(`   Learning: ${program.learningItems ? 'YES' : 'NO'}`)
        console.log(`   Modules: ${program.modules ? 'YES' : 'NO'}`)
      } else {
        console.log(`⚠️  ${slug}: EXISTS but NO DETAIL CONTENT`)
      }
    }
    console.log('')
  }

  await prisma.$disconnect()
}

checkDatabase().catch(console.error)


