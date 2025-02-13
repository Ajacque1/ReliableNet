import { NextAuthOptions } from "next-auth"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"
import NextAuth from "next-auth/next"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
    }
  }
  
  interface User {
    id: string
    email: string
    name?: string
  }
}

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single()

        if (error || !user) {
          throw new Error("Invalid credentials")
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValidPassword) {
          throw new Error("Invalid credentials")
        }

        return user
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  session: {
    strategy: "jwt"
  },
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 