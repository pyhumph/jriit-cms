const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cyberSecurityPrograms = [
  {
    slug: 'intro-to-cyber-security',
    detailPageLayout: 'cyber-security',
    heroTitle: 'Introduction to Cybersecurity',
    heroSubtitle: 'Protecting the digital world, one system at a time.',
    heroImage: '/assets/intro-sec.jpg',
    introParagraphs: JSON.stringify([
      'Cybersecurity has emerged as one of the most critical disciplines in our digital age, protecting organizations and individuals from an ever-evolving landscape of cyber threats. As our world becomes increasingly interconnected through digital technologies, the need for skilled cybersecurity professionals continues to grow exponentially. This comprehensive introduction will guide you through the fundamental concepts, principles, and practices that form the backbone of modern cybersecurity. You\'ll discover how cybersecurity professionals defend against malicious attacks, protect sensitive data, and maintain the integrity of digital systems. The field encompasses everything from network security and cryptography to incident response and digital forensics, offering diverse career paths for those passionate about protecting our digital future.',
      'At JR Institute of Information Technology, we believe that cybersecurity education should be both theoretical and practical, preparing students for real-world challenges. Our program emphasizes hands-on learning through simulated cyber attack scenarios, security tool implementation, and ethical hacking exercises. You\'ll learn to think like both a defender and an attacker, understanding vulnerabilities from multiple perspectives to build comprehensive security strategies.',
    ]),
    classroomImage: '/assets/classrom.jpeg',
    classroomTitle: 'IN THE CLASSROOM',
    classroomParagraphs: JSON.stringify([
      'Students will immerse themselves in interactive cybersecurity labs where they\'ll learn to identify and analyze various types of cyber threats in controlled environments. Through hands-on exercises, you\'ll master the fundamentals of network security, understanding how firewalls, intrusion detection systems, and encryption protocols work together to create robust defense mechanisms.',
      'Advanced modules include digital forensics techniques where students learn to investigate cyber incidents and preserve digital evidence for legal proceedings. Ethical hacking sessions teach responsible vulnerability assessment, helping students understand how to identify security weaknesses before malicious actors can exploit them.',
    ]),
    beyondClassroomImage: '/assets/global.jpeg',
    beyondClassroomTitle: 'BEYOND THE CLASSROOM',
    beyondClassroomParagraphs: JSON.stringify([
      'The cybersecurity field extends far beyond traditional classroom learning, offering students numerous opportunities to engage with real-world security challenges through internships, industry partnerships, and professional certifications.',
      'Alumni of our cybersecurity program have gone on to work for major corporations, government cybersecurity agencies, and specialized security consulting firms across Tanzania and internationally.',
    ]),
    differenceImage: '/assets/cyber-difference.jpeg',
    differenceTitle: 'CYBERSECURITY + THE JRIIT DIFFERENCE',
    differenceParagraphs: JSON.stringify([
      'What sets cybersecurity apart from other IT disciplines is its unique combination of technical expertise, strategic thinking, and constant adaptation to emerging threats in an ever-changing digital landscape.',
      'The cybersecurity profession offers unparalleled job security and growth potential, as the demand for skilled professionals far exceeds the current supply globally.',
    ]),
  },
  {
    slug: 'network-os-security',
    detailPageLayout: 'cyber-security',
    heroTitle: 'Network & OS Security',
    heroSubtitle: 'Securing the backbone of digital communication and operating environments.',
    heroImage: '/assets/os-security.jpg',
    introParagraphs: JSON.stringify([
      'Network & OS Security focuses on safeguarding the essential infrastructure that underpins all digital systems. From protecting local and wide-area networks to securing the very operating systems that power devices, this module equips learners with the knowledge to defend critical layers of technology.',
      'At JR Institute of Information Technology, students gain both theoretical foundations and practical skills. You\'ll explore protocols, permissions, vulnerabilities, and best practices for hardening systems against unauthorized access and malicious activity.',
    ]),
    classroomImage: '/assets/classrom.jpeg',
    classroomTitle: 'IN THE CLASSROOM',
    classroomParagraphs: JSON.stringify([
      'In the classroom, students dive into network architectures and learn to configure secure topologies using routers, switches, and firewalls. You\'ll analyze real-world threats such as malware, ransomware, and denial-of-service attacks while practicing mitigation strategies.',
      'Hands-on labs include hardening Windows and Linux operating systems, implementing user authentication policies, and exploring advanced access control models. Through practice, students gain confidence in securing both networks and operating systems.',
    ]),
    beyondClassroomImage: '/assets/global.jpeg',
    beyondClassroomTitle: 'BEYOND THE CLASSROOM',
    beyondClassroomParagraphs: JSON.stringify([
      'Beyond the classroom, learners apply their skills through internships, industry simulations, and professional certification tracks like CompTIA Security+ and Cisco CCNA Security.',
      'Graduates of the Network & OS Security module often pursue careers as system administrators, network engineers, or security analysts, contributing directly to the protection of organizational IT infrastructure.',
    ]),
    differenceImage: '/assets/networkSecurity01.jpeg',
    differenceTitle: 'NETWORK & OS SECURITY + THE JRIIT DIFFERENCE',
    differenceParagraphs: JSON.stringify([
      'What makes our Network & OS Security training unique is the balance of academic rigor and real-world readiness. Students not only learn concepts but also apply them through realistic attack-and-defense simulations.',
      'With JRIIT\'s hands-on approach, graduates stand out in the job market as professionals who can confidently secure operating systems and networks in diverse environments.',
    ]),
  },
  {
    slug: 'cryptography-basics',
    detailPageLayout: 'cyber-security',
    heroTitle: 'Cryptography Basics',
    heroSubtitle: 'Protecting data through the art and science of encryption.',
    heroImage: '/assets/Cryptography.jpeg',
    introParagraphs: JSON.stringify([
      'Cryptography is the foundation of modern cybersecurity, ensuring the confidentiality, integrity, and authenticity of data. From simple substitution ciphers to advanced encryption algorithms, cryptography plays a vital role in securing communications and protecting sensitive information.',
      'At JR Institute of Information Technology, students are introduced to the mathematical principles and practical techniques behind cryptography. You\'ll gain the knowledge and hands-on experience to understand, apply, and evaluate cryptographic methods used in real-world security systems.',
    ]),
    classroomImage: '/assets/classrom.jpeg',
    classroomTitle: 'IN THE CLASSROOM',
    classroomParagraphs: JSON.stringify([
      'In the classroom, students explore the history of cryptography, symmetric and asymmetric encryption, hashing functions, and digital signatures. Topics include AES, RSA, Diffie-Hellman key exchange, and modern cryptographic standards.',
      'Hands-on labs include encrypting and decrypting messages, generating keys, creating hash digests, and implementing simple secure communication protocols. These activities build the foundation for understanding advanced cybersecurity applications.',
    ]),
    beyondClassroomImage: '/assets/global.jpeg',
    beyondClassroomTitle: 'BEYOND THE CLASSROOM',
    beyondClassroomParagraphs: JSON.stringify([
      'Beyond the classroom, learners apply cryptographic concepts in real-world scenarios, from securing online banking transactions to safeguarding cloud storage systems.',
      'Graduates with strong cryptography skills are well-prepared for roles in cybersecurity engineering, penetration testing, blockchain development, and secure software design.',
    ]),
    differenceImage: '/assets/crypto-diff.jpeg',
    differenceTitle: 'CRYPTOGRAPHY + THE JRIIT DIFFERENCE',
    differenceParagraphs: JSON.stringify([
      'What sets JRIIT apart is our approach to making cryptography accessible and practical. Students not only learn the theoretical underpinnings but also practice implementing cryptographic techniques in security labs.',
      'With our applied learning environment, graduates emerge with confidence to design and evaluate secure systems where cryptography is a core requirement.',
    ]),
  },
  {
    slug: 'ethical-hacking-pen-testing',
    detailPageLayout: 'cyber-security',
    heroTitle: 'Ethical Hacking & Pen Testing',
    heroSubtitle: 'Identifying and fixing vulnerabilities before attackers exploit them.',
    heroImage: '/assets/pen-testing.jpg',
    introParagraphs: JSON.stringify([
      'Ethical Hacking and Penetration Testing are essential practices in modern cybersecurity. They focus on simulating real-world attacks to identify weaknesses in systems, networks, and applications—before malicious hackers can exploit them.',
      'At JR Institute of Information Technology (JRIIT) in Tanzania, students are trained to think like attackers but act as defenders. This module builds the mindset and technical skills needed to ethically test and strengthen digital infrastructure.',
    ]),
    classroomImage: '/assets/classrom.jpeg',
    classroomTitle: 'IN THE CLASSROOM',
    classroomParagraphs: JSON.stringify([
      'In the classroom, students explore penetration testing methodologies, vulnerability assessment tools, and ethical hacking frameworks such as OWASP and NIST standards. Topics include reconnaissance, scanning, exploitation, privilege escalation, and post-exploitation techniques.',
      'Hands-on labs cover using tools like Nmap, Metasploit, Wireshark, and Burp Suite to conduct ethical attacks on controlled environments. Students also learn to document findings and recommend remediation strategies in professional reports.',
    ]),
    beyondClassroomImage: '/assets/global.jpeg',
    beyondClassroomTitle: 'BEYOND THE CLASSROOM',
    beyondClassroomParagraphs: JSON.stringify([
      'Beyond the classroom, learners apply their pen testing skills in internships, Capture the Flag (CTF) competitions, and cybersecurity projects with industry partners.',
      'Graduates of this module often pursue careers as penetration testers, red team members, vulnerability analysts, or cybersecurity consultants, helping organizations strengthen their defenses against evolving threats.',
    ]),
    differenceImage: '/assets/pen-testing.jpg',
    differenceTitle: 'ETHICAL HACKING & PEN TESTING + THE JRIIT DIFFERENCE',
    differenceParagraphs: JSON.stringify([
      'What makes JRIIT\'s Ethical Hacking & Pen Testing training unique is the blend of hands-on labs, real-world simulations, and strict adherence to ethical standards.',
      'By the end of the module, students don\'t just know how to break into systems—they know how to defend them and ensure organizations are prepared against cyber adversaries.',
    ]),
  },
  {
    slug: 'web-application-security',
    detailPageLayout: 'cyber-security',
    heroTitle: 'Web Application Security',
    heroSubtitle: 'Securing the applications that power the digital world.',
    heroImage: '/assets/web-application-security',
    introParagraphs: JSON.stringify([
      'Web Application Security focuses on identifying, preventing, and mitigating vulnerabilities in modern web-based systems. Since most organizations rely heavily on web apps for business and communication, ensuring their security is critical.',
      'At JR Institute of Information Technology (JRIIT) in Tanzania, students gain both theoretical and practical skills to defend applications against common attacks, such as SQL injection, cross-site scripting (XSS), cross-site request forgery (CSRF), and insecure authentication.',
    ]),
    classroomImage: '/assets/classrom.jpeg',
    classroomTitle: 'IN THE CLASSROOM',
    classroomParagraphs: JSON.stringify([
      'In the classroom, students study secure coding principles, application security frameworks like OWASP Top 10, and vulnerability analysis techniques. They learn to evaluate software design, authentication methods, and data validation strategies.',
      'Hands-on labs include exploiting and patching web application vulnerabilities in controlled environments, testing API endpoints, and configuring web application firewalls (WAFs). Through these exercises, students build the skills to protect real-world applications.',
    ]),
    beyondClassroomImage: '/assets/global.jpeg',
    beyondClassroomTitle: 'BEYOND THE CLASSROOM',
    beyondClassroomParagraphs: JSON.stringify([
      'Beyond the classroom, learners participate in bug bounty challenges, industry-driven projects, and internships where they test and secure live web applications.',
      'Graduates of this module are prepared for roles such as web security engineers, secure software developers, penetration testers, or application security consultants, contributing directly to safer online services.',
    ]),
    differenceImage: '/assets/web-application-security',
    differenceTitle: 'WEB APPLICATION SECURITY + THE JRIIT DIFFERENCE',
    differenceParagraphs: JSON.stringify([
      'What sets JRIIT apart is our focus on combining development and security skills. Students not only learn how attackers exploit web apps but also how to design and code securely from the ground up.',
      'With our hands-on, real-world approach, graduates emerge with the confidence to build, test, and secure web applications that meet modern cybersecurity standards.',
    ]),
  },
  {
    slug: 'malware-forensics',
    detailPageLayout: 'cyber-security',
    heroTitle: 'Malware & Forensics',
    heroSubtitle: 'Detecting, analyzing, and investigating cyber threats to uncover the truth.',
    heroImage: '/assets/malware.jpeg',
    introParagraphs: JSON.stringify([
      'Malware & Forensics is a critical field within cybersecurity that focuses on understanding malicious software and investigating digital crimes. Malware analysis helps identify threats such as viruses, worms, ransomware, and trojans, while forensics uncovers digital evidence to support incident response and legal action.',
      'At JR Institute of Information Technology (JRIIT) in Tanzania, students gain practical expertise in identifying, dissecting, and defending against malware, as well as investigating compromised systems to trace attacks and recover critical data.',
    ]),
    classroomImage: '/assets/classrom.jpeg',
    classroomTitle: 'IN THE CLASSROOM',
    classroomParagraphs: JSON.stringify([
      'In the classroom, students study malware types, infection techniques, payload delivery methods, and evasion tactics. They also learn forensic methodologies, including evidence collection, preservation, and analysis in accordance with legal standards.',
      'Hands-on labs include malware reverse engineering, static and dynamic malware analysis, using forensic toolkits to recover deleted files, analyzing system logs, and tracing attacker footprints across networks.',
    ]),
    beyondClassroomImage: '/assets/global.jpeg',
    beyondClassroomTitle: 'BEYOND THE CLASSROOM',
    beyondClassroomParagraphs: JSON.stringify([
      'Beyond the classroom, learners participate in simulations of cyber incidents, work on forensic case studies, and engage in projects where they investigate realistic attack scenarios.',
      'Graduates of this module are prepared for careers as malware analysts, digital forensic investigators, incident response specialists, or threat intelligence researchers—high-demand roles in government, law enforcement, and private industry.',
    ]),
    differenceImage: '/assets/malware.jpeg',
    differenceTitle: 'MALWARE & FORENSICS + THE JRIIT DIFFERENCE',
    differenceParagraphs: JSON.stringify([
      'What sets JRIIT apart is our applied learning environment where students not only study malware concepts but also perform real analysis and forensic investigations in a secure lab environment.',
      'Graduates leave JRIIT with both the technical skills to neutralize threats and the investigative mindset to uncover digital evidence, making them highly valued in today\'s cybersecurity landscape.',
    ]),
  },
  {
    slug: 'wireless-mobile-security',
    detailPageLayout: 'cyber-security',
    heroTitle: 'Wireless & Mobile Security',
    heroSubtitle: 'Securing the always-connected world of wireless networks and mobile devices.',
    heroImage: '/assets/mobile-security.jpeg',
    introParagraphs: JSON.stringify([
      'Wireless & Mobile Security addresses the unique challenges of securing communication channels and devices in today\'s mobile-first world. From Wi-Fi networks to smartphones and IoT devices, attackers often exploit vulnerabilities in wireless protocols and mobile platforms.',
      'At JR Institute of Information Technology (JRIIT) in Tanzania, students gain the knowledge and practical skills to protect wireless networks, secure mobile applications, and defend against threats targeting portable technologies.',
    ]),
    classroomImage: '/assets/classrom.jpeg',
    classroomTitle: 'IN THE CLASSROOM',
    classroomParagraphs: JSON.stringify([
      'In the classroom, students explore wireless security protocols such as WPA3, common Wi-Fi attacks like man-in-the-middle, packet sniffing, and rogue access points. They also study mobile OS security models for Android and iOS, mobile app vulnerabilities, and mobile device management (MDM) solutions.',
      'Hands-on labs include setting up secure Wi-Fi networks, testing mobile applications for vulnerabilities, simulating attacks such as Wi-Fi cracking and SMS phishing, and applying encryption for mobile communications.',
    ]),
    beyondClassroomImage: '/assets/global.jpeg',
    beyondClassroomTitle: 'BEYOND THE CLASSROOM',
    beyondClassroomParagraphs: JSON.stringify([
      'Beyond the classroom, learners engage in wireless security audits, mobile penetration testing exercises, and case studies involving real-world mobile data breaches and IoT attacks.',
      'Graduates of this module are prepared for careers as wireless security specialists, mobile application security analysts, penetration testers, and IoT security consultants, helping organizations defend against ever-evolving mobile threats.',
    ]),
    differenceImage: '/assets/mobile-security.jpeg',
    differenceTitle: 'WIRELESS & MOBILE SECURITY + THE JRIIT DIFFERENCE',
    differenceParagraphs: JSON.stringify([
      'What makes JRIIT\'s Wireless & Mobile Security training unique is the balance of classroom theory and hands-on field practice. Students simulate real wireless and mobile attack scenarios while applying professional-grade defensive measures.',
      'This practical approach ensures graduates leave with the skills and confidence to secure mobile ecosystems and wireless infrastructures in today\'s hyperconnected world.',
    ]),
  },
];

async function seedCyberSecurityDetails() {
  console.log('🌐 Seeding Cyber Security program details...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const programData of cyberSecurityPrograms) {
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
          // Explicitly set all fields to ensure they're updated
          detailPageLayout: detailContent.detailPageLayout,
          heroTitle: detailContent.heroTitle,
          heroSubtitle: detailContent.heroSubtitle,
          heroImage: detailContent.heroImage,
          introParagraphs: detailContent.introParagraphs,
          classroomImage: detailContent.classroomImage,
          classroomTitle: detailContent.classroomTitle,
          classroomParagraphs: detailContent.classroomParagraphs,
          beyondClassroomImage: detailContent.beyondClassroomImage,
          beyondClassroomTitle: detailContent.beyondClassroomTitle,
          beyondClassroomParagraphs: detailContent.beyondClassroomParagraphs,
          differenceImage: detailContent.differenceImage,
          differenceTitle: detailContent.differenceTitle,
          differenceParagraphs: detailContent.differenceParagraphs,
        },
      });

      // Verify the update
      const hasAllFields = 
        result.introParagraphs && 
        result.classroomImage && 
        result.classroomParagraphs &&
        result.beyondClassroomImage &&
        result.beyondClassroomParagraphs &&
        result.differenceImage &&
        result.differenceParagraphs;

      if (hasAllFields) {
        console.log(`  ✅ Seeded: ${existingProgram.name} (${slug}) - ALL FIELDS SET`);
        successCount++;
      } else {
        console.log(`  ⚠️  Seeded: ${existingProgram.name} (${slug}) - SOME FIELDS MISSING`);
        console.log(`     - introParagraphs: ${result.introParagraphs ? 'SET' : 'NULL'}`);
        console.log(`     - classroomImage: ${result.classroomImage ? 'SET' : 'NULL'}`);
        console.log(`     - classroomParagraphs: ${result.classroomParagraphs ? 'SET' : 'NULL'}`);
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
  console.log(`\n🎉 Cyber Security programs seeding completed!`);
}

seedCyberSecurityDetails()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



