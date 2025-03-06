export const runtime = "nodejs"

import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { data: complex, error } = await supabase
      .from("ApartmentComplex")
      .select(`
        *,
        reviews:ApartmentReview(
          id,
          rating,
          internetRating,
          comment,
          pros,
          cons,
          verified,
          helpfulCount,
          createdAt,
          user:users(name)
        ),
        isps:ComplexISP(
          id,
          isDefault,
          coverage,
          speedTests,
          ispMetric:ISPMetrics(
            id,
            isp,
            avgDownload,
            avgUpload,
            avgPing,
            reliability,
            testCount
          )
        ),
        speedTests:SpeedTest(
          id,
          downloadSpeed,
          uploadSpeed,
          ping,
          createdAt,
          isp
        )
      `)
      .eq("id", id)
      .single()

    if (error) throw error

    if (!complex) {
      return NextResponse.json(
        { error: "Apartment complex not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ complex })
  } catch (error) {
    console.error("Failed to fetch apartment complex:", error)
    return NextResponse.json(
      { error: "Failed to fetch apartment complex" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { id } = params
    const updates = await request.json()

    // Validate the complex exists
    const { data: existing } = await supabase
      .from("ApartmentComplex")
      .select("id")
      .eq("id", id)
      .single()

    if (!existing) {
      return NextResponse.json(
        { error: "Apartment complex not found" },
        { status: 404 }
      )
    }

    // Update the complex
    const { data: complex, error } = await supabase
      .from("ApartmentComplex")
      .update({
        name: updates.name,
        address: updates.address,
        city: updates.city,
        state: updates.state,
        zip: updates.zip,
        latitude: updates.latitude,
        longitude: updates.longitude,
        website: updates.website,
        amenities: updates.amenities,
        managementContact: updates.managementContact,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ complex })
  } catch (error) {
    console.error("Failed to update apartment complex:", error)
    return NextResponse.json(
      { error: "Failed to update apartment complex" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { id } = params

    const { error } = await supabase
      .from("ApartmentComplex")
      .delete()
      .eq("id", id)

    if (error) throw error

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Failed to delete apartment complex:", error)
    return NextResponse.json(
      { error: "Failed to delete apartment complex" },
      { status: 500 }
    )
  }
} 