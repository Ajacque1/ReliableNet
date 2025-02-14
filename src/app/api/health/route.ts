import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Try a simple query
    const userCount = await prisma.user.count()
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      userCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 