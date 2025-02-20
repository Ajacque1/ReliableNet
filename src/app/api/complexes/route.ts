import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

interface CreateComplexData {
  name: string
  address: string
  city: string
  state: string
  zip: string
  latitude?: number
  longitude?: number
  website?: string
  amenities: string[]
  managementContact?: {
    name: string
    email: string
    phone: string
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const data: CreateComplexData = await request.json()

    // Validate required fields
    if (!data.name || !data.address || !data.city || !data.state || !data.zip) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create the complex
    const { data: complex, error } = await supabase
      .from("ApartmentComplex")
      .insert([{
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        latitude: data.latitude,
        longitude: data.longitude,
        website: data.website,
        amenities: data.amenities,
        managementContact: data.managementContact,
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ complex })
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
    const amenities = searchParams.getAll("amenities")
    const hasISP = searchParams.get("hasISP")
    const query = searchParams.get("query")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    // Build query
    let dbQuery = supabase
      .from("ApartmentComplex")
      .select(`
        *,
        reviews:ApartmentReview(count),
        isps:ComplexISP(
          ispMetric:ISPMetrics(
            id,
            isp,
            avgDownload,
            avgUpload,
            avgPing
          )
        )
      `)

    // Apply filters
    if (city) {
      dbQuery = dbQuery.eq("city", city)
    }
    if (state) {
      dbQuery = dbQuery.eq("state", state)
    }
    if (amenities.length > 0) {
      dbQuery = dbQuery.contains("amenities", amenities)
    }
    if (hasISP) {
      dbQuery = dbQuery.not("isps", "is", null)
    }
    if (query) {
      dbQuery = dbQuery.or(
        `name.ilike.%${query}%,address.ilike.%${query}%`
      )
    }

    // Add pagination
    const start = (page - 1) * limit
    dbQuery = dbQuery
      .order("name")
      .range(start, start + limit - 1)

    const { data: complexes, error, count } = await dbQuery

    if (error) throw error

    return NextResponse.json({
      complexes,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: count ? Math.ceil(count / limit) : 0,
      }
    })
  } catch (error) {
    console.error("Failed to fetch apartment complexes:", error)
    return NextResponse.json(
      { error: "Failed to fetch apartment complexes" },
      { status: 500 }
    )
  }
} 