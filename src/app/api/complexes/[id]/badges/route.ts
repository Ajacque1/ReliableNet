import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { calculateComplexBadges } from "@/lib/badges"

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { id } = params

    // Recalculate badges
    const badges = await calculateComplexBadges(id)

    return NextResponse.json({ badges })
  } catch (error) {
    console.error("Failed to recalculate badges:", error)
    return NextResponse.json(
      { error: "Failed to recalculate badges" },
      { status: 500 }
    )
  }
} 