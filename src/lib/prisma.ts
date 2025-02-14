import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error'],
  datasources: {
    db: {
      url: process.env.POSTGRES_PRISMA_URL
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Add error handling
prisma.$use(async (params, next) => {
  try {
    return await next(params)
  } catch (error) {
    console.error('Prisma Error:', error)
    throw error
  }
}) 