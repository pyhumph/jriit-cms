const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    console.log('Testing seed for: cryptography-basics');
    
    // Check if program exists
    const existing = await prisma.program.findUnique({
      where: { slug: 'cryptography-basics' },
      select: { id: true, name: true }
    });
    
    if (!existing) {
      console.log('❌ Program not found!');
      await prisma.$disconnect();
      return;
    }
    
    console.log('✅ Program found:', existing.name);
    
    // Try to update with all fields
    const updateData = {
      detailPageLayout: 'cyber-security',
      heroTitle: 'Cryptography Basics',
      heroSubtitle: 'Protecting data through the art and science of encryption.',
      heroImage: '/assets/Cryptography.jpeg',
      introParagraphs: JSON.stringify([
        'Test paragraph 1',
        'Test paragraph 2'
      ]),
      classroomImage: '/assets/classrom.jpeg',
      classroomTitle: 'IN THE CLASSROOM',
      classroomParagraphs: JSON.stringify([
        'Test classroom paragraph 1',
        'Test classroom paragraph 2'
      ]),
      beyondClassroomImage: '/assets/global.jpeg',
      beyondClassroomTitle: 'BEYOND THE CLASSROOM',
      beyondClassroomParagraphs: JSON.stringify([
        'Test beyond paragraph 1'
      ]),
      differenceImage: '/assets/crypto-diff.jpeg',
      differenceTitle: 'CRYPTOGRAPHY + THE JRIIT DIFFERENCE',
      differenceParagraphs: JSON.stringify([
        'Test difference paragraph 1'
      ]),
    };
    
    console.log('\nUpdating with data...');
    const result = await prisma.program.update({
      where: { slug: 'cryptography-basics' },
      data: updateData
    });
    
    console.log('\n✅ Update successful!');
    console.log('  detailPageLayout:', result.detailPageLayout);
    console.log('  heroTitle:', result.heroTitle);
    console.log('  introParagraphs:', result.introParagraphs ? `SET (${result.introParagraphs.length} chars)` : 'NULL');
    console.log('  classroomImage:', result.classroomImage);
    console.log('  classroomTitle:', result.classroomTitle);
    console.log('  classroomParagraphs:', result.classroomParagraphs ? `SET (${result.classroomParagraphs.length} chars)` : 'NULL');
    console.log('  beyondClassroomImage:', result.beyondClassroomImage);
    console.log('  differenceImage:', result.differenceImage);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('Unknown argument')) {
      console.error('  → Field does not exist in database!');
      console.error('  → Run: npx prisma db push');
    }
  } finally {
    await prisma.$disconnect();
  }
})();



