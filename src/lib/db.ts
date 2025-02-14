import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error'],
  datasources: {
    db: {
      url: process.env.NODE_ENV === 'production'
        ? process.env.DATABASE_URL
        : process.env.DATABASE_URL
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Test database connection
async function testConnection() {
  try {
    await prisma.$connect()
    console.log('Database connection successful')
  } catch (error) {
    console.error('Database connection failed:', error)
    throw error // This will help Vercel identify deployment issues
  }
}

// Only run connection test during build
if (process.env.VERCEL_ENV === 'production') {
  testConnection()
} 