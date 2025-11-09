import { PrismaClient, Prisma } from '@prisma/client'
import * as seedData from './seed-it-detail-content'

const prisma = new PrismaClient()

// Get the detail content data
const IT_PROGRAM_DETAIL_CONTENT = (seedData as any).IT_PROGRAM_DETAIL_CONTENT || []

async function main() {
  console.log('🔍 Checking and Seeding IT Program Detail Content...\n')

  let found = 0
  let updated = 0
  let notFound = 0
  let errors = 0

  for (const content of IT_PROGRAM_DETAIL_CONTENT) {
    try {
      // Check if program exists
      const program = await prisma.program.findUnique({
        where: { slug: content.slug },
        select: { id: true, slug: true, name: true, heroTitle: true },
      })

      if (!program) {
        console.log(`⚠️  Program NOT FOUND: ${content.slug}`)
        console.log(`   → This program needs to be created first using: npm run db:seed-programs`)
        notFound++
        continue
      }

      found++

      // Check if content already exists
      if (program.heroTitle) {
        console.log(`ℹ️  ${content.slug}: Already has content, skipping...`)
        continue
      }

      // Prepare update data
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

      // Update the program
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

  console.log('\n📊 Summary:')
  console.log(`   Found: ${found} programs`)
  console.log(`   Updated: ${updated} programs`)
  console.log(`   Not Found: ${notFound} programs`)
  console.log(`   Errors: ${errors} programs`)

  if (notFound > 0) {
    console.log('\n⚠️  Some programs were not found in the database.')
    console.log('   Run: npm run db:seed-programs')
  }

  if (updated > 0) {
    console.log('\n✨ Detail content seeded successfully!')
  } else if (found === IT_PROGRAM_DETAIL_CONTENT.length) {
    console.log('\n✨ All programs already have detail content!')
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

