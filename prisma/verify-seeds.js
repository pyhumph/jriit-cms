const fs = require('fs');

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./prisma/dev.db';
}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
  const results = [];
  results.push('=== SEED VERIFICATION RESULTS ===\n');
  
  // Check Cyber Security programs
  results.push('🔒 CYBER SECURITY PROGRAMS:');
  const cyberPrograms = [
    'intro-to-cyber-security',
    'network-os-security',
    'cryptography-basics',
    'ethical-hacking-pen-testing',
    'web-application-security',
    'malware-forensics',
    'wireless-mobile-security'
  ];
  
  let cyberSuccess = 0;
  for (const slug of cyberPrograms) {
    const p = await prisma.program.findUnique({
      where: { slug },
      select: { name: true, heroTitle: true, introParagraphs: true, detailPageLayout: true }
    });
    if (p) {
      const hasContent = p.heroTitle && p.introParagraphs;
      if (hasContent) cyberSuccess++;
      results.push(`  ${hasContent ? '✅' : '⚠️'} ${p.name}:`);
      results.push(`     - Layout: ${p.detailPageLayout || 'NULL'}`);
      results.push(`     - Hero Title: ${p.heroTitle ? 'SET' : 'NULL'}`);
      results.push(`     - Intro Paragraphs: ${p.introParagraphs ? 'SET (' + p.introParagraphs.length + ' chars)' : 'NULL'}`);
    } else {
      results.push(`  ❌ ${slug}: NOT FOUND IN DATABASE`);
    }
  }
  
  // Check Business Administration programs
  results.push('\n📈 BUSINESS ADMINISTRATION PROGRAMS:')
  const businessPrograms = [
    'business-management',
    'marketing-management',
    'financial-management',
    'human-resource-management',
    'operations-management',
    'strategic-planning',
  ]
  let businessSuccess = 0
  for (const slug of businessPrograms) {
    const p = await prisma.program.findUnique({
      where: { slug },
    })
    if (p) {
      const hasContent = p.coreConcepts && p.learningPath && p.modules
      if (hasContent) businessSuccess++
      results.push(`  ${hasContent ? '✅' : '⚠️'} ${p.name}:`)
      results.push(`     - Layout: ${p.detailPageLayout || 'NULL'}`)
      results.push(`     - Hero Title: ${p.heroTitle ? 'SET' : 'NULL'}`)
      results.push(`     - Core Concepts: ${p.coreConcepts ? 'SET' : 'NULL'}`)
      results.push(`     - Learning Path: ${p.learningPath ? 'SET' : 'NULL'}`)
      results.push(`     - Modules: ${p.modules ? 'SET' : 'NULL'}`)
    } else {
      results.push(`  ❌ ${slug}: NOT FOUND IN DATABASE`)
    }
  }
  
  // Check Computer Science programs
  results.push('\n💻 COMPUTER SCIENCE PROGRAMS:');
  const csPrograms = ['programming-fundamentals', 'data-structures-algorithms'];
  let csSuccess = 0;
  for (const slug of csPrograms) {
    const p = await prisma.program.findUnique({
      where: { slug },
      select: { name: true, heroTitle: true, level: true, learningOutcomes: true, detailPageLayout: true }
    });
    if (p) {
      const hasContent = p.heroTitle && p.level && p.learningOutcomes;
      if (hasContent) csSuccess++;
      results.push(`  ${hasContent ? '✅' : '⚠️'} ${p.name}:`);
      results.push(`     - Layout: ${p.detailPageLayout || 'NULL'}`);
      results.push(`     - Hero Title: ${p.heroTitle ? 'SET' : 'NULL'}`);
      results.push(`     - Level: ${p.level || 'NULL'}`);
      results.push(`     - Learning Outcomes: ${p.learningOutcomes ? 'SET (' + p.learningOutcomes.length + ' chars)' : 'NULL'}`);
    } else {
      results.push(`  ❌ ${slug}: NOT FOUND IN DATABASE`);
    }
  }
  
  // Check Computer Engineering programs
  results.push('\n🔧 COMPUTER ENGINEERING PROGRAMS:');
  const cePrograms = ['digital-electronics', 'computer-architecture'];
  let ceSuccess = 0;
  for (const slug of cePrograms) {
    const p = await prisma.program.findUnique({
      where: { slug },
      select: { name: true, heroTitle: true, level: true, learningOutcomes: true, detailPageLayout: true }
    });
    if (p) {
      const hasContent = p.heroTitle && p.level && p.learningOutcomes;
      if (hasContent) ceSuccess++;
      results.push(`  ${hasContent ? '✅' : '⚠️'} ${p.name}:`);
      results.push(`     - Layout: ${p.detailPageLayout || 'NULL'}`);
      results.push(`     - Hero Title: ${p.heroTitle ? 'SET' : 'NULL'}`);
      results.push(`     - Level: ${p.level || 'NULL'}`);
      results.push(`     - Learning Outcomes: ${p.learningOutcomes ? 'SET (' + p.learningOutcomes.length + ' chars)' : 'NULL'}`);
    } else {
      results.push(`  ❌ ${slug}: NOT FOUND IN DATABASE`);
    }
  }
  
    // Check Travel & Tourism programs
    results.push('\n🌍 TRAVEL & TOURISM PROGRAMS:')
    const ttPrograms = [
      'tourism-operations',
      'customer-service-excellence',
      'destination-management',
      'hotel-management',
      'travel-agency-operations',
      'event-management'
    ]
    let ttSuccess = 0
    for (const slug of ttPrograms) {
      const p = await prisma.program.findUnique({
        where: { slug },
        select: { name: true, heroTitle: true, detailPageLayout: true, coreConcepts: true, learningPath: true, modules: true }
      })
      if (p) {
        const hasContent = p.heroTitle && p.coreConcepts && p.learningPath && p.modules
        if (hasContent) ttSuccess++
        results.push(`  ${hasContent ? '✅' : '⚠️'} ${p.name}:`)
        results.push(`     - Layout: ${p.detailPageLayout || 'NULL'}`)
        results.push(`     - Hero Title: ${p.heroTitle ? 'SET' : 'NULL'}`)
        results.push(`     - Core Concepts: ${p.coreConcepts ? 'SET' : 'NULL'}`)
        results.push(`     - Learning Path: ${p.learningPath ? 'SET' : 'NULL'}`)
        results.push(`     - Modules: ${p.modules ? 'SET' : 'NULL'}`)
      } else {
        results.push(`  ❌ ${slug}: NOT FOUND IN DATABASE`)
    }
  }
  
  results.push('\n=== SUMMARY ===');
  results.push(`Cyber Security: ${cyberSuccess}/${cyberPrograms.length} programs seeded`);
    results.push(`Business Administration: ${businessSuccess}/${businessPrograms.length} programs seeded`);
    results.push(`Travel & Tourism: ${ttSuccess}/${ttPrograms.length} programs seeded`);
  results.push(`Computer Science: ${csSuccess}/${csPrograms.length} programs seeded`);
  results.push(`Computer Engineering: ${ceSuccess}/${cePrograms.length} programs seeded`);
    results.push(`\nTotal: ${cyberSuccess + businessSuccess + ttSuccess + csSuccess + ceSuccess}/${cyberPrograms.length + businessPrograms.length + ttPrograms.length + csPrograms.length + cePrograms.length} programs seeded`);
  
  const output = results.join('\n');
  console.log(output);
  fs.writeFileSync('/tmp/seed-verification.txt', output);
  console.log('\n📄 Results also saved to /tmp/seed-verification.txt');
  } catch (error) {
    console.error('Seed verification failed:', error);
    fs.writeFileSync('/tmp/seed-verification.txt', `ERROR: ${error?.message || error}`);
    process.exitCode = 1;
  } finally {
  await prisma.$disconnect();
  }
})();



