const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const businessAdminPrograms = [
  {
    slug: 'business-management',
    detailPageLayout: 'business-administration',
    heroTitle: 'Business Management',
    heroSubtitle: 'Master the art of leading organizations, making strategic decisions, and driving business success',
    heroImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2072&q=80',
    coreConcepts: JSON.stringify([
      { icon: 'Briefcase', title: 'Leadership & Management', description: 'Develop essential leadership skills and management techniques', features: ['Team leadership', 'Decision making', 'Conflict resolution', 'Performance management'], color: 'blue' },
      { icon: 'Target', title: 'Strategic Planning', description: 'Learn to set goals and create actionable business strategies', features: ['Goal setting', 'Strategic analysis', 'Business planning', 'Risk assessment'], color: 'green' },
      { icon: 'Users', title: 'Organizational Behavior', description: 'Understand how people and groups function in organizations', features: ['Team dynamics', 'Motivation theories', 'Organizational culture', 'Change management'], color: 'purple' },
      { icon: 'TrendingUp', title: 'Business Growth', description: 'Master techniques for scaling and expanding businesses', features: ['Market expansion', 'Revenue growth', 'Resource optimization', 'Innovation strategies'], color: 'orange' },
      { icon: 'BarChart3', title: 'Business Analytics', description: 'Use data-driven insights to make informed business decisions', features: ['Data analysis', 'KPI tracking', 'Performance metrics', 'Business intelligence'], color: 'red' },
      { icon: 'Lightbulb', title: 'Entrepreneurship', description: 'Learn to identify opportunities and launch successful ventures', features: ['Opportunity identification', 'Business model design', 'Startup strategies', 'Venture capital'], color: 'indigo' },
    ]),
    learningPath: JSON.stringify([
      { title: 'Foundation Level', duration: '3 months', topics: ['Business Fundamentals', 'Management Principles', 'Leadership Basics'] },
      { title: 'Intermediate Level', duration: '4 months', topics: ['Strategic Management', 'Organizational Development', 'Business Analytics'] },
      { title: 'Advanced Level', duration: '3 months', topics: ['Executive Leadership', 'Global Business Strategy', 'Innovation Management'] },
    ]),
    modules: JSON.stringify([
      'Introduction to Business Management',
      'Leadership and Team Management',
      'Strategic Planning and Goal Setting',
      'Organizational Behavior and Culture',
      'Business Communication and Negotiation',
      'Financial Management for Managers',
      'Operations and Process Management',
      'Marketing and Customer Relations',
      'Human Resource Management',
      'Business Ethics and Corporate Governance',
      'Change Management and Innovation',
      'Capstone: Business Management Project',
    ]),
    ctaTitle: 'Ready to Lead with Excellence?',
    ctaDescription: 'Join professionals who have transformed their careers through comprehensive business management training',
  },
  {
    slug: 'marketing-management',
    detailPageLayout: 'business-administration',
    heroTitle: 'Marketing Management',
    heroSubtitle: 'Master the strategies and techniques to build strong brands, reach customers, and drive business growth through effective marketing',
    heroImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2072&q=80',
    coreConcepts: JSON.stringify([
      { icon: 'Megaphone', title: 'Digital Marketing', description: 'Master online marketing channels and digital strategies', features: ['Social media marketing', 'SEO & SEM', 'Content marketing', 'Email campaigns'], color: 'blue' },
      { icon: 'Target', title: 'Market Research', description: 'Understand customer needs and market dynamics', features: ['Consumer behavior', 'Market analysis', 'Competitive research', 'Data collection'], color: 'green' },
      { icon: 'TrendingUp', title: 'Brand Management', description: 'Build and maintain strong brand identities', features: ['Brand positioning', 'Brand equity', 'Brand communication', 'Reputation management'], color: 'purple' },
      { icon: 'Users', title: 'Customer Relations', description: 'Develop strategies for customer acquisition and retention', features: ['CRM systems', 'Customer loyalty', 'Relationship building', 'Customer service'], color: 'orange' },
      { icon: 'BarChart3', title: 'Marketing Analytics', description: 'Measure and optimize marketing performance', features: ['ROI analysis', 'Campaign metrics', 'Conversion tracking', 'Performance optimization'], color: 'red' },
      { icon: 'Globe', title: 'International Marketing', description: 'Expand business reach across global markets', features: ['Global strategies', 'Cultural adaptation', 'Market entry', 'Cross-border marketing'], color: 'indigo' },
    ]),
    learningPath: JSON.stringify([
      { title: 'Foundation Level', duration: '3 months', topics: ['Marketing Fundamentals', 'Consumer Behavior', 'Market Research Basics'] },
      { title: 'Intermediate Level', duration: '4 months', topics: ['Digital Marketing', 'Brand Management', 'Marketing Strategy'] },
      { title: 'Advanced Level', duration: '3 months', topics: ['Marketing Analytics', 'Global Marketing', 'Strategic Marketing Leadership'] },
    ]),
    modules: JSON.stringify([
      'Introduction to Marketing Management',
      'Consumer Behavior and Market Research',
      'Marketing Strategy and Planning',
      'Brand Management and Positioning',
      'Digital Marketing and Social Media',
      'Advertising and Promotion',
      'Sales Management and Distribution',
      'Customer Relationship Management',
      'Marketing Analytics and Metrics',
      'International and Global Marketing',
      'Marketing Ethics and Social Responsibility',
      'Capstone: Marketing Management Project',
    ]),
    ctaTitle: 'Ready to Master Marketing?',
    ctaDescription: 'Join professionals who have transformed their careers through comprehensive marketing management training',
  },
  {
    slug: 'financial-management',
    detailPageLayout: 'business-administration',
    heroTitle: 'Financial Management',
    heroSubtitle: 'Master financial planning, budgeting, and investment strategies for business success',
    heroImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2072&q=80',
    coreConcepts: JSON.stringify([
      { icon: 'DollarSign', title: 'Financial Planning', description: 'Create comprehensive financial plans and budgets', features: ['Budget development', 'Cash flow management', 'Financial forecasting', 'Resource allocation'], color: 'blue' },
      { icon: 'TrendingUp', title: 'Investment Analysis', description: 'Evaluate investment opportunities and returns', features: ['ROI calculation', 'Risk assessment', 'Portfolio management', 'Investment strategies'], color: 'green' },
      { icon: 'PieChart', title: 'Financial Reporting', description: 'Prepare and analyze financial statements', features: ['Balance sheets', 'Income statements', 'Cash flow statements', 'Financial analysis'], color: 'purple' },
      { icon: 'Calculator', title: 'Cost Management', description: 'Control costs and optimize financial performance', features: ['Cost analysis', 'Pricing strategies', 'Expense control', 'Profit optimization'], color: 'orange' },
      { icon: 'Shield', title: 'Risk Management', description: 'Identify and mitigate financial risks', features: ['Risk assessment', 'Insurance planning', 'Hedging strategies', 'Compliance'], color: 'red' },
      { icon: 'BarChart3', title: 'Financial Analytics', description: 'Use data to make informed financial decisions', features: ['Financial modeling', 'Performance metrics', 'Trend analysis', 'Predictive analytics'], color: 'indigo' },
    ]),
    learningPath: JSON.stringify([
      { title: 'Foundation Level', duration: '3 months', topics: ['Financial Fundamentals', 'Accounting Basics', 'Budgeting Principles'] },
      { title: 'Intermediate Level', duration: '4 months', topics: ['Financial Analysis', 'Investment Management', 'Risk Assessment'] },
      { title: 'Advanced Level', duration: '3 months', topics: ['Strategic Finance', 'Corporate Finance', 'Financial Leadership'] },
    ]),
    modules: JSON.stringify([
      'Introduction to Financial Management',
      'Financial Accounting and Reporting',
      'Budgeting and Financial Planning',
      'Cash Flow Management',
      'Investment Analysis and Portfolio Management',
      'Cost Management and Control',
      'Financial Risk Management',
      'Capital Structure and Financing',
      'Financial Modeling and Forecasting',
      'Performance Measurement and KPIs',
      'Corporate Finance and Valuation',
      'Capstone: Financial Management Project',
    ]),
    ctaTitle: 'Ready to Master Finance?',
    ctaDescription: 'Join professionals who have transformed their careers through comprehensive financial management training',
  },
  {
    slug: 'human-resource-management',
    detailPageLayout: 'business-administration',
    heroTitle: 'Human Resource Management',
    heroSubtitle: 'Master the art of managing people, developing talent, and building high-performing organizations',
    heroImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2072&q=80',
    coreConcepts: JSON.stringify([
      { icon: 'Users', title: 'Recruitment & Selection', description: 'Attract and hire the best talent for your organization', features: ['Job analysis', 'Candidate sourcing', 'Interview techniques', 'Selection processes'], color: 'blue' },
      { icon: 'UserCheck', title: 'Training & Development', description: 'Develop employee skills and career growth', features: ['Training programs', 'Performance coaching', 'Career planning', 'Skill development'], color: 'green' },
      { icon: 'Briefcase', title: 'Performance Management', description: 'Evaluate and improve employee performance', features: ['Performance reviews', 'Goal setting', 'Feedback systems', 'Performance improvement'], color: 'purple' },
      { icon: 'TrendingUp', title: 'Compensation & Benefits', description: 'Design competitive compensation packages', features: ['Salary structures', 'Benefits planning', 'Incentive programs', 'Total rewards'], color: 'orange' },
      { icon: 'FileText', title: 'HR Policies & Compliance', description: 'Ensure legal compliance and fair practices', features: ['Labor laws', 'Employment policies', 'Compliance management', 'Legal requirements'], color: 'red' },
      { icon: 'Users', title: 'Employee Relations', description: 'Build positive workplace relationships', features: ['Conflict resolution', 'Employee engagement', 'Communication', 'Workplace culture'], color: 'indigo' },
    ]),
    learningPath: JSON.stringify([
      { title: 'Foundation Level', duration: '3 months', topics: ['HR Fundamentals', 'Recruitment Basics', 'Employment Law'] },
      { title: 'Intermediate Level', duration: '4 months', topics: ['Performance Management', 'Training & Development', 'Compensation'] },
      { title: 'Advanced Level', duration: '3 months', topics: ['Strategic HR', 'Organizational Development', 'HR Leadership'] },
    ]),
    modules: JSON.stringify([
      'Introduction to Human Resource Management',
      'Recruitment and Selection Strategies',
      'Training and Development Programs',
      'Performance Management Systems',
      'Compensation and Benefits Design',
      'Employee Relations and Engagement',
      'HR Policies and Legal Compliance',
      'Organizational Development',
      'Talent Management and Succession Planning',
      'HR Analytics and Metrics',
      'Strategic Human Resource Management',
      'Capstone: HR Management Project',
    ]),
    ctaTitle: 'Ready to Master HR Management?',
    ctaDescription: 'Join professionals who have transformed their careers through comprehensive human resource management training',
  },
  {
    slug: 'operations-management',
    detailPageLayout: 'business-administration',
    heroTitle: 'Operations Management',
    heroSubtitle: 'Master the art of optimizing processes, managing supply chains, and driving operational excellence',
    heroImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2072&q=80',
    coreConcepts: JSON.stringify([
      { icon: 'Settings', title: 'Process Optimization', description: 'Streamline operations for maximum efficiency', features: ['Process mapping', 'Workflow design', 'Efficiency improvement', 'Quality control'], color: 'blue' },
      { icon: 'Package', title: 'Supply Chain Management', description: 'Manage the flow of goods and services', features: ['Inventory management', 'Supplier relations', 'Logistics planning', 'Distribution networks'], color: 'green' },
      { icon: 'Truck', title: 'Logistics & Distribution', description: 'Optimize transportation and delivery systems', features: ['Transportation planning', 'Warehouse management', 'Route optimization', 'Delivery systems'], color: 'purple' },
      { icon: 'Factory', title: 'Production Management', description: 'Oversee manufacturing and production processes', features: ['Production planning', 'Capacity management', 'Quality assurance', 'Lean manufacturing'], color: 'orange' },
      { icon: 'BarChart3', title: 'Operations Analytics', description: 'Use data to improve operational performance', features: ['Performance metrics', 'Data analysis', 'Forecasting', 'Optimization models'], color: 'red' },
      { icon: 'Zap', title: 'Lean Operations', description: 'Eliminate waste and maximize value', features: ['Waste reduction', 'Continuous improvement', 'Six Sigma', 'Kaizen methods'], color: 'indigo' },
    ]),
    learningPath: JSON.stringify([
      { title: 'Foundation Level', duration: '3 months', topics: ['Operations Fundamentals', 'Process Management', 'Supply Chain Basics'] },
      { title: 'Intermediate Level', duration: '4 months', topics: ['Production Management', 'Logistics & Distribution', 'Quality Management'] },
      { title: 'Advanced Level', duration: '3 months', topics: ['Operations Strategy', 'Lean Management', 'Operations Analytics'] },
    ]),
    modules: JSON.stringify([
      'Introduction to Operations Management',
      'Process Design and Analysis',
      'Production Planning and Control',
      'Supply Chain Management',
      'Inventory Management',
      'Quality Management and Control',
      'Logistics and Distribution',
      'Lean Operations and Six Sigma',
      'Operations Strategy',
      'Operations Analytics and Metrics',
      'Project Management in Operations',
      'Capstone: Operations Management Project',
    ]),
    ctaTitle: 'Ready to Master Operations?',
    ctaDescription: 'Join professionals who have transformed their careers through comprehensive operations management training',
  },
  {
    slug: 'strategic-planning',
    detailPageLayout: 'business-administration',
    heroTitle: 'Strategic Planning',
    heroSubtitle: 'Master the art of developing comprehensive strategies, executing plans, and driving organizational success',
    heroImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2072&q=80',
    coreConcepts: JSON.stringify([
      { icon: 'Target', title: 'Strategic Analysis', description: 'Analyze internal and external business environments', features: ['SWOT analysis', 'PEST analysis', 'Competitive analysis', 'Market research'], color: 'blue' },
      { icon: 'Map', title: 'Strategic Planning', description: 'Develop comprehensive strategic plans and roadmaps', features: ['Vision & mission', 'Strategic goals', 'Action plans', 'Implementation roadmaps'], color: 'green' },
      { icon: 'TrendingUp', title: 'Strategic Execution', description: 'Implement strategies effectively and monitor progress', features: ['Execution frameworks', 'Change management', 'Performance tracking', 'Strategic alignment'], color: 'purple' },
      { icon: 'Lightbulb', title: 'Innovation Strategy', description: 'Foster innovation and drive business transformation', features: ['Innovation frameworks', 'Digital transformation', 'Disruptive thinking', 'Future planning'], color: 'orange' },
      { icon: 'BarChart3', title: 'Strategic Metrics', description: 'Measure and evaluate strategic performance', features: ['KPIs and metrics', 'Balanced scorecard', 'Performance dashboards', 'Strategic reviews'], color: 'red' },
      { icon: 'Globe', title: 'Global Strategy', description: 'Develop strategies for international expansion', features: ['Global market entry', 'International strategy', 'Cross-cultural planning', 'Global partnerships'], color: 'indigo' },
    ]),
    learningPath: JSON.stringify([
      { title: 'Foundation Level', duration: '3 months', topics: ['Strategic Thinking', 'Business Analysis', 'Planning Fundamentals'] },
      { title: 'Intermediate Level', duration: '4 months', topics: ['Strategic Planning', 'Strategy Implementation', 'Performance Management'] },
      { title: 'Advanced Level', duration: '3 months', topics: ['Strategic Leadership', 'Innovation Strategy', 'Global Strategy'] },
    ]),
    modules: JSON.stringify([
      'Introduction to Strategic Planning',
      'Strategic Analysis and Environmental Scanning',
      'Vision, Mission, and Strategic Objectives',
      'Strategic Planning Frameworks',
      'Competitive Strategy and Positioning',
      'Strategic Implementation and Execution',
      'Change Management and Transformation',
      'Strategic Performance Measurement',
      'Innovation and Digital Strategy',
      'Global and International Strategy',
      'Strategic Leadership and Governance',
      'Capstone: Strategic Planning Project',
    ]),
    ctaTitle: 'Ready to Master Strategic Planning?',
    ctaDescription: 'Join professionals who have transformed their careers through comprehensive strategic planning training',
  },
];

async function seedBusinessAdminDetails() {
  console.log('💼 Seeding Business Administration program details...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const programData of businessAdminPrograms) {
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

      // Update program with ALL detail content fields
      const result = await prisma.program.update({
        where: { slug },
        data: {
          ...detailContent,
          // Explicitly set all fields
          detailPageLayout: detailContent.detailPageLayout,
          heroTitle: detailContent.heroTitle,
          heroSubtitle: detailContent.heroSubtitle,
          heroImage: detailContent.heroImage,
          coreConcepts: detailContent.coreConcepts,
          learningPath: detailContent.learningPath,
          modules: detailContent.modules,
          ctaTitle: detailContent.ctaTitle,
          ctaDescription: detailContent.ctaDescription,
        },
      });

      // Verify the update
      const hasAllFields = 
        result.coreConcepts && 
        result.learningPath &&
        result.modules;

      if (hasAllFields) {
        console.log(`  ✅ Seeded: ${existingProgram.name} (${slug}) - ALL FIELDS SET`);
        successCount++;
      } else {
        console.log(`  ⚠️  Seeded: ${existingProgram.name} (${slug}) - SOME FIELDS MISSING`);
        console.log(`     - coreConcepts: ${result.coreConcepts ? 'SET' : 'NULL'}`);
        console.log(`     - learningPath: ${result.learningPath ? 'SET' : 'NULL'}`);
        console.log(`     - modules: ${result.modules ? 'SET' : 'NULL'}`);
        successCount++;
      }
    } catch (error) {
      console.error(`  ❌ Failed to seed ${slug}:`, error.message);
      if (error.message.includes('Unknown argument')) {
        console.error(`     → Field does not exist in database! Run: npx prisma db push`);
      }
      errorCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`  ✅ Successfully seeded: ${successCount} programs`);
  console.log(`  ❌ Failed: ${errorCount} programs`);
  console.log(`\n🎉 Business Administration programs seeding completed!`);
}

seedBusinessAdminDetails()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



