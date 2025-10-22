import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Get the admin user
  const admin = await prisma.admin.findFirst({
    where: { email: 'admin@jriit.com' }
  })

  if (!admin) {
    console.log('Admin user not found. Please run the main seed script first.')
    return
  }

  // Create test blog posts
  const testPosts = [
    {
      title: 'Welcome to JRIIIT Institute',
      slug: 'welcome-to-jriit-institute',
      content: `
        <h2>Welcome to JRIIIT Institute</h2>
        <p>We are excited to welcome you to JRIIIT Institute, where innovation meets education. Our institute is committed to providing world-class education in Information Technology, Cybersecurity, and related fields.</p>
        
        <h3>Our Mission</h3>
        <p>To empower students with cutting-edge knowledge and practical skills that prepare them for successful careers in the technology industry.</p>
        
        <h3>Why Choose JRIIIT?</h3>
        <ul>
          <li>Expert faculty with industry experience</li>
          <li>State-of-the-art facilities</li>
          <li>Hands-on practical training</li>
          <li>Industry partnerships</li>
          <li>Career placement assistance</li>
        </ul>
        
        <p>Join us on this exciting journey of learning and discovery!</p>
      `,
      excerpt: 'Welcome to JRIIIT Institute, where innovation meets education. Discover our world-class programs and state-of-the-art facilities.',
      published: true,
      authorId: admin.id,
    },
    {
      title: 'New Cybersecurity Program Launch',
      slug: 'new-cybersecurity-program-launch',
      content: `
        <h2>New Cybersecurity Program Launch</h2>
        <p>We are thrilled to announce the launch of our comprehensive Cybersecurity program, designed to prepare students for the growing demand in cybersecurity careers.</p>
        
        <h3>Program Highlights</h3>
        <ul>
          <li>Ethical Hacking and Penetration Testing</li>
          <li>Network Security Fundamentals</li>
          <li>Cryptography and Data Protection</li>
          <li>Incident Response and Forensics</li>
          <li>Security Risk Assessment</li>
        </ul>
        
        <h3>Career Opportunities</h3>
        <p>Graduates of this program will be prepared for roles such as:</p>
        <ul>
          <li>Cybersecurity Analyst</li>
          <li>Penetration Tester</li>
          <li>Security Consultant</li>
          <li>Incident Response Specialist</li>
          <li>Security Architect</li>
        </ul>
        
        <p>Applications are now open for the upcoming semester!</p>
      `,
      excerpt: 'Announcing our new comprehensive Cybersecurity program with hands-on training and industry-relevant curriculum.',
      published: true,
      authorId: admin.id,
    },
    {
      title: 'Student Success Stories',
      slug: 'student-success-stories',
      content: `
        <h2>Student Success Stories</h2>
        <p>At JRIIIT Institute, we take pride in our students' achievements. Here are some inspiring success stories from our recent graduates.</p>
        
        <h3>Sarah's Journey to Software Development</h3>
        <p>Sarah graduated from our Information Technology program and now works as a Senior Software Developer at a leading tech company. "The hands-on approach and real-world projects at JRIIIT prepared me perfectly for my career," she says.</p>
        
        <h3>Ahmed's Cybersecurity Career</h3>
        <p>Ahmed completed our Cybersecurity program and is now a Security Analyst at a major financial institution. "The practical training and industry connections I gained at JRIIIT were invaluable," he shares.</p>
        
        <h3>Maria's Entrepreneurial Success</h3>
        <p>Maria used the skills she learned in our Business Administration program to start her own digital marketing agency. "The business fundamentals and technology integration at JRIIIT gave me the perfect foundation," she explains.</p>
        
        <p>These are just a few examples of how JRIIIT Institute is shaping the future of our students.</p>
      `,
      excerpt: 'Discover inspiring success stories from our graduates who have achieved remarkable careers in technology and business.',
      published: true,
      authorId: admin.id,
    },
    {
      title: 'Industry Partnerships and Internships',
      slug: 'industry-partnerships-internships',
      content: `
        <h2>Industry Partnerships and Internships</h2>
        <p>JRIIIT Institute has established strong partnerships with leading companies to provide our students with valuable internship opportunities and real-world experience.</p>
        
        <h3>Our Partners</h3>
        <ul>
          <li>Microsoft - Cloud Computing and Azure Training</li>
          <li>Cisco - Networking and Security Certifications</li>
          <li>IBM - Data Science and AI Programs</li>
          <li>Amazon Web Services - Cloud Architecture</li>
          <li>Local Tech Companies - Software Development</li>
        </ul>
        
        <h3>Internship Program</h3>
        <p>Our internship program provides students with:</p>
        <ul>
          <li>Real-world project experience</li>
          <li>Mentorship from industry professionals</li>
          <li>Networking opportunities</li>
          <li>Potential job offers upon graduation</li>
        </ul>
        
        <h3>Success Metrics</h3>
        <p>Over 85% of our students secure internships during their studies, and 90% receive job offers within 6 months of graduation.</p>
        
        <p>Apply now to be part of our next cohort!</p>
      `,
      excerpt: 'Learn about our industry partnerships and internship opportunities that provide real-world experience and career connections.',
      published: true,
      authorId: admin.id,
    },
    {
      title: 'Technology Trends in 2024',
      slug: 'technology-trends-2024',
      content: `
        <h2>Technology Trends in 2024</h2>
        <p>As we move through 2024, several technology trends are shaping the future of work and education. Here's what students and professionals need to know.</p>
        
        <h3>Artificial Intelligence and Machine Learning</h3>
        <p>AI continues to revolutionize industries, from healthcare to finance. Understanding AI fundamentals is becoming essential for all technology professionals.</p>
        
        <h3>Cybersecurity Evolution</h3>
        <p>With increasing cyber threats, cybersecurity skills are in high demand. New attack vectors require updated defense strategies and continuous learning.</p>
        
        <h3>Cloud Computing</h3>
        <p>Cloud technologies are becoming the backbone of modern applications. Skills in cloud platforms like AWS, Azure, and Google Cloud are highly valued.</p>
        
        <h3>Edge Computing</h3>
        <p>Processing data closer to its source is becoming crucial for IoT applications and real-time systems.</p>
        
        <h3>Quantum Computing</h3>
        <p>While still emerging, quantum computing is showing promise for solving complex problems in cryptography and optimization.</p>
        
        <p>At JRIIIT Institute, we continuously update our curriculum to reflect these trends and prepare students for the future.</p>
      `,
      excerpt: 'Explore the key technology trends shaping 2024 and how they impact education and career opportunities.',
      published: true,
      authorId: admin.id,
    }
  ]

  // Create the posts
  for (const postData of testPosts) {
    const existingPost = await prisma.post.findUnique({
      where: { slug: postData.slug }
    })

    if (!existingPost) {
      const post = await prisma.post.create({
        data: postData
      })
      console.log(`Created post: ${post.title}`)
    } else {
      console.log(`Post already exists: ${postData.title}`)
    }
  }

  console.log('Test posts created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

