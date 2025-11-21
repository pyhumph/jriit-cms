const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const computerSciencePrograms = [
  {
    slug: 'programming-fundamentals',
    detailPageLayout: 'computer-science',
    heroTitle: 'Programming Fundamentals',
    heroSubtitle: 'Master the essential building blocks of programming and software development',
    heroImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=2072&q=80',
    overviewTitle: 'Course Overview',
    overviewContent: 'Programming Fundamentals is the cornerstone of computer science education, providing students with the essential skills and knowledge needed to become proficient programmers. This comprehensive course introduces you to the fundamental concepts, principles, and practices that form the foundation of all programming languages. Through hands-on practice and real-world examples, you\'ll learn how to think algorithmically, solve problems systematically, and write clean, efficient code. The course covers essential programming concepts including variables, data types, control structures, functions, and object-oriented programming principles. Whether you\'re a complete beginner or looking to strengthen your programming foundation, this course will equip you with the skills and confidence needed to tackle more advanced programming challenges and pursue a successful career in software development.',
    learningOutcomes: JSON.stringify([
      'Understand fundamental programming concepts and principles',
      'Master variables, data types, and basic operations',
      'Learn control structures (conditionals, loops, and branching)',
      'Develop proficiency in functions and modular programming',
      'Grasp object-oriented programming concepts',
      'Practice problem-solving and algorithmic thinking',
      'Write clean, readable, and maintainable code',
      'Debug and troubleshoot programming errors effectively',
      'Understand software development best practices',
      'Prepare for advanced programming courses and projects',
    ]),
    careerPaths: JSON.stringify([
      {
        title: 'Software Developer',
        description: 'Design and develop software applications using various programming languages and frameworks.',
        color: 'bg-gradient-to-r from-blue-500 to-purple-600',
      },
      {
        title: 'Web Developer',
        description: 'Create dynamic websites and web applications using front-end and back-end technologies.',
        color: 'bg-gradient-to-r from-green-500 to-teal-600',
      },
      {
        title: 'Mobile App Developer',
        description: 'Develop mobile applications for iOS and Android platforms using modern development tools.',
        color: 'bg-gradient-to-r from-orange-500 to-red-600',
      },
      {
        title: 'Game Developer',
        description: 'Create interactive games and entertainment software using programming and game engines.',
        color: 'bg-gradient-to-r from-pink-500 to-rose-600',
      },
      {
        title: 'Software Engineer',
        description: 'Design, develop, and maintain large-scale software systems and applications.',
        color: 'bg-gradient-to-r from-indigo-500 to-blue-600',
      },
      {
        title: 'Full-Stack Developer',
        description: 'Work on both front-end and back-end development to create complete web solutions.',
        color: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      },
    ]),
    detailsDuration: '12 weeks',
    detailsPrerequisites: 'Basic computer literacy and mathematics knowledge',
    level: 'Beginner to Intermediate',
  },
  {
    slug: 'data-structures-algorithms',
    detailPageLayout: 'computer-science',
    heroTitle: 'Data Structures & Algorithms',
    heroSubtitle: 'Master the fundamental building blocks of efficient programming and problem-solving',
    heroImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=2072&q=80',
    overviewTitle: 'Course Overview',
    overviewContent: 'Data Structures and Algorithms form the backbone of computer science and software engineering. This essential course teaches you how to organize data efficiently and solve complex problems using proven algorithmic techniques. Mastery of these concepts is crucial for writing efficient, scalable software and excelling in technical interviews. You\'ll learn about fundamental data structures including arrays, linked lists, stacks, queues, trees, graphs, and hash tables. Each structure is accompanied by practical algorithms for insertion, deletion, searching, and traversal operations. The course emphasizes both theoretical understanding and practical implementation. Through hands-on coding exercises and real-world problem-solving scenarios, you\'ll develop the analytical thinking and programming skills needed to tackle complex computational challenges. This course prepares you for advanced computer science topics and technical interviews at top technology companies.',
    learningOutcomes: JSON.stringify([
      'Master fundamental data structures (arrays, lists, stacks, queues)',
      'Understand tree and graph data structures and their applications',
      'Learn essential sorting and searching algorithms',
      'Analyze algorithm time and space complexity (Big O notation)',
      'Implement dynamic programming solutions',
      'Solve problems using greedy algorithms and divide-and-conquer techniques',
      'Apply graph algorithms for pathfinding and network analysis',
      'Design efficient algorithms for real-world problems',
      'Prepare for technical interviews and coding challenges',
      'Develop problem-solving and analytical thinking skills',
    ]),
    careerPaths: JSON.stringify([
      {
        title: 'Software Engineer',
        description: 'Design and implement efficient software solutions using optimal algorithms and data structures.',
        color: 'bg-gradient-to-r from-blue-500 to-purple-600',
      },
      {
        title: 'Algorithm Engineer',
        description: 'Develop and optimize algorithms for specific applications and performance requirements.',
        color: 'bg-gradient-to-r from-green-500 to-teal-600',
      },
      {
        title: 'Data Scientist',
        description: 'Apply algorithmic thinking to analyze large datasets and extract meaningful insights.',
        color: 'bg-gradient-to-r from-orange-500 to-red-600',
      },
      {
        title: 'Research Scientist',
        description: 'Conduct research in computer science and develop new algorithmic solutions.',
        color: 'bg-gradient-to-r from-pink-500 to-rose-600',
      },
      {
        title: 'Technical Interviewer',
        description: 'Evaluate candidates\' algorithmic thinking and problem-solving abilities.',
        color: 'bg-gradient-to-r from-indigo-500 to-blue-600',
      },
      {
        title: 'Competitive Programmer',
        description: 'Participate in programming competitions and solve complex algorithmic challenges.',
        color: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      },
    ]),
    detailsDuration: '16 weeks',
    detailsPrerequisites: 'Programming Fundamentals or equivalent programming experience',
    level: 'Intermediate to Advanced',
  },
];

async function seedComputerScienceDetails() {
  console.log('💻 Seeding Computer Science program details...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const programData of computerSciencePrograms) {
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
  console.log(`\n🎉 Computer Science programs seeding completed!`);
}

seedComputerScienceDetails()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



