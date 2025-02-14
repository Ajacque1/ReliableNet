import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const state = searchParams.get('state')

    let query = supabase
      .from('ISPMetrics')
      .select('*')
      .order('testCount', { ascending: false })
      .limit(10)

    if (city && state) {
      query = query
        .eq('city', city)
        .eq('state', state)
    }

    const { data: metrics, error } = await query

    if (error) throw error

    return NextResponse.json({ metrics })

  } catch (error) {
    console.error('Failed to fetch ISP metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ISP metrics' },
      { status: 500 }
    )
  }
} 