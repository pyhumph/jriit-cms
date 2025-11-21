const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('=== Checking Database Structure ===\n');

  // Check Departments
  console.log('📁 DEPARTMENTS:');
  const departments = await prisma.department.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
      _count: {
        select: {
          programs: true,
        },
      },
    },
  });

  if (departments.length === 0) {
    console.log('  ⚠️  No departments found!\n');
  } else {
    departments.forEach((dept) => {
      console.log(`  ✓ ${dept.name} (${dept.slug}) - ${dept._count.programs} programs`);
    });
  }

  console.log('\n📚 PROGRAMS BY DEPARTMENT:');
  for (const dept of departments) {
    const programs = await prisma.program.findMany({
      where: { departmentId: dept.id },
      select: {
        id: true,
        name: true,
        slug: true,
        detailPageLayout: true,
        heroTitle: true,
      },
      orderBy: { name: 'asc' },
    });

    if (programs.length > 0) {
      console.log(`\n  ${dept.name} (${programs.length} programs):`);
      programs.forEach((prog) => {
        const layout = prog.detailPageLayout || 'none';
        const hasContent = prog.heroTitle ? '✓' : '✗';
        console.log(`    ${hasContent} ${prog.name} (${prog.slug}) - Layout: ${layout}`);
      });
    }
  }

  // Check for required departments
  console.log('\n\n=== Required Departments Check ===');
  const requiredDepartments = [
    { name: 'Cyber Security', slug: 'cyber-security' },
    { name: 'Computer Science', slug: 'computer-science' },
    { name: 'Computer Engineering', slug: 'computer-engineering' },
    { name: 'Business Administration', slug: 'business-administration' },
    { name: 'Travel & Tourism Management', slug: 'travel-tourism-management' },
    { name: 'Accountancy', slug: 'accountancy' },
    { name: 'Electronics & Telecommunications', slug: 'electronics-telecommunications' },
    { name: 'Professional Courses', slug: 'professional-courses' },
    { name: 'Short Courses', slug: 'short-courses' },
  ];

  const existingSlugs = departments.map((d) => d.slug);
  const missing = requiredDepartments.filter(
    (req) => !existingSlugs.includes(req.slug)
  );

  if (missing.length === 0) {
    console.log('  ✅ All required departments exist!\n');
  } else {
    console.log('  ⚠️  Missing departments:');
    missing.forEach((dept) => {
      console.log(`    - ${dept.name} (${dept.slug})`);
    });
  }

  // Check for required programs
  console.log('\n=== Required Programs Check ===');
  const requiredPrograms = {
    'cyber-security': [
      'intro-to-cyber-security',
      'network-os-security',
      'cryptography-basics',
      'ethical-hacking-pen-testing',
      'web-application-security',
      'malware-forensics',
      'wireless-mobile-security',
    ],
    'computer-science': [
      'programming-fundamentals',
      'data-structures-algorithms',
    ],
    'computer-engineering': [
      'digital-electronics',
      'computer-architecture',
    ],
  };

  for (const [deptSlug, programSlugs] of Object.entries(requiredPrograms)) {
    const dept = departments.find((d) => d.slug === deptSlug);
    if (!dept) {
      console.log(`\n  ⚠️  Department "${deptSlug}" not found - cannot check programs`);
      continue;
    }

    const existingPrograms = await prisma.program.findMany({
      where: { departmentId: dept.id },
      select: { slug: true },
    });
    const existingSlugs = existingPrograms.map((p) => p.slug);
    const missing = programSlugs.filter((slug) => !existingSlugs.includes(slug));

    if (missing.length === 0) {
      console.log(`  ✅ ${dept.name}: All programs exist`);
    } else {
      console.log(`  ⚠️  ${dept.name}: Missing programs:`);
      missing.forEach((slug) => {
        console.log(`    - ${slug}`);
      });
    }
  }

  await prisma.$disconnect();
}

checkDatabase().catch(console.error);



