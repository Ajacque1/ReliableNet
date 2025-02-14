import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Ensure database is up to date
    await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
    
    console.log('Database deployment completed successfully')
  } catch (error) {
    console.error('Error during database deployment:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main() 