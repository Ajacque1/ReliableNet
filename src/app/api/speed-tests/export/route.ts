import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

interface SpeedTest {
  id: string
  downloadSpeed: number
  uploadSpeed: number
  ping: number
  createdAt: string
  isp: string
  city?: string
  state?: string
}

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "json"
    const complexId = searchParams.get("complexId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Build query
    let query = supabase
      .from("SpeedTest")
      .select("*")

    if (complexId) {
      query = query.eq("complexId", complexId)
    }

    if (startDate) {
      query = query.gte("createdAt", startDate)
    }

    if (endDate) {
      query = query.lte("createdAt", endDate)
    }

    const { data: tests, error } = await query.order("createdAt", { ascending: false })

    if (error) throw error

    // Format the data based on requested format
    if (format === "csv") {
      const csvContent = formatSpeedTestsAsCSV(tests as SpeedTest[])
      
      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="speed_tests_${new Date().toISOString().split("T")[0]}.csv"`
        }
      })
    }

    return NextResponse.json({ tests })
  } catch (error) {
    console.error("Failed to export speed tests:", error)
    return NextResponse.json(
      { error: "Failed to export speed tests" },
      { status: 500 }
    )
  }
}

function formatSpeedTestsAsCSV(tests: SpeedTest[]): string {
  const headers = [
    "Date",
    "ISP",
    "Download Speed (Mbps)",
    "Upload Speed (Mbps)",
    "Ping (ms)",
    "Location"
  ]

  const rows = tests.map(test => [
    new Date(test.createdAt).toLocaleString(),
    test.isp,
    test.downloadSpeed.toFixed(1),
    test.uploadSpeed.toFixed(1),
    test.ping.toFixed(0),
    test.city && test.state ? `${test.city}, ${test.state}` : "N/A"
  ])

  return [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n")
} 