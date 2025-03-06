import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const data = await request.json()
    const {
      name,
      address,
      city,
      state,
      zip,
      latitude,
      longitude,
      website,
      amenities
    } = data

    // Validate required fields
    if (!name || !address || !city || !state || !zip) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const { data: complex, error } = await supabase
      .from("ApartmentComplex")
      .insert([{
        name,
        address,
        city,
        state,
        zip,
        latitude,
        longitude,
        website,
        amenities,
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data: complex })
  } catch (error) {
    console.error("Failed to create apartment complex:", error)
    return NextResponse.json(
      { error: "Failed to create apartment complex" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city")
    const state = searchParams.get("state")
    const query = searchParams.get("query")

    let dbQuery = supabase
      .from("ApartmentComplex")
      .select(`
        *,
        reviews:ApartmentReview(count),
        isps:ComplexISP(
          ispMetric:ISPMetrics(
            isp,
            avgDownload,
            avgUpload,
            avgPing
          )
        )
      `)

    if (city && state) {
      dbQuery = dbQuery
        .eq("city", city)
        .eq("state", state)
    }

    if (query) {
      dbQuery = dbQuery
        .or(`name.ilike.%${query}%,address.ilike.%${query}%`)
    }

    const { data: complexes, error } = await dbQuery
      .order("name")
      .limit(50)

    if (error) throw error

    return NextResponse.json({ complexes })
  } catch (error) {
    console.error("Failed to fetch apartment complexes:", error)
    return NextResponse.json(
      { error: "Failed to fetch apartment complexes" },
      { status: 500 }
    )
  }
} 