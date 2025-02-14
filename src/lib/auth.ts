import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
    }
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Missing credentials')
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user) {
            throw new Error('User not found')
          }

          const passwordMatch = await bcrypt.compare(credentials.password, user.password)

          if (!passwordMatch) {
            throw new Error('Invalid password')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!
      }
      return session
    },
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
} 