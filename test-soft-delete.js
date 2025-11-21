const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testSoftDelete() {
  console.log('🔍 Testing Soft Delete System...\n')

  try {
    // Test 1: Get all programs (should exclude soft-deleted)
    const activePrograms = await prisma.program.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true, deletedAt: true }
    })
    console.log(`✅ Active Programs: ${activePrograms.length}`)
    
    // Test 2: Get soft-deleted programs
    const deletedPrograms = await prisma.program.findMany({
      where: { deletedAt: { not: null } },
      select: { id: true, name: true, deletedAt: true, deletedBy: true }
    })
    console.log(`🗑️  Deleted Programs: ${deletedPrograms.length}`)
    
    if (deletedPrograms.length > 0) {
      console.log('\n📋 Deleted Programs List:')
      deletedPrograms.forEach((prog, index) => {
        console.log(`   ${index + 1}. ${prog.name}`)
        console.log(`      - ID: ${prog.id}`)
        console.log(`      - Deleted At: ${prog.deletedAt}`)
        console.log(`      - Deleted By: ${prog.deletedBy || 'Unknown'}`)
      })
    }
    
    // Test 3: Get ALL programs including deleted (no filter)
    const allPrograms = await prisma.program.findMany({
      select: { id: true, name: true, deletedAt: true }
    })
    console.log(`\n📊 Total Programs in Database: ${allPrograms.length}`)
    console.log(`   - Active: ${activePrograms.length}`)
    console.log(`   - Deleted: ${deletedPrograms.length}`)
    
    // Verify the filter is working
    if (allPrograms.length === activePrograms.length + deletedPrograms.length) {
      console.log('\n✅ Soft delete filter is working correctly!')
    } else {
      console.log('\n⚠️  Warning: Count mismatch detected')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testSoftDelete()

