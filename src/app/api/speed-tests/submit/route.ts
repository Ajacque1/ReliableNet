import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

interface SpeedTestData {
  downloadSpeed: number
  uploadSpeed: number
  ping: number
  location?: {
    latitude?: number
    longitude?: number
    city?: string
    state?: string
    country?: string
    zip?: string
  }
}

export async function POST(request: Request) {
  try {
    const data: SpeedTestData = await request.json()

    // Validate required fields
    if (!data.downloadSpeed || !data.uploadSpeed || !data.ping) {
      return NextResponse.json(
        { error: "Missing required speed test data" },
        { status: 400 }
      )
    }

    // Get user session if available
    const session = await auth()
    
    // Get ISP information
    const ispResponse = await fetch('http://ip-api.com/json?fields=66842623')
    const ispData = await ispResponse.json()

    // Prepare speed test data
    const speedTestData = {
      downloadSpeed: data.downloadSpeed,
      uploadSpeed: data.uploadSpeed,
      ping: data.ping,
      userId: session?.user?.id || null,
      createdAt: new Date().toISOString(),
      isp: ispData.isp,
      ispOrg: ispData.org,
      asn: ispData.asn,
      ...(data.location && {
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        city: data.location.city,
        state: data.location.state,
        country: data.location.country,
        zip: data.location.zip,
      }),
    }

    // Insert speed test data
    const { error: insertError } = await supabase
      .from("speed_tests")
      .insert([speedTestData])

    if (insertError) throw insertError

    // Update ISP metrics
    if (speedTestData.isp && speedTestData.city && speedTestData.state) {
      await updateISPMetrics(speedTestData)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Failed to submit speed test:', error)
    return NextResponse.json(
      { error: 'Failed to submit speed test' },
      { status: 500 }
    )
  }
}

async function updateISPMetrics(speedTest: any) {
  const { isp, city, state, country } = speedTest

  // Get existing metrics
  const { data: existing } = await supabase
    .from('ISPMetrics')
    .select('*')
    .eq('isp', isp)
    .eq('city', city)
    .eq('state', state)
    .eq('country', country)
    .single()

  if (existing) {
    // Update existing metrics
    const newCount = existing.testCount + 1
    const newAvgDown = (existing.avgDownload * existing.testCount + speedTest.downloadSpeed) / newCount
    const newAvgUp = (existing.avgUpload * existing.testCount + speedTest.uploadSpeed) / newCount
    const newAvgPing = (existing.avgPing * existing.testCount + speedTest.ping) / newCount

    await supabase
      .from('ISPMetrics')
      .update({
        avgDownload: newAvgDown,
        avgUpload: newAvgUp,
        avgPing: newAvgPing,
        testCount: newCount,
      })
      .match({ isp, city, state, country })
  } else {
    // Create new metrics
    await supabase
      .from('ISPMetrics')
      .insert([{
        isp,
        city,
        state,
        country,
        avgDownload: speedTest.downloadSpeed,
        avgUpload: speedTest.uploadSpeed,
        avgPing: speedTest.ping,
        testCount: 1,
      }])
  }
} 