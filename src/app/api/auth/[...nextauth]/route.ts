import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Export handlers as named exports
export const { GET, POST } = NextAuth(authOptions)

// Remove default export 