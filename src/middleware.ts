import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Export the middleware with both auth checks
export default withAuth(
  async function middleware(req: NextRequest) {
    // Add any custom middleware logic here
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
  ],
} 