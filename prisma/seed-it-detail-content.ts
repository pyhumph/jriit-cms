import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

// IT Program Detail Content Data
// Extracted from frontend components
const IT_PROGRAM_DETAIL_CONTENT = [
  // 1. Computer Hardware (Standard Layout)
  {
    slug: 'computer-hardware',
    detailPageLayout: 'standard',
    heroTitle: 'Computer Hardware',
    heroSubtitle: 'Master the fundamentals of computer components and systems',
    heroImage: '/assets/computer-hardware.jpg',
    overviewTitle: 'Program Overview',
    overviewContent: `Our Computer Hardware program provides comprehensive training in the physical components that make up computer systems. Students will gain hands-on experience with processors, memory, storage devices, motherboards, and peripheral components.

This program is designed for individuals who want to understand how computers work at the hardware level, troubleshoot hardware issues, and pursue careers in computer repair, system building, and technical support.`,
    learningTitle: "What You'll Learn",
    learningItems: [
      { icon: 'Cpu', title: 'Processors & CPUs', description: 'Understanding CPU architecture, instruction sets, and performance optimization.' },
      { icon: 'MemoryStick', title: 'Memory Systems', description: 'RAM types, memory hierarchy, and storage technologies.' },
      { icon: 'HardDrive', title: 'Storage Devices', description: 'HDDs, SSDs, and emerging storage technologies.' },
      { icon: 'Monitor', title: 'Display Systems', description: 'Graphics cards, monitors, and display technologies.' },
      { icon: 'Zap', title: 'Power Systems', description: 'Power supplies, voltage regulation, and energy efficiency.' },
      { icon: 'Settings', title: 'System Assembly', description: 'Building, configuring, and troubleshooting complete systems.' },
    ],
    modulesTitle: 'Course Modules',
    modules: [
      'Introduction to Computer Hardware',
      'Motherboards and System Architecture',
      'Processors and CPU Technologies',
      'Memory Systems and RAM',
      'Storage Technologies',
      'Power Supply and Cooling Systems',
      'Input/Output Devices and Peripherals',
      'Graphics and Display Systems',
      'System Assembly and Configuration',
      'Hardware Troubleshooting and Repair',
      'Hardware Compatibility and Upgrades',
      'Industry Standards and Certifications',
    ],
    detailsDuration: '6 months',
    detailsFormat: 'Hands-on Lab + Theory',
    detailsSchedule: 'Flexible timing',
    detailsPrerequisites: 'Basic computer literacy',
    careerTitle: 'Career Opportunities',
    careerOpportunities: [
      'Computer Repair Technician',
      'Hardware Support Specialist',
      'System Builder',
      'IT Support Technician',
      'Field Service Engineer',
      'Hardware Sales Consultant',
    ],
    ctaTitle: 'Ready to Start?',
    ctaDescription: 'Join our Computer Hardware program and build your expertise in computer systems.',
  },
  
  // 2. Computer Software (Standard Layout)
  {
    slug: 'computer-software',
    detailPageLayout: 'standard',
    heroTitle: 'Computer Software',
    heroSubtitle: 'Master software development and programming technologies',
    heroImage: '/assets/software.jpeg',
    overviewTitle: 'Program Overview',
    overviewContent: `Our Computer Software program provides comprehensive training in software development, programming languages, and application design. Students will learn to create, test, and maintain software applications across various platforms and technologies.

This program is designed for aspiring software developers, programmers, and technology professionals who want to build robust applications, understand software architecture, and pursue careers in software engineering and development.`,
    learningTitle: "What You'll Learn",
    learningItems: [
      { icon: 'Code', title: 'Programming Languages', description: 'Master various programming languages including Python, Java, C++, and JavaScript.' },
      { icon: 'Database', title: 'Database Systems', description: 'Learn database design, SQL, and database management systems.' },
      { icon: 'Globe', title: 'Web Technologies', description: 'Understand web development frameworks, APIs, and modern web standards.' },
      { icon: 'Shield', title: 'Security Fundamentals', description: 'Learn software security principles, encryption, and secure coding practices.' },
      { icon: 'Smartphone', title: 'Mobile Development', description: 'Develop applications for iOS and Android platforms.' },
      { icon: 'Terminal', title: 'System Software', description: 'Understand operating systems, compilers, and system-level programming.' },
    ],
    modulesTitle: 'Course Modules',
    modules: [
      'Introduction to Computer Software',
      'Programming Fundamentals',
      'Object-Oriented Programming',
      'Data Structures and Algorithms',
      'Database Management Systems',
      'Web Development Technologies',
      'Mobile Application Development',
      'Software Engineering Principles',
      'Version Control and Collaboration',
      'Testing and Quality Assurance',
      'Software Security and Ethics',
      'Industry Best Practices and Deployment',
    ],
    detailsDuration: '8 months',
    detailsFormat: 'Project-based Learning',
    detailsSchedule: 'Flexible timing',
    detailsPrerequisites: 'Basic math and logic',
    careerTitle: 'Career Opportunities',
    careerOpportunities: [
      'Software Developer',
      'Full Stack Developer',
      'Mobile App Developer',
      'Systems Programmer',
      'Software Engineer',
      'Application Developer',
    ],
    ctaTitle: 'Ready to Start?',
    ctaDescription: 'Join our Computer Software program and become a skilled software developer.',
  },

  // 3. Computer Applications (Custom Layout)
  {
    slug: 'computer-applications',
    detailPageLayout: 'custom-applications',
    heroTitle: 'Microsoft Office Applications',
    heroSubtitle: 'Master all Microsoft Office applications and boost your productivity with comprehensive training',
    heroImage: '/assets/office.jpeg',
    overviewTitle: 'Program Overview',
    overviewContent: `Our Microsoft Office Applications program provides comprehensive training in all Microsoft Office suite applications. Students will master Word, Excel, PowerPoint, Access, Outlook, Teams, OneNote, and Publisher through hands-on projects and real-world scenarios.

This program is designed for professionals, students, and anyone who wants to enhance their productivity and career prospects by mastering industry-standard office applications.`,
    learningTitle: "What You'll Learn",
    learningItems: [
      { icon: 'FileText', title: 'Microsoft Word', description: 'Document creation, formatting, and professional writing.' },
      { icon: 'FileSpreadsheet', title: 'Microsoft Excel', description: 'Spreadsheet analysis, data visualization, and calculations.' },
      { icon: 'Presentation', title: 'Microsoft PowerPoint', description: 'Dynamic presentations and visual storytelling.' },
      { icon: 'Database', title: 'Microsoft Access', description: 'Database management and data organization.' },
      { icon: 'Mail', title: 'Microsoft Outlook', description: 'Email management and communication.' },
      { icon: 'Users', title: 'Microsoft Teams', description: 'Collaboration and remote work solutions.' },
    ],
    modulesTitle: 'Course Modules',
    modules: [
      'Microsoft Word Fundamentals',
      'Advanced Word Features',
      'Excel Basics and Formulas',
      'Advanced Excel and Data Analysis',
      'PowerPoint Design and Animation',
      'Access Database Design',
      'Outlook Email Management',
      'Teams Collaboration',
      'OneNote Organization',
      'Publisher Design Tools',
      'Office Integration',
      'Real-World Projects',
    ],
    detailsDuration: '8 months',
    detailsFormat: 'Hands-on Training',
    detailsSchedule: 'Flexible timing',
    detailsPrerequisites: 'Basic computer skills',
    careerTitle: 'Career Opportunities',
    careerOpportunities: [
      'Office Administrator',
      'Data Entry Specialist',
      'Executive Assistant',
      'Administrative Coordinator',
      'Office Manager',
      'Business Analyst',
    ],
    ctaTitle: 'Ready to Master Microsoft Office?',
    ctaDescription: 'Join thousands of students who have enhanced their productivity and career prospects.',
    customContent: JSON.stringify({
      applications: [
        { icon: 'FileText', name: 'Microsoft Word', description: 'Document creation, formatting, and professional writing', features: ['Document formatting', 'Templates', 'Mail merge', 'Collaboration'] },
        { icon: 'FileSpreadsheet', name: 'Microsoft Excel', description: 'Spreadsheet analysis, data visualization, and calculations', features: ['Formulas & Functions', 'Pivot Tables', 'Charts', 'Data Analysis'] },
        { icon: 'Presentation', name: 'Microsoft PowerPoint', description: 'Dynamic presentations and visual storytelling', features: ['Slide design', 'Animations', 'Templates', 'Multimedia'] },
        { icon: 'Database', name: 'Microsoft Access', description: 'Database management and data organization', features: ['Database design', 'Forms', 'Reports', 'Queries'] },
        { icon: 'Mail', name: 'Microsoft Outlook', description: 'Email management and communication', features: ['Email organization', 'Calendar', 'Contacts', 'Tasks'] },
        { icon: 'Users', name: 'Microsoft Teams', description: 'Collaboration and remote work solutions', features: ['Video meetings', 'File sharing', 'Chat', 'Integrations'] },
        { icon: 'BookOpen', name: 'Microsoft OneNote', description: 'Digital note-taking and organization', features: ['Note organization', 'Sync across devices', 'Search', 'Sharing'] },
        { icon: 'BookOpen', name: 'Microsoft Publisher', description: 'Design and publish professional documents', features: ['Brochures', 'Flyers', 'Newsletters', 'Templates'] },
      ],
      skillLevels: [
        { title: 'Beginner Level', duration: '2 months', apps: ['Word Basics', 'Excel Fundamentals', 'PowerPoint Essentials'] },
        { title: 'Intermediate Level', duration: '3 months', apps: ['Advanced Excel', 'Access Database', 'Outlook Management'] },
        { title: 'Advanced Level', duration: '3 months', apps: ['Excel Macros', 'Advanced Access', 'Teams & Collaboration'] },
      ],
    }),
  },

  // 4. Networking & System Administration (Standard Layout)
  {
    slug: 'networking-system-administration',
    detailPageLayout: 'standard',
    heroTitle: 'Networking & System Administration',
    heroSubtitle: 'Learn to design, secure, and manage computer networks & systems',
    heroImage: '/assets/system.jpg',
    overviewTitle: 'Program Overview',
    overviewContent: `The Networking & System Administration program prepares students with the knowledge and hands-on skills needed to design, secure, and manage computer networks and IT systems.

This program is ideal for aspiring IT administrators, network engineers, and system support professionals.`,
    learningTitle: "What You'll Learn",
    learningItems: [
      { icon: 'Network', title: 'Networking Fundamentals', description: 'Understand network topologies, protocols, and communication models.' },
      { icon: 'Router', title: 'Routing & Switching', description: 'Configure routers, switches, and manage traffic flow.' },
      { icon: 'ShieldCheck', title: 'Network Security', description: 'Implement firewalls, VPNs, and security policies to protect systems.' },
      { icon: 'Server', title: 'Server Administration', description: 'Install, configure, and manage Windows/Linux servers.' },
      { icon: 'Cloud', title: 'Cloud & Virtualization', description: 'Work with virtual machines, cloud services, and hybrid environments.' },
      { icon: 'Settings', title: 'System Maintenance', description: 'Monitor, troubleshoot, and optimize system performance and uptime.' },
    ],
    modulesTitle: 'Course Modules',
    modules: [
      'Introduction to Networking',
      'Network Topologies & Protocols',
      'IP Addressing & Subnetting',
      'Routing & Switching',
      'Network Devices & Configuration',
      'Server Administration',
      'Linux & Windows System Administration',
      'Network Security & Firewalls',
      'Virtualization & Cloud Computing',
      'System Monitoring & Troubleshooting',
      'Backup & Disaster Recovery',
      'Industry Standards & Certifications',
    ],
    detailsDuration: '8 months',
    detailsFormat: 'Hands-on Lab + Theory',
    detailsSchedule: 'Flexible timing',
    detailsPrerequisites: 'Basic IT knowledge',
    careerTitle: 'Career Opportunities',
    careerOpportunities: [
      'Network Administrator',
      'System Administrator',
      'IT Support Specialist',
      'Cloud/Virtualization Engineer',
      'Security Analyst',
      'Infrastructure Engineer',
    ],
    ctaTitle: 'Ready to Start?',
    ctaDescription: 'Join our Networking & System Administration program and advance your IT career.',
  },

  // 5. Linux Administration (Standard Layout)
  {
    slug: 'linux-administration',
    detailPageLayout: 'standard',
    heroTitle: 'Linux Administration',
    heroSubtitle: 'Gain expertise in managing, securing, and deploying Linux systems',
    heroImage: '/assets/linux.jpg',
    overviewTitle: 'Program Overview',
    overviewContent: `Our Linux Administration program provides comprehensive training in Linux operating systems, command-line tools, and system administration. Students will learn to manage Linux servers, configure services, and automate tasks.

This program is designed for individuals who want to pursue careers in Linux system administration, DevOps, cloud infrastructure, and open-source technology.`,
    learningTitle: "What You'll Learn",
    learningItems: [
      { icon: 'Terminal', title: 'Linux Fundamentals', description: 'Master the Linux command line, file system structure, and essential commands.' },
      { icon: 'Users', title: 'User & Group Management', description: 'Create, manage, and secure user accounts and permissions.' },
      { icon: 'HardDrive', title: 'Storage & File Systems', description: 'Partition disks, manage file systems, and configure storage solutions.' },
      { icon: 'Cog', title: 'System Configuration', description: 'Configure system services, processes, and automate tasks with scripts.' },
      { icon: 'Shield', title: 'Security & Networking', description: 'Implement firewall rules, SSH, and secure Linux servers from threats.' },
      { icon: 'Database', title: 'Server Administration', description: 'Deploy and manage web, database, and application servers on Linux.' },
    ],
    modulesTitle: 'Course Modules',
    modules: [
      'Introduction to Linux & Distributions',
      'Linux File System & Command Line Basics',
      'User & Group Management',
      'File Permissions & Access Control',
      'Package Management (APT, YUM, DNF)',
      'System Processes & Services',
      'Shell Scripting & Automation',
      'Storage & File System Management',
      'Networking & Firewall Configuration',
      'Linux Server Administration',
      'Monitoring, Logging & Troubleshooting',
      'Security Hardening & Best Practices',
    ],
    detailsDuration: '6 months',
    detailsFormat: 'Hands-on Lab + Theory',
    detailsSchedule: 'Flexible timing',
    detailsPrerequisites: 'Basic knowledge of operating systems',
    careerTitle: 'Career Opportunities',
    careerOpportunities: [
      'Linux System Administrator',
      'DevOps Engineer',
      'Cloud Infrastructure Engineer',
      'Cybersecurity Analyst',
      'Site Reliability Engineer (SRE)',
      'Open Source Specialist',
    ],
    ctaTitle: 'Ready to Start?',
    ctaDescription: 'Enroll in Linux Administration and take your IT career to the next level.',
  },

  // 6. Database Management (Standard Layout)
  {
    slug: 'database-management',
    detailPageLayout: 'standard',
    heroTitle: 'Database Management',
    heroSubtitle: 'Learn to design, secure, and optimize databases that power modern applications',
    heroImage: '/assets/database.jpg',
    overviewTitle: 'Program Overview',
    overviewContent: `The Database Management program equips learners with the knowledge and practical skills to build, secure, and manage databases that support real-world applications.

This program is perfect for aspiring database administrators, data analysts, and backend developers who want to master structured and unstructured data systems.`,
    learningTitle: "What You'll Learn",
    learningItems: [
      { icon: 'Database', title: 'Database Fundamentals', description: 'Understand relational and non-relational databases, data models, and schemas.' },
      { icon: 'FileCode', title: 'SQL Programming', description: 'Learn to write efficient SQL queries for data retrieval, manipulation, and reporting.' },
      { icon: 'Server', title: 'Database Servers', description: 'Install, configure, and maintain popular database servers like MySQL, PostgreSQL, and Oracle.' },
      { icon: 'Shield', title: 'Database Security', description: 'Implement access control, encryption, and backup strategies to protect critical data.' },
      { icon: 'BarChart', title: 'Data Analysis', description: 'Perform advanced data analytics and optimize database performance for business insights.' },
      { icon: 'Settings', title: 'Database Administration', description: 'Automate tasks, tune performance, and ensure database availability with admin best practices.' },
    ],
    modulesTitle: 'Course Modules',
    modules: [
      'Introduction to Databases & Data Models',
      'Relational vs Non-Relational Databases',
      'SQL Basics – Queries, Joins & Subqueries',
      'Advanced SQL – Views, Stored Procedures & Triggers',
      'Database Design & Normalization',
      'Transactions & Concurrency Control',
      'Database Installation & Configuration (MySQL/PostgreSQL/Oracle)',
      'Indexing, Query Optimization & Performance Tuning',
      'Database Backup & Recovery Strategies',
      'Database Security & Access Control',
      'NoSQL Databases (MongoDB, Redis)',
      'Capstone Project: Designing & Managing a Real Database',
    ],
    detailsDuration: '6 months',
    detailsFormat: 'Hands-on Lab + Theory',
    detailsSchedule: 'Flexible timing',
    detailsPrerequisites: 'Basic programming or IT knowledge',
    careerTitle: 'Career Opportunities',
    careerOpportunities: [
      'Database Administrator (DBA)',
      'Data Analyst',
      'Backend Developer',
      'Business Intelligence Specialist',
      'Data Engineer',
      'Cloud Database Specialist',
    ],
    ctaTitle: 'Ready to Start?',
    ctaDescription: 'Enroll in Database Management and gain the skills to manage enterprise data systems effectively.',
  },

  // 7. Object-Oriented Programming (Standard Layout)
  {
    slug: 'object-oriented-programming-oop',
    detailPageLayout: 'standard',
    heroTitle: 'Object-Oriented Programming',
    heroSubtitle: 'Master OOP concepts and design maintainable, scalable software',
    heroImage: '/assets/oop.jpg',
    overviewTitle: 'Program Overview',
    overviewContent: `The Object-Oriented Programming program teaches you how to design and implement software using OOP principles, improving code readability, maintainability, and scalability.

Ideal for software developers and aspiring programmers who want to excel in building modular and reusable applications.`,
    learningTitle: "What You'll Learn",
    learningItems: [
      { icon: 'Code', title: 'OOP Basics', description: 'Learn classes, objects, methods, and properties to structure programs effectively.' },
      { icon: 'Layers', title: 'Encapsulation & Abstraction', description: 'Hide implementation details and expose only necessary functionalities.' },
      { icon: 'Users', title: 'Inheritance', description: 'Reuse and extend existing classes to create hierarchies and reduce code duplication.' },
      { icon: 'Shield', title: 'Polymorphism', description: 'Implement multiple forms of behavior through method overriding and interfaces.' },
      { icon: 'FileCode', title: 'OOP Design Patterns', description: 'Apply common design patterns to solve recurring software design problems.' },
      { icon: 'Settings', title: 'Project Development', description: 'Build object-oriented projects with clean architecture and maintainable code.' },
    ],
    modulesTitle: 'Course Modules',
    modules: [
      'Introduction to Object-Oriented Programming',
      'Classes, Objects, and Methods',
      'Properties, Fields, and Access Modifiers',
      'Encapsulation & Abstraction',
      'Inheritance and Class Hierarchies',
      'Polymorphism & Interfaces',
      'Constructor & Destructor Methods',
      'Exception Handling in OOP',
      'Collections, Generics & Data Structures',
      'Design Patterns & Best Practices',
      'Unit Testing OOP Code',
      'Capstone Project: Building an OOP Application',
    ],
    detailsDuration: '5 months',
    detailsFormat: 'Hands-on + Theory',
    detailsSchedule: 'Flexible',
    detailsPrerequisites: 'Basic programming knowledge',
    careerTitle: 'Career Opportunities',
    careerOpportunities: [
      'Software Developer',
      'Backend Developer',
      'Application Programmer',
      'Full Stack Developer',
      'Game Developer',
      'OOP Software Consultant',
    ],
    ctaTitle: 'Ready to Start?',
    ctaDescription: 'Join our OOP program to build scalable, maintainable, and professional-grade software applications.',
  },

  // 8. Website & Application Development (Standard Layout)
  {
    slug: 'website-application-development',
    detailPageLayout: 'standard',
    heroTitle: 'Website & Application Development',
    heroSubtitle: 'Build modern websites and mobile applications from scratch',
    heroImage: '/assets/webdev.jpg',
    overviewTitle: 'Program Overview',
    overviewContent: `This program equips students with skills to develop websites and applications for web and mobile platforms, using modern technologies and frameworks.

Students will learn both front-end and back-end development, enabling them to create full-stack projects and deploy them professionally.`,
    learningTitle: "What You'll Learn",
    learningItems: [
      { icon: 'Code', title: 'HTML, CSS & JavaScript', description: 'Learn the core web technologies for creating responsive and interactive websites.' },
      { icon: 'Monitor', title: 'Frontend Frameworks', description: 'Work with React, Angular, or Vue to build dynamic user interfaces.' },
      { icon: 'Smartphone', title: 'Mobile App Development', description: 'Create cross-platform apps using React Native or Flutter.' },
      { icon: 'Layers', title: 'Backend Development', description: 'Implement server-side logic with Node.js, Express, databases, and APIs.' },
      { icon: 'Settings', title: 'Full-Stack Integration', description: 'Connect front-end and back-end seamlessly to deploy complete applications.' },
      { icon: 'Code', title: 'Project Deployment', description: 'Learn how to host, deploy, and maintain web and mobile applications.' },
    ],
    modulesTitle: 'Course Modules',
    modules: [
      'Introduction to Web & App Development',
      'HTML, CSS & JavaScript Basics',
      'Responsive Design & UI Principles',
      'Frontend Frameworks (React / Angular / Vue)',
      'State Management & Component Architecture',
      'Backend Development with Node.js & Express',
      'Database Integration (SQL & NoSQL)',
      'RESTful API Design',
      'Authentication & Security',
      'Mobile App Development Basics',
      'Full-Stack Project Implementation',
      'Deployment & Maintenance Best Practices',
    ],
    detailsDuration: '6 months',
    detailsFormat: 'Hands-on + Theory',
    detailsSchedule: 'Flexible',
    detailsPrerequisites: 'Basic computer literacy',
    careerTitle: 'Career Opportunities',
    careerOpportunities: [
      'Frontend Developer',
      'Backend Developer',
      'Full-Stack Developer',
      'Mobile App Developer',
      'Web Designer',
      'Software Engineer',
    ],
    ctaTitle: 'Ready to Start?',
    ctaDescription: 'Join our Website & Application Development program and start building professional web and mobile applications.',
  },

  // 9. Cyber Security (Standard Layout)
  {
    slug: 'cyber-security',
    detailPageLayout: 'standard',
    heroTitle: 'Cyber Security',
    heroSubtitle: 'Protect systems, networks, and data from cyber threats',
    heroImage: '/assets/cyber.jpg',
    overviewTitle: 'Program Overview',
    overviewContent: `Our Cyber Security program teaches students to defend networks, systems, and applications against cyber threats using industry-standard techniques.

Students will gain hands-on experience in ethical hacking, cryptography, incident response, and security compliance.`,
    learningTitle: "What You'll Learn",
    learningItems: [
      { icon: 'Shield', title: 'Network Security', description: 'Protect networks from attacks and vulnerabilities.' },
      { icon: 'Lock', title: 'Cryptography', description: 'Learn encryption, hashing, and secure communication protocols.' },
      { icon: 'Terminal', title: 'Ethical Hacking', description: 'Understand vulnerabilities and penetration testing methodologies ethically.' },
      { icon: 'Zap', title: 'Incident Response', description: 'Detect, respond to, and recover from cyber attacks effectively.' },
      { icon: 'Settings', title: 'Security Tools', description: 'Hands-on with tools like Wireshark, Nmap, Metasploit, and SIEM platforms.' },
      { icon: 'Shield', title: 'Cybersecurity Best Practices', description: 'Implement policies, risk management, and compliance standards.' },
    ],
    modulesTitle: 'Course Modules',
    modules: [
      'Introduction to Cyber Security',
      'Fundamentals of Network Security',
      'Encryption & Cryptography',
      'Operating System Security',
      'Web Application Security',
      'Ethical Hacking & Penetration Testing',
      'Malware Analysis & Reverse Engineering',
      'Incident Response & Forensics',
      'Security Tools & Monitoring',
      'Security Policies & Compliance',
      'Cloud Security Basics',
      'Capstone Project: Secure System Implementation',
    ],
    detailsDuration: '6 months',
    detailsFormat: 'Hands-on + Theory',
    detailsSchedule: 'Flexible',
    detailsPrerequisites: 'Basic IT knowledge',
    careerTitle: 'Career Opportunities',
    careerOpportunities: [
      'Cybersecurity Analyst',
      'Ethical Hacker / Penetration Tester',
      'Security Engineer',
      'IT Security Consultant',
      'Incident Response Specialist',
      'Forensic Analyst',
    ],
    ctaTitle: 'Ready to Start?',
    ctaDescription: 'Join our Cyber Security program to protect organizations from cyber threats and build a secure career.',
  },

  // 10. Cloud Computing (Standard Layout)
  {
    slug: 'cloud-computing',
    detailPageLayout: 'standard',
    heroTitle: 'Cloud Computing',
    heroSubtitle: 'Master the cloud to power modern business and applications',
    heroImage: '/assets/cloud.jpg',
    overviewTitle: 'Program Overview',
    overviewContent: `Our Cloud Computing program equips students with the skills to design, deploy, and manage scalable cloud solutions using leading platforms like AWS, Azure, and Google Cloud.

Learn how to leverage virtualization, containers, DevOps tools, and security practices to drive innovation in cloud environments.`,
    learningTitle: "What You'll Learn",
    learningItems: [
      { icon: 'Cloud', title: 'Cloud Fundamentals', description: 'Understand IaaS, PaaS, SaaS and cloud service delivery models.' },
      { icon: 'Server', title: 'Virtualization', description: 'Learn how virtual machines and containers power cloud platforms.' },
      { icon: 'Database', title: 'Cloud Storage & Databases', description: 'Work with scalable cloud databases and distributed storage systems.' },
      { icon: 'Lock', title: 'Cloud Security', description: 'Implement security controls, identity management, and compliance.' },
      { icon: 'Layers', title: 'Multi-Cloud & Hybrid', description: 'Learn strategies for multi-cloud and hybrid cloud deployments.' },
      { icon: 'Cpu', title: 'Cloud Automation', description: 'Explore DevOps, CI/CD pipelines, and Infrastructure as Code.' },
    ],
    modulesTitle: 'Course Modules',
    modules: [
      'Introduction to Cloud Computing',
      'Cloud Service Models (IaaS, PaaS, SaaS)',
      'Virtualization & Containerization',
      'Cloud Networking',
      'Cloud Storage & Database Solutions',
      'Cloud Security & Compliance',
      'Cloud Automation & DevOps',
      'Serverless Computing & Microservices',
      'Multi-Cloud & Hybrid Cloud Strategies',
      'Capstone Project: Deploying a Cloud Solution',
    ],
    detailsDuration: '6 months',
    detailsFormat: 'Hands-on + Theory',
    detailsSchedule: 'Flexible',
    detailsPrerequisites: 'Basic networking or IT knowledge',
    careerTitle: 'Career Opportunities',
    careerOpportunities: [
      'Cloud Engineer',
      'Cloud Security Specialist',
      'Cloud Solutions Architect',
      'DevOps Engineer',
      'Systems Administrator',
      'Cloud Consultant',
    ],
    ctaTitle: 'Ready to Start?',
    ctaDescription: 'Join our Cloud Computing program and master the technologies driving the future of IT.',
  },

  // 11. System Analysis & Design (Standard Layout)
  {
    slug: 'system-analysis-design',
    detailPageLayout: 'standard',
    heroTitle: 'System Analysis & Design',
    heroSubtitle: 'Learn how to design, analyze, and implement efficient systems',
    heroImage: '/assets/system-design.jpg',
    overviewTitle: 'Program Overview',
    overviewContent: `This program provides students with the knowledge and skills to analyze, design, and implement information systems effectively.

You'll explore SDLC, system modeling, requirements engineering, and stakeholder management to ensure successful system development.`,
    learningTitle: "What You'll Learn",
    learningItems: [
      { icon: 'Workflow', title: 'System Development Life Cycle (SDLC)', description: 'Understand different phases of SDLC including planning, analysis, design, implementation, and maintenance.' },
      { icon: 'FileText', title: 'Requirements Gathering', description: 'Learn to collect, document, and analyze user requirements effectively.' },
      { icon: 'Layers', title: 'System Modeling', description: 'Use diagrams, flowcharts, and modeling tools like UML to represent system processes.' },
      { icon: 'Users', title: 'Stakeholder Analysis', description: 'Identify and manage different stakeholders throughout system development.' },
      { icon: 'ClipboardList', title: 'Design Techniques', description: 'Explore structured design, object-oriented design, and prototyping approaches.' },
      { icon: 'Wrench', title: 'Testing & Maintenance', description: 'Learn testing methods, validation, verification, and post-deployment support.' },
    ],
    modulesTitle: 'Course Modules',
    modules: [
      'Introduction to System Analysis & Design',
      'System Development Life Cycle (SDLC)',
      'Requirements Gathering & Analysis',
      'System Modeling with UML',
      'Feasibility Study & Risk Analysis',
      'Process & Data Modeling',
      'System Design Principles',
      'Implementation & Testing',
      'Maintenance & Evaluation',
      'Capstone Project: System Design Case Study',
    ],
    detailsDuration: '5 months',
    detailsFormat: 'Theory + Case Studies',
    detailsSchedule: 'Flexible',
    detailsPrerequisites: 'Basic programming or IT knowledge',
    careerTitle: 'Career Opportunities',
    careerOpportunities: [
      'Systems Analyst',
      'Business Analyst',
      'IT Consultant',
      'Project Manager',
      'Requirements Engineer',
      'System Designer',
    ],
    ctaTitle: 'Ready to Start?',
    ctaDescription: 'Enroll in System Analysis & Design to learn how to plan and build effective systems for organizations.',
  },

  // 12. Adobe Applications (Custom Layout)
  {
    slug: 'adobe-applications',
    detailPageLayout: 'custom-adobe',
    heroTitle: 'Adobe Creative\nCloud Suite',
    heroSubtitle: 'Master professional design, video editing, and multimedia creation with industry-standard Adobe tools',
    heroImage: '/assets/Adobe.jpeg',
    overviewTitle: 'Program Overview',
    overviewContent: `Our Adobe Applications program provides comprehensive training in Adobe Creative Cloud suite. Students will master Photoshop, Illustrator, Premiere Pro, After Effects, InDesign, XD, Lightroom, and more.

This program is designed for aspiring graphic designers, video editors, web designers, and creative professionals who want to master industry-standard design and multimedia tools.`,
    learningTitle: "What You'll Learn",
    learningItems: [
      { icon: 'Image', title: 'Adobe Photoshop', description: 'Professional photo editing, digital art creation, and image manipulation.' },
      { icon: 'PenTool', title: 'Adobe Illustrator', description: 'Vector graphics, logos, icons, and scalable artwork for digital and print.' },
      { icon: 'Video', title: 'Adobe Premiere Pro', description: 'Professional video editing, transitions, effects, and storytelling.' },
      { icon: 'Layers', title: 'Adobe After Effects', description: 'Motion graphics, animations, and cinematic visual effects.' },
      { icon: 'FileText', title: 'Adobe InDesign', description: 'Layout design for magazines, brochures, posters, and publishing.' },
      { icon: 'Brush', title: 'Adobe XD', description: 'UI/UX design, prototyping, and user experience workflows.' },
    ],
    modulesTitle: 'Course Modules',
    modules: [
      'Adobe Photoshop Fundamentals',
      'Adobe Illustrator Basics',
      'Adobe Premiere Pro Editing',
      'Adobe After Effects Motion Graphics',
      'Adobe InDesign Layout Design',
      'Adobe XD UI/UX Design',
      'Adobe Lightroom Photo Editing',
      'Creative Cloud Integration',
      'Workflow Optimization',
      'Portfolio Development',
      'Industry Projects',
      'Professional Certification',
    ],
    detailsDuration: '10 months',
    detailsFormat: 'Hands-on Creative Projects',
    detailsSchedule: 'Flexible timing',
    detailsPrerequisites: 'Basic computer skills',
    careerTitle: 'Career Opportunities',
    careerOpportunities: [
      'Graphic Designer',
      'Video Editor',
      'UI/UX Designer',
      'Web Designer',
      'Multimedia Specialist',
      'Creative Director',
    ],
    ctaTitle: 'Ready to Master Adobe?',
    ctaDescription: 'Join our Adobe Applications program and unleash your creative potential.',
    customContent: JSON.stringify({
      applications: [
        { icon: 'Image', name: 'Adobe Photoshop', description: 'Professional photo editing, digital art creation, and image manipulation', features: ['Photo editing', 'Digital painting', 'Layer management', 'Filters & effects'] },
        { icon: 'PenTool', name: 'Adobe Illustrator', description: 'Vector graphics, logos, icons, and scalable artwork for digital and print', features: ['Vector graphics', 'Logo design', 'Illustration', 'Typography'] },
        { icon: 'Video', name: 'Adobe Premiere Pro', description: 'Professional video editing, transitions, effects, and storytelling', features: ['Video editing', 'Color grading', 'Audio mixing', 'Export formats'] },
        { icon: 'Layers', name: 'Adobe After Effects', description: 'Motion graphics, animations, and cinematic visual effects', features: ['Motion graphics', 'Visual effects', 'Compositing', 'Animation'] },
        { icon: 'FileText', name: 'Adobe InDesign', description: 'Layout design for magazines, brochures, posters, and publishing', features: ['Page layout', 'Typography', 'Print design', 'Digital publishing'] },
        { icon: 'Brush', name: 'Adobe XD', description: 'UI/UX design, prototyping, and user experience workflows', features: ['UI/UX design', 'Prototyping', 'Wireframing', 'Collaboration'] },
        { icon: 'Palette', name: 'Adobe Lightroom', description: 'Photo organization, editing, and professional photography workflow', features: ['Photo organization', 'RAW editing', 'Presets', 'Batch processing'] },
        { icon: 'Type', name: 'Adobe Creative Cloud', description: 'Integrated workflow across all Adobe applications and cloud services', features: ['Cloud storage', 'Asset libraries', 'Fonts & templates', 'Collaboration'] },
      ],
      skillLevels: [
        { title: 'Beginner Level', duration: '2 months', apps: ['Photoshop Basics', 'Illustrator Fundamentals', 'InDesign Essentials'] },
        { title: 'Intermediate Level', duration: '3 months', apps: ['Advanced Photoshop', 'Premiere Pro Editing', 'After Effects Basics'] },
        { title: 'Advanced Level', duration: '3 months', apps: ['Professional Workflows', 'Advanced Motion Graphics', 'Creative Suite Integration'] },
      ],
    }),
  },
]

// Export for use in other scripts
export { IT_PROGRAM_DETAIL_CONTENT }

async function main() {
  console.log('🌱 Seeding IT Program Detail Content...\n')
  console.log(`📋 Found ${IT_PROGRAM_DETAIL_CONTENT.length} programs to seed\n`)

  let updated = 0
  let notFound = 0
  let errors = 0

  for (const content of IT_PROGRAM_DETAIL_CONTENT) {
    try {
      // Find the program by slug
      const program = await prisma.program.findUnique({
        where: { slug: content.slug },
        select: { id: true, slug: true, name: true, heroTitle: true },
      })

      if (!program) {
        console.log(`⚠️  Program not found: ${content.slug}`)
        console.log(`   → Run 'npm run db:seed-programs' first to create this program`)
        notFound++
        continue
      }

      // Prepare update data
      const updateData: Prisma.ProgramUpdateInput = {
        detailPageLayout: content.detailPageLayout,
        heroTitle: content.heroTitle,
        heroSubtitle: content.heroSubtitle,
        heroImage: content.heroImage,
        overviewTitle: content.overviewTitle,
        overviewContent: content.overviewContent,
        learningTitle: content.learningTitle,
        learningItems: JSON.stringify(content.learningItems),
        modulesTitle: content.modulesTitle,
        modules: JSON.stringify(content.modules),
        detailsDuration: content.detailsDuration,
        detailsFormat: content.detailsFormat,
        detailsSchedule: content.detailsSchedule,
        detailsPrerequisites: content.detailsPrerequisites,
        careerTitle: content.careerTitle,
        careerOpportunitiesJson: JSON.stringify(content.careerOpportunities),
        ctaTitle: content.ctaTitle,
        ctaDescription: content.ctaDescription,
        ...(content.customContent && { customContent: content.customContent }),
      }

      // Update the program (force update even if content exists)
      await prisma.program.update({
        where: { slug: content.slug },
        data: updateData,
      })

      updated++
      const hadContent = !!program.heroTitle
      console.log(`✅ Updated: ${content.slug}${hadContent ? ' (overwritten existing)' : ''}`)
    } catch (error) {
      errors++
      console.error(`❌ Error updating ${content.slug}:`, error)
    }
  }

  console.log('\n✨ Seeding completed!')
  console.log(`   ✅ Updated: ${updated} programs`)
  if (notFound > 0) {
    console.log(`   ⚠️  Not Found: ${notFound} programs (run 'npm run db:seed-programs' first)`)
  }
  if (errors > 0) {
    console.log(`   ❌ Errors: ${errors} programs`)
  }
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

