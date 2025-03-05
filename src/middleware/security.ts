import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SECURITY_HEADERS, CORS_OPTIONS } from '@/lib/security'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Create rate limiters
const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: true,
})

const apiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '15 m'),
  analytics: true,
})

const uploadLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'),
  analytics: true,
})

// Helper function to get client IP
function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]
  }
  return request.ip ?? '127.0.0.1'
}

// Security middleware
export async function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next()
  const ip = getClientIp(request)
  const path = request.nextUrl.pathname

  // Add security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Add CORS headers
  const origin = request.headers.get('origin')
  if (origin && CORS_OPTIONS.origin.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', CORS_OPTIONS.methods.join(','))
    response.headers.set('Access-Control-Allow-Headers', CORS_OPTIONS.allowedHeaders.join(','))
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Max-Age', CORS_OPTIONS.maxAge.toString())
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: response.headers,
    })
  }

  // Apply rate limiting based on path
  try {
    if (path.startsWith('/api/auth')) {
      const { success, limit, reset, remaining } = await authLimiter.limit(ip)
      if (!success) {
        return new NextResponse(
          JSON.stringify({
            error: 'Too Many Requests',
            message: `Rate limit exceeded. Please try again in ${Math.ceil((reset - Date.now()) / 1000)} seconds.`,
            retryAfter: Math.ceil((reset - Date.now()) / 1000),
          }),
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
              ...response.headers,
            },
          }
        )
      }
    } else if (path.startsWith('/api/upload')) {
      const { success, limit, reset, remaining } = await uploadLimiter.limit(ip)
      if (!success) {
        return new NextResponse(
          JSON.stringify({
            error: 'Too Many Requests',
            message: `Upload rate limit exceeded. Please try again in ${Math.ceil((reset - Date.now()) / 1000)} seconds.`,
            retryAfter: Math.ceil((reset - Date.now()) / 1000),
          }),
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
              ...response.headers,
            },
          }
        )
      }
    } else if (path.startsWith('/api')) {
      const { success, limit, reset, remaining } = await apiLimiter.limit(ip)
      if (!success) {
        return new NextResponse(
          JSON.stringify({
            error: 'Too Many Requests',
            message: `API rate limit exceeded. Please try again in ${Math.ceil((reset - Date.now()) / 1000)} seconds.`,
            retryAfter: Math.ceil((reset - Date.now()) / 1000),
          }),
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
              ...response.headers,
            },
          }
        )
      }
    }
  } catch (error) {
    console.error('Rate limiting error:', error)
  }

  return response
} 