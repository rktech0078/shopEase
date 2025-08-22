import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { adminClient } from '@/sanity/lib/client'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Find user by email
          const user = await adminClient.fetch(
            `*[_type == "user" && email == $email][0]`,
            { email: credentials.email }
          )

          if (!user) {
            return null
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          // Update last login
          await adminClient.patch(user._id).set({
            lastLogin: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }).commit()

          return {
            id: user._id,
            email: user.email,
            name: user.fullName,
            role: user.role,
            image: null
          }
        } catch (error: any) {
          console.error('Auth error:', error)
          
          // Handle specific Sanity errors
          if (error.message?.includes('Insufficient permissions')) {
            console.error('Sanity permissions error:', error)
            return null
          }
          
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        (session.user as any).role = token?.role ?? 'customer';
        (session.user as any).id = token?.id ?? '';
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
