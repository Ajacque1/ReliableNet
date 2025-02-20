import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const state = searchParams.get('state')

    let query = supabase
      .from('ISPMetrics')
      .select(`
        id,
        isp,
        avgDownload,
        avgUpload,
        avgPing,
        testCount,
        reliability,
        city,
        state,
        country
      `)
      .order('testCount', { ascending: false })

    // Apply location filters if provided
    if (city && state) {
      query = query
        .eq('city', city)
        .eq('state', state)
    }

    const { data: isps, error } = await query

    if (error) throw error

    if (!isps?.length) {
      return NextResponse.json({
        isps: [],
        message: city && state 
          ? `No ISPs found in ${city}, ${state}`
          : "No ISPs found"
      })
    }

    return NextResponse.json({ isps })

  } catch (error) {
    console.error('Failed to fetch ISPs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ISPs' },
      { status: 500 }
    )
  }
} 