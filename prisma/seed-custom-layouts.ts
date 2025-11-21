import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const customLayoutsContent = {
  'computer-applications': {
    // Hero applications (first 4 apps shown in hero section)
    heroApplications: [
      { name: 'Microsoft Word', icon: 'FileText', slug: 'word' },
      { name: 'Microsoft Excel', icon: 'FileSpreadsheet', slug: 'excel' },
      { name: 'Microsoft PowerPoint', icon: 'Presentation', slug: 'powerpoint' },
      { name: 'Microsoft Access', icon: 'Database', slug: 'access' },
    ],

    // Complete Suite Section
    suiteTitle: 'Complete Microsoft Office Suite',
    suiteDescription: 'Learn industry-standard applications used by millions worldwide',

    applicationCards: [
      {
        name: 'Microsoft Word',
        icon: 'FileText',
        description: 'Document creation, formatting, and professional writing',
        features: ['Document formatting', 'Templates', 'Mail merge', 'Collaboration'],
        color: 'blue',
      },
      {
        name: 'Microsoft Excel',
        icon: 'FileSpreadsheet',
        description: 'Spreadsheet analysis, data visualization, and calculations',
        features: ['Formulas & Functions', 'Pivot Tables', 'Charts', 'Data Analysis'],
        color: 'green',
      },
      {
        name: 'Microsoft PowerPoint',
        icon: 'Presentation',
        description: 'Dynamic presentations and visual storytelling',
        features: ['Slide design', 'Animations', 'Templates', 'Multimedia'],
        color: 'orange',
      },
      {
        name: 'Microsoft Access',
        icon: 'Database',
        description: 'Database management and data organization',
        features: ['Database design', 'Forms', 'Reports', 'Queries'],
        color: 'red',
      },
      {
        name: 'Microsoft Outlook',
        icon: 'Mail',
        description: 'Email management and communication',
        features: ['Email organization', 'Calendar', 'Contacts', 'Tasks'],
        color: 'blue',
      },
      {
        name: 'Microsoft Teams',
        icon: 'Users',
        description: 'Collaboration and remote work solutions',
        features: ['Video meetings', 'File sharing', 'Chat', 'Integrations'],
        color: 'purple',
      },
      {
        name: 'Microsoft OneNote',
        icon: 'BookOpen',
        description: 'Digital note-taking and organization',
        features: ['Note organization', 'Sync across devices', 'Search', 'Sharing'],
        color: 'indigo',
      },
      {
        name: 'Microsoft Publisher',
        icon: 'BookOpen',
        description: 'Design and publish professional documents',
        features: ['Brochures', 'Flyers', 'Newsletters', 'Templates'],
        color: 'green',
      },
    ],

    // Learning Path Section
    learningPathTitle: 'Learning Path',
    learningPathDesc: 'Progress from beginner to advanced with our structured curriculum',

    learningLevels: [
      {
        level: 'Beginner Level',
        duration: '2 months',
        modules: ['Word Basics', 'Excel Fundamentals', 'PowerPoint Essentials'],
      },
      {
        level: 'Intermediate Level',
        duration: '3 months',
        modules: ['Advanced Excel', 'Access Database', 'Outlook Management'],
      },
      {
        level: 'Advanced Level',
        duration: '3 months',
        modules: ['Excel Macros', 'Advanced Access', 'Teams & Collaboration'],
      },
    ],
  },

  'adobe-applications': {
    // Hero applications (first 4 apps shown in hero section)
    heroApplications: [
      { name: 'Adobe Photoshop', icon: 'Image', slug: 'photoshop' },
      { name: 'Adobe Illustrator', icon: 'PenTool', slug: 'illustrator' },
      { name: 'Adobe Premiere Pro', icon: 'Video', slug: 'premiere' },
      { name: 'Adobe After Effects', icon: 'Layers', slug: 'after-effects' },
    ],

    // Complete Suite Section
    suiteTitle: 'Complete Adobe Creative Suite',
    suiteDescription: 'Learn industry-leading creative tools used by professionals worldwide',

    applicationCards: [
      {
        name: 'Adobe Photoshop',
        icon: 'Image',
        description: 'Professional photo editing, digital art creation, and image manipulation',
        features: ['Photo editing', 'Digital painting', 'Layer management', 'Filters & effects'],
        color: 'blue',
      },
      {
        name: 'Adobe Illustrator',
        icon: 'PenTool',
        description: 'Vector graphics, logos, icons, and scalable artwork for digital and print',
        features: ['Vector graphics', 'Logo design', 'Illustration', 'Typography'],
        color: 'orange',
      },
      {
        name: 'Adobe Premiere Pro',
        icon: 'Video',
        description: 'Professional video editing, transitions, effects, and storytelling',
        features: ['Video editing', 'Color grading', 'Audio mixing', 'Export formats'],
        color: 'purple',
      },
      {
        name: 'Adobe After Effects',
        icon: 'Layers',
        description: 'Motion graphics, animations, and cinematic visual effects',
        features: ['Motion graphics', 'Visual effects', 'Compositing', 'Animation'],
        color: 'pink',
      },
      {
        name: 'Adobe InDesign',
        icon: 'FileText',
        description: 'Layout design for magazines, brochures, posters, and publishing',
        features: ['Page layout', 'Typography', 'Print design', 'Digital publishing'],
        color: 'red',
      },
      {
        name: 'Adobe XD',
        icon: 'Brush',
        description: 'UI/UX design, prototyping, and user experience workflows',
        features: ['UI/UX design', 'Prototyping', 'Wireframing', 'Collaboration'],
        color: 'green',
      },
      {
        name: 'Adobe Lightroom',
        icon: 'Palette',
        description: 'Photo organization, editing, and professional photography workflow',
        features: ['Photo organization', 'RAW editing', 'Presets', 'Batch processing'],
        color: 'indigo',
      },
      {
        name: 'Adobe Creative Cloud',
        icon: 'Type',
        description: 'Integrated workflow across all Adobe applications and cloud services',
        features: ['Cloud storage', 'Asset libraries', 'Fonts & templates', 'Collaboration'],
        color: 'yellow',
      },
    ],

    // Learning Path Section
    learningPathTitle: 'Learning Path',
    learningPathDesc: 'Progress from beginner to advanced with our structured curriculum',

    learningLevels: [
      {
        level: 'Beginner Level',
        duration: '2 months',
        modules: ['Photoshop Basics', 'Illustrator Fundamentals', 'InDesign Essentials'],
      },
      {
        level: 'Intermediate Level',
        duration: '3 months',
        modules: ['Advanced Photoshop', 'Premiere Pro Editing', 'After Effects Basics'],
      },
      {
        level: 'Advanced Level',
        duration: '3 months',
        modules: ['Professional Workflows', 'Advanced Motion Graphics', 'Creative Suite Integration'],
      },
    ],
  },
};

async function seedCustomLayouts() {
  console.log('Seeding custom layout content...');

  for (const [slug, content] of Object.entries(customLayoutsContent)) {
    try {
      await prisma.program.update({
        where: { slug },
        data: {
          heroApplications: JSON.stringify(content.heroApplications),
          suiteTitle: content.suiteTitle,
          suiteDescription: content.suiteDescription,
          applicationCards: JSON.stringify(content.applicationCards),
          learningPathTitle: content.learningPathTitle,
          learningPathDesc: content.learningPathDesc,
          learningLevels: JSON.stringify(content.learningLevels),
        },
      });

      console.log(`✓ Seeded custom layout content for: ${slug}`);
    } catch (error) {
      console.error(`✗ Failed to seed ${slug}:`, error);
    }
  }

  console.log('Custom layout content seeded successfully!');
}

seedCustomLayouts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

