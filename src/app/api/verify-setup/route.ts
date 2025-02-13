import { supabase, supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const checks = {
    env: {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      nextAuthUrl: !!process.env.NEXTAUTH_URL,
    },
    connections: {
      publicClient: false,
      adminClient: false,
    }
  }

  try {
    // Test public client
    const { data: publicData, error: publicError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    checks.connections.publicClient = !publicError

    // Test admin client
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('profiles')
      .select('count')
      .limit(1)
    
    checks.connections.adminClient = !adminError

    return NextResponse.json({
      success: true,
      checks,
      message: 'All systems operational'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      checks,
      error: 'Setup verification failed'
    }, { status: 500 })
  }
} 