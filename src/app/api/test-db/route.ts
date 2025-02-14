import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test the connection
    const { data, error } = await supabase
      .from('speed_tests')
      .select('count')
      .limit(1)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Successfully connected to Supabase',
      data
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to connect to database',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
} 