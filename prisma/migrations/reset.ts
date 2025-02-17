import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'

const prisma = new PrismaClient()

async function reset() {
  try {
    // Drop all tables
    await prisma.$executeRawUnsafe(`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
      END $$;
    `)

    // Reset migration history
    await prisma.$executeRawUnsafe(`
      DROP TABLE IF EXISTS "_prisma_migrations";
    `)

    console.log('Database reset successful')

    // Generate new migration
    execSync('npx prisma migrate dev --name init', { stdio: 'inherit' })

  } catch (error) {
    console.error('Error resetting database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

reset() 