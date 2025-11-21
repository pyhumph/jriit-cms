const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const computerEngineeringPrograms = [
  {
    slug: 'digital-electronics',
    detailPageLayout: 'computer-engineering',
    heroTitle: 'Digital Electronics',
    heroSubtitle: 'Master the fundamental principles of digital circuit design and electronic components',
    heroImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=2072&q=80',
    overviewTitle: 'Course Overview',
    overviewContent: 'Digital Electronics is the foundation of modern computer systems and electronic devices. This comprehensive course introduces you to the fundamental principles of digital circuit design, logic gates, and electronic components that form the backbone of all digital systems. You\'ll learn about binary number systems, Boolean algebra, logic gates, combinational and sequential circuits, and how to design and analyze digital systems. The course combines theoretical knowledge with hands-on laboratory work using modern digital design tools and simulation software. Through practical projects and real-world applications, you\'ll gain the skills needed to design, implement, and troubleshoot digital circuits. This course prepares you for advanced topics in computer engineering and provides a solid foundation for careers in electronics and embedded systems.',
    learningOutcomes: JSON.stringify([
      'Understand binary number systems and digital logic',
      'Master Boolean algebra and logic gate operations',
      'Design combinational logic circuits',
      'Implement sequential circuits and flip-flops',
      'Work with digital design tools and simulation software',
      'Analyze and troubleshoot digital circuits',
      'Understand memory systems and storage devices',
      'Design arithmetic and logic units (ALUs)',
      'Apply digital electronics principles to real-world problems',
      'Prepare for advanced computer engineering courses',
    ]),
    careerPaths: JSON.stringify([
      {
        title: 'Digital Design Engineer',
        description: 'Design and develop digital circuits and systems for various applications.',
        color: 'bg-gradient-to-r from-blue-500 to-purple-600',
      },
      {
        title: 'Embedded Systems Engineer',
        description: 'Develop embedded systems and microcontrollers for IoT and automation applications.',
        color: 'bg-gradient-to-r from-green-500 to-teal-600',
      },
      {
        title: 'Hardware Engineer',
        description: 'Design and test computer hardware components and systems.',
        color: 'bg-gradient-to-r from-orange-500 to-red-600',
      },
      {
        title: 'Electronics Technician',
        description: 'Install, maintain, and repair electronic equipment and digital systems.',
        color: 'bg-gradient-to-r from-pink-500 to-rose-600',
      },
      {
        title: 'FPGA Engineer',
        description: 'Design and program Field-Programmable Gate Arrays for specialized applications.',
        color: 'bg-gradient-to-r from-indigo-500 to-blue-600',
      },
      {
        title: 'Test Engineer',
        description: 'Develop and implement testing procedures for digital electronic systems.',
        color: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      },
    ]),
    detailsDuration: '14 weeks',
    detailsPrerequisites: 'Basic mathematics and physics knowledge',
    level: 'Beginner to Intermediate',
  },
  {
    slug: 'computer-architecture',
    detailPageLayout: 'computer-engineering',
    heroTitle: 'Computer Architecture',
    heroSubtitle: 'Understand the design and organization of computer hardware systems',
    heroImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=2072&q=80',
    overviewTitle: 'Course Overview',
    overviewContent: 'Computer Architecture explores the fundamental design principles and organization of computer systems. This comprehensive course covers the internal structure of processors, memory systems, input/output mechanisms, and how these components work together to execute programs efficiently. You\'ll learn about instruction set architecture, processor design, memory hierarchy, caching, pipelining, and parallel processing. The course examines both classical and modern computer architectures, including RISC and CISC processors, multi-core systems, and emerging technologies. Through hands-on projects and simulations, you\'ll gain practical experience in designing and analyzing computer systems. This course provides the foundation for understanding how software interacts with hardware and prepares you for advanced topics in computer engineering and system design.',
    learningOutcomes: JSON.stringify([
      'Understand instruction set architecture and assembly language',
      'Master processor design and execution principles',
      'Learn memory hierarchy and caching strategies',
      'Understand pipelining and parallel processing techniques',
      'Analyze performance metrics and optimization strategies',
      'Design and simulate computer system components',
      'Understand input/output systems and interfaces',
      'Learn about modern processor architectures',
      'Apply computer architecture principles to real systems',
      'Prepare for advanced computer engineering courses',
    ]),
    careerPaths: JSON.stringify([
      {
        title: 'Computer Architect',
        description: 'Design and develop computer system architectures for various applications.',
        color: 'bg-gradient-to-r from-blue-500 to-purple-600',
      },
      {
        title: 'Processor Design Engineer',
        description: 'Design and optimize microprocessors and CPU architectures.',
        color: 'bg-gradient-to-r from-green-500 to-teal-600',
      },
      {
        title: 'Systems Engineer',
        description: 'Design and integrate computer systems for specific applications.',
        color: 'bg-gradient-to-r from-orange-500 to-red-600',
      },
      {
        title: 'Performance Engineer',
        description: 'Analyze and optimize system performance for maximum efficiency.',
        color: 'bg-gradient-to-r from-pink-500 to-rose-600',
      },
      {
        title: 'Research Engineer',
        description: 'Conduct research in computer architecture and emerging technologies.',
        color: 'bg-gradient-to-r from-indigo-500 to-blue-600',
      },
      {
        title: 'Technical Consultant',
        description: 'Provide expertise in computer system design and optimization.',
        color: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      },
    ]),
    detailsDuration: '16 weeks',
    detailsPrerequisites: 'Digital Electronics and basic programming knowledge',
    level: 'Intermediate to Advanced',
  },
];

async function seedComputerEngineeringDetails() {
  console.log('🔧 Seeding Computer Engineering program details...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const programData of computerEngineeringPrograms) {
    const { slug, ...detailContent } = programData;

    try {
      // Check if program exists
      const existingProgram = await prisma.program.findUnique({
        where: { slug },
        select: { id: true, name: true },
      });

      if (!existingProgram) {
        console.log(`  ⚠️  Program "${slug}" not found in database. Skipping...`);
        errorCount++;
        continue;
      }

      // Update program with detail content
      await prisma.program.update({
        where: { slug },
        data: detailContent,
      });

      console.log(`  ✅ Seeded: ${existingProgram.name} (${slug})`);
      successCount++;
    } catch (error) {
      console.error(`  ❌ Failed to seed ${slug}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`  ✅ Successfully seeded: ${successCount} programs`);
  console.log(`  ❌ Failed: ${errorCount} programs`);
  console.log(`\n🎉 Computer Engineering programs seeding completed!`);
}

seedComputerEngineeringDetails()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



