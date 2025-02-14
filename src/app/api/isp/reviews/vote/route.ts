import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
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

    const { data, error } = await supabase
      .from('ISPReview')
      .update({
        [voteType]: supabase.raw(`${voteType} + 1`)
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