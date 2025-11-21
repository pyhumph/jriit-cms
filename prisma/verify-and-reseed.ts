import { PrismaClient, Prisma } from '@prisma/client'
import { IT_PROGRAM_DETAIL_CONTENT } from './seed-it-detail-content'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verifying and Re-seeding IT Program Detail Content...\n')

  let verified = 0
  let reseeded = 0
  let notFound = 0
  let errors = 0

  for (const content of IT_PROGRAM_DETAIL_CONTENT) {
    try {
      // Check if program exists
      const program = await prisma.program.findUnique({
        where: { slug: content.slug },
        select: {
          id: true,
          slug: true,
          name: true,
          heroTitle: true,
          overviewContent: true,
          learningItems: true,
          modules: true,
        },
      })

      if (!program) {
        console.log(`❌ Program NOT FOUND: ${content.slug}`)
        console.log(`   → Run 'npm run db:seed-programs' first`)
        notFound++
        continue
      }

      // Check if content exists
      const hasContent = !!(
        program.heroTitle &&
        program.overviewContent &&
        program.learningItems &&
        program.modules
      )

      if (hasContent) {
        console.log(`✅ ${content.slug}: Already has content`)
        verified++
        continue
      }

      // Reseed this program
      console.log(`🔄 Reseeding: ${content.slug}`)

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

      reseeded++
      console.log(`   ✅ Reseeded successfully`)
    } catch (error) {
      errors++
      console.error(`❌ Error with ${content.slug}:`, error)
    }
  }

  console.log('\n📊 Summary:')
  console.log(`   ✅ Verified (has content): ${verified} programs`)
  console.log(`   🔄 Reseeded: ${reseeded} programs`)
  console.log(`   ❌ Not Found: ${notFound} programs`)
  console.log(`   ❌ Errors: ${errors} programs`)

  if (reseeded > 0 || verified === IT_PROGRAM_DETAIL_CONTENT.length) {
    console.log('\n✨ All programs now have detail content!')
    console.log('\n📋 Next steps:')
    console.log('   1. Open dashboard: http://localhost:3000/dashboard/programs')
    console.log('   2. Edit any IT program')
    console.log('   3. Click "Detail Page Content" tab')
    console.log('   4. Verify all fields are populated')
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




