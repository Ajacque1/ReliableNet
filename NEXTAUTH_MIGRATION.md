# NextAuth.js v5 Migration Notes

## Overview
This document details the changes made to migrate our authentication system to NextAuth.js v5 and fix related deployment errors. The migration was necessary to support the latest Next.js features and improve authentication security.

## Initial Problems Encountered

### 1. Import Errors
```typescript
// Error: Module "@/lib/auth" has no exported member 'auth'
import { auth } from "@/lib/auth"
```
This was the first indication that our auth setup needed to be updated for v5. The old pattern of importing auth from lib/auth no longer worked.

### 2. Type Errors in [...nextauth] Route
```typescript
// Error: Route has an invalid "GET" export
// Type "(req: NextAuthRequest, ctx: AppRouteHandlerFnContext) => void | Response | Promise<...>" 
// is not a valid type for the function's first argument
export const GET = auth
export const POST = auth
```
This showed that the route handler format had changed in v5.

### 3. Session Type Errors
```typescript
// Error: Property 'id' does not exist on type 'Session["user"]'
session.user.id
```
Session types needed to be properly declared for TypeScript support.

## Solutions Attempted

### 1. Direct NextAuth Export (Did Not Work)
Initially tried:
```typescript
import NextAuth from "next-auth"
export default NextAuth(authConfig)
```
This old v4 pattern resulted in type errors and runtime issues.

### 2. Middleware Approach (Partially Worked)
Tried using middleware for auth:
```typescript
export { default } from "next-auth/middleware"
```
While this worked for basic protection, it didn't provide the flexibility needed for our API routes.

### 3. Final Working Solution
The solution that worked involved three key parts:

1. **Root Auth File** (`src/auth.ts`):
```typescript
import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

export const { auth, handlers } = NextAuth(authConfig)
```

2. **Auth Config** (`src/lib/auth.ts`):
```typescript
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
    }
  }
}

export const authConfig = {
  providers: [
    Credentials({
      // ... provider config
    })
  ],
  session: {
    strategy: "jwt"
  },
  // ... rest of config
} satisfies NextAuthConfig
```

3. **NextAuth Route** (`src/app/api/auth/[...nextauth]/route.ts`):
```typescript
import { handlers } from "@/auth"

export const runtime = "nodejs"
export const { GET, POST } = handlers
```

## Critical Lessons Learned

1. **Runtime Considerations**
   - NextAuth.js v5 requires Node.js runtime
   - Edge runtime is not fully supported
   - Always add `export const runtime = "nodejs"` to auth-related routes

2. **Type Safety**
   - Always use type assertions for credentials: `credentials.email as string`
   - Declare session types in the next-auth module
   - Use `satisfies NextAuthConfig` for proper type checking

3. **Import Structure**
   - Keep auth configuration in `lib/auth.ts`
   - Export auth functions from root `auth.ts`
   - Import auth function from root in all routes

4. **Common Pitfalls**
   - Not declaring runtime as "nodejs"
   - Missing type declarations
   - Incorrect route handler exports
   - Missing environment variables

## Debugging Process

1. **Build Errors**
   ```bash
   # Initial error
   Error: Module "@/lib/auth" has no exported member 'auth'
   
   # After first fix attempt
   Type error: Route has an invalid "GET" export
   
   # Final successful build
   ✓ Compiled successfully
   ```

2. **Runtime Errors**
   - JWT errors when secret not properly configured
   - Session undefined errors when not using proper types
   - Route handler type mismatches

## Environment Setup

1. **Required Variables**
```env
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

2. **Production Considerations**
```env
NEXTAUTH_URL=https://your-production-url.com
NODE_ENV=production
```

## Moving Forward

### Immediate Actions
1. Update any remaining routes using old auth pattern
2. Add error boundaries for auth failures
3. Implement proper error logging
4. Add session refresh logic

### Long-term Considerations
1. **Monitoring**
   - Watch for auth failures in production
   - Monitor session performance
   - Track failed login attempts

2. **Security**
   - Implement rate limiting
   - Add brute force protection
   - Consider adding MFA

3. **Maintenance**
   - Keep NextAuth.js updated
   - Monitor for v5 stable release
   - Review security advisories

### Error Handling Template
```typescript
try {
  const session = await auth()
  if (!session) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    )
  }
  // Protected route logic
} catch (error) {
  console.error("Auth error:", error)
  return NextResponse.json(
    { error: "Authentication failed" },
    { status: 500 }
  )
}
```

## Troubleshooting Guide

### Common Issues and Solutions

1. **"auth is not exported" Error**
   - **Problem**: Old import pattern
   - **Solution**: Update to import from root auth.ts
   - **Example**: `import { auth } from "@/auth"`

2. **Invalid Route Export**
   - **Problem**: Wrong route handler format
   - **Solution**: Use handlers from auth
   - **Example**: `export const { GET, POST } = handlers`

3. **Session Type Errors**
   - **Problem**: Missing type declarations
   - **Solution**: Declare types in next-auth module
   - **Example**: See Session interface above

4. **JWT Errors**
   - **Problem**: Missing or invalid secret
   - **Solution**: Set NEXTAUTH_SECRET
   - **Verification**: Check env variables are loaded

### Performance Considerations

1. **Session Caching**
   - Implement where appropriate
   - Consider Redis for distributed systems
   - Monitor session size

2. **Database Load**
   - Monitor auth queries
   - Index relevant fields
   - Consider connection pooling

3. **API Rate Limiting**
   - Implement per-user limits
   - Add retry mechanisms
   - Log excessive attempts

## Testing Checklist

- [ ] Build succeeds without errors
- [ ] All protected routes require authentication
- [ ] Session data includes required fields
- [ ] Error handling works as expected
- [ ] Environment variables are properly set
- [ ] Type safety is maintained
- [ ] Runtime compatibility is verified

## Key Changes

### 1. Root Auth Configuration
Created a new root-level auth configuration file at `src/auth.ts`:
```typescript
import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

export const { auth, handlers } = NextAuth(authConfig)
```

This file exports:
- `auth`: The main authentication function used in API routes and server components
- `handlers`: The NextAuth.js route handlers for the [...nextauth] route

### 2. Auth Route Updates
Updated the NextAuth.js route handler at `src/app/api/auth/[...nextauth]/route.ts`:
```typescript
import { handlers } from "@/auth"

export const runtime = "nodejs"
export const { GET, POST } = handlers
```

### 3. API Route Updates
Modified all API routes that were using the old auth import. Example changes:

From:
```typescript
import { auth } from "@/lib/auth"
```

To:
```typescript
import { auth } from "@/auth"
```

### 4. Auth Configuration
Updated `src/lib/auth.ts` to:
- Add proper TypeScript types for credentials
- Fix type errors in the authorize callback
- Add proper session types
- Configure JWT strategy

Key changes:
```typescript
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
    }
  }
}

export const authConfig = {
  // ... configuration ...
  session: {
    strategy: "jwt"
  },
  // ... rest of config ...
} satisfies NextAuthConfig
```

## Fixed Issues

1. **Type Errors**:
   - Fixed "auth is not exported from @/lib/auth" by moving auth export to root auth.ts
   - Fixed credentials type error by adding type assertions in authorize callback
   - Fixed session type errors by declaring proper types in next-auth module

2. **Runtime Compatibility**:
   - Added `export const runtime = "nodejs"` to all auth-related API routes
   - Ensures compatibility with NextAuth.js which requires Node.js runtime

3. **Route Handler Format**:
   - Updated [...nextauth] route to use the new v5 format with handlers
   - Removed direct NextAuth initialization from API route

## Environment Variables
Required environment variables:
- `NEXTAUTH_SECRET`: For JWT encryption
- `NODE_ENV`: For cookie security settings

## Notes for Future Updates
1. Consider adding more providers beyond Credentials if needed
2. Monitor NextAuth.js v5 updates as it's currently in beta
3. Consider implementing refresh token rotation
4. Add proper error handling for auth failures

## Related Files
- `src/auth.ts`
- `src/lib/auth.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- All API routes using authentication

## Testing
After implementing these changes:
1. Build completed successfully
2. All auth-protected routes working as expected
3. Session management functioning properly
4. JWT strategy properly implemented

## Remaining Tasks
1. Address React hooks dependency warnings (unrelated to auth)
2. Consider implementing refresh token rotation
3. Add more comprehensive error handling
4. Add additional auth providers if needed 