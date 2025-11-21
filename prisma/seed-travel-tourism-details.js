const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const travelTourismPrograms = [
  {
    slug: 'tourism-operations',
    detailPageLayout: 'travel-tourism',
    heroTitle: 'Tourism Operations',
    heroSubtitle: 'Master the art of managing travel experiences and creating unforgettable journeys for travelers worldwide',
    heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2072&q=80',
    overviewTitle: 'Program Overview',
    overviewContent: 'Tourism Operations is the backbone of the travel and hospitality industry, encompassing everything from planning itineraries and coordinating tours to managing international travel logistics and ensuring exceptional customer experiences. This comprehensive program equips you with the skills needed to excel in the dynamic world of tourism, where attention to detail, cultural sensitivity, and operational excellence are paramount. At JR Institute of Information Technology, our Tourism Operations program combines theoretical knowledge with hands-on practical experience. You\'ll learn to navigate complex travel systems, understand diverse cultural contexts, and develop the operational expertise needed to succeed in various tourism sectors including travel agencies, tour operators, destination management companies, and hospitality organizations.',
    coreConcepts: JSON.stringify([
      { icon: 'Plane', title: 'Travel Planning', description: 'Master the art of creating comprehensive travel itineraries', features: ['Itinerary design', 'Transportation booking', 'Accommodation management', 'Activity planning'], color: 'teal' },
      { icon: 'MapPin', title: 'Destination Knowledge', description: 'Develop expertise in global destinations and cultures', features: ['Geography & culture', 'Local attractions', 'Travel regulations', 'Cultural awareness'], color: 'cyan' },
      { icon: 'Users', title: 'Tour Operations', description: 'Manage group tours and travel operations efficiently', features: ['Group management', 'Tour coordination', 'Guide supervision', 'Logistics planning'], color: 'blue' },
      { icon: 'Globe', title: 'International Tourism', description: 'Navigate cross-border travel and international regulations', features: ['Visa processing', 'Customs procedures', 'International protocols', 'Global travel systems'], color: 'indigo' },
      { icon: 'Calendar', title: 'Event Coordination', description: 'Organize tourism events and special travel experiences', features: ['Event planning', 'Timeline management', 'Vendor coordination', 'Quality assurance'], color: 'emerald' },
      { icon: 'Briefcase', title: 'Tourism Business', description: 'Understand tourism industry operations and management', features: ['Industry structure', 'Business models', 'Revenue management', 'Market analysis'], color: 'sky' },
    ]),
    learningPath: JSON.stringify([
      { title: 'Foundation Level', duration: '3 months', topics: ['Tourism Fundamentals', 'Travel Basics', 'Customer Service'] },
      { title: 'Intermediate Level', duration: '4 months', topics: ['Tour Operations', 'Destination Management', 'Event Planning'] },
      { title: 'Advanced Level', duration: '3 months', topics: ['International Tourism', 'Strategic Operations', 'Tourism Leadership'] },
    ]),
    modules: JSON.stringify([
      'Introduction to Tourism Operations',
      'Travel Planning and Itinerary Design',
      'Destination Knowledge and Geography',
      'Tour Operations and Group Management',
      'International Travel Regulations',
      'Event Coordination in Tourism',
      'Customer Service Excellence',
      'Tourism Business Management',
      'Technology in Tourism Operations',
      'Sustainable Tourism Practices',
      'Crisis Management in Tourism',
      'Capstone: Tourism Operations Project',
    ]),
    ctaTitle: 'Ready to Explore Tourism Operations?',
    ctaDescription: 'Join professionals who have transformed their careers through comprehensive tourism operations training',
  },
  {
    slug: 'customer-service-excellence',
    detailPageLayout: 'travel-tourism',
    heroTitle: 'Customer Service Excellence',
    heroSubtitle: 'Master the art of delivering exceptional customer experiences in the travel and tourism industry',
    heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2072&q=80',
    overviewTitle: 'Program Overview',
    overviewContent: 'Customer Service Excellence is the cornerstone of success in the travel and tourism industry. This program focuses on developing the interpersonal skills, communication techniques, and service mindset needed to create exceptional customer experiences that build loyalty and drive business success. At JR Institute of Information Technology, our Customer Service Excellence program combines theoretical frameworks with practical exercises and real-world scenarios. You\'ll learn to handle diverse customer situations, resolve conflicts effectively, and deliver service that not only meets but exceeds customer expectations.',
    coreConcepts: JSON.stringify([
      { icon: 'Heart', title: 'Customer Relations', description: 'Build lasting relationships with exceptional service', features: ['Relationship building', 'Customer loyalty', 'Trust development', 'Personalized service'], color: 'teal' },
      { icon: 'Smile', title: 'Communication Skills', description: 'Master verbal and non-verbal communication techniques', features: ['Active listening', 'Empathy', 'Clear messaging', 'Cultural sensitivity'], color: 'cyan' },
      { icon: 'MessageCircle', title: 'Conflict Resolution', description: 'Handle complaints and difficult situations professionally', features: ['Problem solving', 'De-escalation', 'Solution finding', 'Follow-up'], color: 'blue' },
      { icon: 'Star', title: 'Service Excellence', description: 'Deliver exceptional service that exceeds expectations', features: ['Quality standards', 'Service recovery', 'Exceeding expectations', 'Continuous improvement'], color: 'indigo' },
      { icon: 'Users', title: 'Team Collaboration', description: 'Work effectively with teams to deliver seamless service', features: ['Team coordination', 'Information sharing', 'Support systems', 'Collaborative problem-solving'], color: 'emerald' },
      { icon: 'Headphones', title: 'Service Technology', description: 'Leverage technology to enhance customer experiences', features: ['CRM systems', 'Digital communication', 'Service platforms', 'Feedback systems'], color: 'sky' },
    ]),
    learningPath: JSON.stringify([
      { title: 'Foundation Level', duration: '3 months', topics: ['Service Fundamentals', 'Communication Basics', 'Customer Interaction'] },
      { title: 'Intermediate Level', duration: '4 months', topics: ['Advanced Communication', 'Conflict Management', 'Service Excellence'] },
      { title: 'Advanced Level', duration: '3 months', topics: ['Service Leadership', 'Strategic Service', 'Customer Experience Design'] },
    ]),
    modules: JSON.stringify([
      'Introduction to Customer Service Excellence',
      'Communication Skills and Techniques',
      'Understanding Customer Needs',
      'Conflict Resolution and Problem Solving',
      'Service Recovery and Complaint Handling',
      'Building Customer Relationships',
      'Cultural Sensitivity in Service',
      'Service Technology and Tools',
      'Team Collaboration in Service',
      'Measuring Service Quality',
      'Service Leadership and Management',
      'Capstone: Customer Service Project',
    ]),
    ctaTitle: 'Ready to Excel in Customer Service?',
    ctaDescription: 'Join professionals who have transformed their careers through comprehensive customer service excellence training',
  },
  {
    slug: 'destination-management',
    detailPageLayout: 'travel-tourism',
    heroTitle: 'Destination Management',
    heroSubtitle: 'Learn destination planning, marketing, and sustainable tourism practices to create thriving tourist destinations',
    heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2072&q=80',
    overviewTitle: 'Program Overview',
    overviewContent: 'Destination Management involves the strategic planning, development, and marketing of tourist destinations to create sustainable and memorable visitor experiences. This program equips you with the skills to manage destinations effectively, balancing economic growth with environmental protection and cultural preservation. At JR Institute of Information Technology, our Destination Management program combines theoretical knowledge with practical applications. You\'ll learn to develop destination strategies, create compelling marketing campaigns, implement sustainable practices, and work collaboratively with diverse stakeholders to build successful tourism destinations.',
    coreConcepts: JSON.stringify([
      { icon: 'MapPin', title: 'Destination Planning', description: 'Develop comprehensive destination development strategies', features: ['Strategic planning', 'Infrastructure development', 'Resource allocation', 'Growth strategies'], color: 'teal' },
      { icon: 'Camera', title: 'Destination Marketing', description: 'Promote destinations effectively to attract visitors', features: ['Brand positioning', 'Marketing campaigns', 'Digital promotion', 'Stakeholder engagement'], color: 'cyan' },
      { icon: 'Globe', title: 'Sustainable Tourism', description: 'Implement eco-friendly and sustainable tourism practices', features: ['Environmental protection', 'Community involvement', 'Sustainable practices', 'Conservation'], color: 'blue' },
      { icon: 'Leaf', title: 'Cultural Heritage', description: 'Preserve and promote cultural and historical assets', features: ['Heritage management', 'Cultural preservation', 'Community engagement', 'Cultural tourism'], color: 'indigo' },
      { icon: 'TrendingUp', title: 'Destination Analytics', description: 'Use data to optimize destination performance', features: ['Visitor analytics', 'Performance metrics', 'Market research', 'Data-driven decisions'], color: 'emerald' },
      { icon: 'Compass', title: 'Partnership Development', description: 'Build strategic partnerships for destination success', features: ['Stakeholder relations', 'Public-private partnerships', 'Industry collaboration', 'Network building'], color: 'sky' },
    ]),
    learningPath: JSON.stringify([
      { title: 'Foundation Level', duration: '3 months', topics: ['Destination Basics', 'Tourism Fundamentals', 'Marketing Introduction'] },
      { title: 'Intermediate Level', duration: '4 months', topics: ['Destination Planning', 'Sustainable Tourism', 'Marketing Strategies'] },
      { title: 'Advanced Level', duration: '3 months', topics: ['Strategic Management', 'Destination Leadership', 'Innovation'] },
    ]),
    modules: JSON.stringify([
      'Introduction to Destination Management',
      'Destination Planning and Development',
      'Destination Marketing and Promotion',
      'Sustainable Tourism Practices',
      'Cultural Heritage Management',
      'Visitor Experience Design',
      'Destination Analytics and Research',
      'Stakeholder Management',
      'Crisis Management in Destinations',
      'Technology in Destination Management',
      'Destination Leadership and Strategy',
      'Capstone: Destination Management Project',
    ]),
    ctaTitle: 'Ready to Master Destination Management?',
    ctaDescription: 'Join professionals who have transformed their careers through comprehensive destination management training',
  },
  {
    slug: 'hotel-management',
    detailPageLayout: 'travel-tourism',
    heroTitle: 'Hotel Management',
    heroSubtitle: 'Master hotel operations, front office, and housekeeping management for exceptional guest experiences',
    heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2072&q=80',
    overviewTitle: 'Program Overview',
    overviewContent: 'Hotel Management encompasses all aspects of running a successful hospitality establishment, from front office operations and housekeeping to food and beverage services and revenue management. This comprehensive program prepares you for leadership roles in the dynamic hospitality industry. At JR Institute of Information Technology, our Hotel Management program combines theoretical knowledge with practical training. You\'ll learn to manage hotel operations efficiently, deliver exceptional guest experiences, optimize revenue, and lead diverse teams in fast-paced hospitality environments.',
    coreConcepts: JSON.stringify([
      { icon: 'Building', title: 'Front Office Operations', description: 'Master guest services and front desk management', features: ['Check-in/check-out', 'Reservation systems', 'Guest relations', 'Concierge services'], color: 'teal' },
      { icon: 'Bed', title: 'Housekeeping Management', description: 'Ensure exceptional cleanliness and room standards', features: ['Room maintenance', 'Quality standards', 'Staff management', 'Inventory control'], color: 'cyan' },
      { icon: 'UtensilsCrossed', title: 'Food & Beverage', description: 'Manage restaurant and catering operations', features: ['Menu planning', 'Service standards', 'Cost control', 'Event catering'], color: 'blue' },
      { icon: 'Users', title: 'Human Resources', description: 'Manage hotel staff and operations effectively', features: ['Staff training', 'Performance management', 'Scheduling', 'Team leadership'], color: 'indigo' },
      { icon: 'Calendar', title: 'Revenue Management', description: 'Optimize pricing and maximize hotel profitability', features: ['Pricing strategies', 'Yield management', 'Revenue optimization', 'Market analysis'], color: 'emerald' },
      { icon: 'Star', title: 'Hotel Marketing', description: 'Promote hotel services and build brand reputation', features: ['Brand positioning', 'Digital marketing', 'Guest retention', 'Reputation management'], color: 'sky' },
    ]),
    learningPath: JSON.stringify([
      { title: 'Foundation Level', duration: '3 months', topics: ['Hotel Basics', 'Front Office', 'Housekeeping Fundamentals'] },
      { title: 'Intermediate Level', duration: '4 months', topics: ['F&B Management', 'Revenue Management', 'Guest Services'] },
      { title: 'Advanced Level', duration: '3 months', topics: ['Hotel Leadership', 'Strategic Management', 'Operations Excellence'] },
    ]),
    modules: JSON.stringify([
      'Introduction to Hotel Management',
      'Front Office Operations and Management',
      'Housekeeping Management and Standards',
      'Food and Beverage Operations',
      'Hotel Human Resource Management',
      'Revenue Management and Pricing',
      'Hotel Marketing and Sales',
      'Guest Relations and Service Excellence',
      'Hotel Financial Management',
      'Technology in Hotel Operations',
      'Hotel Leadership and Strategy',
      'Capstone: Hotel Management Project',
    ]),
    ctaTitle: 'Ready to Master Hotel Management?',
    ctaDescription: 'Join professionals who have transformed their careers through comprehensive hotel management training',
  },
  {
    slug: 'travel-agency-operations',
    detailPageLayout: 'travel-tourism',
    heroTitle: 'Travel Agency Operations',
    heroSubtitle: 'Learn travel booking systems and tour package development to run successful travel businesses',
    heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2072&q=80',
    overviewTitle: 'Program Overview',
    overviewContent: 'Travel Agency Operations involves managing all aspects of a travel business, from booking flights and accommodations to creating customized travel packages and managing customer relationships. This program prepares you for success in the competitive travel industry. At JR Institute of Information Technology, our Travel Agency Operations program combines technical skills with business acumen. You\'ll learn to use industry-standard booking systems, develop attractive travel products, manage supplier relationships, and run efficient travel agency operations.',
    coreConcepts: JSON.stringify([
      { icon: 'Plane', title: 'Travel Booking Systems', description: 'Master airline and transportation booking platforms', features: ['GDS systems', 'Flight booking', 'Reservation management', 'Ticketing'], color: 'teal' },
      { icon: 'Ticket', title: 'Package Development', description: 'Create attractive travel packages and tour products', features: ['Package design', 'Pricing strategies', 'Product development', 'Market positioning'], color: 'cyan' },
      { icon: 'Map', title: 'Itinerary Planning', description: 'Design comprehensive and appealing travel itineraries', features: ['Route planning', 'Activity selection', 'Timeline management', 'Cost optimization'], color: 'blue' },
      { icon: 'CreditCard', title: 'Payment Processing', description: 'Handle transactions and financial operations', features: ['Payment systems', 'Billing procedures', 'Refund management', 'Financial records'], color: 'indigo' },
      { icon: 'Globe', title: 'Supplier Relations', description: 'Manage relationships with hotels, airlines, and vendors', features: ['Vendor management', 'Contract negotiation', 'Rate management', 'Partnership building'], color: 'emerald' },
      { icon: 'Briefcase', title: 'Agency Management', description: 'Run efficient and profitable travel agency operations', features: ['Operations management', 'Staff coordination', 'Quality control', 'Business development'], color: 'sky' },
    ]),
    learningPath: JSON.stringify([
      { title: 'Foundation Level', duration: '3 months', topics: ['Travel Basics', 'Booking Systems', 'Customer Service'] },
      { title: 'Intermediate Level', duration: '4 months', topics: ['Package Development', 'Itinerary Planning', 'Supplier Management'] },
      { title: 'Advanced Level', duration: '3 months', topics: ['Agency Leadership', 'Business Strategy', 'Operations Excellence'] },
    ]),
    modules: JSON.stringify([
      'Introduction to Travel Agency Operations',
      'Travel Booking Systems and GDS',
      'Package Development and Design',
      'Itinerary Planning and Management',
      'Supplier Relations and Management',
      'Payment Processing and Financial Operations',
      'Customer Service in Travel Agencies',
      'Travel Technology and Systems',
      'Marketing and Sales for Travel Agencies',
      'Legal and Regulatory Compliance',
      'Travel Agency Management and Leadership',
      'Capstone: Travel Agency Operations Project',
    ]),
    ctaTitle: 'Ready to Master Travel Agency Operations?',
    ctaDescription: 'Join professionals who have transformed their careers through comprehensive travel agency operations training',
  },
  {
    slug: 'event-management',
    detailPageLayout: 'travel-tourism',
    heroTitle: 'Event Management',
    heroSubtitle: 'Plan and manage tourism events and special occasions to create memorable experiences',
    heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2072&q=80',
    overviewTitle: 'Program Overview',
    overviewContent: 'Event Management involves planning, organizing, and executing various types of events from corporate conferences and cultural festivals to weddings and tourism celebrations. This program equips you with the skills to create memorable experiences and manage successful events. At JR Institute of Information Technology, our Event Management program combines creative vision with practical execution skills. You\'ll learn to plan events from conception to completion, manage budgets and timelines, coordinate vendors and teams, and ensure exceptional experiences for all attendees.',
    coreConcepts: JSON.stringify([
      { icon: 'Calendar', title: 'Event Planning', description: 'Master the art of comprehensive event planning', features: ['Timeline development', 'Budget planning', 'Vendor coordination', 'Logistics management'], color: 'teal' },
      { icon: 'Users', title: 'Event Coordination', description: 'Coordinate all aspects of successful events', features: ['Team management', 'Stakeholder communication', 'On-site coordination', 'Crisis management'], color: 'cyan' },
      { icon: 'Music', title: 'Entertainment Management', description: 'Organize entertainment and cultural events', features: ['Artist booking', 'Performance coordination', 'Sound & lighting', 'Cultural events'], color: 'blue' },
      { icon: 'Camera', title: 'Event Marketing', description: 'Promote events effectively to attract attendees', features: ['Marketing campaigns', 'Social media promotion', 'Public relations', 'Brand partnerships'], color: 'indigo' },
      { icon: 'MapPin', title: 'Venue Management', description: 'Select and manage event venues effectively', features: ['Venue selection', 'Space planning', 'Facility coordination', 'Setup management'], color: 'emerald' },
      { icon: 'Sparkles', title: 'Special Events', description: 'Create memorable experiences for special occasions', features: ['Wedding planning', 'Corporate events', 'Festivals', 'Celebrations'], color: 'sky' },
    ]),
    learningPath: JSON.stringify([
      { title: 'Foundation Level', duration: '3 months', topics: ['Event Basics', 'Planning Fundamentals', 'Coordination Skills'] },
      { title: 'Intermediate Level', duration: '4 months', topics: ['Event Marketing', 'Venue Management', 'Entertainment Coordination'] },
      { title: 'Advanced Level', duration: '3 months', topics: ['Event Leadership', 'Strategic Planning', 'Large-Scale Events'] },
    ]),
    modules: JSON.stringify([
      'Introduction to Event Management',
      'Event Planning and Design',
      'Budget Management and Financial Planning',
      'Venue Selection and Management',
      'Vendor and Supplier Management',
      'Event Marketing and Promotion',
      'Entertainment and Program Coordination',
      'On-Site Event Management',
      'Crisis Management and Problem Solving',
      'Event Technology and Tools',
      'Post-Event Evaluation and Analysis',
      'Capstone: Event Management Project',
    ]),
    ctaTitle: 'Ready to Master Event Management?',
    ctaDescription: 'Join professionals who have transformed their careers through comprehensive event management training',
  },
];

async function seedTravelTourismDetails() {
  console.log('✈️ Seeding Travel & Tourism Management program details...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const programData of travelTourismPrograms) {
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
          overviewTitle: detailContent.overviewTitle,
          overviewContent: detailContent.overviewContent,
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
  console.log(`\n🎉 Travel & Tourism Management programs seeding completed!`);
}

seedTravelTourismDetails()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



