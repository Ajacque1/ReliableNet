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

    const { ispMetricId, rating, comment, pros, cons } = await request.json()

    const { data, error } = await supabase
      .from('ISPReview')
      .insert([{
        ispMetricId,
        userId: session.user.id,
        rating,
        comment,
        pros,
        cons,
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Failed to submit review:', error)
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const ispMetricId = searchParams.get('ispMetricId')

    if (!ispMetricId) {
      return NextResponse.json(
        { error: "ISP Metric ID is required" },
        { status: 400 }
      )
    }

    const { data: reviews, error } = await supabase
      .from('ISPReview')
      .select(`
        *,
        user:users(name)
      `)
      .eq('ispMetricId', ispMetricId)
      .order('createdAt', { ascending: false })

    if (error) throw error

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error('Failed to fetch reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
} 