import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { downloadSpeed, uploadSpeed, ping, location } = await request.json()

    // Validate required fields
    if (!downloadSpeed || !uploadSpeed || !ping) {
      return NextResponse.json(
        { error: "Missing required speed test data" },
        { status: 400 }
      )
    }

    // Get user session if available
    const session = await getServerSession(authOptions)
    
    // Get ISP information
    const ispResponse = await fetch('http://ip-api.com/json?fields=66842623')
    const ispData = await ispResponse.json()

    // Prepare speed test data
    const speedTestData = {
      downloadSpeed,
      uploadSpeed,
      ping,
      userId: session?.user?.id || null,
      createdAt: new Date().toISOString(),
      isp: ispData.isp,
      ispOrg: ispData.org,
      asn: ispData.asn,
      ...(location && {
        latitude: location.latitude,
        longitude: location.longitude,
        city: location.city,
        state: location.state,
        country: location.country,
        zip: location.zip,
      }),
    }

    // Insert speed test data
    const { data, error } = await supabase
      .from("speed_tests")
      .insert([speedTestData])
      .select()
      .single()

    if (error) throw error

    // Update ISP metrics
    await updateISPMetrics(speedTestData)

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Failed to submit speed test:", error)
    return NextResponse.json(
      { error: "Failed to submit speed test" },
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
    .match({ isp, city, state, country })
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