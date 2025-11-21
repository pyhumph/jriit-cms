const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const shortCoursePrograms = [
  {
    slug: 'web-design',
    detailPageLayout: 'short-course',
    heroTitle: 'Web Design',
    heroSubtitle: 'Learn modern web design principles, HTML, CSS, and responsive design techniques',
    heroImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=2072&q=80',
    overviewTitle: 'Program Overview',
    overviewContent: 'Web Design is a comprehensive short course that teaches you how to create beautiful, functional, and responsive websites. This program covers everything from HTML and CSS fundamentals to modern design principles and responsive layout techniques.\n\nAt JR Institute of Information Technology, our Web Design course combines hands-on coding practice with design theory. You\'ll learn to create visually appealing websites that work seamlessly across all devices, from desktop computers to smartphones and tablets.',
    coreConcepts: JSON.stringify([
      {
        icon: 'Code',
        title: 'HTML & CSS',
        description: 'Master the fundamentals of web markup and styling',
        features: ['HTML5 structure', 'CSS3 styling', 'Layout techniques', 'Responsive design'],
        color: 'blue'
      },
      {
        icon: 'Palette',
        title: 'Design Principles',
        description: 'Learn visual design and user experience fundamentals',
        features: ['Color theory', 'Typography', 'Visual hierarchy', 'UI/UX principles'],
        color: 'purple'
      },
      {
        icon: 'Monitor',
        title: 'Responsive Design',
        description: 'Create websites that work on all devices',
        features: ['Mobile-first design', 'Flexbox & Grid', 'Media queries', 'Cross-browser compatibility'],
        color: 'green'
      },
      {
        icon: 'Smartphone',
        title: 'Mobile Design',
        description: 'Design and optimize for mobile devices',
        features: ['Touch interfaces', 'Mobile layouts', 'Performance optimization', 'Mobile UX'],
        color: 'orange'
      },
      {
        icon: 'Globe',
        title: 'Web Standards',
        description: 'Follow best practices and web standards',
        features: ['Accessibility', 'SEO basics', 'Web performance', 'Best practices'],
        color: 'indigo'
      },
      {
        icon: 'Zap',
        title: 'Design Tools',
        description: 'Use modern design and prototyping tools',
        features: ['Figma/Adobe XD', 'Prototyping', 'Design systems', 'Asset creation'],
        color: 'yellow'
      }
    ]),
    learningPath: JSON.stringify([
      {
        title: 'Foundation Level',
        duration: '2 months',
        topics: ['HTML Basics', 'CSS Fundamentals', 'Design Principles']
      },
      {
        title: 'Intermediate Level',
        duration: '2 months',
        topics: ['Responsive Design', 'CSS Advanced', 'Design Tools']
      },
      {
        title: 'Advanced Level',
        duration: '2 months',
        topics: ['Advanced Layouts', 'Performance', 'Portfolio Development']
      }
    ]),
    modules: JSON.stringify([
      'Introduction to Web Design',
      'HTML5 Fundamentals',
      'CSS3 Styling and Layout',
      'Design Principles and Color Theory',
      'Typography and Visual Hierarchy',
      'Responsive Web Design',
      'Mobile-First Design Approach',
      'CSS Grid and Flexbox',
      'Design Tools: Figma and Adobe XD',
      'Web Accessibility and Standards',
      'Portfolio Project Development',
      'Capstone: Complete Website Design'
    ]),
    ctaTitle: 'Ready to Master Web Design?',
    ctaDescription: 'Join professionals who have transformed their careers through comprehensive web design training'
  },
  {
    slug: 'system-maintenance-cisco',
    detailPageLayout: 'short-course',
    heroTitle: 'System Maintenance and Repair: With CISCO',
    heroSubtitle: 'Master computer system maintenance, troubleshooting, and CISCO networking fundamentals',
    heroImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=2072&q=80',
    overviewTitle: 'Program Overview',
    overviewContent: 'System Maintenance and Repair with CISCO is a comprehensive short course that combines computer hardware maintenance with CISCO networking fundamentals. This program teaches you to diagnose, repair, and maintain computer systems while understanding network infrastructure.\n\nAt JR Institute of Information Technology, our System Maintenance course provides hands-on training in hardware troubleshooting, software installation, and CISCO networking basics. You\'ll learn to keep systems running efficiently and understand network connectivity.',
    coreConcepts: JSON.stringify([
      {
        icon: 'Wrench',
        title: 'Hardware Maintenance',
        description: 'Diagnose and repair computer hardware issues',
        features: ['Component replacement', 'Troubleshooting', 'Preventive maintenance', 'Diagnostics'],
        color: 'blue'
      },
      {
        icon: 'Network',
        title: 'CISCO Networking',
        description: 'Understand CISCO networking fundamentals',
        features: ['Network basics', 'CISCO devices', 'Configuration', 'Troubleshooting'],
        color: 'green'
      },
      {
        icon: 'Server',
        title: 'System Administration',
        description: 'Manage and maintain computer systems',
        features: ['OS installation', 'Software management', 'Updates', 'Backup systems'],
        color: 'purple'
      },
      {
        icon: 'Shield',
        title: 'Security Maintenance',
        description: 'Keep systems secure and protected',
        features: ['Antivirus', 'Firewall setup', 'Security updates', 'Access control'],
        color: 'orange'
      },
      {
        icon: 'Settings',
        title: 'Performance Optimization',
        description: 'Optimize system performance',
        features: ['Speed optimization', 'Resource management', 'Cleanup', 'Monitoring'],
        color: 'red'
      },
      {
        icon: 'Zap',
        title: 'Troubleshooting',
        description: 'Diagnose and resolve system problems',
        features: ['Problem identification', 'Diagnostic tools', 'Solution implementation', 'Documentation'],
        color: 'indigo'
      }
    ]),
    learningPath: JSON.stringify([
      {
        title: 'Foundation Level',
        duration: '2 months',
        topics: ['Hardware Basics', 'System Components', 'CISCO Introduction']
      },
      {
        title: 'Intermediate Level',
        duration: '2 months',
        topics: ['Maintenance Procedures', 'CISCO Configuration', 'Troubleshooting']
      },
      {
        title: 'Advanced Level',
        duration: '2 months',
        topics: ['Advanced Repairs', 'Network Management', 'Certification Prep']
      }
    ]),
    modules: JSON.stringify([
      'Introduction to System Maintenance',
      'Computer Hardware Components',
      'Hardware Troubleshooting and Repair',
      'Operating System Installation',
      'Software Installation and Management',
      'CISCO Networking Fundamentals',
      'CISCO Device Configuration',
      'Network Troubleshooting',
      'System Security and Maintenance',
      'Performance Optimization',
      'Preventive Maintenance',
      'Capstone: Complete System Maintenance Project'
    ]),
    ctaTitle: 'Ready to Master System Maintenance?',
    ctaDescription: 'Join professionals who have transformed their careers through comprehensive system maintenance training'
  },
  {
    slug: 'networking-cisco',
    detailPageLayout: 'short-course',
    heroTitle: 'Networking: With CISCO Course',
    heroSubtitle: 'Master network design, implementation, and CISCO networking technologies',
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2072&q=80',
    overviewTitle: 'Program Overview',
    overviewContent: 'Networking with CISCO Course is a comprehensive short course that teaches you network design, implementation, and management using CISCO technologies. This program covers everything from basic networking concepts to advanced CISCO device configuration.\n\nAt JR Institute of Information Technology, our Networking course combines theoretical knowledge with hands-on CISCO device practice. You\'ll learn to design, configure, and troubleshoot networks using industry-standard CISCO equipment and protocols.',
    coreConcepts: JSON.stringify([
      {
        icon: 'Network',
        title: 'Network Fundamentals',
        description: 'Understand core networking concepts and protocols',
        features: ['TCP/IP', 'OSI Model', 'Network topologies', 'Protocols'],
        color: 'blue'
      },
      {
        icon: 'Router',
        title: 'CISCO Routing',
        description: 'Configure and manage CISCO routers',
        features: ['Router configuration', 'Routing protocols', 'Static routes', 'Dynamic routing'],
        color: 'green'
      },
      {
        icon: 'Shield',
        title: 'Network Security',
        description: 'Implement network security measures',
        features: ['Access lists', 'Firewall configuration', 'VPN setup', 'Security policies'],
        color: 'purple'
      },
      {
        icon: 'Server',
        title: 'Switching',
        description: 'Configure CISCO switches and VLANs',
        features: ['Switch configuration', 'VLAN setup', 'STP', 'Ethernet switching'],
        color: 'orange'
      },
      {
        icon: 'Wifi',
        title: 'Wireless Networking',
        description: 'Set up and manage wireless networks',
        features: ['WLAN configuration', 'Wireless security', 'Access points', 'Troubleshooting'],
        color: 'red'
      },
      {
        icon: 'Settings',
        title: 'Network Management',
        description: 'Monitor and maintain network infrastructure',
        features: ['Network monitoring', 'Troubleshooting', 'Performance optimization', 'Documentation'],
        color: 'indigo'
      }
    ]),
    learningPath: JSON.stringify([
      {
        title: 'Foundation Level',
        duration: '2 months',
        topics: ['Network Basics', 'CISCO Introduction', 'Basic Configuration']
      },
      {
        title: 'Intermediate Level',
        duration: '2 months',
        topics: ['Routing & Switching', 'VLANs', 'Security']
      },
      {
        title: 'Advanced Level',
        duration: '2 months',
        topics: ['Advanced Routing', 'Network Design', 'Certification Prep']
      }
    ]),
    modules: JSON.stringify([
      'Introduction to Networking',
      'Network Fundamentals and Protocols',
      'CISCO Device Basics',
      'CISCO Router Configuration',
      'Routing Protocols',
      'CISCO Switch Configuration',
      'VLANs and Switching',
      'Network Security with CISCO',
      'Wireless Networking',
      'Network Troubleshooting',
      'Network Design and Planning',
      'Capstone: Complete Network Project'
    ]),
    ctaTitle: 'Ready to Master CISCO Networking?',
    ctaDescription: 'Join professionals who have transformed their careers through comprehensive networking training'
  },
  {
    slug: 'computer-hardware-short',
    detailPageLayout: 'short-course',
    heroTitle: 'Computer Hardware',
    heroSubtitle: 'Learn computer hardware components, assembly, and troubleshooting techniques',
    heroImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=2072&q=80',
    overviewTitle: 'Program Overview',
    overviewContent: 'Computer Hardware is a comprehensive short course that teaches you about computer components, system assembly, and hardware troubleshooting. This program covers everything from basic hardware components to advanced troubleshooting and maintenance techniques.\n\nAt JR Institute of Information Technology, our Computer Hardware course provides hands-on training with actual computer components. You\'ll learn to build, upgrade, and maintain computer systems from the ground up.',
    coreConcepts: JSON.stringify([
      {
        icon: 'Cpu',
        title: 'Processors & CPUs',
        description: 'Understand CPU architecture and performance',
        features: ['CPU types', 'Socket types', 'Performance specs', 'Overclocking basics'],
        color: 'blue'
      },
      {
        icon: 'HardDrive',
        title: 'Storage Devices',
        description: 'Learn about storage technologies',
        features: ['HDDs & SSDs', 'RAID configurations', 'Data recovery', 'Backup solutions'],
        color: 'green'
      },
      {
        icon: 'MemoryStick',
        title: 'Memory & RAM',
        description: 'Master memory technologies',
        features: ['RAM types', 'Memory speeds', 'Capacity planning', 'Troubleshooting'],
        color: 'purple'
      },
      {
        icon: 'Monitor',
        title: 'Display Systems',
        description: 'Understand graphics and displays',
        features: ['Graphics cards', 'Display types', 'Resolution', 'Multi-monitor setups'],
        color: 'orange'
      },
      {
        icon: 'Zap',
        title: 'Power Systems',
        description: 'Learn about power and cooling',
        features: ['PSU selection', 'Power requirements', 'Cooling solutions', 'Cable management'],
        color: 'red'
      },
      {
        icon: 'Wrench',
        title: 'Assembly & Repair',
        description: 'Build and repair computer systems',
        features: ['System assembly', 'Component replacement', 'Diagnostics', 'Troubleshooting'],
        color: 'indigo'
      }
    ]),
    learningPath: JSON.stringify([
      {
        title: 'Foundation Level',
        duration: '2 months',
        topics: ['Hardware Basics', 'Components Overview', 'Safety Procedures']
      },
      {
        title: 'Intermediate Level',
        duration: '2 months',
        topics: ['System Assembly', 'Upgrades', 'Troubleshooting']
      },
      {
        title: 'Advanced Level',
        duration: '2 months',
        topics: ['Advanced Repairs', 'Performance Tuning', 'Certification Prep']
      }
    ]),
    modules: JSON.stringify([
      'Introduction to Computer Hardware',
      'Motherboards and Chipsets',
      'Processors and CPUs',
      'Memory and RAM Technologies',
      'Storage Devices: HDDs and SSDs',
      'Graphics Cards and Display Systems',
      'Power Supplies and Cooling',
      'Input and Output Devices',
      'System Assembly and Configuration',
      'Hardware Troubleshooting',
      'Component Upgrades and Maintenance',
      'Capstone: Complete System Build'
    ]),
    ctaTitle: 'Ready to Master Computer Hardware?',
    ctaDescription: 'Join professionals who have transformed their careers through comprehensive hardware training'
  }
];

async function main() {
  console.log('🚀 Starting Short Course programs seeding...\n');

  // Find the department (correct slug is 'short-course')
  const department = await prisma.department.findUnique({
    where: { slug: 'short-course' }
  });

  if (!department) {
    console.error('❌ Department "short-course" not found!');
    console.log('\nChecking all departments:');
    const allDepts = await prisma.department.findMany();
    allDepts.forEach(d => console.log(`  - ${d.name} (slug: "${d.slug}")`));
    console.log('\nPlease ensure the department exists in the database first.');
    return;
  }

  console.log(`✅ Found department: ${department.name}\n`);

  let successCount = 0;
  let errorCount = 0;
  let notFoundCount = 0;

  for (const programData of shortCoursePrograms) {
    try {
      const program = await prisma.program.findUnique({
        where: { slug: programData.slug }
      });

      if (!program) {
        console.log(`⚠️  Program "${programData.slug}" not found in database. Skipping...`);
        notFoundCount++;
        continue;
      }

      await prisma.program.update({
        where: { slug: programData.slug },
        data: {
          detailPageLayout: programData.detailPageLayout,
          heroTitle: programData.heroTitle,
          heroSubtitle: programData.heroSubtitle,
          heroImage: programData.heroImage,
          overviewTitle: programData.overviewTitle,
          overviewContent: programData.overviewContent,
          coreConcepts: programData.coreConcepts,
          learningPath: programData.learningPath,
          modules: programData.modules,
          ctaTitle: programData.ctaTitle,
          ctaDescription: programData.ctaDescription
        }
      });

      console.log(`✅ Updated: ${program.name}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error updating ${programData.slug}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Successfully updated: ${successCount} programs`);
  console.log(`   ⚠️  Not found: ${notFoundCount} programs`);
  console.log(`   ❌ Errors: ${errorCount} programs`);
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

