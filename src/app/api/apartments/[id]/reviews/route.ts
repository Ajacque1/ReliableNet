export const runtime = "nodejs"

import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function POST(
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
    const body = await request.json()
    const {
      rating,
      internetRating,
      comment,
      pros,
      cons
    } = body

    // Validate required fields
    if (!rating || !internetRating || !comment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Verify the complex exists
    const { data: complex, error: complexError } = await supabase
      .from("ApartmentComplex")
      .select("id")
      .eq("id", id)
      .single()

    if (complexError || !complex) {
      return NextResponse.json(
        { error: "Apartment complex not found" },
        { status: 404 }
      )
    }

    // Create the review
    const { data: review, error: reviewError } = await supabase
      .from("ApartmentReview")
      .insert([{
        complexId: id,
        userId: session.user.id,
        rating,
        internetRating,
        comment,
        pros,
        cons,
        verified: false, // This could be updated later based on verification process
        helpfulCount: 0
      }])
      .select(`
        *,
        user:users(name)
      `)
      .single()

    if (reviewError) throw reviewError

    return NextResponse.json({ review })
  } catch (error) {
    console.error("Failed to submit review:", error)
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { data: reviews, error } = await supabase
      .from("ApartmentReview")
      .select(`
        *,
        user:users(name)
      `)
      .eq("complexId", id)
      .order("createdAt", { ascending: false })

    if (error) throw error

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Failed to fetch reviews:", error)
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    )
  }
} 