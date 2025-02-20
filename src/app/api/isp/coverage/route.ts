import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

interface CoveragePoint {
  latitude: number
  longitude: number
  signalStrength: number
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const isp = searchParams.get('isp')
    const city = searchParams.get('city')
    const state = searchParams.get('state')

    if (!isp) {
      return NextResponse.json(
        { error: "ISP name is required" },
        { status: 400 }
      )
    }

    let query = supabase
      .from('ISPCoverage')
      .select(`
        *,
        ispMetric:ISPMetrics(isp)
      `)
      .eq('ispMetric.isp', isp)

    if (city && state) {
      query = query
        .eq('ispMetric.city', city)
        .eq('ispMetric.state', state)
    }

    const { data: coverage, error } = await query

    if (error) throw error

    return NextResponse.json({
      coverage: coverage.map((point: CoveragePoint) => ({
        latitude: point.latitude,
        longitude: point.longitude,
        signalStrength: point.signalStrength,
      }))
    })

  } catch (error) {
    console.error('Failed to fetch coverage data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coverage data' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic' 