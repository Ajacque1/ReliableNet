import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { ispId: string } }
) {
  try {
    const { ispId } = params

    if (!ispId) {
      return NextResponse.json(
        { error: "ISP ID is required" },
        { status: 400 }
      )
    }

    const { data: reviews, error } = await supabase
      .from('ISPReview')
      .select(`
        *,
        user:users(name)
      `)
      .eq('ispMetricId', ispId)
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