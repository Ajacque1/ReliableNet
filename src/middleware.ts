import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Export the middleware with both auth checks
export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === "admin"

    // Protect admin routes
    if (req.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth/login',
    },
  }
)

// Update the matcher to include all protected routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/speed-test/history/:path*',
    '/settings/:path*',
    '/api/protected/:path*',
    '/admin/:path*',
    '/api/admin/:path*'
  ],
} 