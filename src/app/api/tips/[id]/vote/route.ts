export const runtime = "nodejs"

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export const dynamic = 'force-dynamic'

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
    const { voteType } = await request.json()

    if (!["helpful", "notHelpful"].includes(voteType)) {
      return NextResponse.json(
        { error: "Invalid vote type" },
        { status: 400 }
      )
    }

    // Update the tip's vote count
    const tip = await prisma.tip.update({
      where: { id },
      data: {
        [voteType]: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ tip })
  } catch (error) {
    console.error("Failed to submit vote:", error)
    return NextResponse.json(
      { error: "Failed to submit vote" },
      { status: 500 }
    )
  }
} 