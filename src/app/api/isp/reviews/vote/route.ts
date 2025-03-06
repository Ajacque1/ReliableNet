export const runtime = "nodejs"

import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { reviewId, voteType } = await request.json()

    if (!reviewId || !['helpful', 'notHelpful'].includes(voteType)) {
      return NextResponse.json(
        { error: "Invalid vote data" },
        { status: 400 }
      )
    }

    // First get current value
    const { data: review } = await supabase
      .from('ISPReview')
      .select(voteType)
      .eq('id', reviewId)
      .single()

    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      )
    }

    // Then increment it
    const { data, error } = await supabase
      .from('ISPReview')
      .update({
        [voteType]: Number(review[voteType] || 0) + 1
      })
      .eq('id', reviewId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Failed to submit vote:', error)
    return NextResponse.json(
      { error: 'Failed to submit vote' },
      { status: 500 }
    )
  }
} 