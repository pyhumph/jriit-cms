import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

// Lazy import Prisma to avoid initialization issues
let prisma: any = null
const getPrisma = async () => {
  if (!prisma) {
    const { prisma: prismaClient } = await import('@/lib/prisma')
    prisma = prismaClient
  }
  return prisma
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          // Validate input
          const { email, password } = loginSchema.parse(credentials)

          // Get Prisma client
          const db = await getPrisma()

          // Find admin by email
          const admin = await db.admin.findUnique({
            where: { email }
          })

          if (!admin) {
            return null
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(password, admin.password)
          
          if (!isValidPassword) {
            return null
          }

          // Return user object (password will be excluded)
          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          }
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
})
